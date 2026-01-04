
import { PrismaClient } from '@prisma/client';
import { datasources } from './prisma.config';

const prisma = new PrismaClient({ datasources });

const templates = [
    // TECH CATEGORY
    {
        name: 'Senior Software Engineer',
        category: 'Tech',
        rating: 4.9,
        downloads: 1250,
        data: {
            personalInfo: { firstName: 'John', lastName: 'Doe', title: 'Senior Software Engineer', email: 'john.doe@tech.com', phone: '+1 555 123 4567', location: 'San Francisco, CA' },
            summary: 'Experienced Software Engineer with over 10 years of experience in full-stack development. Specialist in microservices, cloud architecture, and high-performance React applications.',
            experiences: [
                { company: 'Global Tech Corp', jobTitle: 'Lead Software Engineer', startDate: '2018-03', endDate: 'Present', current: true, description: 'Led a team of 15 engineers to rebuild the core API platform resulting in 40% latency reduction.' },
                { company: 'DataStream Inc', jobTitle: 'Senior Developer', startDate: '2014-06', endDate: '2018-02', current: false, description: 'Designed and implemented real-time data visualization components using React and D3.js.' }
            ],
            skills: [{ name: 'React', category: 'Frontend' }, { name: 'Node.js', category: 'Backend' }, { name: 'AWS', category: 'Cloud' }, { name: 'PostgreSQL', category: 'Database' }]
        }
    },
    {
        name: 'Data Scientist',
        category: 'Tech',
        rating: 4.8,
        downloads: 840,
        data: {
            personalInfo: { firstName: 'Alice', lastName: 'Smith', title: 'Data Scientist', email: 'alice.s@data.ai', location: 'Boston, MA' },
            summary: 'Ph.D. in Statistics with a passion for machine learning and predictive modeling. Expert in Python, R, and TensorFlow.',
            experiences: [
                { company: 'Insight Analytics', jobTitle: 'Principal Data Scientist', startDate: '2019-01', current: true, description: 'Developed predictive models for customer churn resulting in $2M annual savings.' }
            ],
            skills: [{ name: 'Python', category: 'Data Science' }, { name: 'TensorFlow', category: 'ML' }, { name: 'SQL', category: 'Database' }]
        }
    },
    {
        name: 'DevOps Engineer',
        category: 'Tech',
        rating: 4.7,
        downloads: 620,
        data: {
            personalInfo: { firstName: 'Bob', lastName: 'Miller', title: 'DevOps Engineer', location: 'Austin, TX' },
            summary: 'Infrastructure as Code specialist with deep expertise in Kubernetes, Terraform, and CI/CD pipelines.',
            skills: [{ name: 'Kubernetes', category: 'Cloud' }, { name: 'Terraform', category: 'IaC' }, { name: 'Docker', category: 'DevOps' }]
        }
    },
    {
        name: 'UI/UX Designer',
        category: 'Design',
        rating: 4.9,
        downloads: 1100,
        data: {
            personalInfo: { firstName: 'Elena', lastName: 'Vance', title: 'Senior Product Designer', location: 'London, UK' },
            summary: 'Creating user-centric designs that balance aesthetic beauty with functional simplicity. Expert in Figma and Prototyping.',
            skills: [{ name: 'Figma', category: 'Tools' }, { name: 'User Research', category: 'Design' }, { name: 'A/B Testing', category: 'Research' }]
        }
    },
    {
        name: 'Mobile App Developer',
        category: 'Tech',
        rating: 4.6,
        downloads: 750,
        data: {
            personalInfo: { title: 'Mobile Developer (iOS/Android)', location: 'Remote' },
            summary: 'Specialized in building high-performance cross-platform applications using React Native and Flutter.',
            skills: [{ name: 'React Native', category: 'Mobile' }, { name: 'Flutter', category: 'Mobile' }, { name: 'Swift', category: 'iOS' }]
        }
    },
    {
        name: 'Cybersecurity Analyst',
        category: 'Tech',
        rating: 4.8,
        downloads: 430,
        data: {
            personalInfo: { title: 'Information Security Specialist' },
            summary: 'Dedicated to protecting corporate infrastructures from advanced persistent threats and vulnerabilities.',
            skills: [{ name: 'Penetration Testing', category: 'Security' }, { name: 'ISO 27001', category: 'Compliance' }]
        }
    },

    // MARKETING CATEGORY
    {
        name: 'Digital Marketing Manager',
        category: 'Marketing',
        rating: 4.7,
        downloads: 920,
        data: {
            personalInfo: { firstName: 'Sarah', lastName: 'Jones', title: 'Digital Marketing Expert', location: 'Chicago, IL' },
            summary: 'Driving growth through data-driven SEO, SEM, and social media strategies. Over 5 years of ROI-focused experience.',
            experiences: [{ company: 'GrowthLeads', jobTitle: 'Marketing Manager', startDate: '2020-05', current: true, description: 'Increased organic traffic by 150% in 12 months.' }],
            skills: [{ name: 'SEO', category: 'Marketing' }, { name: 'Google Ads', category: 'SEM' }, { name: 'Analytics', category: 'Tools' }]
        }
    },
    {
        name: 'Content Strategist',
        category: 'Marketing',
        rating: 4.5,
        downloads: 310,
        data: {
            personalInfo: { title: 'Senior Content Strategist' },
            summary: 'A storyteller at heart, helping brands define their voice and connect with audiences through high-quality content.',
            skills: [{ name: 'Copywriting', category: 'Content' }, { name: 'CMS', category: 'Tools' }]
        }
    },
    {
        name: 'Social Media Specialist',
        category: 'Marketing',
        rating: 4.6,
        downloads: 540,
        data: {
            personalInfo: { title: 'Social Media Manager' },
            summary: 'Expert in building community and brand awareness across TikTok, Instagram, and LinkedIn.',
            skills: [{ name: 'Influencer Marketing', category: 'Social' }, { name: 'Video Editing', category: 'Content' }]
        }
    },

    // SALES CATEGORY
    {
        name: 'Account Executive',
        category: 'Sales',
        rating: 4.8,
        downloads: 870,
        data: {
            personalInfo: { firstName: 'Michael', lastName: 'Brown', title: 'Senior Account Executive', location: 'New York, NY' },
            summary: 'Consultative sales professional with a track record of exceeding quotas by over 120% consistently.',
            experiences: [{ company: 'SaaS Solutions', jobTitle: 'AE', startDate: '2017-11', current: true, description: 'Closed deals with Fortune 500 companies totaling $3M+.' }],
            skills: [{ name: 'Consultative Selling', category: 'Sales' }, { name: 'CRM (Salesforce)', category: 'Tools' }]
        }
    },
    {
        name: 'Sales Development Representative (SDR)',
        category: 'Sales',
        rating: 4.4,
        downloads: 420,
        data: {
            personalInfo: { title: 'SDR' },
            summary: 'Driven and resilient outreach specialist focused on qualifying high-value leads and setting appointments.',
            skills: [{ name: 'Cold Calling', category: 'Sales' }, { name: 'Lead Research', category: 'Sales' }]
        }
    },

    // DESIGN & CREATIVE
    {
        name: 'Graphic Designer',
        category: 'Design',
        rating: 4.8,
        downloads: 1300,
        data: {
            personalInfo: { title: 'Creative Graphic Designer' },
            summary: 'Visual communicator with a bold style and proficiency in Adobe Creative Suite.',
            skills: [{ name: 'Photoshop', category: 'Tools' }, { name: 'Illustrator', category: 'Tools' }, { name: 'InDesign', category: 'Tools' }]
        }
    },
    {
        name: 'Motion Graphics Artist',
        category: 'Design',
        rating: 4.7,
        downloads: 280,
        data: {
            personalInfo: { title: 'Motion Designer' },
            summary: 'Bringing stories to life through animation and 3D visual effects.',
            skills: [{ name: 'After Effects', category: 'Software' }, { name: 'Cinema 4D', category: 'Software' }]
        }
    },

    // MANAGEMENT & HR
    {
        name: 'Project Manager',
        category: 'Management',
        rating: 4.6,
        downloads: 1050,
        data: {
            personalInfo: { firstName: 'David', lastName: 'Clark', title: 'PMP Certified Project Manager', location: 'Denver, CO' },
            summary: 'Agile enthusiast specializing in streamlining workflows and delivering complex projects on time and under budget.',
            skills: [{ name: 'Agile/Scrum', category: 'Methodology' }, { name: 'Jira', category: 'Tools' }, { name: 'Risk Management', category: 'Soft' }]
        }
    },
    {
        name: 'HR Business Partner',
        category: 'HR',
        rating: 4.5,
        downloads: 480,
        data: {
            personalInfo: { title: 'Senior HRBP' },
            summary: 'Strategic partner for organizational growth, talent retention, and culture building.',
            skills: [{ name: 'Employee Relations', category: 'HR' }, { name: 'Recruitment', category: 'HR' }]
        }
    },
    {
        name: 'Product Manager',
        category: 'Management',
        rating: 4.9,
        downloads: 1150,
        data: {
            personalInfo: { title: 'Senior Product Manager' },
            summary: 'Bridging the gap between business goals, user needs, and engineering capabilities.',
            skills: [{ name: 'Product Discovery', category: 'Management' }, { name: 'Data Analysis', category: 'Hard' }]
        }
    },

    // FINANCE & LEGAL
    {
        name: 'Financial Analyst',
        category: 'Finance',
        rating: 4.7,
        downloads: 590,
        data: {
            personalInfo: { title: 'Financial Planning & Analysis' },
            summary: 'Detail-oriented analyst with expertise in budgeting, forecasting, and financial modeling.',
            skills: [{ name: 'Excel VBA', category: 'Tools' }, { name: 'FP&A', category: 'Finance' }]
        }
    },
    {
        name: 'Corporate Lawyer',
        category: 'Legal',
        rating: 4.8,
        downloads: 210,
        data: {
            personalInfo: { title: 'Associate Attorney' },
            summary: 'Specializing in M&A, contract law, and corporate governance.',
            skills: [{ name: 'Contract Drafting', category: 'Legal' }, { name: 'Negotiation', category: 'Soft' }]
        }
    },

    // OTHER / EDUCATION
    {
        name: 'Customer Success Manager',
        category: 'Customer Service',
        rating: 4.6,
        downloads: 670,
        data: {
            personalInfo: { title: 'Senior CSM' },
            summary: 'Maximizing customer value and driving renewals in high-touch SaaS environments.',
            skills: [{ name: 'Onboarding', category: 'CX' }, { name: 'Churn Prevention', category: 'Sales' }]
        }
    },
    {
        name: 'Executive Assistant',
        category: 'Support',
        rating: 4.5,
        downloads: 380,
        data: {
            personalInfo: { title: 'Senior EA' },
            summary: 'Right-hand support for C-suite executives, managing complex schedules and operations.',
            skills: [{ name: 'Calendar Management', category: 'Admin' }, { name: 'Travel Coordination', category: 'Admin' }]
        }
    },
    {
        name: 'Registered Nurse',
        category: 'Healthcare',
        rating: 4.9,
        downloads: 1400,
        data: {
            personalInfo: { title: 'Registered Nurse (BSN)' },
            summary: 'Compassionate and dedicated healthcare professional with 8 years of experience in critical care and patient advocacy.',
            skills: [{ name: 'Patient Assessment', category: 'Clinical' }, { name: 'EMR Systems', category: 'Tools' }]
        }
    },
    {
        name: 'High School Teacher',
        category: 'Education',
        rating: 4.7,
        downloads: 890,
        data: {
            personalInfo: { title: 'Mathematics Educator' },
            summary: 'Passionate educator committed to fostering a love for logic and problem-solving in students of all levels.',
            skills: [{ name: 'Curriculum Design', category: 'Education' }, { name: 'Classroom Management', category: 'Education' }]
        }
    }
];

async function main() {
    console.log('Start seeding CV Templates...');
    for (const t of templates) {
        const template = await prisma.cVTemplate.create({
            data: t,
        });
        console.log(`Created template with id: ${template.id} (Name: ${template.name})`);
    }
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
