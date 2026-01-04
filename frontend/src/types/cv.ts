
export interface PersonalInfo {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    profession?: string;
    jobTitle?: string; // Aligning with template types
    linkedin?: string;
    github?: string;
    location?: string; // Aligning with template types
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
    level?: number;
}

export interface Language {
    id: string;
    name: string;
    proficiency: 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic';
    level?: number;
}

export interface CVData {
    personalInfo: PersonalInfo;
    experience: Experience[];
    education: Education[];
    skills: Skill[];
    languages: Language[];
    certificates?: any[];
    displayMode?: 'pro' | 'ats';
}
