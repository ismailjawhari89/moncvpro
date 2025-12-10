/**
 * Enhanced CV Templates Database
 * Professional templates with comprehensive metadata for filtering and preview
 */

// ========== TYPES ==========
export type TemplateCategory = 'tech' | 'business' | 'creative' | 'medical' | 'education' | 'all';
export type TemplateStyle = 'modern' | 'minimalist' | 'creative' | 'professional' | 'bold';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'executive';

export interface EnhancedCVTemplate {
    id: string;
    name: string;
    nameAr?: string; // Arabic name for localization
    description: string;
    descriptionAr?: string;

    // Categorization
    category: TemplateCategory[];
    style: TemplateStyle[];
    experienceLevel: ExperienceLevel[];

    // ATS Information
    atsScore: number;
    atsReason: string; // Explanation for the ATS score

    // Pricing
    isPremium: boolean;

    // Visual Assets
    previewImage: string;
    thumbnailImage?: string;
    usePlaceholder?: boolean;

    // SEO
    altText: string;
    metaDescription: string;
    keywords: string[];

    // Design Details
    colors: {
        primary: string;
        secondary: string;
        accent: string;
    };
    typography: {
        heading: string;
        body: string;
    };
    layout: 'one-column' | 'two-column' | 'sidebar' | 'creative';

    // Features & Sections
    features: string[];
    sections: string[];

    // Usage Tips
    bestFor: string[];
    tips: string[];
    difficulty: 'easy' | 'medium' | 'advanced';

    // Stats (can be updated dynamically)
    popularity?: number;
    usageCount?: number;
    rating?: number;
}

// ========== SAMPLE CV DATA ==========
export interface SampleCVData {
    personalInfo: {
        fullName: string;
        title: string;
        email: string;
        phone: string;
        location: string;
        linkedin?: string;
        website?: string;
        summary: string;
    };
    experience: Array<{
        title: string;
        company: string;
        location: string;
        startDate: string;
        endDate: string;
        current: boolean;
        achievements: string[];
    }>;
    education: Array<{
        degree: string;
        institution: string;
        location: string;
        graduationDate: string;
        gpa?: string;
    }>;
    skills: Array<{
        name: string;
        level: number; // 1-5
        category: string;
    }>;
    languages: Array<{
        name: string;
        level: string;
    }>;
}

// Industry-specific sample data
export const sampleDataByIndustry: Record<string, SampleCVData> = {
    tech: {
        personalInfo: {
            fullName: "Alex J. Rivera",
            title: "Senior Full Stack Developer",
            email: "alex.rivera@email.com",
            phone: "+1 (555) 123-4567",
            location: "San Francisco, CA",
            linkedin: "linkedin.com/in/alexrivera",
            website: "alexrivera.dev",
            summary: "Passionate full-stack developer with 7+ years of experience building scalable web applications. Expert in React, Node.js, and cloud technologies. Led teams of 5+ developers and delivered projects that increased user engagement by 40%."
        },
        experience: [
            {
                title: "Senior Full Stack Developer",
                company: "TechCorp Industries",
                location: "San Francisco, CA",
                startDate: "Jan 2021",
                endDate: "Present",
                current: true,
                achievements: [
                    "Led development of microservices architecture serving 2M+ daily users",
                    "Reduced API response time by 60% through optimization",
                    "Mentored 5 junior developers and established code review practices"
                ]
            },
            {
                title: "Full Stack Developer",
                company: "StartupXYZ",
                location: "Austin, TX",
                startDate: "Mar 2018",
                endDate: "Dec 2020",
                current: false,
                achievements: [
                    "Built React-based dashboard used by 500+ enterprise clients",
                    "Implemented CI/CD pipeline reducing deployment time by 75%",
                    "Developed RESTful APIs handling 100K+ requests/day"
                ]
            }
        ],
        education: [
            {
                degree: "B.S. Computer Science",
                institution: "Stanford University",
                location: "Stanford, CA",
                graduationDate: "2018",
                gpa: "3.8"
            }
        ],
        skills: [
            { name: "React/Next.js", level: 5, category: "Frontend" },
            { name: "TypeScript", level: 5, category: "Languages" },
            { name: "Node.js", level: 4, category: "Backend" },
            { name: "PostgreSQL", level: 4, category: "Database" },
            { name: "AWS/GCP", level: 4, category: "Cloud" },
            { name: "Docker/K8s", level: 4, category: "DevOps" }
        ],
        languages: [
            { name: "English", level: "Native" },
            { name: "Spanish", level: "Professional" }
        ]
    },
    business: {
        personalInfo: {
            fullName: "Sarah M. Anderson",
            title: "Senior Project Manager",
            email: "sarah.anderson@email.com",
            phone: "+1 (555) 987-6543",
            location: "New York, NY",
            linkedin: "linkedin.com/in/sarahanderson",
            summary: "Results-driven project manager with 10+ years of experience leading cross-functional teams. PMP certified with expertise in Agile methodologies. Successfully delivered $50M+ in projects on time and under budget."
        },
        experience: [
            {
                title: "Senior Project Manager",
                company: "Fortune 500 Corp",
                location: "New York, NY",
                startDate: "Jun 2019",
                endDate: "Present",
                current: true,
                achievements: [
                    "Managed portfolio of 12 projects with combined budget of $25M",
                    "Achieved 98% on-time delivery rate across all projects",
                    "Reduced project costs by 15% through process optimization"
                ]
            },
            {
                title: "Project Manager",
                company: "Consulting Partners LLC",
                location: "Boston, MA",
                startDate: "Aug 2015",
                endDate: "May 2019",
                current: false,
                achievements: [
                    "Led digital transformation initiative for 3 Fortune 500 clients",
                    "Built and managed team of 20+ consultants",
                    "Increased client satisfaction scores by 35%"
                ]
            }
        ],
        education: [
            {
                degree: "MBA, Strategy",
                institution: "Harvard Business School",
                location: "Boston, MA",
                graduationDate: "2015"
            },
            {
                degree: "B.A. Business Administration",
                institution: "NYU Stern",
                location: "New York, NY",
                graduationDate: "2012"
            }
        ],
        skills: [
            { name: "Project Management", level: 5, category: "Management" },
            { name: "Agile/Scrum", level: 5, category: "Methodologies" },
            { name: "Stakeholder Management", level: 5, category: "Leadership" },
            { name: "Budget Planning", level: 4, category: "Finance" },
            { name: "Risk Assessment", level: 4, category: "Analysis" },
            { name: "MS Project/Jira", level: 5, category: "Tools" }
        ],
        languages: [
            { name: "English", level: "Native" },
            { name: "French", level: "Conversational" }
        ]
    },
    creative: {
        personalInfo: {
            fullName: "Maya Chen",
            title: "Senior UI/UX Designer",
            email: "maya.chen@email.com",
            phone: "+1 (555) 246-8135",
            location: "Los Angeles, CA",
            linkedin: "linkedin.com/in/mayachen",
            website: "mayachen.design",
            summary: "Award-winning UI/UX designer with 8+ years crafting delightful digital experiences. Expertise in design systems, user research, and accessibility. Portfolio includes work for Apple, Google, and Netflix."
        },
        experience: [
            {
                title: "Senior UI/UX Designer",
                company: "Design Studio Pro",
                location: "Los Angeles, CA",
                startDate: "Mar 2020",
                endDate: "Present",
                current: true,
                achievements: [
                    "Redesigned e-commerce platform increasing conversions by 45%",
                    "Created design system adopted by 50+ product teams",
                    "Won 3 Webby Awards for mobile app designs"
                ]
            },
            {
                title: "UI Designer",
                company: "Creative Agency",
                location: "San Diego, CA",
                startDate: "Jan 2017",
                endDate: "Feb 2020",
                current: false,
                achievements: [
                    "Designed 40+ brand identities for startups and enterprises",
                    "Led user research initiatives with 500+ participants",
                    "Established accessibility guidelines for all projects"
                ]
            }
        ],
        education: [
            {
                degree: "M.F.A. Interaction Design",
                institution: "ArtCenter College of Design",
                location: "Pasadena, CA",
                graduationDate: "2017"
            }
        ],
        skills: [
            { name: "Figma", level: 5, category: "Design Tools" },
            { name: "Adobe Creative Suite", level: 5, category: "Design Tools" },
            { name: "User Research", level: 5, category: "UX" },
            { name: "Prototyping", level: 5, category: "UX" },
            { name: "Design Systems", level: 4, category: "UI" },
            { name: "HTML/CSS", level: 4, category: "Development" }
        ],
        languages: [
            { name: "English", level: "Native" },
            { name: "Mandarin", level: "Native" }
        ]
    },
    medical: {
        personalInfo: {
            fullName: "Dr. James Wilson",
            title: "Internal Medicine Physician",
            email: "dr.wilson@hospital.com",
            phone: "+1 (555) 369-2580",
            location: "Chicago, IL",
            summary: "Board-certified Internal Medicine physician with 12+ years of clinical experience. Specialized in chronic disease management and preventive care. Published 15+ peer-reviewed articles and led quality improvement initiatives reducing hospital readmissions by 25%."
        },
        experience: [
            {
                title: "Attending Physician",
                company: "Chicago General Hospital",
                location: "Chicago, IL",
                startDate: "Jul 2018",
                endDate: "Present",
                current: true,
                achievements: [
                    "Manage panel of 2,500+ patients with chronic conditions",
                    "Led telemedicine initiative during COVID-19 pandemic",
                    "Mentor 8 medical residents annually"
                ]
            },
            {
                title: "Resident Physician",
                company: "Johns Hopkins Hospital",
                location: "Baltimore, MD",
                startDate: "Jul 2015",
                endDate: "Jun 2018",
                current: false,
                achievements: [
                    "Completed 3-year Internal Medicine residency program",
                    "Published research on diabetes management protocols",
                    "Awarded Chief Resident position in final year"
                ]
            }
        ],
        education: [
            {
                degree: "M.D.",
                institution: "Johns Hopkins School of Medicine",
                location: "Baltimore, MD",
                graduationDate: "2015"
            },
            {
                degree: "B.S. Biology",
                institution: "Duke University",
                location: "Durham, NC",
                graduationDate: "2011"
            }
        ],
        skills: [
            { name: "Patient Care", level: 5, category: "Clinical" },
            { name: "Diagnostics", level: 5, category: "Clinical" },
            { name: "EMR Systems", level: 4, category: "Technology" },
            { name: "Research", level: 4, category: "Academic" },
            { name: "Team Leadership", level: 4, category: "Management" }
        ],
        languages: [
            { name: "English", level: "Native" },
            { name: "Spanish", level: "Conversational" }
        ]
    },
    education: {
        personalInfo: {
            fullName: "Professor Emily Roberts",
            title: "Associate Professor of Psychology",
            email: "e.roberts@university.edu",
            phone: "+1 (555) 147-2589",
            location: "Boston, MA",
            website: "emilyroberts.academia.edu",
            summary: "Dedicated educator and researcher with 15+ years in higher education. Expertise in cognitive psychology and educational technology. Authored 25+ peer-reviewed publications and secured $2M+ in research grants."
        },
        experience: [
            {
                title: "Associate Professor",
                company: "Boston University",
                location: "Boston, MA",
                startDate: "Aug 2018",
                endDate: "Present",
                current: true,
                achievements: [
                    "Teach undergraduate and graduate courses (500+ students/year)",
                    "Lead research lab with 8 PhD students and 4 postdocs",
                    "Recipient of Excellence in Teaching Award 2022"
                ]
            },
            {
                title: "Assistant Professor",
                company: "University of Michigan",
                location: "Ann Arbor, MI",
                startDate: "Sep 2012",
                endDate: "Jul 2018",
                current: false,
                achievements: [
                    "Developed new curriculum for Psychology 101 course",
                    "Secured $1.2M NSF grant for cognitive research",
                    "Published 12 peer-reviewed articles in top journals"
                ]
            }
        ],
        education: [
            {
                degree: "Ph.D. Cognitive Psychology",
                institution: "Yale University",
                location: "New Haven, CT",
                graduationDate: "2012"
            },
            {
                degree: "M.A. Psychology",
                institution: "Columbia University",
                location: "New York, NY",
                graduationDate: "2008"
            }
        ],
        skills: [
            { name: "Research Methods", level: 5, category: "Academic" },
            { name: "Curriculum Design", level: 5, category: "Teaching" },
            { name: "Grant Writing", level: 5, category: "Academic" },
            { name: "Data Analysis (SPSS, R)", level: 4, category: "Technical" },
            { name: "Academic Publishing", level: 5, category: "Research" }
        ],
        languages: [
            { name: "English", level: "Native" },
            { name: "German", level: "Professional" }
        ]
    }
};

// Default sample data for templates without specific industry
export const defaultSampleData: SampleCVData = sampleDataByIndustry.tech;

// ========== ENHANCED TEMPLATES DATABASE ==========
export const enhancedTemplates: EnhancedCVTemplate[] = [
    // ========== TECH TEMPLATES ==========
    {
        id: 'tech-modern-developer',
        name: 'Modern Developer',
        nameAr: 'المطور الحديث',
        description: 'Clean, professional template perfect for software developers and engineers. Features a modern two-column layout with prominent skills section.',
        descriptionAr: 'قالب نظيف واحترافي مثالي لمطوري البرمجيات والمهندسين',
        category: ['tech', 'all'],
        style: ['modern', 'minimalist'],
        experienceLevel: ['mid', 'senior'],
        atsScore: 95,
        atsReason: 'Clean structure with standard headings, no graphics that confuse ATS, and proper hierarchy for parsing.',
        isPremium: false,
        previewImage: '/templates/tech-modern-developer.png',
        altText: 'Modern Developer CV Template - ATS Optimized for Software Engineers',
        metaDescription: 'Download this ATS-friendly Modern Developer CV template. Perfect for software engineers and developers looking for a clean, professional design.',
        keywords: ['developer', 'software engineer', 'programmer', 'tech', 'IT', 'coding'],
        colors: { primary: '#3B82F6', secondary: '#1E40AF', accent: '#60A5FA' },
        typography: { heading: 'Inter', body: 'Inter' },
        layout: 'two-column',
        features: ['ATS-Optimized', 'Two-Column Layout', 'Skills Progress Bars', 'GitHub Integration', 'Tech Stack Icons'],
        sections: ['Contact', 'Summary', 'Experience', 'Skills', 'Education', 'Projects', 'Certifications'],
        bestFor: ['Software Developers', 'DevOps Engineers', 'Data Scientists', 'Full Stack Developers'],
        tips: [
            'Highlight your tech stack prominently in the skills section',
            'Include links to GitHub and portfolio projects',
            'Quantify achievements with metrics (performance improvements, users served)'
        ],
        difficulty: 'easy',
        popularity: 95,
        rating: 4.8
    },
    {
        id: 'tech-full-stack',
        name: 'Full Stack Pro',
        nameAr: 'المطور الشامل',
        description: 'Comprehensive layout to showcase front-end and back-end expertise. Perfect for developers who work across the entire stack.',
        descriptionAr: 'تصميم شامل لعرض خبرات الواجهة الأمامية والخلفية',
        category: ['tech', 'all'],
        style: ['modern', 'professional'],
        experienceLevel: ['mid', 'senior'],
        atsScore: 92,
        atsReason: 'Standard formatting with clear sections. Tech stack icons are properly labeled for ATS compatibility.',
        isPremium: false,
        previewImage: '/templates/tech-full-stack.png',
        altText: 'Full Stack Developer Resume Template with Tech Stack Icons',
        metaDescription: 'Showcase your full-stack development skills with this professional resume template.',
        keywords: ['full stack', 'frontend', 'backend', 'web developer', 'javascript', 'python'],
        colors: { primary: '#10B981', secondary: '#059669', accent: '#34D399' },
        typography: { heading: 'Poppins', body: 'Inter' },
        layout: 'two-column',
        features: ['Tech Stack Icons', 'GitHub Integration', 'Portfolio Links', 'ATS-Friendly', 'Project Showcase'],
        sections: ['Contact', 'Summary', 'Technical Skills', 'Experience', 'Projects', 'Education'],
        bestFor: ['Full Stack Developers', 'Web Developers', 'Software Engineers'],
        tips: [
            'Balance frontend and backend skills equally',
            'Include both technologies and frameworks',
            'Add links to live projects or demos'
        ],
        difficulty: 'easy',
        popularity: 88,
        rating: 4.7
    },
    {
        id: 'tech-data-scientist',
        name: 'Data Scientist Elite',
        nameAr: 'عالم البيانات',
        description: 'Highlight your data analysis, ML expertise, and research publications. Designed for data professionals.',
        descriptionAr: 'أبرز خبرتك في تحليل البيانات والتعلم الآلي والأبحاث',
        category: ['tech', 'all'],
        style: ['professional', 'modern'],
        experienceLevel: ['mid', 'senior', 'executive'],
        atsScore: 94,
        atsReason: 'Proper section hierarchy, clean text formatting, and standard headings optimize for ATS parsing.',
        isPremium: false,
        previewImage: '/templates/tech-data-scientist.png',
        altText: 'Data Scientist CV Template for Machine Learning Experts',
        metaDescription: 'Specialized CV template for Data Scientists and ML Engineers.',
        keywords: ['data science', 'machine learning', 'AI', 'python', 'analytics', 'statistics'],
        colors: { primary: '#8B5CF6', secondary: '#7C3AED', accent: '#A78BFA' },
        typography: { heading: 'Roboto', body: 'Open Sans' },
        layout: 'one-column',
        features: ['Publications Section', 'Research Highlights', 'Technical Skills Matrix', 'Certifications', 'Conference Presentations'],
        sections: ['Contact', 'Summary', 'Experience', 'Publications', 'Skills', 'Education', 'Certifications'],
        bestFor: ['Data Scientists', 'ML Engineers', 'Research Scientists', 'AI Specialists'],
        tips: [
            'List publications and research papers prominently',
            'Include specific ML/AI frameworks and tools',
            'Quantify impact of your models (accuracy, business value)'
        ],
        difficulty: 'medium',
        popularity: 82,
        rating: 4.6
    },
    {
        id: 'tech-devops-engineer',
        name: 'DevOps Specialist',
        nameAr: 'مهندس DevOps',
        description: 'Perfect for DevOps, SRE, and Cloud Engineers. Emphasizes infrastructure, automation, and CI/CD expertise.',
        descriptionAr: 'مثالي لمهندسي DevOps والبنية التحتية السحابية',
        category: ['tech', 'all'],
        style: ['modern', 'minimalist'],
        experienceLevel: ['mid', 'senior'],
        atsScore: 91,
        atsReason: 'Clear structure with industry-standard terminology. Certifications section helps with keyword matching.',
        isPremium: false,
        previewImage: '/templates/tech-devops-engineer.png',
        altText: 'DevOps Engineer Resume Template with Cloud Certifications',
        metaDescription: 'Build a strong DevOps or SRE resume with this template.',
        keywords: ['devops', 'cloud', 'AWS', 'kubernetes', 'docker', 'CI/CD', 'infrastructure'],
        colors: { primary: '#F59E0B', secondary: '#D97706', accent: '#FBBF24' },
        typography: { heading: 'Inter', body: 'Inter' },
        layout: 'two-column',
        features: ['Certifications Badges', 'Infrastructure Skills', 'Tool Proficiency Chart', 'Cloud Platforms'],
        sections: ['Contact', 'Summary', 'Certifications', 'Experience', 'Skills', 'Education'],
        bestFor: ['DevOps Engineers', 'SRE', 'Cloud Architects', 'Platform Engineers'],
        tips: [
            'List AWS/GCP/Azure certifications prominently',
            'Include specific tools: Terraform, Ansible, Jenkins',
            'Quantify improvements (uptime, deployment frequency)'
        ],
        difficulty: 'easy',
        popularity: 79,
        rating: 4.5
    },
    {
        id: 'tech-ui-ux-designer',
        name: 'UI/UX Designer',
        nameAr: 'مصمم UI/UX',
        description: 'Beautiful portfolio-style CV for designers. Balances creativity with ATS compatibility.',
        descriptionAr: 'سيرة ذاتية بأسلوب المحفظة للمصممين',
        category: ['tech', 'creative', 'all'],
        style: ['creative', 'modern'],
        experienceLevel: ['entry', 'mid', 'senior'],
        atsScore: 88,
        atsReason: 'Creative layout maintains ATS readability. Portfolio links and case studies are properly formatted.',
        isPremium: false,
        previewImage: '/templates/tech-ui-ux-designer.png',
        altText: 'Creative UI/UX Designer Resume Template with Portfolio Gallery',
        metaDescription: 'Stand out as a UI/UX Designer with this portfolio-style resume template.',
        keywords: ['UI design', 'UX design', 'product design', 'figma', 'user research', 'prototyping'],
        colors: { primary: '#EC4899', secondary: '#DB2777', accent: '#F472B6' },
        typography: { heading: 'Montserrat', body: 'Lato' },
        layout: 'sidebar',
        features: ['Portfolio Gallery', 'Design Tools', 'Case Study Links', 'Color Palette Display', 'Process Showcase'],
        sections: ['Contact', 'Summary', 'Experience', 'Portfolio', 'Skills', 'Education', 'Awards'],
        bestFor: ['UI Designers', 'UX Designers', 'Product Designers', 'Interaction Designers'],
        tips: [
            'Include links to your design portfolio',
            'Showcase your design process, not just outputs',
            'List design tools: Figma, Sketch, Adobe XD'
        ],
        difficulty: 'medium',
        popularity: 85,
        rating: 4.7
    },

    // ========== BUSINESS TEMPLATES ==========
    {
        id: 'business-executive',
        name: 'Executive Professional',
        nameAr: 'المدير التنفيذي',
        description: 'Premium template for C-level and senior executives. Clean, authoritative design that commands attention.',
        descriptionAr: 'قالب متميز للمديرين التنفيذيين والقيادات العليا',
        category: ['business', 'all'],
        style: ['professional', 'minimalist'],
        experienceLevel: ['senior', 'executive'],
        atsScore: 96,
        atsReason: 'Traditional format with clear hierarchy. Conservative styling ensures maximum ATS compatibility.',
        isPremium: false,
        previewImage: '/templates/business-executive.png',
        altText: 'Executive Resume Template for C-Level Professionals',
        metaDescription: 'Premium executive resume template designed for C-suite leaders.',
        keywords: ['executive', 'CEO', 'director', 'leadership', 'management', 'strategy'],
        colors: { primary: '#1F2937', secondary: '#374151', accent: '#6B7280' },
        typography: { heading: 'Merriweather', body: 'Open Sans' },
        layout: 'one-column',
        features: ['Leadership Focus', 'Board Experience Section', 'Strategic Achievements', 'Executive Summary'],
        sections: ['Executive Summary', 'Core Competencies', 'Experience', 'Board Positions', 'Education', 'Affiliations'],
        bestFor: ['CEOs', 'CFOs', 'VPs', 'Directors', 'General Managers'],
        tips: [
            'Lead with strategic impact, not daily tasks',
            'Include board positions and advisory roles',
            'Quantify P&L responsibility and team sizes'
        ],
        difficulty: 'medium',
        popularity: 75,
        rating: 4.6
    },
    {
        id: 'business-manager',
        name: 'Modern Manager',
        nameAr: 'المدير الحديث',
        description: 'Ideal for project managers and team leaders. Highlights leadership, KPIs, and team achievements.',
        descriptionAr: 'مثالي لمديري المشاريع وقادة الفرق',
        category: ['business', 'all'],
        style: ['modern', 'professional'],
        experienceLevel: ['mid', 'senior'],
        atsScore: 93,
        atsReason: 'Well-structured with standard sections. Metrics-focused content aligns with recruiter expectations.',
        isPremium: false,
        previewImage: '/templates/business-manager.png',
        altText: 'Project Manager Resume Template with KPI Highlights',
        metaDescription: 'Effective resume template for Project Managers and Team Leaders.',
        keywords: ['project manager', 'team lead', 'agile', 'PMP', 'leadership', 'operations'],
        colors: { primary: '#3B82F6', secondary: '#2563EB', accent: '#60A5FA' },
        typography: { heading: 'Poppins', body: 'Inter' },
        layout: 'two-column',
        features: ['Team Size Metrics', 'Budget Management', 'KPI Highlights', 'Methodology Certifications'],
        sections: ['Contact', 'Summary', 'Core Competencies', 'Experience', 'Certifications', 'Education'],
        bestFor: ['Project Managers', 'Product Managers', 'Team Leaders', 'Operations Managers'],
        tips: [
            'Quantify team sizes and budget responsibility',
            'List relevant certifications (PMP, Scrum Master)',
            'Include key metrics and KPIs achieved'
        ],
        difficulty: 'easy',
        popularity: 90,
        rating: 4.8
    },
    {
        id: 'business-consultant',
        name: 'Strategy Consultant',
        nameAr: 'المستشار الاستراتيجي',
        description: 'Perfect for consultants and business analysts. Showcases client work and consulting frameworks.',
        descriptionAr: 'مثالي للمستشارين ومحللي الأعمال',
        category: ['business', 'all'],
        style: ['professional', 'minimalist'],
        experienceLevel: ['mid', 'senior', 'executive'],
        atsScore: 94,
        atsReason: 'Clean, professional format with industry-specific terminology that ATS systems recognize.',
        isPremium: false,
        previewImage: '/templates/business-consultant.png',
        altText: 'Business Consultant CV Template - Professional & Minimalist',
        metaDescription: 'Professional CV template for Strategy Consultants and Business Analysts.',
        keywords: ['consultant', 'strategy', 'McKinsey', 'BCG', 'business analyst', 'advisory'],
        colors: { primary: '#059669', secondary: '#047857', accent: '#10B981' },
        typography: { heading: 'Roboto', body: 'Open Sans' },
        layout: 'one-column',
        features: ['Client Portfolio', 'Industry Expertise', 'Consulting Frameworks', 'Impact Metrics'],
        sections: ['Contact', 'Summary', 'Key Engagements', 'Experience', 'Skills', 'Education'],
        bestFor: ['Management Consultants', 'Strategy Consultants', 'Business Analysts', 'Advisory Roles'],
        tips: [
            'Describe client engagements with impact metrics',
            'List industries served and consulting methodologies',
            'Highlight prestigious client logos (if allowed)'
        ],
        difficulty: 'medium',
        popularity: 72,
        rating: 4.5
    },
    {
        id: 'business-sales',
        name: 'Sales Champion',
        nameAr: 'بطل المبيعات',
        description: 'Highlight your sales achievements and targets exceeded. Numbers-focused layout for sales professionals.',
        descriptionAr: 'أبرز إنجازاتك في المبيعات والأهداف المحققة',
        category: ['business', 'all'],
        style: ['bold', 'modern'],
        experienceLevel: ['entry', 'mid', 'senior'],
        atsScore: 90,
        atsReason: 'Clear structure with numerical achievements that ATS can parse. Standard sales terminology.',
        isPremium: false,
        previewImage: '/templates/business-sales.png',
        altText: 'Sales Professional Resume Template with Revenue Metrics',
        metaDescription: 'High-impact resume template for Sales Professionals.',
        keywords: ['sales', 'account executive', 'business development', 'revenue', 'quota', 'B2B'],
        colors: { primary: '#F59E0B', secondary: '#D97706', accent: '#FBBF24' },
        typography: { heading: 'Inter', body: 'Inter' },
        layout: 'two-column',
        features: ['Revenue Numbers', 'Quota Achievement', 'Sales Metrics Dashboard', 'Client Wins'],
        sections: ['Contact', 'Summary', 'Key Achievements', 'Experience', 'Skills', 'Education'],
        bestFor: ['Account Executives', 'Sales Managers', 'BDRs', 'Sales Directors'],
        tips: [
            'Lead with revenue numbers and quota attainment',
            'Include deal sizes and win rates',
            'List major accounts closed'
        ],
        difficulty: 'easy',
        popularity: 83,
        rating: 4.6
    },

    // ========== CREATIVE TEMPLATES ==========
    {
        id: 'creative-graphic-designer',
        name: 'Creative Designer',
        nameAr: 'المصمم المبدع',
        description: 'Bold and colorful template for graphic designers. Showcases creativity while remaining professional.',
        descriptionAr: 'قالب جريء وملون لمصممي الجرافيك',
        category: ['creative', 'all'],
        style: ['creative', 'bold'],
        experienceLevel: ['entry', 'mid', 'senior'],
        atsScore: 85,
        atsReason: 'Creative layout with careful ATS considerations. Text remains parseable despite visual elements.',
        isPremium: false,
        previewImage: '/templates/creative-designer.png',
        altText: 'Creative Graphic Designer Resume Template - Bold & Colorful',
        metaDescription: 'Bold and colorful resume template for Graphic Designers.',
        keywords: ['graphic design', 'branding', 'adobe', 'illustrator', 'photoshop', 'creative'],
        colors: { primary: '#8B5CF6', secondary: '#7C3AED', accent: '#C084FC' },
        typography: { heading: 'Montserrat', body: 'Lato' },
        layout: 'creative',
        features: ['Visual Portfolio', 'Design Awards', 'Creative Tools Section', 'Brand Work Showcase'],
        sections: ['Contact', 'Statement', 'Experience', 'Portfolio', 'Skills', 'Awards', 'Education'],
        bestFor: ['Graphic Designers', 'Art Directors', 'Brand Designers', 'Visual Artists'],
        tips: [
            'Include a link to your online portfolio',
            'List design software proficiencies',
            'Showcase award-winning work'
        ],
        difficulty: 'medium',
        popularity: 78,
        rating: 4.5
    },
    {
        id: 'creative-marketing',
        name: 'Marketing Specialist',
        nameAr: 'متخصص التسويق',
        description: 'Dynamic template for marketing professionals. Highlights campaigns, ROI, and social media stats.',
        descriptionAr: 'قالب ديناميكي لمحترفي التسويق',
        category: ['creative', 'business', 'all'],
        style: ['modern', 'bold'],
        experienceLevel: ['entry', 'mid', 'senior'],
        atsScore: 92,
        atsReason: 'Marketing terminology is well-recognized by ATS. Metrics-rich content improves keyword matching.',
        isPremium: false,
        previewImage: '/templates/creative-designer.png',
        altText: 'Marketing Specialist Resume Template with Campaign Metrics',
        metaDescription: 'Dynamic resume template for Marketing Professionals.',
        keywords: ['marketing', 'digital marketing', 'SEO', 'social media', 'campaigns', 'analytics'],
        colors: { primary: '#EC4899', secondary: '#DB2777', accent: '#F472B6' },
        typography: { heading: 'Poppins', body: 'Inter' },
        layout: 'two-column',
        features: ['Campaign Highlights', 'ROI Metrics', 'Social Media Stats', 'Brand Projects'],
        sections: ['Contact', 'Summary', 'Key Campaigns', 'Experience', 'Skills', 'Education', 'Certifications'],
        bestFor: ['Marketing Managers', 'Digital Marketers', 'Content Strategists', 'Social Media Managers'],
        tips: [
            'Quantify campaign results (engagement, conversions, ROI)',
            'List marketing tools and platforms',
            'Include relevant certifications (Google Ads, HubSpot)'
        ],
        difficulty: 'easy',
        popularity: 86,
        rating: 4.7
    },

    // ========== MEDICAL TEMPLATES ==========
    {
        id: 'medical-doctor',
        name: 'Medical Professional',
        nameAr: 'الطبيب المحترف',
        description: 'Professional template for doctors and physicians. Emphasizes credentials, specializations, and clinical experience.',
        descriptionAr: 'قالب احترافي للأطباء والممارسين الصحيين',
        category: ['medical', 'all'],
        style: ['professional', 'minimalist'],
        experienceLevel: ['mid', 'senior', 'executive'],
        atsScore: 97,
        atsReason: 'Traditional CV format preferred in medical field. Clear sections for credentials and certifications.',
        isPremium: false,
        previewImage: '/templates/medical-doctor.png',
        altText: 'Medical Doctor CV Template - Professional & Clinical',
        metaDescription: 'Professional CV template for Doctors and Physicians.',
        keywords: ['doctor', 'physician', 'MD', 'medical', 'clinical', 'healthcare'],
        colors: { primary: '#0EA5E9', secondary: '#0284C7', accent: '#38BDF8' },
        typography: { heading: 'Georgia', body: 'Open Sans' },
        layout: 'one-column',
        features: ['Medical License Section', 'Specializations', 'Publications', 'Clinical Experience', 'Board Certifications'],
        sections: ['Contact', 'Summary', 'Medical License', 'Experience', 'Education', 'Publications', 'Certifications'],
        bestFor: ['Physicians', 'Surgeons', 'Specialists', 'Chief Medical Officers'],
        tips: [
            'List all medical licenses and board certifications',
            'Include research publications and presentations',
            'Detail clinical rotations and specializations'
        ],
        difficulty: 'medium',
        popularity: 70,
        rating: 4.8
    },
    {
        id: 'medical-nurse',
        name: 'Nursing Professional',
        nameAr: 'التمريض المحترف',
        description: 'Clear and organized template for nurses. Highlights certifications, clinical skills, and patient care experience.',
        descriptionAr: 'قالب واضح ومنظم للممرضين والممرضات',
        category: ['medical', 'all'],
        style: ['professional', 'modern'],
        experienceLevel: ['entry', 'mid', 'senior'],
        atsScore: 95,
        atsReason: 'Healthcare-standard format with proper terminology. Certifications are prominently displayed.',
        isPremium: false,
        previewImage: '/templates/medical-nurse.png',
        altText: 'Nursing Resume Template - Organized & Patient-Care Focused',
        metaDescription: 'Organized resume template for Nurses.',
        keywords: ['nurse', 'RN', 'nursing', 'healthcare', 'patient care', 'clinical'],
        colors: { primary: '#10B981', secondary: '#059669', accent: '#34D399' },
        typography: { heading: 'Inter', body: 'Open Sans' },
        layout: 'two-column',
        features: ['Certifications Display', 'Clinical Skills', 'Patient Care Metrics', 'Ward Experience'],
        sections: ['Contact', 'Summary', 'Certifications', 'Experience', 'Clinical Skills', 'Education'],
        bestFor: ['Registered Nurses', 'Nurse Practitioners', 'Clinical Nurses', 'Nurse Managers'],
        tips: [
            'List nursing licenses and certifications prominently',
            'Include specializations and unit experience',
            'Mention patient-to-nurse ratios and care quality metrics'
        ],
        difficulty: 'easy',
        popularity: 77,
        rating: 4.6
    },

    // ========== EDUCATION TEMPLATES ==========
    {
        id: 'education-teacher',
        name: 'Educator Professional',
        nameAr: 'المعلم المحترف',
        description: 'Comprehensive template for teachers and educators. Showcases teaching philosophy and student outcomes.',
        descriptionAr: 'قالب شامل للمعلمين والمربين',
        category: ['education', 'all'],
        style: ['professional', 'modern'],
        experienceLevel: ['entry', 'mid', 'senior'],
        atsScore: 93,
        atsReason: 'Education-specific terminology is well recognized. Clear structure for credentials and experience.',
        isPremium: false,
        previewImage: '/templates/education-teacher.png',
        altText: 'Teacher Resume Template - Comprehensive for Educators',
        metaDescription: 'Comprehensive resume template for Teachers and Educators.',
        keywords: ['teacher', 'educator', 'classroom', 'curriculum', 'instruction', 'education'],
        colors: { primary: '#F59E0B', secondary: '#D97706', accent: '#FBBF24' },
        typography: { heading: 'Poppins', body: 'Inter' },
        layout: 'two-column',
        features: ['Teaching Philosophy', 'Student Outcomes', 'Curriculum Development', 'Classroom Management'],
        sections: ['Contact', 'Summary', 'Teaching Philosophy', 'Experience', 'Certifications', 'Education', 'Professional Development'],
        bestFor: ['K-12 Teachers', 'Special Education Teachers', 'Department Heads', 'Curriculum Coordinators'],
        tips: [
            'Include teaching certifications and endorsements',
            'Highlight student achievement improvements',
            'List professional development and training'
        ],
        difficulty: 'easy',
        popularity: 74,
        rating: 4.5
    },
    {
        id: 'education-academic',
        name: 'Academic Researcher',
        nameAr: 'الباحث الأكاديمي',
        description: 'Detailed academic CV for researchers and professors. Emphasizes publications, grants, and teaching.',
        descriptionAr: 'سيرة ذاتية أكاديمية مفصلة للباحثين والأساتذة',
        category: ['education', 'all'],
        style: ['professional', 'minimalist'],
        experienceLevel: ['senior', 'executive'],
        atsScore: 96,
        atsReason: 'Traditional academic CV format. Comprehensive sections for research, publications, and grants.',
        isPremium: false,
        previewImage: '/templates/education-researcher.png',
        altText: 'Academic CV Template for Researchers and Professors',
        metaDescription: 'Detailed CV template for Academic Researchers and Professors.',
        keywords: ['professor', 'researcher', 'academic', 'publications', 'PhD', 'university'],
        colors: { primary: '#1F2937', secondary: '#374151', accent: '#6B7280' },
        typography: { heading: 'Merriweather', body: 'Open Sans' },
        layout: 'one-column',
        features: ['Publications List', 'Research Grants', 'Citations Count', 'Teaching Experience', 'Conference Presentations'],
        sections: ['Contact', 'Research Interests', 'Education', 'Experience', 'Publications', 'Grants', 'Teaching', 'Service'],
        bestFor: ['Professors', 'Research Scientists', 'Postdoctoral Researchers', 'Department Chairs'],
        tips: [
            'List publications in standard citation format',
            'Include grant amounts and funding sources',
            'Detail graduate students supervised'
        ],
        difficulty: 'advanced',
        popularity: 65,
        rating: 4.7
    },

    // ========== UNIVERSAL TEMPLATES ==========
    {
        id: 'classic-simple',
        name: 'Classic Simple',
        nameAr: 'الكلاسيكي البسيط',
        description: 'Timeless, ATS-friendly template that works for any industry. Maximum readability and compatibility.',
        descriptionAr: 'قالب كلاسيكي يناسب جميع الصناعات',
        category: ['all'],
        style: ['minimalist', 'professional'],
        experienceLevel: ['entry', 'mid', 'senior', 'executive'],
        atsScore: 98,
        atsReason: 'Cleanest possible format with no graphics. Maximum ATS compatibility with standard sections.',
        isPremium: false,
        previewImage: '/templates/minimalist-elegant.png',
        altText: 'Classic Simple Resume Template - Highest ATS Score',
        metaDescription: 'Timeless, ATS-friendly resume template suitable for any industry.',
        keywords: ['classic', 'simple', 'ATS', 'universal', 'professional', 'clean'],
        colors: { primary: '#000000', secondary: '#1F2937', accent: '#6B7280' },
        typography: { heading: 'Georgia', body: 'Arial' },
        layout: 'one-column',
        features: ['Maximum ATS Score', 'Universal Format', 'Easy to Read', 'Print-Friendly', 'Clean Design'],
        sections: ['Contact', 'Summary', 'Experience', 'Education', 'Skills'],
        bestFor: ['Career Changers', 'First-time Job Seekers', 'Traditional Industries', 'Government Jobs'],
        tips: [
            'Perfect when ATS compatibility is the top priority',
            'Works for any industry or experience level',
            'Focus on strong content over visual design'
        ],
        difficulty: 'easy',
        popularity: 92,
        rating: 4.9
    },
    {
        id: 'minimalist-elegant',
        name: 'Minimalist Elegant',
        nameAr: 'الأناقة البسيطة',
        description: 'Clean and sophisticated design for any profession. Subtle accents without sacrificing professionalism.',
        descriptionAr: 'تصميم نظيف وأنيق لأي مهنة',
        category: ['all'],
        style: ['minimalist', 'modern'],
        experienceLevel: ['entry', 'mid', 'senior'],
        atsScore: 97,
        atsReason: 'Minimal design elements ensure ATS compatibility. Professional typography enhances readability.',
        isPremium: false,
        previewImage: '/templates/minimalist-elegant.png',
        altText: 'Minimalist Elegant Resume Template - Clean & Sophisticated',
        metaDescription: 'Clean and sophisticated resume template for any profession.',
        keywords: ['minimalist', 'elegant', 'clean', 'modern', 'professional', 'sophisticated'],
        colors: { primary: '#3B82F6', secondary: '#2563EB', accent: '#60A5FA' },
        typography: { heading: 'Inter', body: 'Inter' },
        layout: 'one-column',
        features: ['Clean Layout', 'Professional Typography', 'Subtle Accents', 'ATS-Safe', 'Versatile Design'],
        sections: ['Contact', 'Summary', 'Experience', 'Education', 'Skills', 'Certifications'],
        bestFor: ['Any Professional', 'Multiple Industries', 'Clean Design Lovers', 'Minimalism Fans'],
        tips: [
            'Let your experience speak with minimal distractions',
            'Perfect balance of style and professionalism',
            'Works well in both digital and print formats'
        ],
        difficulty: 'easy',
        popularity: 89,
        rating: 4.8
    }
];

// ========== HELPER FUNCTIONS ==========

export const getEnhancedTemplatesByCategory = (category: TemplateCategory): EnhancedCVTemplate[] => {
    if (category === 'all') return enhancedTemplates;
    return enhancedTemplates.filter(t => t.category.includes(category));
};

export const getEnhancedTemplatesByStyle = (style: TemplateStyle): EnhancedCVTemplate[] => {
    return enhancedTemplates.filter(t => t.style.includes(style));
};

export const getEnhancedTemplatesByLevel = (level: ExperienceLevel): EnhancedCVTemplate[] => {
    return enhancedTemplates.filter(t => t.experienceLevel.includes(level));
};

export const getEnhancedTemplateById = (id: string): EnhancedCVTemplate | undefined => {
    return enhancedTemplates.find(t => t.id === id);
};

export const getHighATSTemplates = (minScore: number = 90): EnhancedCVTemplate[] => {
    return enhancedTemplates.filter(t => t.atsScore >= minScore).sort((a, b) => b.atsScore - a.atsScore);
};

export const searchTemplates = (query: string): EnhancedCVTemplate[] => {
    const lowerQuery = query.toLowerCase();
    return enhancedTemplates.filter(t =>
        t.name.toLowerCase().includes(lowerQuery) ||
        t.description.toLowerCase().includes(lowerQuery) ||
        t.keywords.some(k => k.toLowerCase().includes(lowerQuery)) ||
        t.bestFor.some(b => b.toLowerCase().includes(lowerQuery))
    );
};

export const filterTemplates = (filters: {
    category?: TemplateCategory;
    style?: TemplateStyle;
    level?: ExperienceLevel;
    minATS?: number;
    searchQuery?: string;
}): EnhancedCVTemplate[] => {
    let filtered = [...enhancedTemplates];

    if (filters.category && filters.category !== 'all') {
        filtered = filtered.filter(t => t.category.includes(filters.category!));
    }

    if (filters.style) {
        filtered = filtered.filter(t => t.style.includes(filters.style!));
    }

    if (filters.level) {
        filtered = filtered.filter(t => t.experienceLevel.includes(filters.level!));
    }

    if (filters.minATS) {
        filtered = filtered.filter(t => t.atsScore >= filters.minATS!);
    }

    if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filtered = filtered.filter(t =>
            t.name.toLowerCase().includes(query) ||
            t.description.toLowerCase().includes(query) ||
            t.keywords.some(k => k.toLowerCase().includes(query))
        );
    }

    return filtered;
};

export const getSampleDataForTemplate = (template: EnhancedCVTemplate): SampleCVData => {
    const primaryCategory = template.category.find(c => c !== 'all') || 'tech';
    return sampleDataByIndustry[primaryCategory] || defaultSampleData;
};

// ========== FILTER OPTIONS ==========
export const categoryOptions: { id: TemplateCategory; label: string; labelAr: string; icon: string }[] = [
    { id: 'all', label: 'All Templates', labelAr: 'جميع القوالب', icon: '📋' },
    { id: 'tech', label: 'Tech & IT', labelAr: 'تكنولوجيا', icon: '💻' },
    { id: 'business', label: 'Business', labelAr: 'أعمال', icon: '💼' },
    { id: 'creative', label: 'Creative', labelAr: 'إبداعي', icon: '🎨' },
    { id: 'medical', label: 'Medical', labelAr: 'طبي', icon: '⚕️' },
    { id: 'education', label: 'Education', labelAr: 'تعليم', icon: '📚' }
];

export const styleOptions: { id: TemplateStyle; label: string; labelAr: string }[] = [
    { id: 'modern', label: 'Modern', labelAr: 'حديث' },
    { id: 'minimalist', label: 'Minimalist', labelAr: 'بسيط' },
    { id: 'creative', label: 'Creative', labelAr: 'إبداعي' },
    { id: 'professional', label: 'Professional', labelAr: 'احترافي' },
    { id: 'bold', label: 'Bold', labelAr: 'جريء' }
];

export const levelOptions: { id: ExperienceLevel; label: string; labelAr: string }[] = [
    { id: 'entry', label: 'Entry Level', labelAr: 'مبتدئ' },
    { id: 'mid', label: 'Mid Level', labelAr: 'متوسط' },
    { id: 'senior', label: 'Senior', labelAr: 'خبير' },
    { id: 'executive', label: 'Executive', labelAr: 'تنفيذي' }
];

export const sortOptions = [
    { id: 'popularity', label: 'Most Popular', labelAr: 'الأكثر شعبية' },
    { id: 'atsScore', label: 'Highest ATS Score', labelAr: 'أعلى نسبة ATS' },
    { id: 'rating', label: 'Top Rated', labelAr: 'الأعلى تقييماً' },
    { id: 'name', label: 'Name (A-Z)', labelAr: 'الاسم (أ-ي)' }
];
