
import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { logger } from '../lib/logger';
import { encrypt, decrypt } from '../utils/crypto';

export class EmailController {
    /**
     * Get user email preferences
     */
    async getPreferences(req: Request, res: Response) {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        try {
            let preferences = await prisma.emailPreference.findUnique({
                where: { userId }
            });

            if (!preferences) {
                // Initialize default preferences
                preferences = await prisma.emailPreference.create({
                    data: { userId }
                });
            }

            res.json(preferences);
        } catch (error: any) {
            logger.error({ error: error.message, userId }, 'Failed to get email preferences');
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Update email preferences
     */
    async updatePreferences(req: Request, res: Response) {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const { securityAlerts, productUpdates, onboardingEmails, newsletters } = req.body;

        try {
            const preferences = await prisma.emailPreference.upsert({
                where: { userId },
                create: {
                    userId,
                    securityAlerts,
                    productUpdates,
                    onboardingEmails,
                    newsletters
                },
                update: {
                    securityAlerts,
                    productUpdates,
                    onboardingEmails,
                    newsletters
                }
            });

            res.json(preferences);
        } catch (error: any) {
            logger.error({ error: error.message, userId }, 'Failed to update email preferences');
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * One-click unsubscribe
     */
    async unsubscribe(req: Request, res: Response) {
        const { token } = req.params;
        const { category } = req.query; // 'newsletters', 'productUpdates', etc.

        try {
            // Decrypt token to get userId (simple implementation for now)
            // In real app, use a proper signed token with expiry
            const userId = decrypt(token);

            if (!userId) return res.status(400).json({ error: 'Invalid token' });

            const data: any = {};
            if (category && typeof category === 'string') {
                data[category] = false;
            } else {
                // Default: unsubscribe from ALL non-security emails
                data.productUpdates = false;
                data.onboardingEmails = false;
                data.newsletters = false;
            }

            await prisma.emailPreference.upsert({
                where: { userId },
                create: { userId, ...data },
                update: data
            });

            res.send('Successfully unsubscribed. You will no longer receive these emails.');
        } catch (error: any) {
            logger.error({ error: error.message }, 'Unsubscribe failed');
            res.status(400).send('Invalid or expired unsubscribe link.');
        }
    }

    /**
     * Get email history (for the user)
     */
    async getHistory(req: Request, res: Response) {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        try {
            const history = await prisma.emailEvent.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: 50
            });

            res.json(history);
        } catch (error: any) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
