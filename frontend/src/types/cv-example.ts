export interface CVExample {
    id: string;
    slug: string;
    title: string;
    description: string;
    industry: 'Technology' | 'Marketing' | 'Finance' | 'Design' | 'Education' | 'Healthcare';
    level: 'Entry Level' | 'Mid Level' | 'Senior' | 'Executive';
    style: 'Modern' | 'Classic' | 'Creative' | 'Minimalist';
    color: string; // For thumbnail background
    content: {
        personalInfo: {
            fullName: string;
            title: string;
            email: string;
            phone: string;
            location: string;
            website?: string;
            linkedin?: string;
        };
        summary: string;
        experience: {
            id: string;
            title: string;
            company: string;
            location: string;
            startDate: string;
            endDate: string;
            description: string;
            achievements?: string[];
        }[];
        education: {
            id: string;
            degree: string;
            school: string;
            location: string;
            startDate: string;
            endDate: string;
        }[];
        skills: string[];
        languages: string[];
    };
    tags: string[];
    atsScore: number;
}
