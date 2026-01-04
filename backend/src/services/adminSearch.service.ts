
import { Prisma, PrismaClient } from '@prisma/client';
import { datasources } from '../../prisma/prisma.config';

const prisma = new PrismaClient({ datasources });

export class AdminSearchService {
    /**
     * Build where clause for user search/filtering
     */
    static buildUserWhereClause(filters: any): Prisma.UserWhereInput {
        const where: Prisma.UserWhereInput = {
            deletedAt: null // Only active users by default
        };

        if (filters.search) {
            where.OR = [
                { email: { contains: filters.search, mode: 'insensitive' } },
                { firstName: { contains: filters.search, mode: 'insensitive' } },
                { lastName: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        if (filters.role) {
            where.role = filters.role;
        }

        if (filters.isAdmin !== undefined) {
            where.isAdmin = filters.isAdmin === 'true';
        }

        if (filters.isSuspended === 'true') {
            where.suspendedAt = { not: null };
        } else if (filters.isSuspended === 'false') {
            where.suspendedAt = null;
        }

        if (filters.emailVerified === 'true') {
            where.emailVerified = { not: null };
        } else if (filters.emailVerified === 'false') {
            where.emailVerified = null;
        }

        if (filters.createdAfter || filters.createdBefore) {
            where.createdAt = {};
            if (filters.createdAfter) {
                (where.createdAt as Prisma.DateTimeFilter).gte = new Date(filters.createdAfter);
            }
            if (filters.createdBefore) {
                (where.createdAt as Prisma.DateTimeFilter).lte = new Date(filters.createdBefore);
            }
        }

        return where;
    }
}
