// CV Data Types
export interface PersonalInfo {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
}

export interface Experience {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    achievements: string[];
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    description?: string;
    current: boolean;
}

export interface Skill {
    id: string;
    name: string;
    category: 'technical' | 'soft';
    level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Language {
    id: string;
    name: string;
    proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

export interface CVData {
    personal: PersonalInfo;
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
