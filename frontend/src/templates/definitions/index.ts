import modern from './modern.json';
import classic from './classic.json';
import creative from './creative.json';
import { TemplateDef } from '../types';
import { enhancedTemplates, getEnhancedTemplateById } from '@/data/enhanced-templates';

// Legacy template definitions (for backward compatibility with existing renderer)
export const templates: Record<string, TemplateDef> = {
    modern: modern as unknown as TemplateDef,
    classic: classic as unknown as TemplateDef,
    creative: creative as unknown as TemplateDef
};

// Get template definition by ID (legacy)
export const getTemplate = (id: string): TemplateDef => {
    // First check legacy templates
    if (templates[id]) {
        return templates[id];
    }

    // For new enhanced templates, map to closest legacy definition
    const enhanced = getEnhancedTemplateById(id);
    if (enhanced) {
        // Map based on style
        if (enhanced.style.includes('creative')) {
            return templates.creative;
        } else if (enhanced.style.includes('professional') || enhanced.style.includes('minimalist')) {
            return templates.classic;
        }
    }

    // Default to modern
    return templates.modern;
};

// Get all template IDs (including enhanced)
export const getTemplateIds = () => {
    return enhancedTemplates.map(t => t.id);
};

// Get template display info for dropdowns/selectors
export const getTemplateDisplayInfo = (id: string) => {
    const enhanced = getEnhancedTemplateById(id);
    if (enhanced) {
        return {
            id: enhanced.id,
            name: enhanced.name,
            thumbnail: enhanced.previewImage,
            description: enhanced.description,
            category: enhanced.category[0],
            atsScore: enhanced.atsScore,
            palette: enhanced.colors
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
    const enhanced = getEnhancedTemplateById(templateId);
    const definition = getTemplate(templateId);

    return {
        definition,
        enhanced,
        colors: enhanced?.colors || definition?.palette || {
            primary: '#3b82f6',
            secondary: '#1e40af',
            accent: '#60a5fa'
        },
        typography: enhanced?.typography || definition?.typography || {
            heading: 'Inter',
            body: 'Inter'
        },
        layout: enhanced?.layout || definition?.metadata?.layout || 'two-column'
    };
};
