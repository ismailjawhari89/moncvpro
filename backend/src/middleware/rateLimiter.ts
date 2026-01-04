
import rateLimit from 'express-rate-limit';

/**
 * Standard Auth Endpoint Rate Limiter
 * 5 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: { error: 'Too many requests, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Password Reset Rate Limiter
 * 3 requests per hour per IP (Simplified from 'per email' for middleware level)
 */
export const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: { error: 'Too many password reset attempts, please try again after an hour' },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * 2FA Verification Limiter
 * 5 attempts per 15 minutes
 */
export const mfaLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Too many 2FA attempts, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * AI Service Rate Limiter
 * 10 requests per hour per IP
 */
export const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: { error: 'Daily AI limit reached (10 requests/hour). Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * CV Management Rate Limiter
 * 50 operations per 15 minutes
 */
export const cvLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: { error: 'Too many CV operations. Relax for a bit.' },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Global API Limiter
 * 100 requests per minute per IP
 * Skip health checks
 */
export const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100,
    message: { error: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path.startsWith('/health') || req.path.startsWith('/api/health')
});
