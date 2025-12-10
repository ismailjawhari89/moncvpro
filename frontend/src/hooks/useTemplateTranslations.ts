/**
 * Smart Translation Hook for Templates
 * Provides dynamic translation with RTL support and template-specific content
 */

import { useParams } from 'next/navigation';
import { useMemo, useCallback } from 'react';
import { EnhancedCVTemplate } from '@/data/enhanced-templates';

// Import template translations
import templateTranslationsEn from '@/i18n/locales/templates/en.json';
import templateTranslationsAr from '@/i18n/locales/templates/ar.json';

// Type definitions
type Locale = 'en' | 'ar' | 'fr';

interface TranslatedTemplate extends Omit<EnhancedCVTemplate, 'name' | 'description' | 'bestFor' | 'features' | 'tips'> {
    name: string;
    description: string;
    bestFor: string[];
    features: string[];
    tips: string[];
    // Original values for fallback
    originalName: string;
    originalDescription: string;
}

interface TemplateTranslations {
    gallery: Record<string, string>;
    filters: Record<string, string>;
    categories: Record<string, string>;
    styles: Record<string, string>;
    levels: Record<string, string>;
    card: Record<string, string>;
    modal: Record<string, string>;
    difficulty: Record<string, string>;
    templates: Record<string, {
        name: string;
        description: string;
        bestFor: string[];
        features: string[];
        tips: string[];
    }>;
    sampleData?: Record<string, any>;
}

// Get translations based on locale
const getTranslations = (locale: Locale): TemplateTranslations => {
    switch (locale) {
        case 'ar':
            return templateTranslationsAr as TemplateTranslations;
        case 'en':
        default:
            return templateTranslationsEn as TemplateTranslations;
    }
};

/**
 * Main hook for template translations
 */
export function useTemplateTranslations() {
    const params = useParams();
    const locale = (params?.locale as Locale) || 'en';
    const isRTL = locale === 'ar';

    // Get translations for current locale
    const translations = useMemo(() => getTranslations(locale), [locale]);

    // Translate a single template
    const translateTemplate = useCallback((template: EnhancedCVTemplate): TranslatedTemplate => {
        const templateTranslation = translations.templates?.[template.id];

        return {
            ...template,
            name: templateTranslation?.name || template.nameAr || template.name,
            description: templateTranslation?.description || template.descriptionAr || template.description,
            bestFor: templateTranslation?.bestFor || template.bestFor,
            features: templateTranslation?.features || template.features,
            tips: templateTranslation?.tips || template.tips,
            originalName: template.name,
            originalDescription: template.description
        };
    }, [translations]);

    // Translate all templates
    const translateTemplates = useCallback((templates: EnhancedCVTemplate[]): TranslatedTemplate[] => {
        return templates.map(translateTemplate);
    }, [translateTemplate]);

    // Get category translation
    const translateCategory = useCallback((category: string): string => {
        return translations.categories?.[category] || category;
    }, [translations]);

    // Get style translation
    const translateStyle = useCallback((style: string): string => {
        return translations.styles?.[style] || style;
    }, [translations]);

    // Get experience level translation
    const translateLevel = useCallback((level: string): string => {
        return translations.levels?.[level] || level;
    }, [translations]);

    // Get difficulty translation
    const translateDifficulty = useCallback((difficulty: string): string => {
        return translations.difficulty?.[difficulty] || difficulty;
    }, [translations]);

    // Get UI string translation
    const t = useCallback((key: string, section: keyof TemplateTranslations = 'gallery'): string => {
        const sectionData = translations[section];
        if (typeof sectionData === 'object' && sectionData !== null) {
            return (sectionData as Record<string, string>)[key] || key;
        }
        return key;
    }, [translations]);

    // Get sample data for locale
    const getSampleData = useCallback((industry: string = 'tech') => {
        return translations.sampleData?.[industry] || null;
    }, [translations]);

    return {
        locale,
        isRTL,
        direction: isRTL ? 'rtl' : 'ltr',
        translations,
        translateTemplate,
        translateTemplates,
        translateCategory,
        translateStyle,
        translateLevel,
        translateDifficulty,
        t,
        getSampleData,
        // Convenience accessors
        galleryStrings: translations.gallery,
        filterStrings: translations.filters,
        cardStrings: translations.card,
        modalStrings: translations.modal
    };
}

/**
 * Hook for RTL-aware styling
 */
export function useRTLStyles() {
    const params = useParams();
    const locale = (params?.locale as Locale) || 'en';
    const isRTL = locale === 'ar';

    return useMemo(() => ({
        isRTL,
        direction: isRTL ? 'rtl' : 'ltr',
        textAlign: isRTL ? 'right' : 'left',
        flexDirection: isRTL ? 'row-reverse' : 'row',
        marginStart: isRTL ? 'marginRight' : 'marginLeft',
        marginEnd: isRTL ? 'marginLeft' : 'marginRight',
        paddingStart: isRTL ? 'paddingRight' : 'paddingLeft',
        paddingEnd: isRTL ? 'paddingLeft' : 'paddingRight',
        startPosition: isRTL ? 'right' : 'left',
        endPosition: isRTL ? 'left' : 'right',
        // CSS classes
        flipClass: isRTL ? 'flip-rtl' : '',
        textClass: isRTL ? 'text-right' : 'text-left',
        flexClass: isRTL ? 'flex-row-reverse' : 'flex-row',
        // Font
        fontFamily: isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif'
    }), [isRTL]);
}

/**
 * Hook for date formatting based on locale
 */
export function useDateFormatter() {
    const params = useParams();
    const locale = (params?.locale as Locale) || 'en';

    const formatDate = useCallback((date: Date | string, format: 'short' | 'long' | 'month-year' = 'short'): string => {
        const d = typeof date === 'string' ? new Date(date) : date;

        if (isNaN(d.getTime())) return String(date);

        const optionsMap: Record<string, Intl.DateTimeFormatOptions> = {
            short: { year: 'numeric', month: 'short' },
            long: { year: 'numeric', month: 'long', day: 'numeric' },
            'month-year': { year: 'numeric', month: 'long' }
        };

        const options = optionsMap[format];
        const localeCode = locale === 'ar' ? 'ar-SA' : locale === 'fr' ? 'fr-FR' : 'en-US';

        return d.toLocaleDateString(localeCode, options);
    }, [locale]);

    const formatPresent = useCallback((): string => {
        return locale === 'ar' ? 'حتى الآن' : locale === 'fr' ? 'Présent' : 'Present';
    }, [locale]);

    return { formatDate, formatPresent };
}

export default useTemplateTranslations;
