// CV Data Types
export interface PersonalInfo {
    fullName: string;
    email: string;
    phone: string;
    address: string; // Changed from location to address
    profession?: string;
    linkedin?: string;
    github?: string;
    photoUrl?: string;
}

export interface Experience {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string; // Added description
    achievements?: string[];
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    graduationYear: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    description?: string;
}

export interface Skill {
    id: string;
    name: string;
    level: number;
    category: 'technical' | 'soft' | 'language';
}

export interface Language {
    id: string;
    name: string;
    proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

// Optional certification for professional templates
export interface Certification {
    id: string;
    name: string;
    issuer: string;
    date: string;
}

export interface CVData {
    id?: string;
    personalInfo: PersonalInfo;
    experiences: Experience[];
    education: Education[];
    skills: Skill[];
    languages: Language[];
    certifications?: Certification[]; // Optional for professional templates
    summary: string;
    // System Data
    template: TemplateType;
    theme?: string; // e.g., 'dark', 'emerald'
    metadata: {
        createdAt: string;
        updatedAt: string;
        version: number;
        lastAutoSave: string;
        lastModified: number; // For sync conflict resolution
    };
    contentLanguage: 'en' | 'ar' | 'fr'; // Language of the CV content
    targetJob?: string; // Target job description for AI tailoring
    coverLetter?: CoverLetterData;
}

export interface CoverLetterData {
    content: string;
    recipientName?: string;
    recipientTitle?: string;
    companyName?: string;
    date?: string;
    lastGenerated?: string;
}

export interface TemplateData {
    personal: {
        fullName: string;
        email: string;
        phone: string;
        location: string;
        summary: string;
    };
    experiences: Experience[];
    education: Education[];
    skills: Skill[];
    languages: Language[];
}

export type TemplateType =
    | 'modern'
    | 'classic'
    | 'creative'
    | 'executive'
    | 'minimalist'
    | 'tech'
    | 'modern-developer'
    | 'medical-doctor'
    | 'academic-professor'
    | 'creative-designer'
    | 'executive-manager'
    | 'professional-chef'
    | 'research-scientist'
    | 'hr-manager'
    | 'civil-engineer'
    | 'artist-musician';

export interface SavedCV {
    id: string;
    data: CVData;
    template: TemplateType;
    createdAt: string;
    updatedAt: string;
}

export interface AISuggestion {
    id: string;
    type: 'personal' | 'summary' | 'experience' | 'education' | 'skill' | 'language' | 'general';
    targetId?: string;
    targetItemTitle?: string;
    field?: string;
    originalContent?: string;
    suggestedContent: string;
    improvementBrief: string;
    reason: string;
    applied: boolean;
    timestamp: number;
}
