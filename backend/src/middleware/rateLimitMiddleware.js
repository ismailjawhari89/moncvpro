import { RateLimiterMemory } from 'rate-limiter-flexible';

const getEnvNumber = (key, defaultValue) => {
    const value = process.env[key];
    return value ? parseInt(value, 10) : defaultValue;
};

const globalLimiterOptions = {
    points: getEnvNumber('RATE_LIMIT_MAX_REQUESTS', 100),
    duration: Math.floor(getEnvNumber('RATE_LIMIT_WINDOW_MS', 900000) / 1000),
};

const authLoginLimiterOptions = {
    points: getEnvNumber('AUTH_LOGIN_ATTEMPTS', 5),
    duration: Math.floor(getEnvNumber('RATE_LIMIT_WINDOW_MS', 900000) / 1000),
    blockDuration: 60 * 15,
};

const authRegisterLimiterOptions = {
    points: getEnvNumber('AUTH_REGISTER_ATTEMPTS', 3),
    duration: 60 * 60,
    blockDuration: 60 * 60,
};

const uploadLimiterOptions = {
    points: getEnvNumber('UPLOAD_REQUESTS_LIMIT', 10),
    duration: 60 * 60,
    blockDuration: 60 * 60,
};

const aiGenerateLimiterOptions = {
    points: getEnvNumber('AI_GENERATE_REQUESTS_LIMIT', 20),
    duration: 60 * 60,
    blockDuration: 60 * 60,
};

export const globalRateLimiter = new RateLimiterMemory(globalLimiterOptions);
export const authLoginRateLimiter = new RateLimiterMemory(authLoginLimiterOptions);
export const authRegisterRateLimiter = new RateLimiterMemory(authRegisterLimiterOptions);
export const uploadRateLimiter = new RateLimiterMemory(uploadLimiterOptions);
export const aiGenerateRateLimiter = new RateLimiterMemory(aiGenerateLimiterOptions);

const getClientIp = (req) => {
    return (
        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.headers['x-real-ip'] ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.ip
    );
};

const logRateLimitViolation = (ip, route, remainingTime) => {
    const timestamp = new Date().toISOString();
    console.warn(`[RATE LIMIT] ${timestamp} - IP: ${ip} - Route: ${route} - Retry after: ${remainingTime}s`);
    
    if (process.env.NODE_ENV === 'production') {
        console.error(`[SECURITY ALERT] Potential abuse detected from IP: ${ip} on route: ${route}`);
    }
};

export const rateLimitMiddleware = (limiter, routeName = 'API') => {
    return async (req, res, next) => {
        const ip = getClientIp(req);
        
        try {
            const rateLimiterRes = await limiter.consume(ip);
            
            res.setHeader('X-RateLimit-Limit', limiter.points);
            res.setHeader('X-RateLimit-Remaining', rateLimiterRes.remainingPoints);
            res.setHeader('X-RateLimit-Reset', new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString());
            
            next();
        } catch (rateLimiterRes) {
            const retrySecs = Math.ceil(rateLimiterRes.msBeforeNext / 1000);
            
            logRateLimitViolation(ip, routeName, retrySecs);
            
            res.setHeader('Retry-After', retrySecs);
            res.setHeader('X-RateLimit-Limit', limiter.points);
            res.setHeader('X-RateLimit-Remaining', 0);
            res.setHeader('X-RateLimit-Reset', new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString());
            
            return res.status(429).json({
                success: false,
                error: 'Too many requests',
                message: `Rate limit exceeded. Please try again in ${retrySecs} seconds.`,
                retryAfter: retrySecs,
            });
        }
    };
};

export const globalRateLimit = rateLimitMiddleware(globalRateLimiter, 'Global');
export const authLoginRateLimit = rateLimitMiddleware(authLoginRateLimiter, 'Auth Login');
export const authRegisterRateLimit = rateLimitMiddleware(authRegisterRateLimiter, 'Auth Register');
export const uploadRateLimit = rateLimitMiddleware(uploadRateLimiter, 'Upload');
export const aiGenerateRateLimit = rateLimitMiddleware(aiGenerateRateLimiter, 'AI Generate');
