
import modern from './modern.json';
import classic from './classic.json';
import creative from './creative.json';
import { TemplateDef } from '../types';
import { aiTemplates, getAITemplateById } from '@/data/ai-templates/ai-templates';

// Legacy template definitions (for backward compatibility with existing renderer)
export const templates: Record<string, TemplateDef> = {
    modern: modern as unknown as TemplateDef,
    classic: classic as unknown as TemplateDef,
    creative: creative as unknown as TemplateDef
};

// Get template definition by ID
export const getTemplate = (id: string): TemplateDef => {
    // First check legacy templates
    if (templates[id]) {
        return templates[id];
    }

    // For new AI templates, map to closest legacy definition
    const aiTemplate = getAITemplateById(id);
    if (aiTemplate) {
        // Map based on layout style
        if (aiTemplate.design.layout === 'creative') {
            return templates.creative;
        } else if (aiTemplate.design.layout === 'classic' || aiTemplate.design.layout === 'academic' || aiTemplate.design.layout === 'executive') {
            return templates.classic;
        }
    }

    // Default to modern
    return templates.modern;
};

// Get all template IDs
export const getTemplateIds = () => {
    return aiTemplates.map(t => t.id);
};

// Get template display info for dropdowns/selectors
export const getTemplateDisplayInfo = (id: string) => {
    const aiTemplate = getAITemplateById(id);
    if (aiTemplate) {
        return {
            id: aiTemplate.id,
            name: aiTemplate.name.en, // Default to English name here
            thumbnail: '', // Thumbnail handling moved to AITemplatePreview
            description: aiTemplate.description.en,
            category: 'Professional',
            atsScore: aiTemplate.atsScore,
            palette: aiTemplate.design.colors
        };
    }

    // Legacy fallback
    const legacy = templates[id];
    if (legacy) {
        return {
            id: legacy.id,
            name: legacy.name,
            thumbnail: legacy.thumbnail,
            description: legacy.description,
            category: legacy.category,
            atsScore: 90,
            palette: legacy.palette
        };
    }

    return null;
};

// Map template ID to render configuration
export const getTemplateRenderConfig = (templateId: string) => {
    const aiTemplate = getAITemplateById(templateId);
    const definition = getTemplate(templateId);

    return {
        definition,
        aiTemplate,
        colors: aiTemplate?.design.colors || definition?.palette || {
            primary: '#3b82f6',
            secondary: '#1e40af',
            accent: '#60a5fa'
        },
        typography: {
            heading: aiTemplate?.design.typography.headingFont || 'Inter',
            body: aiTemplate?.design.typography.fontFamily || 'Inter'
        },
        layout: aiTemplate?.design.layout || definition?.metadata?.layout || 'two-column'
    };
};
