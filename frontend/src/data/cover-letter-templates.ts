/**
 * Cover Letter Templates Data
 * Pre-designed templates for cover letters
 */

import { CoverLetterTemplate } from '@/types/cover-letter';

export const coverLetterTemplates: CoverLetterTemplate[] = [
    {
        id: 'modern-professional',
        name: 'Modern Professional',
        category: 'modern',
        description: 'Clean and contemporary design perfect for tech and creative industries',
        preview: '/templates/cover-letter/modern-professional.png',
        styles: {
            fontFamily: "'Inter', sans-serif",
            fontSize: '11pt',
            lineHeight: '1.6',
            headerColor: '#3B82F6',
            textColor: '#1F2937',
            accentColor: '#8B5CF6',
            spacing: '1.5rem'
        }
    },
    {
        id: 'classic-formal',
        name: 'Classic Formal',
        category: 'classic',
        description: 'Traditional business letter format for corporate positions',
        preview: '/templates/cover-letter/classic-formal.png',
        styles: {
            fontFamily: "'Times New Roman', serif",
            fontSize: '12pt',
            lineHeight: '1.5',
            headerColor: '#1F2937',
            textColor: '#374151',
            accentColor: '#6B7280',
            spacing: '1.25rem'
        }
    },
    {
        id: 'creative-design',
        name: 'Creative Design',
        category: 'creative',
        description: 'Bold and colorful design for creative roles and agencies',
        preview: '/templates/cover-letter/creative-design.png',
        styles: {
            fontFamily: "'Outfit', sans-serif",
            fontSize: '11pt',
            lineHeight: '1.7',
            headerColor: '#EC4899',
            textColor: '#1F2937',
            accentColor: '#F59E0B',
            spacing: '1.75rem'
        }
    },
    {
        id: 'minimalist',
        name: 'Minimalist',
        category: 'minimalist',
        description: 'Simple and elegant design that focuses on content',
        preview: '/templates/cover-letter/minimalist.png',
        styles: {
            fontFamily: "'Helvetica', 'Arial', sans-serif",
            fontSize: '11pt',
            lineHeight: '1.6',
            headerColor: '#000000',
            textColor: '#333333',
            accentColor: '#666666',
            spacing: '1.5rem'
        }
    },
    {
        id: 'corporate',
        name: 'Corporate',
        category: 'corporate',
        description: 'Professional design for finance, consulting, and corporate roles',
        preview: '/templates/cover-letter/corporate.png',
        styles: {
            fontFamily: "'Georgia', serif",
            fontSize: '11.5pt',
            lineHeight: '1.5',
            headerColor: '#1E40AF',
            textColor: '#1F2937',
            accentColor: '#3B82F6',
            spacing: '1.5rem'
        }
    },
    {
        id: 'academic',
        name: 'Academic',
        category: 'academic',
        description: 'Scholarly format for academic positions and research roles',
        preview: '/templates/cover-letter/academic.png',
        styles: {
            fontFamily: "'Palatino', 'Book Antiqua', serif",
            fontSize: '12pt',
            lineHeight: '2',
            headerColor: '#374151',
            textColor: '#1F2937',
            accentColor: '#6B7280',
            spacing: '2rem'
        }
    }
];

export const defaultCoverLetterData = {
    personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        linkedIn: '',
        currentPosition: ''
    },
    companyInfo: {
        hiringManagerName: '',
        companyName: '',
        jobTitle: '',
        jobReference: ''
    },
    content: {
        introduction: '',
        bodyParagraph1: '',
        bodyParagraph2: '',
        bodyParagraph3: '',
        closing: '',
        callToAction: ''
    },
    tone: 'professional' as const,
    templateId: 'modern-professional'
};

export const toneDescriptions = {
    professional: 'Balanced and business-appropriate tone',
    creative: 'Engaging and innovative language',
    concise: 'Direct and to-the-point communication',
    friendly: 'Warm and approachable style',
    formal: 'Traditional and highly professional'
};

export const sampleContent = {
    introduction: "I am writing to express my strong interest in the [Job Title] position at [Company Name]. With my background in [Your Field] and proven track record of [Key Achievement], I am confident I would be a valuable addition to your team.",
    bodyParagraph1: "In my current role as [Current Position], I have successfully [Key Responsibility/Achievement]. This experience has equipped me with [Relevant Skills] that directly align with the requirements outlined in your job posting.",
    bodyParagraph2: "What particularly excites me about [Company Name] is [Specific Aspect of Company]. I am impressed by [Company Achievement/Value], and I believe my [Relevant Quality] would contribute to [Company Goal].",
    bodyParagraph3: "My technical skills include [Skill 1], [Skill 2], and [Skill 3]. Additionally, I bring strong [Soft Skill] abilities, which I have demonstrated through [Specific Example].",
    closing: "I am enthusiastic about the opportunity to contribute to [Company Name]'s continued success and would welcome the chance to discuss how my skills and experiences align with your needs.",
    callToAction: "Thank you for considering my application. I look forward to the opportunity to discuss this position further. I am available for an interview at your convenience and can be reached at [Phone] or [Email]."
};
