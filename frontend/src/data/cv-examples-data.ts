import { CVExample } from '@/types/cv-example';

export const CV_EXAMPLES_DATA: CVExample[] = [
    // TECHNOLOGY
    {
        id: 'tech-1',
        slug: 'senior-frontend-developer',
        title: 'Senior Frontend Developer',
        description: 'Expert React developer with 8+ years of experience in building scalable web applications.',
        industry: 'Technology',
        level: 'Senior',
        style: 'Modern',
        color: 'bg-blue-600',
        atsScore: 95,
        tags: ['React', 'TypeScript', 'Next.js', 'Frontend'],
        content: {
            personalInfo: {
                fullName: 'Alex Johnson',
                title: 'Senior Frontend Developer',
                email: 'alex.j@example.com',
                phone: '+1 (555) 123-4567',
                location: 'San Francisco, CA',
                linkedin: 'linkedin.com/in/alexjdev',
                website: 'alexj.dev'
            },
            summary: 'Senior Frontend Developer with 8+ years of experience specializing in React ecosystem and modern web technologies. Proven track record of leading teams, optimizing performance by 40%, and delivering high-impact user interfaces for enterprise clients.',
            experience: [
                {
                    id: 'exp1',
                    title: 'Senior Frontend Engineer',
                    company: 'TechFlow Solutions',
                    location: 'San Francisco, CA',
                    startDate: '2020-03',
                    endDate: 'Present',
                    description: 'Leading the frontend migration to Next.js and mentoring a team of 5 developers.',
                    achievements: [
                        'Architected and led the migration of a legacy monolith to a micro-frontend architecture using Next.js.',
                        'Improved Core Web Vitals scores by 40%, resulting in a 15% increase in conversion rate.',
                        'Implemented a comprehensive design system used across 4 different product lines.'
                    ]
                },
                {
                    id: 'exp2',
                    title: 'Frontend Developer',
                    company: 'Innovate Corp',
                    location: 'Austin, TX',
                    startDate: '2017-06',
                    endDate: '2020-02',
                    description: 'Developed responsive web applications and collaborated with UX designers.',
                    achievements: [
                        'Built a real-time analytics dashboard using React and D3.js.',
                        'Reduced build times by 60% by optimizing Webpack configuration.'
                    ]
                }
            ],
            education: [
                {
                    id: 'edu1',
                    degree: 'B.S. Computer Science',
                    school: 'University of Texas',
                    location: 'Austin, TX',
                    startDate: '2013-09',
                    endDate: '2017-05'
                }
            ],
            skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL', 'Jest', 'CI/CD', 'AWS'],
            languages: ['English (Native)', 'Spanish (Intermediate)']
        }
    },
    {
        id: 'tech-2',
        slug: 'junior-data-scientist',
        title: 'Junior Data Scientist',
        description: 'Aspiring data scientist with strong Python and ML skills, ready to derive insights from data.',
        industry: 'Technology',
        level: 'Entry Level',
        style: 'Modern',
        color: 'bg-indigo-500',
        atsScore: 88,
        tags: ['Python', 'Machine Learning', 'Data Analysis', 'SQL'],
        content: {
            personalInfo: {
                fullName: 'Maya Patel',
                title: 'Junior Data Scientist',
                email: 'maya.p@example.com',
                phone: '+1 (555) 987-6543',
                location: 'Boston, MA',
                linkedin: 'linkedin.com/in/mayapatel'
            },
            summary: 'Recent Computer Science graduate with a specialization in Data Science. Proficient in Python, SQL, and Machine Learning algorithms. Passionate about uncovering actionable insights from complex datasets.',
            experience: [
                {
                    id: 'exp1',
                    title: 'Data Science Intern',
                    company: 'DataViz Inc.',
                    location: 'Remote',
                    startDate: '2023-06',
                    endDate: '2023-09',
                    description: 'Assisted the analytics team in processing and visualizing large datasets.',
                    achievements: [
                        'Cleaned and preprocessed a dataset of 1M+ records for a predictive maintenance model.',
                        'Created interactive dashboards in Tableau to visualize customer churn trends.'
                    ]
                }
            ],
            education: [
                {
                    id: 'edu1',
                    degree: 'M.S. Data Science',
                    school: 'Boston University',
                    location: 'Boston, MA',
                    startDate: '2022-09',
                    endDate: '2024-05'
                }
            ],
            skills: ['Python', 'SQL', 'Pandas', 'Scikit-learn', 'Tableau', 'TensorFlow', 'Git'],
            languages: ['English (Native)', 'Hindi (Fluent)']
        }
    },
    {
        id: 'tech-3',
        slug: 'devops-engineer',
        title: 'DevOps Engineer',
        description: 'Experienced DevOps Engineer focused on automation, CI/CD, and cloud infrastructure.',
        industry: 'Technology',
        level: 'Mid Level',
        style: 'Classic',
        color: 'bg-slate-600',
        atsScore: 92,
        tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
        content: {
            personalInfo: {
                fullName: 'David Kim',
                title: 'DevOps Engineer',
                email: 'david.kim@example.com',
                phone: '+1 (555) 456-7890',
                location: 'Seattle, WA',
                linkedin: 'linkedin.com/in/davidkimops'
            },
            summary: 'DevOps Engineer with 4 years of experience managing cloud infrastructure on AWS. Expert in containerization with Docker and Kubernetes, and automating deployment pipelines using Jenkins and GitHub Actions.',
            experience: [
                {
                    id: 'exp1',
                    title: 'DevOps Engineer',
                    company: 'CloudScale Systems',
                    location: 'Seattle, WA',
                    startDate: '2021-01',
                    endDate: 'Present',
                    description: 'Managing cloud infrastructure and deployment pipelines for high-traffic applications.',
                    achievements: [
                        'Migrated on-premise infrastructure to AWS, reducing operational costs by 30%.',
                        'Implemented Kubernetes clusters for microservices orchestration, improving availability to 99.99%.'
                    ]
                },
                {
                    id: 'exp2',
                    title: 'Systems Administrator',
                    company: 'NetCorp',
                    location: 'Portland, OR',
                    startDate: '2019-05',
                    endDate: '2020-12',
                    description: 'Maintained server infrastructure and supported development teams.',
                    achievements: [
                        'Automated server provisioning using Ansible.',
                        'Reduced incident response time by 50% through improved monitoring setup.'
                    ]
                }
            ],
            education: [
                {
                    id: 'edu1',
                    degree: 'B.S. Information Technology',
                    school: 'University of Washington',
                    location: 'Seattle, WA',
                    startDate: '2015-09',
                    endDate: '2019-05'
                }
            ],
            skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Python', 'Linux'],
            languages: ['English (Native)', 'Korean (Conversational)']
        }
    },
    {
        id: 'tech-4',
        slug: 'product-manager',
        title: 'Product Manager',
        description: 'Strategic Product Manager with a background in engineering and a focus on user-centric design.',
        industry: 'Technology',
        level: 'Senior',
        style: 'Creative',
        color: 'bg-purple-600',
        atsScore: 90,
        tags: ['Product Management', 'Agile', 'Strategy', 'UX'],
        content: {
            personalInfo: {
                fullName: 'Sarah Jenkins',
                title: 'Senior Product Manager',
                email: 'sarah.j@example.com',
                phone: '+1 (555) 222-3333',
                location: 'New York, NY',
                linkedin: 'linkedin.com/in/sarahjenkins'
            },
            summary: 'Product Manager with 7+ years of experience launching B2B SaaS products. Skilled in roadmap planning, stakeholder management, and agile methodologies. Passionate about solving complex user problems.',
            experience: [
                {
                    id: 'exp1',
                    title: 'Senior Product Manager',
                    company: 'SaaSify',
                    location: 'New York, NY',
                    startDate: '2019-08',
                    endDate: 'Present',
                    description: 'Leading the product vision and strategy for the enterprise analytics suite.',
                    achievements: [
                        'Launched a new analytics module that generated $2M in ARR within the first year.',
                        'Increased user retention by 20% through targeted feature improvements based on user feedback.'
                    ]
                },
                {
                    id: 'exp2',
                    title: 'Product Owner',
                    company: 'FinTech Solutions',
                    location: 'Chicago, IL',
                    startDate: '2016-04',
                    endDate: '2019-07',
                    description: 'Managed the backlog and sprint planning for the mobile banking app.',
                    achievements: [
                        'Delivered the mobile check deposit feature ahead of schedule.',
                        'Facilitated agile ceremonies for a cross-functional team of 10.'
                    ]
                }
            ],
            education: [
                {
                    id: 'edu1',
                    degree: 'MBA',
                    school: 'Kellogg School of Management',
                    location: 'Evanston, IL',
                    startDate: '2014-09',
                    endDate: '2016-05'
                }
            ],
            skills: ['Product Strategy', 'Agile/Scrum', 'Jira', 'User Research', 'Data Analysis', 'Stakeholder Management'],
            languages: ['English (Native)']
        }
    },

    // HEALTHCARE
    {
        id: 'health-1',
        slug: 'registered-nurse',
        title: 'Registered Nurse',
        description: 'Compassionate Registered Nurse with 5 years of experience in critical care and patient advocacy.',
        industry: 'Healthcare',
        level: 'Mid Level',
        style: 'Classic',
        color: 'bg-teal-500',
        atsScore: 94,
        tags: ['Nursing', 'Critical Care', 'Patient Care', 'BLS'],
        content: {
            personalInfo: {
                fullName: 'Emily Wilson',
                title: 'Registered Nurse (BSN, RN)',
                email: 'emily.w@example.com',
                phone: '+1 (555) 777-8888',
                location: 'Chicago, IL'
            },
            summary: 'Dedicated Registered Nurse with 5 years of experience in ICU and ER settings. Committed to providing high-quality patient care and supporting families during critical times. Strong clinical skills and ability to remain calm under pressure.',
            experience: [
                {
                    id: 'exp1',
                    title: 'ICU Nurse',
                    company: 'City General Hospital',
                    location: 'Chicago, IL',
                    startDate: '2020-02',
                    endDate: 'Present',
                    description: 'Providing comprehensive care to critically ill patients in a 20-bed ICU.',
                    achievements: [
                        'Recognized as "Nurse of the Month" twice for exceptional patient care.',
                        'Precepted 5 new nursing graduates, ensuring successful integration into the unit.'
                    ]
                },
                {
                    id: 'exp2',
                    title: 'Staff Nurse',
                    company: 'Community Health Center',
                    location: 'Springfield, IL',
                    startDate: '2018-06',
                    endDate: '2020-01',
                    description: 'Provided primary care and health education to diverse patient populations.',
                    achievements: [
                        'Implemented a diabetes education program that improved patient compliance by 25%.',
                        'Assisted in the implementation of a new EMR system.'
                    ]
                }
            ],
            education: [
                {
                    id: 'edu1',
                    degree: 'Bachelor of Science in Nursing',
                    school: 'University of Illinois',
                    location: 'Chicago, IL',
                    startDate: '2014-09',
                    endDate: '2018-05'
                }
            ],
            skills: ['Critical Care', 'Patient Advocacy', 'IV Therapy', 'BLS/ACLS Certified', 'EMR (Epic, Cerner)', 'Wound Care'],
            languages: ['English (Native)', 'Spanish (Medical)']
        }
    },
    {
        id: 'health-2',
        slug: 'medical-doctor',
        title: 'Medical Doctor',
        description: 'Board-certified Internal Medicine Physician with a focus on preventive care and chronic disease management.',
        industry: 'Healthcare',
        level: 'Senior',
        style: 'Modern',
        color: 'bg-blue-700',
        atsScore: 96,
        tags: ['Physician', 'Internal Medicine', 'Healthcare', 'Doctor'],
        content: {
            personalInfo: {
                fullName: 'Dr. James Carter',
                title: 'Internal Medicine Physician',
                email: 'dr.carter@example.com',
                phone: '+1 (555) 999-0000',
                location: 'Boston, MA'
            },
            summary: 'Board-certified Internal Medicine Physician with 10+ years of clinical experience. Dedicated to evidence-based medicine and patient-centered care. Proven ability to manage complex chronic conditions and lead multidisciplinary teams.',
            experience: [
                {
                    id: 'exp1',
                    title: 'Attending Physician',
                    company: 'Boston Medical Center',
                    location: 'Boston, MA',
                    startDate: '2015-07',
                    endDate: 'Present',
                    description: 'Managing a panel of 2,000+ patients with a focus on chronic disease management.',
                    achievements: [
                        'Reduced hospital readmission rates for heart failure patients by 15% through a new follow-up protocol.',
                        'Serves on the Quality Improvement Committee, leading initiatives to improve patient safety.'
                    ]
                }
            ],
            education: [
                {
                    id: 'edu1',
                    degree: 'Doctor of Medicine (M.D.)',
                    school: 'Harvard Medical School',
                    location: 'Boston, MA',
                    startDate: '2008-09',
                    endDate: '2012-05'
                }
            ],
            skills: ['Internal Medicine', 'Chronic Disease Management', 'Diagnostic Skills', 'EMR', 'Medical Education', 'Clinical Research'],
            languages: ['English (Native)']
        }
    },
    {
        id: 'health-3',
        slug: 'pharmacist',
        title: 'Pharmacist',
        description: 'Detail-oriented Pharmacist with experience in retail and hospital settings.',
        industry: 'Healthcare',
        level: 'Mid Level',
        style: 'Classic',
        color: 'bg-emerald-600',
        atsScore: 93,
        tags: ['Pharmacy', 'Medication Management', 'Healthcare', 'Patient Counseling'],
        content: {
            personalInfo: {
                fullName: 'Robert Chen',
                title: 'Clinical Pharmacist',
                email: 'robert.chen@example.com',
                phone: '+1 (555) 333-4444',
                location: 'San Diego, CA'
            },
            summary: 'Licensed Pharmacist with 6 years of experience ensuring safe and effective medication therapy. Strong knowledge of pharmacology, drug interactions, and patient counseling. Committed to improving patient health outcomes.',
            experience: [
                {
                    id: 'exp1',
                    title: 'Clinical Pharmacist',
                    company: 'Scripps Health',
                    location: 'San Diego, CA',
                    startDate: '2019-08',
                    endDate: 'Present',
                    description: 'Providing clinical pharmacy services in a hospital setting.',
                    achievements: [
                        'Implemented an antimicrobial stewardship program that reduced antibiotic costs by 10%.',
                        'Collaborated with physicians to optimize medication regimens for complex patients.'
                    ]
                }
            ],
            education: [
                {
                    id: 'edu1',
                    degree: 'Doctor of Pharmacy (Pharm.D.)',
                    school: 'UCSF School of Pharmacy',
                    location: 'San Francisco, CA',
                    startDate: '2013-09',
                    endDate: '2017-05'
                }
            ],
            skills: ['Medication Therapy Management', 'Patient Counseling', 'Drug Information', 'Hospital Pharmacy', 'Immunization Certified'],
            languages: ['English (Native)', 'Mandarin (Fluent)']
        }
    },

    // FINANCE
    {
        id: 'fin-1',
        slug: 'financial-analyst',
        title: 'Financial Analyst',
        description: 'Analytical Financial Analyst with expertise in financial modeling and forecasting.',
        industry: 'Finance',
        level: 'Mid Level',
        style: 'Modern',
        color: 'bg-green-600',
        atsScore: 91,
        tags: ['Finance', 'Analysis', 'Excel', 'Modeling'],
        content: {
            personalInfo: {
                fullName: 'Michael Ross',
                title: 'Financial Analyst',
                email: 'm.ross@example.com',
                phone: '+1 (555) 876-5432',
                location: 'Chicago, IL',
                linkedin: 'linkedin.com/in/mrossfinance'
            },
            summary: 'Detail-oriented Financial Analyst with 4 years of experience in corporate finance. Proficient in financial modeling, budgeting, and variance analysis. Advanced Excel user and CFA Level 2 candidate.',
            experience: [
                {
                    id: 'exp1',
                    title: 'Financial Analyst',
                    company: 'Global Finance Group',
                    location: 'Chicago, IL',
                    startDate: '2020-01',
                    endDate: 'Present',
                    description: 'Responsible for monthly financial reporting and strategic planning support.',
                    achievements: [
                        'Developed a new revenue forecasting model that improved accuracy by 15%.',
                        'Automated monthly reporting processes using VBA macros, saving 10 hours per month.'
                    ]
                }
            ],
            education: [
                {
                    id: 'edu1',
                    degree: 'B.S. Finance',
                    school: 'University of Chicago',
                    location: 'Chicago, IL',
                    startDate: '2015-09',
                    endDate: '2019-05'
                }
            ],
            skills: ['Financial Modeling', 'Excel (Advanced)', 'SQL', 'Tableau', 'Budgeting', 'Forecasting'],
            languages: ['English (Native)']
        }
    },
    {
        id: 'fin-2',
        slug: 'accountant',
        title: 'Accountant',
        description: 'Organized Accountant with a strong foundation in GAAP and tax preparation.',
        industry: 'Finance',
        level: 'Entry Level',
        style: 'Classic',
        color: 'bg-green-700',
        atsScore: 89,
        tags: ['Accounting', 'Tax', 'GAAP', 'QuickBooks'],
        content: {
            personalInfo: {
                fullName: 'Jennifer Lee',
                title: 'Staff Accountant',
                email: 'jen.lee@example.com',
                phone: '+1 (555) 654-3210',
                location: 'Houston, TX'
            },
            summary: 'Diligent Staff Accountant with 2 years of experience in general ledger accounting and tax preparation. Proficient in QuickBooks and SAP. Committed to accuracy and compliance with GAAP.',
            experience: [
                {
                    id: 'exp1',
                    title: 'Junior Accountant',
                    company: 'Smith & Associates CPAs',
                    location: 'Houston, TX',
                    startDate: '2022-06',
                    endDate: 'Present',
                    description: 'Assisting with audits, tax returns, and monthly closings.',
                    achievements: [
                        'Prepared over 100 individual and small business tax returns.',
                        'Assisted in the successful completion of 5 external audits.'
                    ]
                }
            ],
            education: [
                {
                    id: 'edu1',
                    degree: 'B.B.A. Accounting',
                    school: 'University of Houston',
                    location: 'Houston, TX',
                    startDate: '2018-09',
                    endDate: '2022-05'
                }
            ],
            skills: ['Accounting', 'Tax Preparation', 'QuickBooks', 'Excel', 'GAAP', 'Reconciliation'],
            languages: ['English (Native)']
        }
    },
    {
        id: 'fin-3',
        slug: 'investment-banker',
        title: 'Investment Banker',
        description: 'Results-oriented Investment Banker with experience in M&A and capital markets.',
        industry: 'Finance',
        level: 'Senior',
        style: 'Classic',
        color: 'bg-slate-800',
        atsScore: 95,
        tags: ['Investment Banking', 'M&A', 'Valuation', 'Finance'],
        content: {
            personalInfo: {
                fullName: 'William Sterling',
                title: 'Vice President, Investment Banking',
                email: 'w.sterling@example.com',
                phone: '+1 (555) 111-2222',
                location: 'New York, NY'
            },
            summary: 'Vice President of Investment Banking with 8 years of experience executing M&A transactions and capital raises in the technology sector. Proven ability to lead deal teams, manage client relationships, and negotiate complex terms.',
            experience: [
                {
                    id: 'exp1',
                    title: 'Vice President',
                    company: 'Goldman Sachs',
                    location: 'New York, NY',
                    startDate: '2019-01',
                    endDate: 'Present',
                    description: 'Leading execution of M&A and financing transactions for TMT clients.',
                    achievements: [
                        'Advised on the $5B acquisition of a major software company.',
                        'Led the IPO process for a high-growth fintech startup, raising $300M.'
                    ]
                }
            ],
            education: [
                {
                    id: 'edu1',
                    degree: 'MBA',
                    school: 'Wharton School',
                    location: 'Philadelphia, PA',
                    startDate: '2013-09',
                    endDate: '2015-05'
                }
            ],
            skills: ['M&A', 'Financial Modeling', 'Valuation', 'Due Diligence', 'Client Management', 'Negotiation'],
            languages: ['English (Native)', 'French (Fluent)']
        }
    },

    // EDUCATION
    {
        id: 'edu-1',
        slug: 'high-school-teacher',
        title: 'High School Teacher',
        description: 'Inspiring High School English Teacher dedicated to fostering student engagement and literacy.',
        industry: 'Education',
        level: 'Mid Level',
        style: 'Creative',
        color: 'bg-yellow-500',
        atsScore: 90,
        tags: ['Teaching', 'Education', 'English', 'Curriculum Design'],
        content: {
            personalInfo: {
                fullName: 'Sarah Thompson',
                title: 'High School English Teacher',
                email: 'sarah.t@example.com',
                phone: '+1 (555) 444-5555',
                location: 'Denver, CO'
            },
            summary: 'Passionate English Teacher with 6 years of experience in secondary education. Committed to creating an inclusive classroom environment and using innovative teaching methods to inspire a love for literature and writing.',
            experience: [
                {
                    id: 'exp1',
                    title: 'English Teacher',
                    company: 'Lincoln High School',
                    location: 'Denver, CO',
                    startDate: '2018-08',
                    endDate: 'Present',
                    description: 'Teaching 9th and 10th grade English Literature and Composition.',
                    achievements: [
                        'Developed a new creative writing curriculum that increased student enrollment in the elective by 50%.',
                        'Organized the annual school poetry slam and literary magazine.'
                    ]
                }
            ],
            education: [
                {
                    id: 'edu1',
                    degree: 'M.Ed. Secondary Education',
                    school: 'University of Colorado',
                    location: 'Boulder, CO',
                    startDate: '2016-09',
                    endDate: '2018-05'
                }
            ],
            skills: ['Curriculum Development', 'Classroom Management', 'Differentiated Instruction', 'Literacy Strategies', 'Educational Technology'],
            languages: ['English (Native)']
        }
    },
    {
        id: 'edu-2',
        slug: 'university-professor',
        title: 'University Professor',
        description: 'Accomplished Professor of History with a strong research record and teaching excellence.',
        industry: 'Education',
        level: 'Senior',
        style: 'Classic',
        color: 'bg-amber-700',
        atsScore: 92,
        tags: ['Professor', 'Research', 'Higher Education', 'History'],
        content: {
            personalInfo: {
                fullName: 'Dr. Robert Langdon',
                title: 'Professor of History',
                email: 'r.langdon@example.com',
                phone: '+1 (555) 666-7777',
                location: 'Cambridge, MA'
            },
            summary: 'Tenured Professor of History with 15 years of experience in research and teaching. Specializing in European History. Author of 3 books and numerous peer-reviewed articles. Dedicated to mentoring graduate students.',
            experience: [
                {
                    id: 'exp1',
                    title: 'Professor of History',
                    company: 'Harvard University',
                    location: 'Cambridge, MA',
                    startDate: '2010-09',
                    endDate: 'Present',
                    description: 'Teaching undergraduate and graduate courses in European History.',
                    achievements: [
                        'Awarded the University Teaching Excellence Award in 2018.',
                        'Secured over $500k in research grants from the National Endowment for the Humanities.'
                    ]
                }
            ],
            education: [
                {
                    id: 'edu1',
                    degree: 'Ph.D. History',
                    school: 'Yale University',
                    location: 'New Haven, CT',
                    startDate: '2000-09',
                    endDate: '2006-05'
                }
            ],
            skills: ['Academic Research', 'Lecturing', 'Curriculum Design', 'Grant Writing', 'Public Speaking', 'Mentoring'],
            languages: ['English (Native)', 'French (Fluent)', 'German (Reading)']
        }
    },
    {
        id: 'edu-3',
        slug: 'educational-consultant',
        title: 'Educational Consultant',
        description: 'Strategic Educational Consultant helping schools improve curriculum and student outcomes.',
        industry: 'Education',
        level: 'Senior',
        style: 'Modern',
        color: 'bg-orange-500',
        atsScore: 91,
        tags: ['Consulting', 'Education', 'Strategy', 'Curriculum'],
        content: {
            personalInfo: {
                fullName: 'Amanda Garcia',
                title: 'Educational Consultant',
                email: 'amanda.g@example.com',
                phone: '+1 (555) 222-1111',
                location: 'Los Angeles, CA'
            },
            summary: 'Educational Consultant with 10 years of experience in K-12 education reform. Expertise in curriculum alignment, teacher training, and school improvement strategies. Proven track record of raising student achievement scores.',
            experience: [
                {
                    id: 'exp1',
                    title: 'Senior Consultant',
                    company: 'EdStrategies LLC',
                    location: 'Los Angeles, CA',
                    startDate: '2019-01',
                    endDate: 'Present',
                    description: 'Advising school districts on curriculum implementation and professional development.',
                    achievements: [
                        'Led a district-wide STEM initiative that resulted in a 20% increase in math proficiency scores.',
                        'Designed and delivered professional development workshops for over 500 teachers.'
                    ]
                }
            ],
            education: [
                {
                    id: 'edu1',
                    degree: 'Ed.D. Educational Leadership',
                    school: 'UCLA',
                    location: 'Los Angeles, CA',
                    startDate: '2012-09',
                    endDate: '2016-05'
                }
            ],
            skills: ['Educational Leadership', 'Curriculum Design', 'Teacher Training', 'Data Analysis', 'Program Evaluation', 'Strategic Planning'],
            languages: ['English (Native)', 'Spanish (Fluent)']
        }
    },

    // MARKETING
    {
        id: 'mkt-1',
        slug: 'digital-marketing-manager',
        title: 'Digital Marketing Manager',
        description: 'Data-driven Digital Marketing Manager expert in SEO, PPC, and content strategy.',
        industry: 'Marketing',
        level: 'Senior',
        style: 'Modern',
        color: 'bg-purple-600',
        atsScore: 94,
        tags: ['Marketing', 'SEO', 'PPC', 'Strategy'],
        content: {
            personalInfo: {
                fullName: 'Jessica Chen',
                title: 'Digital Marketing Manager',
                email: 'jessica.c@example.com',
                phone: '+1 (555) 888-9999',
                location: 'San Francisco, CA'
            },
            summary: 'Digital Marketing Manager with 7 years of experience driving growth for B2B tech companies. Expert in SEO, SEM, and marketing automation. Proven ability to manage large budgets and deliver high ROI campaigns.',
            experience: [
                {
                    id: 'exp1',
                    title: 'Digital Marketing Manager',
                    company: 'TechGrowth Inc.',
                    location: 'San Francisco, CA',
                    startDate: '2020-03',
                    endDate: 'Present',
                    description: 'Overseeing all digital marketing channels and managing a team of 4.',
                    achievements: [
                        'Increased organic traffic by 200% YoY through a comprehensive SEO and content strategy.',
                        'Optimized paid search campaigns, reducing CPA by 30% while increasing lead volume.'
                    ]
                }
            ],
            education: [
                {
                    id: 'edu1',
                    degree: 'B.A. Marketing',
                    school: 'UC Berkeley',
                    location: 'Berkeley, CA',
                    startDate: '2013-09',
                    endDate: '2017-05'
                }
            ],
            skills: ['SEO/SEM', 'Google Analytics', 'HubSpot', 'Content Strategy', 'Social Media Marketing', 'Email Marketing'],
            languages: ['English (Native)']
        }
    },
    {
        id: 'mkt-2',
        slug: 'social-media-specialist',
        title: 'Social Media Specialist',
        description: 'Creative Social Media Specialist with a knack for viral content and community engagement.',
        industry: 'Marketing',
        level: 'Entry Level',
        style: 'Creative',
        color: 'bg-pink-500',
        atsScore: 88,
        tags: ['Social Media', 'Content Creation', 'Community Management', 'Marketing'],
        content: {
            personalInfo: {
                fullName: 'Tyler Durden',
                title: 'Social Media Specialist',
                email: 'tyler.d@example.com',
                phone: '+1 (555) 000-1111',
                location: 'Austin, TX'
            },
            summary: 'Creative Social Media Specialist with 2 years of experience managing brand presence on Instagram, TikTok, and Twitter. Skilled in content creation, community engagement, and social analytics.',
            experience: [
                {
                    id: 'exp1',
                    title: 'Social Media Coordinator',
                    company: 'BuzzAgency',
                    location: 'Austin, TX',
                    startDate: '2022-06',
                    endDate: 'Present',
                    description: 'Creating and scheduling content for client social media accounts.',
                    achievements: [
                        'Grew a client\'s TikTok following from 0 to 50k in 6 months.',
                        'Increased engagement rates by 20% through interactive stories and polls.'
                    ]
                }
            ],
            education: [
                {
                    id: 'edu1',
                    degree: 'B.S. Communications',
                    school: 'University of Texas',
                    location: 'Austin, TX',
                    startDate: '2018-09',
                    endDate: '2022-05'
                }
            ],
            skills: ['Social Media Management', 'Content Creation', 'Canva', 'Copywriting', 'Community Management', 'Influencer Marketing'],
            languages: ['English (Native)']
        }
    },
    {
        id: 'mkt-3',
        slug: 'seo-analyst',
        title: 'SEO Analyst',
        description: 'Technical SEO Analyst focused on improving search rankings and organic traffic.',
        industry: 'Marketing',
        level: 'Mid Level',
        style: 'Modern',
        color: 'bg-blue-500',
        atsScore: 92,
        tags: ['SEO', 'Analytics', 'Technical SEO', 'Marketing'],
        content: {
            personalInfo: {
                fullName: 'Kevin O\'Connor',
                title: 'SEO Analyst',
                email: 'kevin.o@example.com',
                phone: '+1 (555) 777-6666',
                location: 'Seattle, WA'
            },
            summary: 'SEO Analyst with 4 years of experience in technical SEO and keyword strategy. Proficient in using SEO tools like Ahrefs, SEMrush, and Screaming Frog to identify opportunities and track performance.',
            experience: [
                {
                    id: 'exp1',
                    title: 'SEO Specialist',
                    company: 'E-commerce Giants',
                    location: 'Seattle, WA',
                    startDate: '2020-01',
                    endDate: 'Present',
                    description: 'Managing SEO strategy for a large e-commerce website.',
                    achievements: [
                        'Resolved critical technical SEO issues, resulting in a 25% increase in indexed pages.',
                        'Conducted keyword research that informed the creation of 50+ high-traffic blog posts.'
                    ]
                }
            ],
            education: [
                {
                    id: 'edu1',
                    degree: 'B.S. Information Systems',
                    school: 'University of Washington',
                    location: 'Seattle, WA',
                    startDate: '2015-09',
                    endDate: '2019-05'
                }
            ],
            skills: ['Technical SEO', 'Keyword Research', 'Google Search Console', 'Ahrefs', 'SEMrush', 'HTML/CSS'],
            languages: ['English (Native)']
        }
    },
    {
        id: 'mkt-4',
        slug: 'brand-strategist',
        title: 'Brand Strategist',
        description: 'Visionary Brand Strategist helping companies define their voice and identity.',
        industry: 'Marketing',
        level: 'Senior',
        style: 'Creative',
        color: 'bg-indigo-600',
        atsScore: 93,
        tags: ['Branding', 'Strategy', 'Marketing', 'Identity'],
        content: {
            personalInfo: {
                fullName: 'Olivia Martinez',
                title: 'Senior Brand Strategist',
                email: 'olivia.m@example.com',
                phone: '+1 (555) 333-2222',
                location: 'Los Angeles, CA'
            },
            summary: 'Senior Brand Strategist with 8 years of experience building strong, resonant brands. Expertise in brand positioning, messaging, and visual identity. Passionate about storytelling and connecting with audiences.',
            experience: [
                {
                    id: 'exp1',
                    title: 'Brand Director',
                    company: 'Creative Agency XYZ',
                    location: 'Los Angeles, CA',
                    startDate: '2018-05',
                    endDate: 'Present',
                    description: 'Leading brand strategy for a portfolio of lifestyle and consumer goods clients.',
                    achievements: [
                        'Led the rebranding of a major fashion retailer, resulting in a 15% increase in brand sentiment.',
                        'Developed comprehensive brand guidelines for 3 global startups.'
                    ]
                }
            ],
            education: [
                {
                    id: 'edu1',
                    degree: 'B.A. Communications',
                    school: 'USC',
                    location: 'Los Angeles, CA',
                    startDate: '2010-09',
                    endDate: '2014-05'
                }
            ],
            skills: ['Brand Strategy', 'Market Research', 'Copywriting', 'Visual Identity', 'Storytelling', 'Project Management'],
            languages: ['English (Native)', 'Spanish (Fluent)']
        }
    },

    // DESIGN
    {
        id: 'des-1',
        slug: 'ui-ux-designer',
        title: 'UI/UX Designer',
        description: 'User-centered UI/UX Designer creating intuitive and beautiful digital experiences.',
        industry: 'Design',
        level: 'Senior',
        style: 'Creative',
        color: 'bg-pink-600',
        atsScore: 94,
        tags: ['UI/UX', 'Design', 'Figma', 'Product Design'],
        content: {
            personalInfo: {
                fullName: 'Daniel Kim',
                title: 'Senior UI/UX Designer',
                email: 'daniel.k@example.com',
                phone: '+1 (555) 444-3333',
                location: 'San Francisco, CA',
                website: 'danielkim.design'
            },
            summary: 'Senior UI/UX Designer with 7 years of experience designing mobile and web applications. Expert in Figma, prototyping, and design systems. Passionate about solving user problems through elegant design solutions.',
            experience: [
                {
                    id: 'exp1',
                    title: 'Lead Product Designer',
                    company: 'AppWorks',
                    location: 'San Francisco, CA',
                    startDate: '2019-02',
                    endDate: 'Present',
                    description: 'Leading the design of the flagship mobile app and managing a team of 3 designers.',
                    achievements: [
                        'Redesigned the onboarding flow, increasing user activation by 25%.',
                        'Established a comprehensive design system that improved design-to-dev handoff efficiency by 40%.'
                    ]
                }
            ],
            education: [
                {
                    id: 'edu1',
                    degree: 'B.F.A. Interaction Design',
                    school: 'California College of the Arts',
                    location: 'San Francisco, CA',
                    startDate: '2012-09',
                    endDate: '2016-05'
                }
            ],
            skills: ['Figma', 'Prototyping', 'User Research', 'Design Systems', 'Wireframing', 'HTML/CSS'],
            languages: ['English (Native)', 'Korean (Fluent)']
        }
    },
    {
        id: 'des-2',
        slug: 'graphic-designer',
        title: 'Graphic Designer',
        description: 'Versatile Graphic Designer with expertise in branding, print, and digital design.',
        industry: 'Design',
        level: 'Mid Level',
        style: 'Creative',
        color: 'bg-purple-500',
        atsScore: 90,
        tags: ['Graphic Design', 'Branding', 'Adobe Creative Suite', 'Illustration'],
        content: {
            personalInfo: {
                fullName: 'Emma Davis',
                title: 'Graphic Designer',
                email: 'emma.d@example.com',
                phone: '+1 (555) 111-0000',
                location: 'Portland, OR',
                website: 'emmadavis.portfolio'
            },
            summary: 'Creative Graphic Designer with 5 years of experience in agency and in-house roles. Proficient in Adobe Creative Suite. Strong eye for typography, color, and layout. Proven ability to deliver high-quality visual assets on time.',
            experience: [
                {
                    id: 'exp1',
                    title: 'Graphic Designer',
                    company: 'Creative Studio',
                    location: 'Portland, OR',
                    startDate: '2019-06',
                    endDate: 'Present',
                    description: 'Designing marketing materials, logos, and social media graphics for various clients.',
                    achievements: [
                        'Created the visual identity for a local coffee chain that expanded to 5 locations.',
                        'Designed award-winning packaging for a craft brewery.'
                    ]
                }
            ],
            education: [
                {
                    id: 'edu1',
                    degree: 'B.A. Graphic Design',
                    school: 'Portland State University',
                    location: 'Portland, OR',
                    startDate: '2015-09',
                    endDate: '2019-05'
                }
            ],
            skills: ['Adobe Photoshop', 'Illustrator', 'InDesign', 'Typography', 'Branding', 'Print Design'],
            languages: ['English (Native)']
        }
    },
    {
        id: 'des-3',
        slug: 'product-designer',
        title: 'Product Designer',
        description: 'Strategic Product Designer bridging the gap between user needs and business goals.',
        industry: 'Design',
        level: 'Senior',
        style: 'Modern',
        color: 'bg-rose-500',
        atsScore: 93,
        tags: ['Product Design', 'UX', 'Strategy', 'Design Thinking'],
        content: {
            personalInfo: {
                fullName: 'Lucas Silva',
                title: 'Senior Product Designer',
                email: 'lucas.s@example.com',
                phone: '+1 (555) 999-8888',
                location: 'Austin, TX',
                website: 'lucassilva.design'
            },
            summary: 'Senior Product Designer with 8 years of experience in SaaS and consumer tech. Skilled in end-to-end product design, from research to high-fidelity prototyping. Advocate for user-centric design principles.',
            experience: [
                {
                    id: 'exp1',
                    title: 'Staff Product Designer',
                    company: 'TechGiant',
                    location: 'Austin, TX',
                    startDate: '2020-01',
                    endDate: 'Present',
                    description: 'Leading design strategy for the enterprise collaboration tool.',
                    achievements: [
                        'Led the redesign of the core messaging interface, improving user satisfaction scores by 15%.',
                        'Mentored junior designers and facilitated design thinking workshops.'
                    ]
                }
            ],
            education: [
                {
                    id: 'edu1',
                    degree: 'M.Des. Interaction Design',
                    school: 'Carnegie Mellon University',
                    location: 'Pittsburgh, PA',
                    startDate: '2012-09',
                    endDate: '2014-05'
                }
            ],
            skills: ['Product Strategy', 'Interaction Design', 'User Testing', 'Figma', 'Sketch', 'Agile'],
            languages: ['English (Native)', 'Portuguese (Fluent)']
        }
    }
];
