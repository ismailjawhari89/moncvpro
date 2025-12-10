/**
 * Template to CV Data Converter
 * Converts sample data from enhanced templates to CVData format
 */

import { CVData, Experience, Education, Skill, Language, PersonalInfo } from '@/types/cv';
import {
    EnhancedCVTemplate,
    SampleCVData,
    getSampleDataForTemplate,
    getEnhancedTemplateById
} from '@/data/enhanced-templates';

// Generate unique IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Convert sample data to CVData format
 */
export function convertSampleDataToCVData(
    template: EnhancedCVTemplate,
    sampleData: SampleCVData
): Partial<CVData> {
    // Convert experiences
    const experiences: Experience[] = sampleData.experience.map((exp, index) => ({
        id: generateId(),
        company: exp.company,
        position: exp.title,
        startDate: exp.startDate,
        endDate: exp.endDate,
        current: exp.current,
        description: exp.achievements.join('\n• '),
        achievements: exp.achievements
    }));

    // Convert education
    const education: Education[] = sampleData.education.map((edu, index) => ({
        id: generateId(),
        institution: edu.institution,
        degree: edu.degree.split(',')[0].trim(),
        field: edu.degree.includes(',') ? edu.degree.split(',')[1]?.trim() : '',
        graduationYear: edu.graduationDate,
        startDate: '',
        endDate: edu.graduationDate,
        current: false,
        description: edu.gpa ? `GPA: ${edu.gpa}` : ''
    }));

    // Convert skills
    const skills: Skill[] = sampleData.skills.map((skill, index) => ({
        id: generateId(),
        name: skill.name,
        level: skill.level,
        category: skill.category.toLowerCase().includes('soft') ? 'soft' : 'technical'
    }));

    // Convert languages
    const languages: Language[] = sampleData.languages.map((lang, index) => ({
        id: generateId(),
        name: lang.name,
        proficiency: lang.level.toLowerCase().includes('native') ? 'native' :
            lang.level.toLowerCase().includes('fluent') || lang.level.toLowerCase().includes('professional') ? 'fluent' :
                lang.level.toLowerCase().includes('conversational') ? 'conversational' : 'basic'
    }));

    // Personal info
    const personalInfo: PersonalInfo = {
        fullName: sampleData.personalInfo.fullName,
        email: sampleData.personalInfo.email,
        phone: sampleData.personalInfo.phone,
        address: sampleData.personalInfo.location,
        profession: sampleData.personalInfo.title,
        linkedin: sampleData.personalInfo.linkedin || '',
        github: sampleData.personalInfo.website || ''
    };

    return {
        personalInfo,
        summary: sampleData.personalInfo.summary,
        experiences,
        education,
        skills,
        languages,
        template: 'modern' as any // Will be overridden
    };
}

/**
 * Get sample CV data for a template
 */
export function getTemplateSampleCVData(templateId: string): Partial<CVData> | null {
    const template = getEnhancedTemplateById(templateId);
    if (!template) return null;

    const sampleData = getSampleDataForTemplate(template);
    return convertSampleDataToCVData(template, sampleData);
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
    const template = getEnhancedTemplateById(templateId);
    if (!template) {
        return {
            primary: '#3b82f6',
            secondary: '#1e40af',
            accent: '#60a5fa'
        };
    }
    return {
        primary: template.colors.primary,
        secondary: template.colors.secondary,
        accent: template.colors.accent,
        text: '#1f2937',
        muted: '#6b7280',
        background: '#ffffff'
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
    const template = getEnhancedTemplateById(templateId);
    if (!template) {
        return {
            heading: 'Inter, sans-serif',
            body: 'Inter, sans-serif'
        };
    }
    return {
        heading: template.typography.heading + ', sans-serif',
        body: template.typography.body + ', sans-serif'
    };
}

/**
 * Check if user has empty/minimal data
 */
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

/**
 * Merge sample data with existing user data
 * Only fills empty sections, preserves user's existing data
 */
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
 * Get template metadata for display
 */
export function getTemplateMetadata(templateId: string) {
    const template = getEnhancedTemplateById(templateId);
    if (!template) return null;

    return {
        id: template.id,
        name: template.name,
        description: template.description,
        atsScore: template.atsScore,
        atsReason: template.atsReason,
        category: template.category,
        style: template.style,
        experienceLevel: template.experienceLevel,
        features: template.features,
        bestFor: template.bestFor,
        tips: template.tips,
        colors: template.colors,
        typography: template.typography,
        layout: template.layout
    };
}
