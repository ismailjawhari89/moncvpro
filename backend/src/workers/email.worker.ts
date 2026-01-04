
import { emailQueue, EmailJobData } from '../queues/emailQueue';
import { emailService } from '../services/email.service';
import { logger } from '../lib/logger';

logger.info('Email Worker started...');

emailQueue.process(5, async (job) => {
    try {
        const payload = job.data as EmailJobData;
        logger.info({ jobId: job.id, to: payload.to, template: payload.templateName }, 'Processing email job');

        await job.progress(20);

        // Send Email using service which handles template rendering and tracking
        await emailService.sendEmail({
            to: payload.to,
            subject: payload.subject,
            templateName: payload.templateName,
            context: payload.context,
            userId: payload.userId
        });

        await job.progress(100);
        logger.info({ jobId: job.id, to: payload.to }, 'Email sent successfully');
        return { success: true };

    } catch (error: any) {
        logger.error({ jobId: job.id, error: error.message }, 'Email job failed');
        throw error; // Let Bull handle retries
    }
});
