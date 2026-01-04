
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { auditService } from '../services/audit.service';
import { datasources } from '../../prisma/prisma.config';

const prisma = new PrismaClient({ datasources });

/**
 * Middleware to restrict access to users with unverified emails
 */
export const verifiedMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const userPayload = (req as any).user;

    if (!userPayload?.id) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userPayload.id },
            select: { id: true, emailVerified: true }
        });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        if (!user.emailVerified) {
            // Log the blocked attempt
            await auditService.logAuditEvent(
                user.id,
                'ACCESS_BLOCKED_UNVERIFIED',
                {
                    path: req.originalUrl || req.path,
                    method: req.method
                },
                req.audit?.ip,
                req.audit?.userAgent,
                'failure'
            );

            return res.status(403).json({
                error: "Email verification required",
                code: "EMAIL_NOT_VERIFIED"
            });
        }

        // Attach verification status to req.user for further use if needed
        (req as any).user.emailVerified = user.emailVerified;

        next();
    } catch (error) {
        next(error);
    }
};
