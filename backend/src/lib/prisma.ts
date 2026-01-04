import { PrismaClient } from '@prisma/client';
import { datasources } from '../../prisma/prisma.config';

declare global {
    var prisma: PrismaClient | undefined;
}

const prismaClient = new PrismaClient({
    datasources,
    log: process.env.NODE_ENV === 'development' ? [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'warn' },
    ] : [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'error' }
    ],
});

// Log query durations
(prismaClient as any).$on('query', (e: any) => {
    const duration = e.duration;
    const query = e.query;

    if (process.env.NODE_ENV === 'development' || duration > 200) {
        const level = duration > 200 ? 'warn' : 'debug';
        (logger as any)[level](`Prisma Query Execution`, {
            query,
            duration: `${duration}ms`,
            timestamp: e.timestamp
        });
    }
});

export const prisma = global.prisma || prismaClient;

import { logger } from './logger';

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}

export default prisma;
