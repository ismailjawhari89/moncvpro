
import { Request } from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Log a user action for auditing purposes
 */
export async function logAction(
    userId: string,
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    entity: string,
    entityId: string,
    changes: any,
    req: Request
) {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                actionDetails: {
                    entity,
                    entityId,
                    changes
                },
                ipAddress: req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress,
                userAgent: req.get('user-agent'),
                status: 'success'
            }
        });
    } catch (error) {
        console.error('Failed to log action:', error);
    }
}

/**
 * Calculate difference between two objects
 * Simple implementation for demo purposes
 */
export function calculateDiff(oldObj: any, newObj: any) {
    const diff: any = {};

    if (!oldObj) return { _all: { old: null, new: newObj } };

    const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

    allKeys.forEach(key => {
        if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
            diff[key] = {
                old: oldObj[key],
                new: newObj[key]
            };
        }
    });

    return diff;
}

/**
 * Create a new version for a CV
 */
export async function createCVVersion(
    cvId: string,
    version: number,
    snapshot: any,
    userId: string,
    description?: string
) {
    await (prisma as any).cVVersion.create({
        data: {
            cvId,
            version,
            snapshot,
            createdBy: userId,
            description
        }
    });
}
