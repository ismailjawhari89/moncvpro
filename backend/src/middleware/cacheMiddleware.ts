
import { Request, Response, NextFunction } from 'express';
import { cacheService } from '../services/cacheService';
import { logger } from '../lib/logger';

/**
 * Middleware to cache GET responses
 * @param ttl Time to live in seconds
 * @param tags Optional tags for invalidation
 */
export const cacheMiddleware = (ttl: number = 3600, tags: string[] = []) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        const cacheKey = cacheService.generateKey(req);

        try {
            const cachedData = await cacheService.get(cacheKey);

            if (cachedData) {
                res.set('X-Cache', 'HIT');
                return res.json(cachedData);
            }

            res.set('X-Cache', 'MISS');

            // Override res.json to capture response and store in cache
            const originalJson = res.json;
            res.json = function (this: any, body: any) {
                // Store in cache asynchronously
                cacheService.set(cacheKey, body, ttl, tags).catch(err => {
                    logger.error({ error: err.message, cacheKey }, 'Failed to background set cache');
                });

                return originalJson.call(this, body);
            } as any;

            next();
        } catch (error: any) {
            logger.error({ error: error.message, cacheKey }, 'Cache middleware error');
            next();
        }
    };
};
