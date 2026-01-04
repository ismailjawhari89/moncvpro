import Groq from 'groq-sdk';
import { logger } from '../lib/logger';
import { AppError } from '../utils/AppError';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

/**
 * AI Service strictly using Groq (Llama 3 70B recommended for CVs)
 */
export const callAIService = async (params: { cvId: string, section: string, prompt: string }) => {
    if (!process.env.GROQ_API_KEY) {
        logger.error('Missing GROQ_API_KEY in environment');
        throw new AppError('AI service is currently unavailable', 503);
    }

    try {
        logger.info('Calling Groq AI Service', { cvId: params.cvId, section: params.section });

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a professional CV writing expert. Your goal is to improve CV content for high ATS scoring and professional impact.'
                },
                {
                    role: 'user',
                    content: params.prompt
                }
            ],
            model: 'llama3-70b-8192',
            temperature: 0.5,
            max_tokens: 1024,
        });

        const content = chatCompletion.choices[0]?.message?.content;

        if (!content) {
            throw new Error('Empty response from Groq');
        }

        // Simple parsing logic assuming bullet points or paragraphs
        // In a real app, you might want more structured output (JSON)
        const suggestions = content.split('\n').filter(line => line.trim().length > 5);

        return suggestions;

    } catch (error: any) {
        logger.error('Groq AI Service Error', { error: error.message, cvId: params.cvId });
        throw new AppError('Failed to process AI request', 500);
    }
};

export const trackAICost = async (cvId: string, tokens: number) => {
    // Standard cost for Llama 3 70B on Groq is very low/free for now but we track it
    // Input/Output token tracking for quota management
    logger.debug('AI_COST_TRACKER', { cvId, tokens });
};
