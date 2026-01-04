
import Bull from 'bull';
import dotenv from 'dotenv';
import { TemplateContext } from '../services/templateEngine';

dotenv.config();

const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD
};

export interface EmailJobData {
    to: string;
    subject: string;
    templateName: string;
    context: TemplateContext;
    userId?: string;
}

export const emailQueue = new Bull<EmailJobData>('email-notification', {
    redis: redisConfig,
    defaultJobOptions: {
        attempts: 5,
        backoff: {
            type: 'exponential',
            delay: 5000
        },
        removeOnComplete: true,
        removeOnFail: false
    }
});

export async function queueEmail(payload: EmailJobData) {
    const { to, templateName, subject } = payload;

    const job = await emailQueue.add(
        payload,
        {
            jobId: `email-${to}-${templateName}-${Date.now()}`,
            priority: templateName === 'reset-password' ? 1 : 2
        }
    );

    return {
        jobId: job.id,
        status: 'queued'
    };
}
