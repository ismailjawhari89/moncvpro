import prisma from '../lib/prisma';
import { logger } from '../lib/logger';

export class AuditService {
    /**
     * Log a security or system event to the database
     */
    async logAuditEvent(
        userId: string | null,
        action: string,
        actionDetails: any,
        ipAddress?: string,
        userAgent?: string,
        status: 'success' | 'failure' = 'success'
    ) {
        try {
            await prisma.auditLog.create({
                data: {
                    userId: userId || undefined,
                    action,
                    actionDetails: actionDetails || {},
                    ipAddress,
                    userAgent,
                    status
                }
            });

            // Also log to the primary logger for real-time monitoring
            logger.info(`Audit Event: ${action}`, { userId, action, status });
        } catch (error: any) {
            // We do not throw error here to avoid breaking the main auth flow
            logger.error('Failed to save audit log to database', { error: error.message, action });
        }
    }
}

export const auditService = new AuditService();
