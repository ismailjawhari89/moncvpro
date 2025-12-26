
import { createGroq } from '@ai-sdk/groq';

/**
 * Shared Groq provider instance.
 * Trims the API key to avoid accidental whitespace errors.
 */
export const groq = createGroq({
    apiKey: (process.env.NEXT_PUBLIC_GROQ_API_KEY || '').trim(),
});

/**
 * Validates if the Groq API key is present.
 */
export const hasGroqKey = () => {
    const key = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (!key) {
        console.warn('Groq Key Debug: NEXT_PUBLIC_GROQ_API_KEY is undefined');
    }
    return !!key && key.trim().length > 5;
};
