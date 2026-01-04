import cron from 'node-cron';
import { backupService } from '../services/backup.service';
import { logger } from '../lib/logger';

export const initBackupJob = () => {
    // Run daily at 2:00 AM
    cron.schedule('0 2 * * *', async () => {
        logger.info('Running daily scheduled backup job');
        try {
            await backupService.performBackup();
        } catch (error: any) {
            logger.error('Scheduled backup job failed', { error: error.message });
        }
    });

    logger.info('Backup job scheduled (Daily at 02:00 AM)');
};
