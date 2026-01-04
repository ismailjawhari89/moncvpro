
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AdminPermission, RBACService } from '../services/rbac.service';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

/**
 * Middleware to authorize admin actions based on role and permissions
 */
export const authorizeAdmin = (permission?: AdminPermission) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const userPayload = (req as any).user;

        if (!userPayload?.id) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        try {
            // Fetch full user with admin status and role
            const user = await prisma.user.findUnique({
                where: { id: userPayload.id },
                select: {
                    id: true,
                    isAdmin: true,
                    role: true,
                    suspendedAt: true
                }
            });

            if (!user || (!user.isAdmin && !user.role)) {
                logger.warn({ userId: userPayload.id }, 'Unauthorized admin access attempt');
                return res.status(403).json({ error: 'Admin access denied' });
            }

            if (user.suspendedAt) {
                return res.status(403).json({ error: 'Your admin account is suspended' });
            }

            // Check specific permission if provided
            if (permission && user.role) {
                const hasPermission = RBACService.hasPermission(user.role, permission);
                if (!hasPermission) {
                    logger.warn({
                        userId: user.id,
                        role: user.role,
                        permission
                    }, 'Permission denied for admin action');
                    return res.status(403).json({ error: `Missing required permission: ${permission}` });
                }
            } else if (permission && !user.role) {
                // Handle case where user is marked isAdmin but has no role (fallback to SUPER_ADMIN or guest)
                if (!user.isAdmin) {
                    return res.status(403).json({ error: 'Insufficient permissions' });
                }
            }

            // Allow if SUPER_ADMIN or has permission
            next();
        } catch (error) {
            logger.error({ error }, 'Admin authorization error');
            next(error);
        }
    };
};
