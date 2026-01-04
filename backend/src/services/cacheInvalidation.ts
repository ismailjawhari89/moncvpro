
import { cacheService } from './cacheService';
import { logger } from '../lib/logger';

export const invalidateCache = {
    user: async (userId: string) => {
        await cacheService.invalidateByTag(`user:${userId}`);
        await cacheService.invalidateByTag('admin:users');
    },

    subscription: async (userId: string) => {
        await cacheService.invalidateByTag(`subscription:${userId}`);
        await cacheService.invalidateByTag('admin:subscriptions');
        await cacheService.invalidateByTag('admin:analytics');
    },

    cv: async (userId: string, cvId: string) => {
        await cacheService.del(`cache:/cvs/${cvId}`);
        await cacheService.invalidateByTag(`user:${userId}:cvs`);
    },

    adminAnalytics: async () => {
        await cacheService.invalidateByTag('admin:analytics');
    }
};
