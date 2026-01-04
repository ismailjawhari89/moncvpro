import { cleanEnv, str, port, url } from 'envalid';

export const validateEnv = () => {
    cleanEnv(process.env, {
        NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
        PORT: port({ default: 3001 }),
        DATABASE_URL: str(),
        JWT_SECRET: str(),
        ACCESS_TOKEN_SECRET: str({ default: 'access-secret-change-me' }),
        REFRESH_TOKEN_SECRET: str({ default: 'refresh-secret-change-me' }),
        ALLOWED_ORIGINS: str({ default: 'http://localhost:3000' }),
        // Optional but recommended for production features
        REDIS_URL: str({ default: 'redis://localhost:6379' }),
        GROQ_API_KEY: str({ default: '' }), // Optional if not using AI
    });
};
