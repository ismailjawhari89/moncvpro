import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();
const ARCHIVE_DIR = path.join(process.cwd(), 'logs', 'audit');
const RETENTION_DAYS_DB = 7;
const RETENTION_DAYS_ARCHIVE = 90;

// Ensure archive directory exists
if (!fs.existsSync(ARCHIVE_DIR)) {
    fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
}

/**
 * Archive old audit logs from DB to JSON files
 */
export const archiveAuditLogs = async () => {
    logger.info('Starting audit log archival process...');

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS_DB);

    try {
        // Find logs older than retention period
        const logsToArchive = await prisma.auditLog.findMany({
            where: {
                createdAt: {
                    lt: cutoffDate
                }
            },
            take: 1000 // Process in batches
        });

        if (logsToArchive.length === 0) {
            logger.info('No audit logs to archive.');
            return;
        }

        const dateStr = new Date().toISOString().split('T')[0];
        const archiveFile = path.join(ARCHIVE_DIR, `audit-${dateStr}-${Date.now()}.jsonl`);

        const stream = fs.createWriteStream(archiveFile, { flags: 'a' });

        const archivedIds: number[] = [];

        for (const log of logsToArchive) {
            stream.write(JSON.stringify(log) + '\n');
            archivedIds.push(log.id);
        }

        stream.end();

        // Delete archived logs from DB
        await prisma.auditLog.deleteMany({
            where: {
                id: {
                    in: archivedIds
                }
            }
        });

        logger.info({ count: logsToArchive.length, file: archiveFile }, 'Audit logs archived and deleted from DB.');

        // Recursively call if we hit the batch limit (simple implementation)
        if (logsToArchive.length === 1000) {
            await archiveAuditLogs();
        }

    } catch (error: any) {
        logger.error({ error: error.message }, 'Failed to archive audit logs');
    }
};

/**
 * Cleanup old archive files (older than 90 days)
 */
export const cleanupArchives = async () => {
    logger.info('Starting archive cleanup...');
    const cleanupCutoff = new Date();
    cleanupCutoff.setDate(cleanupCutoff.getDate() - RETENTION_DAYS_ARCHIVE);

    try {
        const files = fs.readdirSync(ARCHIVE_DIR);

        for (const file of files) {
            const filePath = path.join(ARCHIVE_DIR, file);
            const stats = fs.statSync(filePath);

            if (stats.birthtime < cleanupCutoff) {
                fs.unlinkSync(filePath);
                logger.info({ file }, 'Deleted old audit archive file');
            }
        }
    } catch (error: any) {
        logger.error({ error: error.message }, 'Failed to cleanup archive files');
    }
};

// Initialize Cron Jobs
export const initAuditJobs = () => {
    // Run every day at 02:00 AM
    cron.schedule('0 2 * * *', async () => {
        await archiveAuditLogs();
        await cleanupArchives();
    });
    logger.info('Audit archival jobs scheduled (Daily at 02:00 AM)');
};
