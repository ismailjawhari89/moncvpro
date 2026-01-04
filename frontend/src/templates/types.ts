/**
 * Template Type Definitions
 * Type definitions for CV templates
 */

export type PhotoShape = 'circle' | 'square' | 'rounded';
export type ColumnLayout = 'single-column' | 'two-column' | 'three-column';
export type TextAlign = 'left' | 'center' | 'right';
export type Direction = 'ltr' | 'rtl';

export interface TemplateColors {
    primary: string;
    background: string;
    text: string;
    mutedText: string;
    borders: string;
}

export interface TemplateTypography {
    fontFamily: string;
    sizes: {
        name: string;
        jobTitle: string;
        sectionHeader: string;
        body: string;
        contact: string;
    };
    weights: {
        name: string;
        jobTitle: string;
        sectionHeader: string;
        body: string;
    };
}

export interface TemplateSpacing {
    sectionGap: string;
    columnGap: string;
    itemPadding: string;
    documentMargin: string;
}

export interface PhotoSettings {
    size: string;
    borderWidth: string;
    borderColor: string;
    position: 'top-left' | 'top-right' | 'top-center';
}

export interface TemplateDesign {
    colors: TemplateColors;
    typography: TemplateTypography;
    spacing: TemplateSpacing;
    photo?: PhotoSettings;
}

export interface ColumnConfig {
    width: string;
    sections: string[];
}

export interface LayoutConfig {
    type: ColumnLayout;
    columns: {
        left?: ColumnConfig;
        right?: ColumnConfig;
        center?: ColumnConfig;
    };
}

export interface BlockSettings {
    [key: string]: any;
}

export interface TemplateBlock {
    type: string;
    enabled: boolean;
    settings: BlockSettings;
}

export interface TemplateBlocks {
    header: TemplateBlock;
    contact: TemplateBlock;
    summary: TemplateBlock;
    experience: TemplateBlock;
    education: TemplateBlock;
    skills: TemplateBlock;
    languages: TemplateBlock;
    footer: TemplateBlock;
    [key: string]: TemplateBlock;
}

export interface RTLSettings {
    supported: boolean;
    settings: {
        fontFamily: string;
        textAlign: TextAlign;
        direction: Direction;
        photoPosition: string;
        columnOrder: 'normal' | 'reverse';
    };
}

export interface ExportSettings {
    pdf: {
        pageSize: 'A4' | 'Letter';
        margins: {
            top: string;
            right: string;
            bottom: string;
            left: string;
        };
        quality: 'low' | 'medium' | 'high';
    };
}

export interface TemplateMetadata {
    author: string;
    createdAt: string;
    tags: string[];
    previewImage: string;
    isPremium: boolean;
}

export interface TemplateSettings {
    showPhoto: boolean;
    photoShape: PhotoShape;
    showSummary: boolean;
    showContactIcons: boolean;
    columnLayout: ColumnLayout;
    atsCompatible: boolean;
}

export interface TemplateDefinition {
    id: string;
    name: string;
    category: string;
    description: string;
    version: string;
    settings: TemplateSettings;
    design: TemplateDesign;
    layout: LayoutConfig;
    blocks: TemplateBlocks;
    rtl?: RTLSettings;
    export?: ExportSettings;
    metadata: TemplateMetadata;
}

export interface TemplateRegistry {
    [templateId: string]: TemplateDefinition;
}

/**
 * CV Data Types
 */

export interface PersonalInfo {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    photoUrl?: string;
    summary?: string;
}

export interface Experience {
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
    achievements?: string[];
}

export interface Education {
    id: string;
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string;
    gpa?: string;
}

export interface Skill {
    id: string;
    name: string;
    category: string;
    level?: number; // 1-5
}

export interface Language {
    id: string;
    name: string;
    proficiency: 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic';
    level?: number; // 1-5
}

export interface CVData {
    personalInfo: PersonalInfo;
    experience: Experience[];
    education: Education[];
    skills: Skill[];
    languages: Language[];
    certificates?: any[];
}

/**
 * Render Props
 */

export interface TemplateRenderProps {
    template: TemplateDefinition;
    data: CVData;
    locale?: string;
    customizations?: Partial<TemplateDesign>;
}
