
import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Batched user loader to prevent N+1 queries
 */
export const userLoader = new DataLoader(async (userIds: readonly string[]) => {
    const users = await prisma.user.findMany({
        where: {
            id: { in: [...userIds] }
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            profileImage: true
        }
    });

    // Map results back to original keys order
    const userMap = users.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
    }, {} as Record<string, any>);

    return userIds.map(id => userMap[id] || null);
});
