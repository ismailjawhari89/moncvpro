
import { Request } from 'express';
import { logAction, calculateDiff, createCVVersion } from '../utils/auditLog';
import { invalidateCache } from './cacheInvalidation';

// Mock DB client
const db = {
    cv: {
        findUnique: async ({ where }: any) => {
            return { id: where.id, title: 'Old Title', content: { personal: { name: 'John' } }, version: 1 };
        },
        update: async ({ where, data }: any) => {
            console.log(`[DB] Updating CV ${where.id}...`);
            return { id: where.id, ...data };
        },
        count_versions: async (cvId: string) => {
            return 5;
        }
    }
};

/**
 * Service to handle CV updates with audit logging and versioning
 */
export async function updateCV(cvId: string, data: any, userId: string, req: Request) {
    // 1. Fetch the current state before update
    const oldCV = await db.cv.findUnique({ where: { id: cvId } });

    // 2. Perform the update
    const updatedCV = await db.cv.update({
        where: { id: cvId },
        data
    });

    // 3. Calculate differences
    const changes = calculateDiff(oldCV, updatedCV);

    // 4. Log the action
    await logAction(userId, 'UPDATE', 'CV', cvId, changes, req);

    // 5. Create a version if significant changes or explicitly requested
    // In a real app, you might only version every X changes or on manual save
    const currentVersionCount = await db.cv.count_versions(cvId);
    await createCVVersion(
        cvId,
        currentVersionCount + 1,
        updatedCV,
        userId,
        'Automatic update version'
    );

    // Invalidate Cache
    await invalidateCache.cv(userId, cvId);

    return updatedCV;
}

/**
 * Restore a specific version of a CV
 */
export async function restoreVersion(cvId: string, versionId: string, userId: string, req: Request) {
    console.log(`Restoring version ${versionId} for CV ${cvId}`);
    // implementation would fetch snapshot from versionId and update CV
    // then log 'RESTORE' action
}
