/**
 * AI Service - Frontend integration with MonCVPro AI Backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ATSAnalysisResult {
    score: number;
    summary: string;
    strengths: string[];
    improvements: string[];
    keywords: {
        found: string[];
        missing: string[];
    };
    sections?: {
        name: string;
        score: number;
        feedback: string;
    }[];
}

export interface ContentImproveResult {
    originalText: string;
    improvedText: string;
    changes: string[];
    improvementType: string;
}

export interface GrammarCheckResult {
    correctedText: string;
    errors: {
        type: string;
        original: string;
        correction: string;
        explanation: string;
    }[];
    score: number;
}

export interface KeywordAnalysisResult {
    keywords: string[];
    density: Record<string, number>;
    suggestions: string[];
    industryMatch: number;
}

export interface RateLimitInfo {
    limit: number;
    remaining: number;
    reset: number;
}

interface APIResponse<T> {
    success: boolean;
    data: T;
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
     * Analyze CV for ATS compatibility
     */
    async analyzeCV(
        cvText: string,
        industry?: string,
        role?: string
    ): Promise<ATSAnalysisResult> {
        const response = await this.request<APIResponse<ATSAnalysisResult>>(
            '/api/ai/analyze',
            'POST',
            { cvText, industry, role }
        );
        return response.data;
    }

    /**
     * Stream CV analysis with progress updates
     */
    async analyzeCVStream(
        cvText: string,
        industry?: string,
        callbacks?: {
            onProgress?: (message: string, progress: number) => void;
            onToken?: (token: string) => void;
            onComplete?: (result: ATSAnalysisResult) => void;
            onError?: (error: Error) => void;
        }
    ): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/api/ai/stream/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
            },
            body: JSON.stringify({ cvText, industry }),
        });

        if (!response.body) {
            throw new Error('No response body');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('event:')) {
                    const eventType = line.slice(7).trim();
                    continue;
                }
                if (line.startsWith('data:')) {
                    try {
                        const data = JSON.parse(line.slice(5).trim());

                        if (data.progress !== undefined && callbacks?.onProgress) {
                            callbacks.onProgress(data.message || '', data.progress);
                        }
                        if (data.token && callbacks?.onToken) {
                            callbacks.onToken(data.token);
                        }
                        if (data.data && callbacks?.onComplete) {
                            callbacks.onComplete(data.data);
                        }
                        if (data.message && !data.progress && callbacks?.onError) {
                            callbacks.onError(new Error(data.message));
                        }
                    } catch (e) {
                        // Ignore parse errors for partial data
                    }
                }
            }
        }
    }

    /**
     * Improve content with AI
     */
    async improveContent(
        text: string,
        type: 'professional' | 'concise' | 'impactful' | 'creative' = 'professional'
    ): Promise<ContentImproveResult> {
        const response = await this.request<APIResponse<ContentImproveResult>>(
            '/api/ai/improve',
            'POST',
            { text, type }
        );
        return response.data;
    }

    /**
     * Check grammar and style
     */
    async checkGrammar(text: string): Promise<GrammarCheckResult> {
        const response = await this.request<APIResponse<GrammarCheckResult>>(
            '/api/ai/grammar',
            'POST',
            { text }
        );
        return response.data;
    }

    /**
     * Extract and analyze keywords
     */
    async extractKeywords(text: string, industry?: string): Promise<KeywordAnalysisResult> {
        const response = await this.request<APIResponse<KeywordAnalysisResult>>(
            '/api/ai/keywords',
            'POST',
            { text, industry }
        );
        return response.data;
    }

    /**
     * Generate professional summary
     */
    async generateSummary(cvData: any, targetRole?: string): Promise<string> {
        const response = await this.request<APIResponse<{ summary: string }>>(
            '/api/ai/summary',
            'POST',
            { cvData, targetRole }
        );
        return response.data.summary;
    }

    /**
     * Get available AI models
     */
    async getModels(): Promise<Record<string, string>> {
        const response = await this.request<APIResponse<{ models: Record<string, string>; mockMode: boolean }>>(
            '/api/ai/models'
        );
        return response.data.models;
    }

    /**
     * Get rate limit status
     */
    async getRateLimitStatus(): Promise<RateLimitInfo> {
        const response = await this.request<APIResponse<RateLimitInfo>>(
            '/api/ai/rate-limit'
        );
        return response.data;
    }
}

// Singleton instance
export const aiService = new AIService();
export default aiService;
