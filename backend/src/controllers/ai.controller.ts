import { Request, Response } from 'express';
import { callAIService, trackAICost } from '../services/ai.service';
import { auditService } from '../services/audit.service';
import { logger } from '../lib/logger';

export class AIController {
    /**
     * Get suggestions for a CV section
     */
    async getSuggestions(req: Request, res: Response) {
        const { cvId, section, prompt } = req.body;
        const userId = (req as any).userId;

        try {
            const suggestions = await callAIService({ cvId, section, prompt });

            // Track cost and audit usage
            await trackAICost(cvId, 150); // Mock tokens

            await auditService.logAuditEvent(
                userId,
                'AI_SUGGESTION_GENERATED',
                { cvId, section },
                req.ip,
                req.headers['user-agent']
            );

            res.json({
                success: true,
                data: suggestions
            });
        } catch (error: any) {
            logger.error('AI suggestion failed', { userId, cvId, error: error.message });

            await auditService.logAuditEvent(
                userId,
                'AI_SUGGESTION_FAILED',
                { cvId, section, error: error.message },
                req.ip,
                req.headers['user-agent'],
                'failure'
            );

            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    /**
     * Improve CV content
     */
    async improveContent(req: Request, res: Response) {
        const { cvId, content } = req.body;
        const userId = (req as any).userId;

        try {
            const prompt = `Improve the following CV content while maintaining professional tone: ${content}`;
            const suggestions = await callAIService({ cvId, section: 'improvement', prompt });

            await auditService.logAuditEvent(
                userId,
                'AI_CONTENT_IMPROVED',
                { cvId },
                req.ip,
                req.headers['user-agent']
            );

            res.json({
                success: true,
                data: suggestions
            });
        } catch (error: any) {
            logger.error('AI improvement failed', { userId, cvId, error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}

export const aiController = new AIController();
