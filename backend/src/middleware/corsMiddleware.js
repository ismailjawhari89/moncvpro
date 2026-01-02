import cors from 'cors';

const getAllowedOrigins = () => {
    const envOrigins = process.env.ALLOWED_ORIGINS;
    
    if (envOrigins) {
        return envOrigins.split(',').map(origin => origin.trim());
    }
    
    if (process.env.NODE_ENV === 'production') {
        return ['https://moncvpro.pages.dev'];
    }
    
    return ['http://localhost:3000', 'http://localhost:3001'];
};

const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = getAllowedOrigins();
        
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            console.warn(`[CORS] Blocked request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'X-Requested-With'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset', 'Retry-After'],
    maxAge: 3600,
    optionsSuccessStatus: 204,
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
