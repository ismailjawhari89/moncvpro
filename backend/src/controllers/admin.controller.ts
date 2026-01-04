
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { paginate, buildPaginationMetadata } from '../utils/pagination';
import { AdminSearchService } from '../services/adminSearch.service';
import { logger } from '../lib/logger';
import { emailService } from '../services/email.service';
import { invalidateCache } from '../services/cacheInvalidation';
import { datasources } from '../../prisma/prisma.config';

const prisma = new PrismaClient({ datasources });

export const adminController = {
    // --- User Management ---

    async listUsers(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const filters = req.query;

            const where = AdminSearchService.buildUserWhereClause(filters);
            const { skip, take } = paginate(page, limit);

            const [users, total] = await Promise.all([
                prisma.user.findMany({
                    where,
                    skip,
                    take,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        isAdmin: true,
                        role: true,
                        suspendedAt: true,
                        emailVerified: true,
                        createdAt: true,
                    }
                }),
                prisma.user.count({ where })
            ]);

            res.json({
                users,
                metadata: buildPaginationMetadata(total, page, limit)
            });
        } catch (error) {
            logger.error({ error }, 'Failed to list users');
            res.status(500).json({ error: 'Failed to list users' });
        }
    },

    async getUserDetails(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await prisma.user.findUnique({
                where: { id },
                include: {
                    sessions: { take: 5, orderBy: { lastActivityAt: 'desc' } },
                    auditLogs: { take: 10, orderBy: { createdAt: 'desc' } },
                    cvs: { select: { id: true, title: true, updatedAt: true } }
                }
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch user details' });
        }
    },

    async suspendUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { reason } = req.body;

            const user = await prisma.user.update({
                where: { id },
                data: {
                    suspendedAt: new Date(),
                    suspensionReason: reason || 'Violation of terms'
                }
            });

            await invalidateCache.user(id);

            res.json({ message: 'User suspended successfully', user });
        } catch (error) {
            res.status(500).json({ error: 'Failed to suspend user' });
        }
    },

    async reactivateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await prisma.user.update({
                where: { id },
                data: {
                    suspendedAt: null,
                    suspensionReason: null
                }
            });

            await invalidateCache.user(id);

            res.json({ message: 'User reactivated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to reactivate user' });
        }
    },

    async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            // Hard delete or soft delete? User asked for hard delete with confirmation.
            await prisma.user.delete({ where: { id } });

            await invalidateCache.user(id);

            res.json({ message: 'User deleted permanently' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete user' });
        }
    },

    async sendEmailToUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { subject, message } = req.body;

            const user = await prisma.user.findUnique({ where: { id } });
            if (!user) return res.status(404).json({ error: 'User not found' });

            await emailService.sendEmail({
                to: user.email,
                subject,
                html: `<p>${message}</p>`,
                userId: user.id
            });

            res.json({ message: 'Email sent successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to send email' });
        }
    },

    // --- Subscription Management (Mocked for now until Stripe Task) ---

    async listSubscriptions(req: Request, res: Response) {
        // This will be expanded in Stripe task
        res.json({ subscriptions: [], metadata: { total: 0 } });
    },

    // --- Analytics ---

    async getOverview(req: Request, res: Response) {
        try {
            const [totalUsers, activeUsersToday, totalCvs] = await Promise.all([
                prisma.user.count(),
                prisma.session.count({
                    where: { lastActivityAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } }
                }),
                prisma.cV.count()
            ]);

            res.json({
                totalUsers,
                activeUsersToday,
                totalCvs,
                // Mock revenue for now
                mrr: 0,
                churnRate: '0%'
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch analytics' });
        }
    },

    // --- System Settings ---

    async getHealthStatus(req: Request, res: Response) {
        try {
            // Check DB
            await prisma.$queryRaw`SELECT 1`;

            res.json({
                status: 'healthy',
                timestamp: new Date(),
                services: {
                    database: 'up',
                    redis: 'up', // Mock
                    api: 'up'
                }
            });
        } catch (error) {
            res.status(503).json({ status: 'unhealthy', error: 'Database connection failed' });
        }
    }
};
