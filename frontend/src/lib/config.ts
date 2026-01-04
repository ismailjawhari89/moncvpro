import { z } from 'zod';

const envSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

const validateEnv = () => {
    try {
        const env = {
            NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
            NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        };
        const parsed = envSchema.parse(env);
        return parsed;
    } catch (error) {
        console.error('❌ Invalid environment variables:', error);
        throw new Error('Invalid environment variables');
    }
};

export const env = validateEnv();

export default env;
