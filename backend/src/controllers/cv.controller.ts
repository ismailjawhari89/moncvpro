import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { auditService } from '../services/audit.service';
import { logger } from '../lib/logger';

export class CVController {
    /**
     * List user's CVs
     */
    async listCVs(req: Request, res: Response) {
        const userId = (req as any).userId;
        try {
            const cvs = await prisma.cV.findMany({
                where: {
                    userId,
                    deletedAt: null
                },
                orderBy: { updatedAt: 'desc' }
            });

            logger.debug('CV_LIST_RETRIEVED', { userId, count: cvs.length });

            res.json(cvs);
        } catch (error: any) {
            logger.error('Failed to fetch CVs', { userId, error: error.message });
            res.status(500).json({ error: 'Failed to fetch CVs' });
        }
    }

    /**
     * Create a new CV
     */
    async createCV(req: Request, res: Response) {
        const userId = (req as any).userId;
        const { title, template, personalInfo, summary, experiences, education, skills } = req.body;

        try {
            // Nested write for relational integrity
            const cv = await prisma.cV.create({
                data: {
                    title,
                    template: template || 'modern-pro',
                    personalInfo,
                    summary,
                    userId,
                    experiences: experiences ? {
                        create: experiences
                    } : undefined,
                    education: education ? {
                        create: education
                    } : undefined,
                    skills: skills ? {
                        create: skills
                    } : undefined,
                    content: req.body // Keep full snapshot in content for backup/legacy
                },
                include: {
                    experiences: true,
                    education: true,
                    skills: true
                }
            });

            await auditService.logAuditEvent(
                userId,
                'CV_CREATED',
                { cvId: cv.id, title },
                req.ip,
                req.headers['user-agent']
            );

            res.status(201).json({
                success: true,
                data: cv
            });
        } catch (error: any) {
            logger.error('Failed to create CV', { userId, error: error.message });
            res.status(500).json({ error: 'Failed to create CV' });
        }
    }

    /**
     * Get CV by ID (with ownership check)
     */
    async getCV(req: Request, res: Response) {
        const { id } = req.params;
        const userId = (req as any).userId;

        try {
            const cv = await prisma.cV.findUnique({ where: { id } });

            if (!cv || cv.deletedAt) {
                logger.warn('CV_NOT_FOUND', { userId, cvId: id });
                return res.status(404).json({ error: 'CV not found' });
            }

            if (cv.userId !== userId) {
                await auditService.logAuditEvent(
                    userId,
                    'UNAUTHORIZED_CV_ACCESS',
                    { cvId: id, ownerId: cv.userId },
                    req.ip,
                    req.headers['user-agent'],
                    'failure'
                );
                return res.status(403).json({
                    error: 'Forbidden',
                    message: 'You do not have permission to access this CV'
                });
            }

            res.json(cv);
        } catch (error: any) {
            logger.error('Get CV error', { userId, cvId: id, error: error.message });
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Update CV (with ownership check)
     */
    async updateCV(req: Request, res: Response) {
        const { id } = req.params;
        const userId = (req as any).userId;
        const { title, template, personalInfo, summary, experiences, education, skills } = req.body;

        try {
            const cv = await prisma.cV.findUnique({ where: { id } });

            if (!cv || cv.deletedAt) {
                return res.status(404).json({ error: 'CV not found' });
            }

            if (cv.userId !== userId) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            // Perform nested updates:
            // For simplicity in this example, we clear and recreate related records
            // In a production app, you might want more complex connect/upsert logic
            const updated = await prisma.$transaction(async (tx) => {
                // 1. Clear existing related records
                if (experiences) await tx.experience.deleteMany({ where: { cvId: id } });
                if (education) await tx.education.deleteMany({ where: { cvId: id } });
                if (skills) await tx.skill.deleteMany({ where: { cvId: id } });

                // 2. Update CV and recreate nested records
                return await tx.cV.update({
                    where: { id },
                    data: {
                        title,
                        template,
                        personalInfo,
                        summary,
                        content: req.body,
                        experiences: experiences ? { create: experiences } : undefined,
                        education: education ? { create: education } : undefined,
                        skills: skills ? { create: skills } : undefined,
                    },
                    include: {
                        experiences: true,
                        education: true,
                        skills: true
                    }
                });
            });

            res.json({
                success: true,
                data: updated
            });
        } catch (error: any) {
            logger.error('Update CV error', { userId, cvId: id, error: error.message });
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Delete CV (Soft delete)
     */
    async deleteCV(req: Request, res: Response) {
        const { id } = req.params;
        const userId = (req as any).userId;

        try {
            const cv = await prisma.cV.findUnique({ where: { id } });

            if (!cv || cv.deletedAt) {
                return res.status(404).json({ error: 'CV not found' });
            }

            if (cv.userId !== userId) {
                await auditService.logAuditEvent(
                    userId,
                    'UNAUTHORIZED_CV_DELETE',
                    { cvId: id, ownerId: cv.userId },
                    req.ip,
                    req.headers['user-agent'],
                    'failure'
                );
                return res.status(403).json({
                    error: 'Forbidden',
                    message: 'You do not have permission to delete this CV'
                });
            }

            // Soft delete
            await prisma.cV.update({
                where: { id },
                data: { deletedAt: new Date() }
            });

            await auditService.logAuditEvent(
                userId,
                'CV_DELETED',
                { cvId: id, title: cv.title },
                req.ip,
                req.headers['user-agent']
            );

            res.json({ message: 'CV deleted successfully' });
        } catch (error: any) {
            logger.error('Delete CV error', { userId, cvId: id, error: error.message });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export const cvController = new CVController();
