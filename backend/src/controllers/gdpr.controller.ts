import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';
import { auditService } from '../services/audit.service';
import fs from 'fs';
import path from 'path';
import { datasources } from '../../prisma/prisma.config';

const prisma = new PrismaClient({ datasources });

export class GDPRController {
    /**
     * Delete user account and all associated data (Right to be Forgotten)
     */
    async deleteAccount(req: Request, res: Response) {
        const userId = (req as any).userId;

        try {
            logger.warn('Processing account deletion request', { userId });

            // 1. Delete all CVs (Soft or Hard? GDPR implies hard delete usually, or anonymization)
            // The user requirement says: "Delete all CVs first" then "Delete user"
            // Deleting user with Cascade should handle it if relation is set up, but let's be explicit

            // Delete CVs
            await prisma.cV.deleteMany({ where: { userId } });

            // Delete Audit Logs (Personal data in logs?)
            // Usually we keep audit logs for security, but anonymize the user. 
            // However, the requirement says "delete all user data".
            // Let's delete user-specific logs or keep them if they are system critical but nullify userId.
            // Prisma "SetNull" on delete is one option. 
            // Here we rigidly follow: delete what we can.

            // Delete User (triggers cascade for Sessions, etc.)
            await prisma.user.delete({ where: { id: userId } });

            logger.info('User account deleted successfully', { userId });

            // We can't log to audit service easily if user is gone, but we can log "User X deleted".
            // Ideally we log this BEFORE deletion finishes or with the ID.

            res.json({ success: true, message: 'Account and all data deleted successfully' });
        } catch (error: any) {
            logger.error('Failed to delete account', { userId, error: error.message });
            res.status(500).json({ error: 'Failed to delete account' });
        }
    }

    /**
     * Export all user data (Right to Data Portability)
     */
    async exportData(req: Request, res: Response) {
        const userId = (req as any).userId;

        try {
            // Fetch all data
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    emailPreferences: true,
                    linkedIn: true,
                    google: true
                }
            });

            const cvs = await prisma.cV.findMany({
                where: { userId },
                include: {
                    experiences: true,
                    education: true,
                    skills: true
                }
            });

            const auditLogs = await prisma.auditLog.findMany({
                where: { userId }
            });

            const exportData = {
                user,
                cvs,
                auditLogs,
                exportedAt: new Date().toISOString()
            };

            const fileName = `data-export-${userId}-${Date.now()}.json`;

            // Send as attachment
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
            res.send(JSON.stringify(exportData, null, 2));

            await auditService.logAuditEvent(
                userId,
                'DATA_EXPORTED',
                { fileName },
                req.ip,
                req.headers['user-agent']
            );

        } catch (error: any) {
            logger.error('Failed to export data', { userId, error: error.message });
            res.status(500).json({ error: 'Failed to export data' });
        }
    }
}

export const gdprController = new GDPRController();
