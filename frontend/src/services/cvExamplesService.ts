

export interface CVExample {
    id: string;
    slug: string;
    title: string;
    description: string;
    industry: 'Tech' | 'Marketing' | 'Finance' | 'Design' | 'Education' | 'Health' | 'Sales' | 'Engineering';
    level: 'Junior' | 'Mid' | 'Senior' | 'Executive';
    style: 'Modern' | 'Minimalist' | 'Creative' | 'Professional';
    color: string; // For thumbnail background
    content: {
        personalInfo: {
            fullName: string;
            title: string;
            email: string;
            phone: string;
            location: string;
            website?: string;
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
}

const INDUSTRIES = ['Tech', 'Marketing', 'Finance', 'Design', 'Education', 'Health', 'Sales', 'Engineering'];
const LEVELS = ['Junior', 'Mid', 'Senior', 'Executive'];
const STYLES = ['Modern', 'Minimalist', 'Creative', 'Professional'];
const COLORS = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-indigo-500', 'bg-pink-500', 'bg-orange-500', 'bg-teal-500', 'bg-cyan-500'];

// Helper to generate realistic data
const generateCVs = (): CVExample[] => {
    const cvs: CVExample[] = [
        {
            id: '1',
            slug: 'senior-full-stack-developer',
            title: 'Senior Full Stack Developer',
            description: 'A comprehensive CV for a senior developer with 8+ years of experience in React and Node.js.',
            industry: 'Tech',
            level: 'Senior',
            style: 'Modern',
            color: 'bg-blue-600',
            content: {
                personalInfo: {
                    fullName: 'Alex Johnson',
                    title: 'Senior Full Stack Developer',
                    email: 'alex.j@example.com',
                    phone: '+1 (555) 123-4567',
                    location: 'San Francisco, CA',
                    website: 'alexjohnson.dev'
                },
                summary: 'Senior Full Stack Developer with 8+ years of experience building scalable web applications. Expert in React, Node.js, and cloud architecture. Proven track record of leading teams and delivering high-impact projects.',
                experience: [
                    {
                        id: 'e1',
                        title: 'Senior Software Engineer',
                        company: 'TechFlow Solutions',
                        location: 'San Francisco, CA',
                        startDate: '2020-03',
                        endDate: 'Present',
                        description: 'Leading a team of 6 developers in rebuilding the core product dashboard. Improved performance by 40% and reduced technical debt.'
                    },
                    {
                        id: 'e2',
                        title: 'Full Stack Developer',
                        company: 'Innovate Corp',
                        location: 'Austin, TX',
                        startDate: '2017-06',
                        endDate: '2020-02',
                        description: 'Developed and maintained multiple client-facing applications using MERN stack. Implemented CI/CD pipelines reducing deployment time by 60%.'
                    }
                ],
                education: [
                    {
                        id: 'ed1',
                        degree: 'B.S. Computer Science',
                        school: 'University of Texas',
                        location: 'Austin, TX',
                        startDate: '2013-09',
                        endDate: '2017-05'
                    }
                ],
                skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'GraphQL', 'PostgreSQL', 'System Design'],
                languages: ['English (Native)', 'Spanish (Intermediate)']
            }
        },
        {
            id: '2',
            slug: 'digital-marketing-manager',
            title: 'Digital Marketing Manager',
            description: 'Strategic marketing CV focusing on ROI, campaign management, and team leadership.',
            industry: 'Marketing',
            level: 'Mid',
            style: 'Creative',
            color: 'bg-purple-600',
            content: {
                personalInfo: {
                    fullName: 'Sarah Miller',
                    title: 'Digital Marketing Manager',
                    email: 'sarah.m@example.com',
                    phone: '+1 (555) 987-6543',
                    location: 'New York, NY',
                    website: 'sarahmiller.marketing'
                },
                summary: 'Results-driven Digital Marketing Manager with 5 years of experience in SEO, PPC, and content strategy. Successfully managed budgets over $50k/month with consistent positive ROI.',
                experience: [
                    {
                        id: 'e1',
                        title: 'Digital Marketing Manager',
                        company: 'Growth Hackers Agency',
                        location: 'New York, NY',
                        startDate: '2021-01',
                        endDate: 'Present',
                        description: 'Oversee digital strategy for 10+ enterprise clients. Increased organic traffic by 150% YoY through targeted SEO campaigns.'
                    },
                    {
                        id: 'e2',
                        title: 'Marketing Specialist',
                        company: 'Creative Solutions',
                        location: 'Boston, MA',
                        startDate: '2018-06',
                        endDate: '2020-12',
                        description: 'Managed social media accounts and email marketing campaigns. Achieved 25% open rate on newsletters.'
                    }
                ],
                education: [
                    {
                        id: 'ed1',
                        degree: 'B.A. Marketing',
                        school: 'Boston University',
                        location: 'Boston, MA',
                        startDate: '2014-09',
                        endDate: '2018-05'
                    }
                ],
                skills: ['SEO/SEM', 'Google Analytics', 'Content Strategy', 'Social Media Marketing', 'Email Marketing', 'Copywriting'],
                languages: ['English (Native)', 'French (Fluent)']
            }
        },
        {
            id: '3',
            slug: 'ux-ui-designer',
            title: 'Senior UX/UI Designer',
            description: 'Portfolio-focused CV for designers highlighting user research and visual design skills.',
            industry: 'Design',
            level: 'Senior',
            style: 'Minimalist',
            color: 'bg-pink-500',
            content: {
                personalInfo: {
                    fullName: 'David Chen',
                    title: 'Senior UX/UI Designer',
                    email: 'david.design@example.com',
                    phone: '+1 (555) 234-5678',
                    location: 'Seattle, WA',
                    website: 'dchen.design'
                },
                summary: 'Passionate UX/UI Designer with a focus on creating intuitive and accessible digital experiences. 7 years of experience working with cross-functional teams to deliver award-winning products.',
                experience: [
                    {
                        id: 'e1',
                        title: 'Lead Product Designer',
                        company: 'Streamline App',
                        location: 'Seattle, WA',
                        startDate: '2019-08',
                        endDate: 'Present',
                        description: 'Led the redesign of the mobile app, resulting in a 4.8-star rating on App Store. Conducted user research and usability testing.'
                    },
                    {
                        id: 'e2',
                        title: 'UI Designer',
                        company: 'Pixel Perfect',
                        location: 'Portland, OR',
                        startDate: '2016-05',
                        endDate: '2019-07',
                        description: 'Designed responsive websites and marketing materials for various clients. Collaborated closely with developers to ensure design fidelity.'
                    }
                ],
                education: [
                    {
                        id: 'ed1',
                        degree: 'B.F.A. Interaction Design',
                        school: 'California College of the Arts',
                        location: 'San Francisco, CA',
                        startDate: '2012-09',
                        endDate: '2016-05'
                    }
                ],
                skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'HTML/CSS', 'Design Systems', 'Wireframing'],
                languages: ['English (Native)', 'Mandarin (Conversational)']
            }
        },
        {
            id: '4',
            slug: 'financial-analyst',
            title: 'Financial Analyst',
            description: 'Data-heavy CV for finance professionals emphasizing analytical skills and reporting.',
            industry: 'Finance',
            level: 'Mid',
            style: 'Professional',
            color: 'bg-green-600',
            content: {
                personalInfo: {
                    fullName: 'Michael Ross',
                    title: 'Financial Analyst',
                    email: 'm.ross@example.com',
                    phone: '+1 (555) 876-5432',
                    location: 'Chicago, IL'
                },
                summary: 'Detail-oriented Financial Analyst with strong background in financial modeling and data analysis. Certified CFA Level 2 candidate.',
                experience: [
                    {
                        id: 'e1',
                        title: 'Financial Analyst',
                        company: 'Global Finance Group',
                        location: 'Chicago, IL',
                        startDate: '2020-01',
                        endDate: 'Present',
                        description: 'Prepare monthly financial reports and variance analysis. Developed automated reporting tools using Python and SQL.'
                    },
                    {
                        id: 'e2',
                        title: 'Junior Analyst',
                        company: 'Midwest Bank',
                        location: 'Chicago, IL',
                        startDate: '2018-06',
                        endDate: '2019-12',
                        description: 'Assisted in credit risk assessment and portfolio management. Conducted market research for investment opportunities.'
                    }
                ],
                education: [
                    {
                        id: 'ed1',
                        degree: 'B.S. Finance',
                        school: 'University of Chicago',
                        location: 'Chicago, IL',
                        startDate: '2014-09',
                        endDate: '2018-05'
                    }
                ],
                skills: ['Financial Modeling', 'Excel (Advanced)', 'SQL', 'Python', 'Tableau', 'Risk Analysis', 'Bloomberg Terminal'],
                languages: ['English (Native)']
            }
        },
        // Generating 16 more placeholders to reach 20
        ...Array.from({ length: 16 }).map((_, i) => ({
            id: `${i + 5}`,
            slug: `example-cv-${i + 5}`,
            title: `${INDUSTRIES[i % INDUSTRIES.length]} Professional`,
            description: `A professional CV template designed for ${INDUSTRIES[i % INDUSTRIES.length]} roles.`,
            industry: INDUSTRIES[i % INDUSTRIES.length] as CVExample['industry'],
            level: LEVELS[i % LEVELS.length] as CVExample['level'],
            style: STYLES[i % STYLES.length] as CVExample['style'],
            color: COLORS[i % COLORS.length],
            content: {
                personalInfo: {
                    fullName: 'John Doe',
                    title: `${INDUSTRIES[i % INDUSTRIES.length]} Specialist`,
                    email: 'john.doe@example.com',
                    phone: '+1 (555) 000-0000',
                    location: 'New York, NY'
                },
                summary: `Experienced professional in the ${INDUSTRIES[i % INDUSTRIES.length]} industry with a proven track record of success. Dedicated to delivering high-quality results and driving business growth.`,
                experience: [
                    {
                        id: 'e1',
                        title: 'Senior Specialist',
                        company: 'Industry Leaders Inc.',
                        location: 'New York, NY',
                        startDate: '2020-01',
                        endDate: 'Present',
                        description: 'Led key initiatives resulting in 20% growth. Managed cross-functional teams and improved operational efficiency.'
                    },
                    {
                        id: 'e2',
                        title: 'Associate',
                        company: 'StartUp Co.',
                        location: 'Brooklyn, NY',
                        startDate: '2017-06',
                        endDate: '2019-12',
                        description: 'Contributed to product development and market research. Collaborated with senior management on strategic planning.'
                    }
                ],
                education: [
                    {
                        id: 'ed1',
                        degree: 'Bachelor of Science',
                        school: 'State University',
                        location: 'New York, NY',
                        startDate: '2013-09',
                        endDate: '2017-05'
                    }
                ],
                skills: ['Project Management', 'Communication', 'Leadership', 'Strategic Planning', 'Problem Solving'],
                languages: ['English (Native)']
            }
        }))
    ];
    return cvs;
};

const CV_EXAMPLES = generateCVs();

export const cvExamplesService = {
    getAllExamples: async (): Promise<CVExample[]> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return CV_EXAMPLES;
    },

    getExampleBySlug: async (slug: string): Promise<CVExample | null> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return CV_EXAMPLES.find(ex => ex.slug === slug) || null;
    },

    getRelatedExamples: async (currentSlug: string, limit: number = 3): Promise<CVExample[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return CV_EXAMPLES.filter(ex => ex.slug !== currentSlug).slice(0, limit);
    },

    getExamplesByIndustry: async (industry: string): Promise<CVExample[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return CV_EXAMPLES.filter(ex => ex.industry === industry);
    }
};
