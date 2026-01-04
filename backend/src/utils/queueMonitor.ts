
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { Express } from 'express';
import { pdfQueue } from '../queues/pdfQueue';
import { aiQueue } from '../queues/aiQueue';
import { emailQueue } from '../queues/emailQueue';

export function setupBullBoard(app: Express) {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');

    createBullBoard({
        queues: [
            new BullAdapter(pdfQueue),
            new BullAdapter(aiQueue),
            new BullAdapter(emailQueue)
        ],
        serverAdapter
    });

    app.use('/admin/queues', serverAdapter.getRouter());
}

// Metrics
export async function getQueueMetrics() {
    return {
        pdf: {
            pending: await pdfQueue.getWaitingCount(),
            active: await pdfQueue.getActiveCount(),
            completed: await pdfQueue.getCompletedCount(),
            failed: await pdfQueue.getFailedCount()
        },
        ai: {
            pending: await aiQueue.getWaitingCount(),
            active: await aiQueue.getActiveCount(),
            completed: await aiQueue.getCompletedCount(),
            failed: await aiQueue.getFailedCount()
        },
        email: {
            pending: await emailQueue.getWaitingCount(),
            active: await emailQueue.getActiveCount(),
            completed: await emailQueue.getCompletedCount(),
            failed: await emailQueue.getFailedCount()
        }
    };
}
