
import express from 'express';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { emailQueue } from '../../queues/emailQueue';

import { authMiddleware } from '../../middleware/authMiddleware';
import { datasources } from '../../../prisma/prisma.config';

const router = express.Router();
const db = new PrismaClient({ datasources });

/**
 * Share CV with user/email
 */
router.post('/cvs/:cvId/share', authMiddleware, async (req: any, res: any) => {
    const { cvId } = req.params;
    const { email, permission = 'comment' } = req.body;

    try {
        // Verify ownership
        const cv: any = await (db as any).cV.findUnique({
            where: { id: cvId }
        });

        if (!cv) {
            return res.status(404).json({ error: 'CV not found' });
        }

        if (cv.userId !== (req as any).userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const token = crypto.randomBytes(16).toString('hex');

        // Create share
        const share = await (db as any).cVShare.upsert({
            where: { cvId_sharedWith: { cvId, sharedWith: email } },
            create: {
                cvId,
                sharedWith: email,
                permission,
                token
            },
            update: { permission }
        });

        // Send email invitation
        await emailQueue.add({
            to: email,
            subject: `Invitation to collaborate on ${cv.title}`,
            template: 'cv-share-invitation',
            data: {
                cvName: cv.title,
                shareLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/shared/${share.token}`,
                permission
            }
        });

        res.json({ success: true, share });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get shared CV (public link)
 */
router.get('/shared/:token', async (req: any, res: any) => {
    const { token } = req.params;

    try {
        const share = await (db as any).cVShare.findUnique({
            where: { token },
            include: { cv: true }
        });

        if (!share || (share.expiresAt && share.expiresAt < new Date())) {
            return res.status(404).json({ error: 'Share expired or not found' });
        }

        res.json({
            cv: share.cv,
            permission: share.permission
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Add comment
 */
router.post('/cvs/:cvId/comments', authMiddleware, async (req: any, res: any) => {
    const { cvId } = req.params;
    const { section, sectionId, text } = req.body;

    try {
        // Verify permission (simplified for demo)
        const comment = await (db as any).cVComment.create({
            data: {
                cvId,
                userId: (req as any).userId,
                section,
                sectionId,
                text
            }
        });

        // Notify CV owner via WebSocket (Mocked for now)
        console.log(`[Socket] Notifying owner about new comment on CV ${cvId}`);

        res.json(comment);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get all comments for a CV
 */
router.get('/cvs/:cvId/comments', authMiddleware, async (req: any, res: any) => {
    const { cvId } = req.params;
    try {
        const comments = await (db as any).cVComment.findMany({
            where: { cvId },
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true } } }
        });
        res.json(comments);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
