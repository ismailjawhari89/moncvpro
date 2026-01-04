
import Bull from 'bull';
import dotenv from 'dotenv';

dotenv.config();

const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD
};

export const pdfQueue = new Bull('pdf-generation', {
    redis: redisConfig,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000
        },
        removeOnComplete: true,
        removeOnFail: false
    }
});

// Mock notification function
const notifyUser = (cvId: string, data: any) => {
    console.log(`[Notification] User ${cvId}:`, data);
};

// Add job
export async function queuePDFGeneration(cvId: string, format: 'standard' | 'hq' | 'ats') {
    const job = await pdfQueue.add(
        { cvId, format },
        {
            jobId: `pdf-${cvId}-${format}-${Date.now()}`,
            priority: 1,
            attempts: 3
        }
    );

    return {
        jobId: job.id,
        status: 'queued',
        estimatedWaitTime: 30 // seconds
    };
}

// Listen to events
pdfQueue.on('completed', (job) => {
    console.log(`PDF generation completed: ${job.id}`);
    // Emit WebSocket event to user
    if (job.data && job.data.cvId) {
        notifyUser(job.data.cvId, { status: 'completed', jobId: job.id });
    }
});

pdfQueue.on('failed', (job, err) => {
    console.error(`PDF generation failed: ${job.id}`, err);
    if (job.data && job.data.cvId) {
        notifyUser(job.data.cvId, { status: 'failed', error: err.message });
    }
});
