
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { logger } from '../lib/logger';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = new Redis(REDIS_URL);

/**
 * Rate limiting middleware using Redis
 * @param maxRequests Maximum requests in the window
 * @param windowSeconds Window size in seconds
 */
export const rateLimitMiddleware = (maxRequests: number = 100, windowSeconds: number = 60) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const ip = req.ip;
        const key = `ratelimit:${ip}:${req.path}`;

        try {
            const current = await redis.incr(key);

            if (current === 1) {
                await redis.expire(key, windowSeconds);
            }

            if (current > maxRequests) {
                logger.warn({ ip, path: req.path }, 'Rate limit exceeded');
                return res.status(429).json({
                    error: 'Too many requests',
                    retryAfter: await redis.ttl(key)
                });
            }

            next();
        } catch (error: any) {
            logger.error({ error: error.message }, 'Rate limit middleware error');
            // Fallback: allow request if redis is down
            next();
        }
    };
};
