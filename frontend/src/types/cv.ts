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

export interface CVData {
    id?: string;
    personalInfo: PersonalInfo;
    experiences: Experience[];
    education: Education[];
    skills: Skill[];
    languages: Language[];
    summary: string;
    // System Data
    template: TemplateType;
    theme?: string; // e.g., 'dark', 'emerald'
    metadata: {
        createdAt: string;
        updatedAt: string;
        version: number;
        lastAutoSave: string;
    };
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

export type TemplateType = 'modern' | 'classic' | 'creative';

export interface SavedCV {
    id: string;
    data: CVData;
    template: TemplateType;
    createdAt: string;
    updatedAt: string;
}
