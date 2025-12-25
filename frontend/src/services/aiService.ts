/**
 * AI Service - Frontend integration with MonCVPro AI Backend
 */

import {
    ATSAnalysisSchema,
    ContentImproveSchema,
    GrammarCheckSchema,
    KeywordAnalysisSchema,
    type ATSAnalysisResult,
    type ContentImproveResult,
    type GrammarCheckResult,
    type KeywordAnalysisResult
} from '@/lib/ai-schemas';
import { ZodSchema } from 'zod';

const API_BASE_URL = process.env.NEXT_PUBLIC_WORKER_URL || 'https://moncvpro-worker.ismailhouwa123.workers.dev';

export type { ATSAnalysisResult, ContentImproveResult, GrammarCheckResult, KeywordAnalysisResult };

export interface RateLimitInfo {
    limit: number;
    remaining: number;
    reset: number;
}

interface APIResponse<T> {
    success: boolean;
    data: T | string; // data can be string if it's a raw generic answer or the inner JSON string
    response?: string; // Sometimes the worker returns 'response' field for AI text
    mockMode?: boolean;
}

class AIService {
    private token: string | null = null;
    private rateLimitInfo: RateLimitInfo | null = null;

    /**
     * Set the authentication token
     */
    setToken(token: string | null) {
        this.token = token;
    }

    /**
     * Get current rate limit info
     */
    getRateLimitInfo(): RateLimitInfo | null {
        return this.rateLimitInfo;
    }

    /**
     * Make an API request with rate limit header handling
     */
    private async request<T>(
        endpoint: string,
        method: 'GET' | 'POST' = 'GET',
        body?: any
    ): Promise<T> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        // Update rate limit info from headers
        const limit = response.headers.get('X-RateLimit-Limit');
        const remaining = response.headers.get('X-RateLimit-Remaining');
        const reset = response.headers.get('X-RateLimit-Reset');

        if (limit && remaining && reset) {
            this.rateLimitInfo = {
                limit: parseInt(limit),
                remaining: parseInt(remaining),
                reset: parseInt(reset),
            };
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API request failed');
        }

        return response.json();
    }

    /**
     * Helper to call the Unified AI Endpoint with Zod Validation
     */
    private async callAI<T>(prompt: string, action: string, schema: ZodSchema<T>, language: string = 'en'): Promise<T> {
        // Implement client-side rate limit check before calling
        if (!this.checkUsageLimit()) {
            throw new Error('Daily AI usage limit reached. Upgrade to Pro for unlimited access.');
        }

        // The worker returns { success: true, response: "..." }
        const apiResponse = await this.request<APIResponse<any>>(
            '/ai',
            'POST',
            { prompt, action, language }
        );

        // Extract the AI text response
        // The worker usually puts the AI content in `response` field
        const rawAiText = apiResponse.response || (typeof apiResponse.data === 'string' ? apiResponse.data : JSON.stringify(apiResponse.data));

        if (!rawAiText) {
            throw new Error('Empty response from AI service');
        }

        try {
            // 1. Clean the response (remove potential markdown markers)
            const cleanJson = rawAiText.replace(/```json\n?|\n?```/g, '').trim();

            // 2. Parse JSON
            const parsedJson = JSON.parse(cleanJson);

            // 3. Validate with Zod
            const validationResult = schema.safeParse(parsedJson);

            if (!validationResult.success) {
                console.error('Schema Validation Failed:', validationResult.error);
                throw new Error('AI response format invalid. We are tweaking the models.');
            }

            // Increment usage on success
            this.incrementUsage();

            return validationResult.data;
        } catch (e: any) {
            console.error('Failed to parse AI response:', rawAiText, e);
            throw new Error(e.message || 'Failed to process AI response');
        }
    }

    /**
     * Check if user has reached daily limit
     */
    checkUsageLimit(): boolean {
        try {
            const today = new Date().toDateString();
            const usageData = localStorage.getItem('moncvpro_ai_usage');
            let usage = { count: 0, date: today };

            if (usageData) {
                const parsed = JSON.parse(usageData);
                if (parsed.date === today) {
                    usage = parsed;
                }
            }

            // Simple limit logic: 
            // If token exists (Auth user) -> 10 actions
            // If no token (Free user) -> 3 actions
            const limit = this.token ? 10 : 3;
            return usage.count < limit;
        } catch (e) {
            // Fallback to allow if localStorage fails
            return true;
        }
    }

    /**
     * Increment usage counter
     */
    private incrementUsage() {
        try {
            const today = new Date().toDateString();
            const usageData = localStorage.getItem('moncvpro_ai_usage');
            let usage = { count: 0, date: today };

            if (usageData) {
                const parsed = JSON.parse(usageData);
                if (parsed.date === today) {
                    usage = parsed;
                }
            }

            usage.count++;
            localStorage.setItem('moncvpro_ai_usage', JSON.stringify(usage));
        } catch (e) {
            // Ignore storage errors
        }
    }

    /**
     * Get current usage state for UI display
     */
    getUsageState(): { used: number; limit: number; remaining: number } {
        try {
            const today = new Date().toDateString();
            const usageData = localStorage.getItem('moncvpro_ai_usage');
            let usage = { count: 0, date: today };

            if (usageData) {
                const parsed = JSON.parse(usageData);
                if (parsed.date === today) {
                    usage = parsed;
                }
            }

            const limit = this.token ? 10 : 3;
            return {
                used: usage.count,
                limit: limit,
                remaining: Math.max(0, limit - usage.count)
            };
        } catch (e) {
            return { used: 0, limit: 3, remaining: 3 };
        }
    }

    /**
     * Analyze CV for ATS compatibility
     */
    async analyzeCV(
        cvText: string,
        industry?: string,
        role?: string
    ): Promise<ATSAnalysisResult> {
        return this.callAI<ATSAnalysisResult>(
            cvText,
            'analyze',
            ATSAnalysisSchema,
            'en'
        );
    }

    /**
     * Improve content with AI
     */
    async improveContent(
        text: string,
        type: 'professional' | 'concise' | 'impactful' | 'creative' = 'professional'
    ): Promise<ContentImproveResult> {
        return this.callAI<ContentImproveResult>(
            text,
            'improve',
            ContentImproveSchema,
            'en'
        );
    }

    /**
     * Check grammar and style
     */
    async checkGrammar(text: string): Promise<GrammarCheckResult> {
        return this.callAI<GrammarCheckResult>(
            text,
            'grammar',
            GrammarCheckSchema,
            'en'
        );
    }

    /**
     * Extract and analyze keywords
     */
    async extractKeywords(text: string, industry?: string): Promise<KeywordAnalysisResult> {
        return this.callAI<KeywordAnalysisResult>(
            text,
            'keywords',
            KeywordAnalysisSchema,
            'en'
        );
    }

    /**
     * Generate professional summary
     */
    async generateSummary(cvData: any, targetRole?: string): Promise<string> {
        const prompt = `Generate a professional summary for a ${targetRole || 'professional'}. Data: ${JSON.stringify(cvData.personalInfo)}`;

        // This endpoint might just return a plain string, not structured JSON.
        // We handle this case separately or wrap it.
        // For now, let's assume the default action returns plain text in 'response'.
        if (!this.checkUsageLimit()) {
            throw new Error('Daily AI usage limit reached.');
        }

        const response = await this.request<APIResponse<string>>(
            '/ai',
            'POST',
            { prompt, action: 'default', language: 'en' }
        );

        this.incrementUsage();
        return response.response || (response.data as string);
    }

    /**
     * Get available AI models
     */
    async getModels(): Promise<Record<string, string>> {
        const response = await this.request<any>('/');
        return {
            default: response.groq_model || 'llama-3.3-70b-versatile'
        };
    }

    /**
     * Get rate limit status
     */
    async getRateLimitStatus(): Promise<RateLimitInfo> {
        return this.rateLimitInfo || { limit: 0, remaining: 0, reset: 0 };
    }
}

// Singleton instance
export const aiService = new AIService();
export default aiService;
