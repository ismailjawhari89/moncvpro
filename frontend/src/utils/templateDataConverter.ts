
/**
 * Template to CV Data Converter
 * AI Templates version
 */

import { CVData } from '@/types/cv';
import { getAITemplateById } from '@/data/ai-templates/ai-templates';

// Helper: Check if user has empty/minimal data
export function hasMinimalData(cvData: CVData): boolean {
    const hasName = cvData.personalInfo?.fullName?.trim();
    const hasSummary = cvData.summary?.trim();
    const hasExperience = cvData.experiences?.length > 0;
    const hasEducation = cvData.education?.length > 0;
    const hasSkills = cvData.skills?.length > 0;

    // Consider data minimal if user has fewer than 2 filled sections
    let filledSections = 0;
    if (hasName) filledSections++;
    if (hasSummary) filledSections++;
    if (hasExperience) filledSections++;
    if (hasEducation) filledSections++;
    if (hasSkills) filledSections++;

    return filledSections < 2;
}

// Helper: Merge sample data
export function mergeSampleDataWithExisting(
    existingData: CVData,
    sampleData: Partial<CVData>,
    fillEmptyOnly: boolean = true
): CVData {
    if (!fillEmptyOnly) {
        // Replace all data with sample
        return {
            ...existingData,
            ...sampleData,
            metadata: existingData.metadata,
            template: existingData.template
        } as CVData;
    }

    // Smart merge - only fill empty sections
    const merged: CVData = { ...existingData };

    // Personal info - only fill if empty
    if (!existingData.personalInfo?.fullName?.trim() && sampleData.personalInfo) {
        merged.personalInfo = {
            ...merged.personalInfo,
            ...sampleData.personalInfo,
            // Preserve photo if exists
            photoUrl: existingData.personalInfo?.photoUrl
        };
    }

    // Summary
    if (!existingData.summary?.trim() && sampleData.summary) {
        merged.summary = sampleData.summary;
    }

    // Experiences
    if ((!existingData.experiences || existingData.experiences.length === 0) && sampleData.experiences) {
        merged.experiences = sampleData.experiences;
    }

    // Education
    if ((!existingData.education || existingData.education.length === 0) && sampleData.education) {
        merged.education = sampleData.education;
    }

    // Skills
    if ((!existingData.skills || existingData.skills.length === 0) && sampleData.skills) {
        merged.skills = sampleData.skills;
    }

    // Languages
    if ((!existingData.languages || existingData.languages.length === 0) && sampleData.languages) {
        merged.languages = sampleData.languages;
    }

    return merged;
}

/**
 * Get sample CV data for a template (Now comes directly from AI Template definition)
 */
export function getTemplateSampleCVData(templateId: string): Partial<CVData> | null {
    const template = getAITemplateById(templateId);
    if (!template) return null;
    return template.exampleData;
}

/**
 * Get template colors for styling
 */
export interface TemplateColors {
    primary: string;
    secondary: string;
    accent: string;
    text?: string;
    muted?: string;
    background?: string;
}

export function getTemplateColors(templateId: string): TemplateColors {
    const template = getAITemplateById(templateId);
    if (!template) {
        return {
            primary: '#3b82f6',
            secondary: '#1e40af',
            accent: '#60a5fa'
        };
    }
    return {
        ...template.design.colors,
        muted: '#6b7280'
    };
}

/**
 * Get template typography
 */
export interface TemplateTypography {
    heading: string;
    body: string;
}

export function getTemplateTypography(templateId: string): TemplateTypography {
    const template = getAITemplateById(templateId);
    if (!template) {
        return {
            heading: 'Inter, sans-serif',
            body: 'Inter, sans-serif'
        };
    }
    return {
        heading: template.design.typography.headingFont,
        body: template.design.typography.fontFamily
    };
}
