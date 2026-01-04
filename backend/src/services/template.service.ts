
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Service to manage pre-made CV templates
 */
export const templateService = {
    /**
     * Get all available templates with optional filtering
     */
    async getTemplates(category?: string) {
        return prisma.cVTemplate.findMany({
            where: category ? { category } : undefined,
            orderBy: { downloads: 'desc' }
        });
    },

    /**
     * Get a single template by ID
     */
    async getTemplateById(id: string) {
        return prisma.cVTemplate.findUnique({
            where: { id }
        });
    },

    /**
     * Create a new CV based on a template
     * This clones the template data into a new user CV
     */
    async useAsTemplate(templateId: string, userId: string) {
        const template = await this.getTemplateById(templateId);
        if (!template) throw new Error('Template not found');

        // Update download count (async/background)
        prisma.cVTemplate.update({
            where: { id: templateId },
            data: { downloads: { increment: 1 } }
        }).catch((err: Error) => console.error('Failed to increment download count:', err));

        // Create the new CV
        return prisma.cV.create({
            data: {
                title: `Copy of ${template.name}`,
                userId: userId,
                content: template.data as any,
            }
        });
    },

    /**
     * Get templates grouped by category for the gallery
     */
    async getGroupedTemplates() {
        const templates = await this.getTemplates();
        return templates.reduce((acc: Record<string, any[]>, curr: any) => {
            if (!acc[curr.category]) acc[curr.category] = [];
            acc[curr.category].push(curr);
            return acc;
        }, {});
    }
};
