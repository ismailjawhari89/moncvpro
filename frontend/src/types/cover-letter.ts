/**
 * Cover Letter Types
 * Type definitions for the Cover Letter Builder
 */

export interface PersonalInfo {
    fullName: string;
    email: string;
    phone: string;
    linkedIn?: string;
    currentPosition: string;
}

export interface CompanyInfo {
    hiringManagerName?: string;
    companyName: string;
    jobTitle: string;
    jobReference?: string;
}

export interface LetterContent {
    introduction: string;
    bodyParagraph1: string;
    bodyParagraph2: string;
    bodyParagraph3: string;
    closing: string;
    callToAction: string;
}

export type ToneStyle = 'professional' | 'creative' | 'concise' | 'friendly' | 'formal';

export interface CoverLetterData {
    personalInfo: PersonalInfo;
    companyInfo: CompanyInfo;
    content: LetterContent;
    tone: ToneStyle;
    templateId: string;
}

export interface CoverLetterTemplate {
    id: string;
    name: string;
    category: 'modern' | 'classic' | 'creative' | 'minimalist' | 'corporate' | 'academic';
    description: string;
    preview: string;
    styles: {
        fontFamily: string;
        fontSize: string;
        lineHeight: string;
        headerColor: string;
        textColor: string;
        accentColor: string;
        spacing: string;
    };
}

export interface AIAnalysis {
    grammarScore: number;
    toneScore: number;
    keywordScore: number;
    readabilityScore: number;
    suggestions: string[];
    improvements: {
        section: keyof LetterContent;
        original: string;
        improved: string;
        reason: string;
    }[];
}

export interface ExportOptions {
    format: 'pdf' | 'docx' | 'txt';
    pageSize: 'A4' | 'Letter';
    includeHeader: boolean;
    includeFooter: boolean;
}
