import { lazy } from 'react';
import type { TemplateData } from '@/types/cv';

// Template Types
export type TemplateId = 'modern' | 'classic' | 'creative' | 'executive' | 'minimalist' | 'tech';

export interface TemplateCustomizations {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: 'system' | 'serif' | 'sans' | 'mono';
    spacing: 'compact' | 'normal' | 'spacious';
    headerStyle: 'full' | 'minimal' | 'centered';
}

export interface TemplateConfig {
    id: TemplateId;
    name: string;
    description: string;
    category: 'professional' | 'creative' | 'modern' | 'tech';
    thumbnail: string;
    isPremium: boolean;
    defaultCustomizations: Partial<TemplateCustomizations>;
    supportedCustomizations: (keyof TemplateCustomizations)[];
}

// Template Registry
export const TEMPLATES: Record<TemplateId, TemplateConfig> = {
    modern: {
        id: 'modern',
        name: 'Moderne',
        description: 'Design épuré et professionnel avec accent coloré',
        category: 'modern',
        thumbnail: '/templates/modern-thumb.png',
        isPremium: false,
        defaultCustomizations: {
            primaryColor: '#3b82f6',
            fontFamily: 'sans',
            spacing: 'normal'
        },
        supportedCustomizations: ['primaryColor', 'fontFamily', 'spacing']
    },
    classic: {
        id: 'classic',
        name: 'Classique',
        description: 'Style traditionnel et intemporel',
        category: 'professional',
        thumbnail: '/templates/classic-thumb.png',
        isPremium: false,
        defaultCustomizations: {
            primaryColor: '#1f2937',
            fontFamily: 'serif',
            spacing: 'normal'
        },
        supportedCustomizations: ['primaryColor', 'fontFamily']
    },
    creative: {
        id: 'creative',
        name: 'Créatif',
        description: 'Design audacieux pour les profils créatifs',
        category: 'creative',
        thumbnail: '/templates/creative-thumb.png',
        isPremium: false,
        defaultCustomizations: {
            primaryColor: '#8b5cf6',
            secondaryColor: '#ec4899',
            fontFamily: 'sans',
            spacing: 'spacious'
        },
        supportedCustomizations: ['primaryColor', 'secondaryColor', 'fontFamily', 'spacing']
    },
    executive: {
        id: 'executive',
        name: 'Exécutif',
        description: 'Élégance sobre pour les postes de direction',
        category: 'professional',
        thumbnail: '/templates/executive-thumb.png',
        isPremium: true,
        defaultCustomizations: {
            primaryColor: '#1e3a5f',
            fontFamily: 'serif',
            spacing: 'spacious',
            headerStyle: 'full'
        },
        supportedCustomizations: ['primaryColor', 'fontFamily', 'spacing', 'headerStyle']
    },
    minimalist: {
        id: 'minimalist',
        name: 'Minimaliste',
        description: 'Simplicité maximale, impact maximal',
        category: 'modern',
        thumbnail: '/templates/minimalist-thumb.png',
        isPremium: true,
        defaultCustomizations: {
            primaryColor: '#000000',
            fontFamily: 'system',
            spacing: 'compact'
        },
        supportedCustomizations: ['primaryColor', 'spacing']
    },
    tech: {
        id: 'tech',
        name: 'Tech',
        description: 'Style terminal pour développeurs',
        category: 'tech',
        thumbnail: '/templates/tech-thumb.png',
        isPremium: true,
        defaultCustomizations: {
            primaryColor: '#0f172a',
            secondaryColor: '#3b82f6',
            fontFamily: 'mono',
            spacing: 'normal'
        },
        supportedCustomizations: ['primaryColor', 'secondaryColor']
    }
};

// Template Components (Lazy loaded)
export const TemplateComponents = {
    modern: lazy(() => import('./ModernTemplate')),
    classic: lazy(() => import('./ClassicTemplate')),
    creative: lazy(() => import('./CreativeTemplate')),
    executive: lazy(() => import('./ExecutiveTemplate')),
    minimalist: lazy(() => import('./MinimalistTemplate')),
    tech: lazy(() => import('./TechTemplate'))
};

// Helper functions
export function getTemplateConfig(id: TemplateId): TemplateConfig {
    return TEMPLATES[id];
}

export function getTemplatesByCategory(category: TemplateConfig['category']): TemplateConfig[] {
    return Object.values(TEMPLATES).filter(t => t.category === category);
}

export function getFreeTemplates(): TemplateConfig[] {
    return Object.values(TEMPLATES).filter(t => !t.isPremium);
}

export function getPremiumTemplates(): TemplateConfig[] {
    return Object.values(TEMPLATES).filter(t => t.isPremium);
}

// Font family mapping
export const FONT_FAMILIES: Record<TemplateCustomizations['fontFamily'], string> = {
    system: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
    sans: 'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", "Consolas", monospace'
};

// Color presets for quick selection
export const COLOR_PRESETS = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Navy', value: '#1e3a5f' },
    { name: 'Black', value: '#000000' }
];

export default TEMPLATES;
