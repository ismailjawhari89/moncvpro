import api from '@/lib/axios';

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || 'https://moncvpro-worker.YOUR_SUBDOMAIN.workers.dev';

export const aiService = {
    /**
     * Get ATS compatibility score (Backend)
     */
    calculateATSScore: async (cvId: string, jobDescription?: string) => {
        const response = await api.post('/ai/ats-score', { cvId, jobDescription });
        return response.data;
    },

    /**
     * Get suggestions for a specific section (Backend)
     */
    getSectionSuggestions: async (cvId: string, section: string, jobDescription?: string) => {
        const response = await api.post('/ai/suggestions', { cvId, section, jobDescription });
        return response.data;
    },

    /**
     * Generate interview questions (Backend)
     */
    generateInterviewQuestions: async (cvId: string) => {
        const response = await api.get(`/ai/interview-prep/${cvId}`);
        return response.data;
    },

    /**
     * ⚡ Direct Groq Generation (Cloudflare Worker)
     * Extremely fast, uses Antigravity infrastructure
     */
    generateWithGroq: async (prompt: string) => {
        try {
            // Using fetch to avoid potential axios interceptor conflicts with external URLs
            const response = await fetch(WORKER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Worker Error: ${response.status}`);
            }

            const data = await response.json();
            // Worker returns { provider: 'groq', content: '...' }
            return data;
        } catch (error: any) {
            console.error('❌ Groq Generation Failed:', error);
            throw new Error(error.message || 'AI Generation failed');
        }
    }
};
