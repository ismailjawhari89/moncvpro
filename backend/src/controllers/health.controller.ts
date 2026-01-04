import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { cacheService } from '../services/cacheService';

export class HealthController {
    /**
     * Liveness probe (Kubernetes/LB)
     * Quick check to see if the process is running.
     */
    getLive(req: Request, res: Response) {
        res.status(200).json({ status: 'UP' });
    }

    /**
     * Readiness/Health probe
     * Deep check of dependencies (DB, Cache, etc.)
     */
    async getHealth(req: Request, res: Response) {
        const health = {
            status: 'UP',
            timestamp: new Date().toISOString(),
            components: {
                database: 'UNKNOWN',
                cache: 'UNKNOWN',
                ai_provider: 'UNKNOWN'
            }
        };

        // 1. Check Database (Critical)
        try {
            await prisma.$queryRaw`SELECT 1`;
            health.components.database = 'UP';
        } catch (e) {
            health.components.database = 'DOWN';
            health.status = 'DEGRADED';
        }

        // 2. Check Cache
        try {
            const isCacheUp = await cacheService.healthCheck();
            health.components.cache = isCacheUp ? 'UP' : 'DOWN';
            // Cache down usually doesn't mean app down, just degraded performance
        } catch (e) {
            health.components.cache = 'DOWN';
        }

        // 3. Check AI Provider
        // We check if API key is configured. 
        // We avoid calling external API here to prevent rate limits/costs on health checks.
        if (process.env.GROQ_API_KEY) {
            health.components.ai_provider = 'UP';
        } else {
            health.components.ai_provider = 'DISABLED';
        }

        // If Database is down, the service is effectively down/degraded severely
        const statusCode = health.components.database === 'UP' ? 200 : 503;

        // If status was marked DEGRADED but DB is UP (e.g. only cache is down), 
        // we might still want to return 200 depending on strategy. 
        // User acceptance criteria implies: "status: UP" -> 200, else 503.
        // My logic checks DB. If DB is UP, I return 200. 
        // But if health.status is 'DEGRADED' (due to DB failure in catch block), statusCode becomes 503.

        res.status(statusCode).json(health);
    }
}

export const healthController = new HealthController();
