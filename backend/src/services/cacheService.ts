
import Redis from 'ioredis';
import { logger } from '../lib/logger';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

class CacheService {
    private redis: Redis;
    private isConnected: boolean = false;

    constructor() {
        this.redis = new Redis(REDIS_URL, {
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            maxRetriesPerRequest: 3,
        });

        this.redis.on('connect', () => {
            this.isConnected = true;
            logger.info('Redis connected for caching');
        });

        this.redis.on('error', (err) => {
            this.isConnected = false;
            logger.error({ error: err.message }, 'Redis connection error');
        });
    }

    /**
     * Set a value in cache
     * @param key Cache key
     * @param value Value to store
     * @param ttl Time to live in seconds
     * @param tags Tags for invalidation
     */
    async set(key: string, value: any, ttl: number = 3600, tags: string[] = []): Promise<void> {
        if (!this.isConnected) return;

        try {
            const multi = this.redis.multi();
            multi.set(key, JSON.stringify(value), 'EX', ttl);

            // Store tags mapping
            for (const tag of tags) {
                multi.sadd(`tag:${tag}`, key);
            }

            await multi.exec();
        } catch (error: any) {
            logger.error({ error: error.message, key }, 'Failed to set cache');
        }
    }

    /**
     * Get a value from cache
     */
    async get<T>(key: string): Promise<T | null> {
        if (!this.isConnected) return null;

        try {
            const data = await this.redis.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error: any) {
            logger.error({ error: error.message, key }, 'Failed to get cache');
            return null;
        }
    }

    /**
     * Delete a key from cache
     */
    async del(key: string): Promise<void> {
        if (!this.isConnected) return;
        try {
            await this.redis.del(key);
        } catch (error: any) {
            logger.error({ error: error.message, key }, 'Failed to delete cache');
        }
    }

    /**
     * Invalidate all keys associated with a tag
     */
    async invalidateByTag(tag: string): Promise<void> {
        if (!this.isConnected) return;

        try {
            const tagKey = `tag:${tag}`;
            const keys = await this.redis.smembers(tagKey);

            if (keys.length > 0) {
                await this.redis.del(...keys, tagKey);
                logger.debug({ tag, count: keys.length }, 'Invalidated cache by tag');
            }
        } catch (error: any) {
            logger.error({ error: error.message, tag }, 'Failed to invalidate cache by tag');
        }
    }

    /**
     * Simple key generator
     */
    generateKey(req: any): string {
        const url = req.originalUrl || req.url;
        const userId = req.user?.id ? `:${req.user.id}` : '';
        return `cache:${url}${userId}`;
    }

    /**
     * Check Redis connection health
     */
    async healthCheck(): Promise<boolean> {
        if (!this.isConnected) return false;
        try {
            const result = await this.redis.ping();
            return result === 'PONG';
        } catch {
            return false;
        }
    }
}

export const cacheService = new CacheService();
