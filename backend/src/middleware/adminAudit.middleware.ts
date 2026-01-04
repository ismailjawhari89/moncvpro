
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';
import { datasources } from '../../prisma/prisma.config';

const prisma = new PrismaClient({ datasources });

/**
 * Middleware to log admin actions to the AdminAuditLog table.
 * This should be used on admin endpoints that perform mutations.
 */
export const logAdminAction = (action: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // We wrap res.send or res.json to log AFTER the request completes successfully
        const originalJson = res.json;
        const adminId = (req as any).user?.id;

        if (!adminId) return next();

        res.json = function (data) {
            // Only log successful actions (2xx status codes)
            if (res.statusCode >= 200 && res.statusCode < 300) {
                const targetId = req.params.id || req.body.userId || req.body.targetId;
                const changes = req.body;

                // Fire and forget logging
                prisma.adminAuditLog.create({
                    data: {
                        adminId,
                        action,
                        targetId,
                        changes: changes ? JSON.parse(JSON.stringify(changes)) : null,
                        ipAddress: req.ip as string,
                        userAgent: req.headers['user-agent'] as string,
                    }
                }).catch((err: any) => logger.error({ err }, 'Failed to save admin audit log'));
            }
            return originalJson.call(this, data);
        };

        next();
    };
};
