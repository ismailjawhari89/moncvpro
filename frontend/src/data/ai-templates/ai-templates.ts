
import { CVData } from '@/types/cv';

export enum PhotoPosition {
    TOP_LEFT = 'top-left',
    TOP_RIGHT = 'top-right',
    CENTER = 'center',
    LEFT_SIDEBAR = 'left-sidebar',
    RIGHT_SIDEBAR = 'right-sidebar',
    CIRCULAR = 'circular', // Usually floating or specific style
    NO_PHOTO = 'no-photo',
    MINIMAL = 'minimal'
}

export enum PhotoStyle {
    MODERN = 'modern',
    CLASSIC = 'classic',
    CREATIVE = 'creative',
    MINIMAL = 'minimal',
    ROUNDED = 'rounded',
    SQUARE = 'square'
}

export interface AICVDesign {
    layout: 'modern' | 'classic' | 'creative' | 'executive' | 'academic' | 'technical' | 'minimalist';
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
    };
    typography: {
        headingFont: string;
        fontFamily: string;
        fontSize: string;
    };
    spacing: 'compact' | 'normal' | 'spacious';
}

export interface AIImageOptions {
    position: PhotoPosition;
    style: PhotoStyle;
    width: number;
    height: number;
    enhancementEffects: ('background-removal' | 'professional-lighting' | 'attire-correction')[];
}

export interface AICVTemplate {
    id: string;
    name: {
        en: string;
        fr: string;
        ar: string;
    };
    description: {
        en: string;
        fr: string;
        ar: string;
    };
    atsScore: number;
    photoPosition: PhotoPosition; // Redundant but useful for filtering
    tags: string[]; // For smart search
    design: AICVDesign;
    imageOptions: AIImageOptions;
    exampleData: CVData;
}

export const aiTemplates: AICVTemplate[] = [
    // 1. Modern Developer
    {
        id: 'modern-developer',
        name: { en: 'Modern Developer', fr: 'Développeur Moderne', ar: 'المطور الحديث' },
        description: {
            en: 'Clean, tech-focused design optimized for GitHub links and technical skills.',
            fr: 'Design épuré et axé sur la technologie, optimisé pour les liens GitHub et les compétences techniques.',
            ar: 'تصميم حديث يركز على المهارات التقنية وروابط GitHub.'
        },
        atsScore: 98,
        photoPosition: PhotoPosition.TOP_LEFT,
        tags: ['tech', 'software', 'developer', 'programming', 'modern'],
        design: {
            layout: 'modern',
            colors: { primary: '#2563eb', secondary: '#1e40af', accent: '#60a5fa', background: '#ffffff', text: '#1f2937' },
            typography: { headingFont: 'Inter', fontFamily: 'Roboto', fontSize: '14px' },
            spacing: 'normal'
        },
        imageOptions: {
            position: PhotoPosition.TOP_LEFT,
            style: PhotoStyle.SQUARE,
            width: 120,
            height: 120,
            enhancementEffects: ['professional-lighting']
        },
        exampleData: {
            personalInfo: {
                fullName: 'Alex Chen',
                email: 'alex.code@example.com',
                phone: '+1 555 010 2020',
                address: 'San Francisco, CA, USA',
                profession: 'Senior Full Stack Developer',
                linkedin: 'linkedin.com/in/alexchen',
                github: 'github.com/alexchen-dev',
                photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'
            },
            summary: 'Experienced Full Stack Developer with 7+ years in building scalable web applications. Proficient in React, Node.js, and Cloud Architecture. Led a team of 5 developers to deliver a SaaS platform used by 50k+ users. Passionate about clean code, performance optimization, and mentoring junior developers. Strong advocate for agile methodologies and continuous integration practices.',
            experiences: [
                { id: '1', company: 'TechFlow Solutions', position: 'Senior Full Stack Developer', startDate: '2020-01', endDate: 'Present', current: true, description: 'Lead developer for enterprise SaaS platform serving 50,000+ active users. Architected microservices migration from monolith, reducing API latency by 40%. Implemented real-time features using WebSockets and Redis pub/sub.', achievements: ['Reduced deployment time by 70% with CI/CD pipelines', 'Mentored team of 5 junior developers', 'Increased test coverage from 40% to 85%'] },
                { id: '2', company: 'WebStart Inc', position: 'Full Stack Developer', startDate: '2017-05', endDate: '2019-12', current: false, description: 'Developed client-facing portals and RESTful APIs using Vue.js and Laravel. Collaborated with design team to implement responsive UI components. Optimized database queries reducing page load times by 50%.', achievements: ['Built e-commerce platform processing $2M+ annually', 'Implemented OAuth2 authentication system'] },
                { id: '3', company: 'CodeCraft Studios', position: 'Junior Developer', startDate: '2015-06', endDate: '2017-04', current: false, description: 'Developed mobile-responsive websites and web applications. Participated in agile sprints and code reviews. Gained expertise in JavaScript frameworks and version control systems.', achievements: ['Delivered 20+ client projects on time', 'Introduced automated testing practices'] }
            ],
            education: [
                { id: '1', institution: 'Massachusetts Institute of Technology (MIT)', degree: 'Bachelor of Science in Computer Science', graduationYear: '2017', field: 'Computer Science', startDate: '2013-09', endDate: '2017-05', current: false, description: 'GPA: 3.9/4.0 | Dean\'s List | Focus on Software Engineering and AI' },
                { id: '2', institution: 'Stanford Online', degree: 'Certificate in Machine Learning', graduationYear: '2019', field: 'Machine Learning', startDate: '2019-01', endDate: '2019-06', current: false, description: 'Completed Andrew Ng\'s ML specialization with honors' }
            ],
            skills: [
                { id: '1', name: 'React / Next.js', level: 95, category: 'technical' },
                { id: '2', name: 'TypeScript', level: 92, category: 'technical' },
                { id: '3', name: 'Node.js / Express', level: 90, category: 'technical' },
                { id: '4', name: 'AWS / Cloud', level: 88, category: 'technical' },
                { id: '5', name: 'PostgreSQL / MongoDB', level: 85, category: 'technical' },
                { id: '6', name: 'Docker / Kubernetes', level: 82, category: 'technical' },
                { id: '7', name: 'GraphQL', level: 80, category: 'technical' },
                { id: '8', name: 'Python', level: 78, category: 'technical' },
                { id: '9', name: 'Git / GitHub', level: 95, category: 'technical' },
                { id: '10', name: 'Agile / Scrum', level: 90, category: 'soft' },
                { id: '11', name: 'Team Leadership', level: 85, category: 'soft' },
                { id: '12', name: 'Problem Solving', level: 95, category: 'soft' }
            ],
            languages: [
                { id: '1', name: 'English', proficiency: 'native' },
                { id: '2', name: 'Mandarin Chinese', proficiency: 'fluent' },
                { id: '3', name: 'Spanish', proficiency: 'conversational' }
            ],
            certifications: [
                { id: '1', name: 'AWS Solutions Architect Associate', issuer: 'Amazon Web Services', date: '2021' },
                { id: '2', name: 'Google Cloud Professional Developer', issuer: 'Google', date: '2022' }
            ],
            template: 'modern-developer',
            contentLanguage: 'en',
            metadata: { version: 1, createdAt: '', updatedAt: '', lastAutoSave: '' }
        }
    },
    // 2. Medical Doctor
    {
        id: 'medical-doctor',
        name: { en: 'Medical Professional', fr: 'Professionnel Médical', ar: 'الطبيب المحترف' },
        description: {
            en: 'Trust-inspiring layout with central photo and clear credentials display.',
            fr: 'Mise en page inspirant confiance avec photo centrale et affichage clair des qualifications.',
            ar: 'تصميم يوحي بالثقة مع صورة مركزية وعرض واضح للمؤهلات.'
        },
        atsScore: 95,
        photoPosition: PhotoPosition.CENTER,
        tags: ['medical', 'doctor', 'nurse', 'health', 'healthcare'],
        design: {
            layout: 'classic',
            colors: { primary: '#059669', secondary: '#047857', accent: '#34d399', background: '#f0fdf4', text: '#064e3b' },
            typography: { headingFont: 'Merriweather', fontFamily: 'Open Sans', fontSize: '14px' },
            spacing: 'spacious'
        },
        imageOptions: {
            position: PhotoPosition.CENTER,
            style: PhotoStyle.ROUNDED,
            width: 140,
            height: 140,
            enhancementEffects: ['background-removal', 'attire-correction']
        },
        exampleData: {
            personalInfo: {
                fullName: 'Dr. Sarah Al-Fayed',
                email: 'dr.sarah@hospital.com',
                phone: '+971 50 123 4567',
                address: 'Dubai Healthcare City, UAE',
                profession: 'Consultant Cardiologist',
                linkedin: 'linkedin.com/in/drsarah',
                photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face'
            },
            summary: 'Board-certified Cardiologist with over 12 years of clinical experience in interventional cardiology and cardiovascular disease management. Fellowship-trained at Cleveland Clinic with expertise in complex coronary interventions, structural heart disease, and preventive cardiology. Published 25+ peer-reviewed articles and committed to evidence-based patient care. Fluent in English and Arabic, serving diverse patient populations.',
            experiences: [
                { id: '1', company: 'Dubai Heart Center', position: 'Head of Interventional Cardiology', startDate: '2019-01', endDate: 'Present', current: true, description: 'Leading a team of 25 cardiologists and cardiac surgeons. Performing 200+ interventional procedures annually including PCI, TAVR, and structural heart interventions. Established the region\'s first STEMI response program.', achievements: ['Reduced door-to-balloon time by 35%', 'Achieved 99.2% procedural success rate', 'Trained 15 fellows in interventional techniques'] },
                { id: '2', company: 'Cleveland Clinic Abu Dhabi', position: 'Consultant Cardiologist', startDate: '2015-06', endDate: '2018-12', current: false, description: 'Managed complex cardiac cases including heart failure, arrhythmias, and coronary artery disease. Led multidisciplinary heart team meetings and collaborated with cardiac surgeons on hybrid procedures.', achievements: ['Published 12 research papers', 'Developed heart failure management protocol'] },
                { id: '3', company: 'Johns Hopkins Hospital', position: 'Cardiology Fellow', startDate: '2012-07', endDate: '2015-05', current: false, description: 'Completed three-year interventional cardiology fellowship. Participated in clinical trials for novel cardiac devices. Trained in advanced imaging including cardiac CT and MRI.', achievements: ['Chief Fellow 2014-2015', 'Research Excellence Award'] }
            ],
            education: [
                { id: '1', institution: 'Johns Hopkins University School of Medicine', degree: 'Doctor of Medicine (MD)', graduationYear: '2012', field: 'Medicine', startDate: '2008', endDate: '2012', current: false, description: 'Alpha Omega Alpha Honor Society | Research in cardiovascular genetics' },
                { id: '2', institution: 'Cleveland Clinic', degree: 'Fellowship in Interventional Cardiology', graduationYear: '2015', field: 'Interventional Cardiology', startDate: '2012', endDate: '2015', current: false, description: 'Advanced training in complex coronary and structural interventions' },
                { id: '3', institution: 'American University of Beirut', degree: 'Bachelor of Science in Biology', graduationYear: '2008', field: 'Pre-Medical Studies', startDate: '2004', endDate: '2008', current: false, description: 'Summa Cum Laude | Dean\'s Honor List' }
            ],
            skills: [
                { id: '1', name: 'Interventional Cardiology', level: 98, category: 'technical' },
                { id: '2', name: 'Cardiac Catheterization', level: 96, category: 'technical' },
                { id: '3', name: 'Echocardiography', level: 95, category: 'technical' },
                { id: '4', name: 'Coronary Angioplasty (PCI)', level: 97, category: 'technical' },
                { id: '5', name: 'Electrophysiology', level: 85, category: 'technical' },
                { id: '6', name: 'Cardiac MRI/CT', level: 88, category: 'technical' },
                { id: '7', name: 'Patient Communication', level: 95, category: 'soft' },
                { id: '8', name: 'Team Leadership', level: 92, category: 'soft' },
                { id: '9', name: 'Clinical Research', level: 90, category: 'technical' },
                { id: '10', name: 'Medical Education', level: 88, category: 'soft' }
            ],
            languages: [
                { id: '1', name: 'Arabic', proficiency: 'native' },
                { id: '2', name: 'English', proficiency: 'fluent' },
                { id: '3', name: 'French', proficiency: 'conversational' },
                { id: '4', name: 'Hindi', proficiency: 'basic' }
            ],
            certifications: [
                { id: '1', name: 'American Board of Internal Medicine - Cardiovascular Disease', issuer: 'ABIM', date: '2015' },
                { id: '2', name: 'Interventional Cardiology Board Certification', issuer: 'ABIM', date: '2016' },
                { id: '3', name: 'Advanced Cardiac Life Support (ACLS)', issuer: 'AHA', date: '2023' }
            ],
            template: 'medical-doctor',
            contentLanguage: 'en',
            metadata: { version: 1, createdAt: '', updatedAt: '', lastAutoSave: '' }
        }
    },
    // 3. Academic Professor
    {
        id: 'academic-professor',
        name: { en: 'Academic Professor', fr: 'Professeur Universitaire', ar: 'الأستاذ الأكاديمي' },
        description: {
            en: 'Detailed structure for publications, research, and academic history.',
            fr: 'Structure détaillée pour les publications, la recherche et l’historique académique.',
            ar: 'هيكلية مفصلة للمنشورات والأبحاث والتاريخ الأكاديمي.'
        },
        atsScore: 92,
        photoPosition: PhotoPosition.TOP_LEFT,
        tags: ['academic', 'professor', 'teacher', 'education', 'research', 'university'],
        design: {
            layout: 'academic',
            colors: { primary: '#7c3aed', secondary: '#5b21b6', accent: '#a78bfa', background: '#ffffff', text: '#374151' },
            typography: { headingFont: 'Playfair Display', fontFamily: 'Lora', fontSize: '13px' },
            spacing: 'compact'
        },
        imageOptions: {
            position: PhotoPosition.TOP_LEFT,
            style: PhotoStyle.ROUNDED,
            width: 100,
            height: 100,
            enhancementEffects: []
        },
        exampleData: {
            personalInfo: {
                fullName: 'Prof. James Wilson',
                email: 'j.wilson@oxford.ac.uk',
                phone: '+44 20 7123 4567',
                address: 'Oxford, United Kingdom',
                profession: 'Professor of Modern European History',
                linkedin: 'linkedin.com/in/profwilson',
                photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'
            },
            summary: 'Distinguished Professor of Modern European History with over 22 years of teaching and research experience at world-renowned institutions. Author of 6 critically acclaimed books and 75+ peer-reviewed articles on 19th and 20th century European politics. Fellow of the British Academy and recipient of multiple research grants totaling £2.5M. Supervised 45 PhD candidates to successful completion. Dedicated to fostering critical thinking, historical methodology, and public engagement with historical scholarship.',
            experiences: [
                { id: '1', company: 'University of Oxford', position: 'Professor of Modern History', startDate: '2015-09', endDate: 'Present', current: true, description: 'Chair of the History Faculty (2020-2023). Teaching undergraduate and graduate courses on European political history. Leading research group of 12 scholars on EU integration history project funded by ERC.', achievements: ['Published 2 monographs with Oxford University Press', 'Secured €1.5M ERC Advanced Grant', 'Supervised 15 PhD completions'] },
                { id: '2', company: 'University of Cambridge', position: 'Reader in European History', startDate: '2008-09', endDate: '2015-08', current: false, description: 'Taught courses on modern European history at undergraduate and MPhil level. Served as Director of Graduate Studies for the History Faculty. Established the Cambridge European History Seminar series.', achievements: ['Awarded Pilkington Teaching Prize', 'Published 35 peer-reviewed articles', 'External examiner for 20+ PhD theses'] },
                { id: '3', company: 'London School of Economics', position: 'Lecturer in International History', startDate: '2003-09', endDate: '2008-08', current: false, description: 'Developed new course on Cold War Europe. Contributed to interdisciplinary European Studies programme. Active member of IDEAS research centre.', achievements: ['Teaching Excellence Award 2007', 'Co-authored textbook used in 50+ universities'] }
            ],
            education: [
                { id: '1', institution: 'University of Cambridge', degree: 'Doctor of Philosophy (PhD) in History', graduationYear: '2003', field: 'Modern European History', startDate: '1999', endDate: '2003', current: false, description: 'Dissertation: "The Politics of Memory in Post-War Germany, 1945-1990" | Supervisor: Prof. Richard Evans' },
                { id: '2', institution: 'Harvard University', degree: 'Master of Arts in History', graduationYear: '1999', field: 'European History', startDate: '1997', endDate: '1999', current: false, description: 'Kennedy Scholar | Thesis on Franco-German Relations' },
                { id: '3', institution: 'University of Edinburgh', degree: 'Master of Arts (Hons) in History', graduationYear: '1997', field: 'History and Politics', startDate: '1993', endDate: '1997', current: false, description: 'First Class Honours | University Medal for Best Dissertation' }
            ],
            skills: [
                { id: '1', name: 'Historical Research', level: 100, category: 'technical' },
                { id: '2', name: 'Academic Writing', level: 98, category: 'technical' },
                { id: '3', name: 'Archival Research', level: 95, category: 'technical' },
                { id: '4', name: 'Public Speaking', level: 96, category: 'soft' },
                { id: '5', name: 'Curriculum Development', level: 92, category: 'technical' },
                { id: '6', name: 'PhD Supervision', level: 95, category: 'soft' },
                { id: '7', name: 'Grant Writing', level: 90, category: 'technical' },
                { id: '8', name: 'Peer Review', level: 94, category: 'technical' },
                { id: '9', name: 'Digital Humanities', level: 75, category: 'technical' },
                { id: '10', name: 'Media Engagement', level: 85, category: 'soft' },
                { id: '11', name: 'Conference Organization', level: 88, category: 'soft' },
                { id: '12', name: 'Editorial Leadership', level: 90, category: 'soft' }
            ],
            languages: [
                { id: '1', name: 'English', proficiency: 'native' },
                { id: '2', name: 'German', proficiency: 'fluent' },
                { id: '3', name: 'French', proficiency: 'fluent' },
                { id: '4', name: 'Italian', proficiency: 'conversational' }
            ],
            template: 'academic-professor',
            contentLanguage: 'en',
            metadata: { version: 1, createdAt: '', updatedAt: '', lastAutoSave: '' }
        }
    },
    // 4. Creative Designer
    {
        id: 'creative-designer',
        name: { en: 'Creative Designer', fr: 'Designer Créatif', ar: 'المصمم المبدع' },
        description: {
            en: 'Vibrant, portfolio-ready layout with unique typography and spacing.',
            fr: 'Mise en page dynamique prête pour le portfolio avec typographie et espacement uniques.',
            ar: 'تصميم حيوي جاهز لعرض البورتفوليو مع خطوط ومسافات فريدة.'
        },
        atsScore: 85,
        photoPosition: PhotoPosition.TOP_RIGHT,
        tags: ['creative', 'designer', 'art', 'graphic', 'ui/ux'],
        design: {
            layout: 'creative',
            colors: { primary: '#db2777', secondary: '#be185d', accent: '#f472b6', background: '#fff1f2', text: '#1f2937' },
            typography: { headingFont: 'Montserrat', fontFamily: 'Lato', fontSize: '14px' },
            spacing: 'spacious'
        },
        imageOptions: {
            position: PhotoPosition.TOP_RIGHT,
            style: PhotoStyle.CREATIVE,
            width: 150,
            height: 150,
            enhancementEffects: ['background-removal']
        },
        exampleData: {
            personalInfo: {
                fullName: 'Lena Rossi',
                email: 'lena@lenarossidesign.com',
                phone: '+39 333 1234567',
                address: 'Milan, Italy',
                profession: 'Senior UI/UX Designer & Art Director',
                linkedin: 'linkedin.com/in/lenadesign',
                github: 'dribbble.com/lenadesign',
                photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face'
            },
            summary: 'Award-winning UI/UX Designer and Art Director with 8+ years of experience crafting intuitive digital experiences for Fortune 500 companies and innovative startups. Expert in design systems, user research, and creative direction. Led design teams of 15+ creatives and delivered products used by 10M+ users globally. Passionate about bridging aesthetics with functionality and mentoring the next generation of designers. Featured in Awwwards, CSS Design Awards, and Communication Arts.',
            experiences: [
                { id: '1', company: 'Google', position: 'Senior UX Designer', startDate: '2021-03', endDate: 'Present', current: true, description: 'Leading UX design for Google Workspace mobile applications serving 3B+ users. Established design system components adopted across 12 product teams. Conducting user research and usability testing with diverse global audiences.', achievements: ['Increased user engagement by 40%', 'Design Excellence Award 2022', 'Shipped 3 major product redesigns'] },
                { id: '2', company: 'Spotify', position: 'Product Designer', startDate: '2018-06', endDate: '2021-02', current: false, description: 'Designed features for Spotify\'s premium subscription experience. Led the redesign of the artist profile pages and concert discovery features. Collaborated closely with engineers, product managers, and data scientists.', achievements: ['Increased premium conversions by 25%', 'Featured on Awwwards SOTD', 'Mentored 5 junior designers'] },
                { id: '3', company: 'Freelance', position: 'UI/UX Designer & Brand Consultant', startDate: '2015-01', endDate: '2018-05', current: false, description: 'Provided design and branding services for 40+ clients including startups, agencies, and established brands. Specialized in mobile app design, visual identity systems, and interactive prototyping.', achievements: ['Built portfolio of 50+ successful projects', 'Clients included Nike, Airbnb, WeWork'] }
            ],
            education: [
                { id: '1', institution: 'Politecnico di Milano', degree: 'Master of Arts in Digital Experience Design', graduationYear: '2015', field: 'Interaction Design', startDate: '2013', endDate: '2015', current: false, description: 'Thesis on Emotional Design in Mobile Interfaces | Graduated with Honors' },
                { id: '2', institution: 'Istituto Europeo di Design (IED)', degree: 'Bachelor in Graphic Design', graduationYear: '2013', field: 'Visual Communication', startDate: '2010', endDate: '2013', current: false, description: 'Focus on Typography and Brand Identity | Student Excellence Award' }
            ],
            skills: [
                { id: '1', name: 'Figma', level: 98, category: 'technical' },
                { id: '2', name: 'Adobe Creative Suite', level: 95, category: 'technical' },
                { id: '3', name: 'Sketch', level: 92, category: 'technical' },
                { id: '4', name: 'Prototyping (Principle, Framer)', level: 90, category: 'technical' },
                { id: '5', name: 'Design Systems', level: 95, category: 'technical' },
                { id: '6', name: 'User Research', level: 88, category: 'technical' },
                { id: '7', name: 'Usability Testing', level: 85, category: 'technical' },
                { id: '8', name: 'HTML/CSS', level: 75, category: 'technical' },
                { id: '9', name: 'Creative Direction', level: 92, category: 'soft' },
                { id: '10', name: 'Team Leadership', level: 88, category: 'soft' },
                { id: '11', name: 'Client Presentation', level: 95, category: 'soft' },
                { id: '12', name: 'Visual Storytelling', level: 96, category: 'soft' }
            ],
            languages: [
                { id: '1', name: 'Italian', proficiency: 'native' },
                { id: '2', name: 'English', proficiency: 'fluent' },
                { id: '3', name: 'French', proficiency: 'conversational' }
            ],
            template: 'creative-designer',
            contentLanguage: 'en',
            metadata: { version: 1, createdAt: '', updatedAt: '', lastAutoSave: '' }
        }
    },
    // 5. Executive Manager
    {
        id: 'executive-manager',
        name: { en: 'Executive Manager', fr: 'Cadre Dirigeant', ar: 'المدير التنفيذي' },
        description: {
            en: 'Professional, text-heavy layout emphasizing leadership and strategy.',
            fr: 'Mise en page professionnelle riche en texte mettant l’accent sur le leadership et la stratégie.',
            ar: 'تصميم احترافي يركز على النص، القيادة، والاستراتيجية.'
        },
        atsScore: 99,
        photoPosition: PhotoPosition.NO_PHOTO,
        tags: ['executive', 'manager', 'ceo', 'business', 'leadership'],
        design: {
            layout: 'executive',
            colors: { primary: '#1a365d', secondary: '#2d3748', accent: '#d69e2e', background: '#ffffff', text: '#000000' },
            typography: { headingFont: 'Georgia', fontFamily: 'Arial', fontSize: '14px' },
            spacing: 'compact'
        },
        imageOptions: {
            position: PhotoPosition.NO_PHOTO,
            style: PhotoStyle.MINIMAL,
            width: 0,
            height: 0,
            enhancementEffects: []
        },
        exampleData: {
            personalInfo: {
                fullName: 'Robert Sterling',
                email: 'robert.sterling@globalcorp.com',
                phone: '+1 212 555 7890',
                address: 'New York, NY, USA',
                profession: 'Chief Operating Officer',
                linkedin: 'linkedin.com/in/rsterling'
            },
            summary: 'Results-driven C-suite executive with 18+ years of experience scaling global operations and driving sustainable revenue growth. Proven track record of transforming organizations, optimizing processes, and building high-performance teams of 500+ employees across 12 countries. Delivered $150M+ in cost savings through strategic initiatives. Board member and advisor to multiple Fortune 500 companies. Expert in digital transformation, M&A integration, and operational excellence.',
            experiences: [
                { id: '1', company: 'Global Tech Corporation', position: 'Chief Operating Officer', startDate: '2018-06', endDate: 'Present', current: true, description: 'Overseeing daily operations for $2.5B revenue organization with 3,500 employees across 15 countries. Reporting directly to CEO and serving on Executive Leadership Team. Led digital transformation initiative resulting in 45% efficiency gains.', achievements: ['Increased revenue by 250% over 5 years', 'Expanded operations to 8 new markets', 'Reduced operational costs by $50M annually', 'Achieved 98% employee retention rate'] },
                { id: '2', company: 'Sterling Enterprises', position: 'Vice President of Operations', startDate: '2014-03', endDate: '2018-05', current: false, description: 'Managed end-to-end supply chain operations and logistics for North American division. Led team of 200+ operations professionals. Implemented Lean Six Sigma methodologies across all manufacturing facilities.', achievements: ['Reduced lead times by 40%', 'Achieved ISO 9001 certification', 'Saved $25M through vendor consolidation'] },
                { id: '3', company: 'McKinsey & Company', position: 'Senior Consultant, Operations Practice', startDate: '2010-09', endDate: '2014-02', current: false, description: 'Advised Fortune 500 clients on operational strategy, supply chain optimization, and organizational transformation. Led cross-functional teams on complex engagements across multiple industries.', achievements: ['Managed 30+ client engagements', 'Generated $15M in new business', 'Promoted to Senior Consultant in 2 years'] },
                { id: '4', company: 'Goldman Sachs', position: 'Investment Banking Analyst', startDate: '2008-07', endDate: '2010-08', current: false, description: 'Executed M&A transactions and capital raising for industrial clients. Performed financial modeling, due diligence, and valuation analyses for deals totaling $5B+.', achievements: ['Closed 8 M&A transactions', 'Analyst of the Year 2009'] }
            ],
            education: [
                { id: '1', institution: 'Harvard Business School', degree: 'Master of Business Administration (MBA)', graduationYear: '2010', field: 'General Management', startDate: '2008', endDate: '2010', current: false, description: 'Baker Scholar (Top 5%) | Focus on Strategy and Operations | HBS Leadership Fellow' },
                { id: '2', institution: 'Princeton University', degree: 'Bachelor of Science in Economics', graduationYear: '2006', field: 'Economics', startDate: '2002', endDate: '2006', current: false, description: 'Magna Cum Laude | Varsity Track & Field Captain | Phi Beta Kappa' }
            ],
            skills: [
                { id: '1', name: 'Strategic Planning', level: 98, category: 'soft' },
                { id: '2', name: 'Operational Excellence', level: 96, category: 'technical' },
                { id: '3', name: 'P&L Management', level: 95, category: 'technical' },
                { id: '4', name: 'M&A Integration', level: 92, category: 'technical' },
                { id: '5', name: 'Digital Transformation', level: 90, category: 'technical' },
                { id: '6', name: 'Executive Leadership', level: 98, category: 'soft' },
                { id: '7', name: 'Board Relations', level: 88, category: 'soft' },
                { id: '8', name: 'Change Management', level: 94, category: 'soft' },
                { id: '9', name: 'Supply Chain Optimization', level: 92, category: 'technical' },
                { id: '10', name: 'Financial Analysis', level: 90, category: 'technical' },
                { id: '11', name: 'Team Building', level: 95, category: 'soft' },
                { id: '12', name: 'Public Speaking', level: 92, category: 'soft' }
            ],
            languages: [
                { id: '1', name: 'English', proficiency: 'native' },
                { id: '2', name: 'Spanish', proficiency: 'fluent' },
                { id: '3', name: 'French', proficiency: 'conversational' }
            ],
            template: 'executive-manager',
            contentLanguage: 'en',
            metadata: { version: 1, createdAt: '', updatedAt: '', lastAutoSave: '' }
        }
    },
    // 6. Professional Chef
    {
        id: 'professional-chef',
        name: { en: 'Professional Chef', fr: 'Chef Professionnel', ar: 'الشيف المحترف' },
        description: {
            en: 'Warm, inviting layout with sidebar photo, perfect for culinary arts.',
            fr: 'Mise en page chaleureuse et accueillante avec photo latérale, parfaite pour les arts culinaires.',
            ar: 'تصميم دافئ وجذاب مع صورة جانبية، مثالي لفنون الطهي.'
        },
        atsScore: 88,
        photoPosition: PhotoPosition.LEFT_SIDEBAR,
        tags: ['chef', 'culinary', 'food', 'hospitality', 'cook'],
        design: {
            layout: 'creative',
            colors: { primary: '#92400e', secondary: '#78350f', accent: '#f59e0b', background: '#fffbeb', text: '#451a03' },
            typography: { headingFont: 'Lora', fontFamily: 'Lato', fontSize: '14px' },
            spacing: 'normal'
        },
        imageOptions: {
            position: PhotoPosition.LEFT_SIDEBAR,
            style: PhotoStyle.SQUARE,
            width: 180,
            height: 180,
            enhancementEffects: ['professional-lighting']
        },
        exampleData: {
            personalInfo: {
                fullName: 'Marco Pierre Laurent',
                email: 'chef.marco@lepetitbistro.fr',
                phone: '+33 6 12 34 56 78',
                address: 'Paris, France',
                profession: 'Executive Chef & Culinary Director',
                linkedin: 'linkedin.com/in/chefmarco',
                photoUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&h=200&fit=crop&crop=face'
            },
            summary: 'Award-winning Executive Chef with 15+ years of experience in fine dining and culinary innovation. Michelin-starred restaurateur with expertise in French haute cuisine, Mediterranean flavors, and farm-to-table philosophy. Trained under legendary chefs including Alain Ducasse and Gordon Ramsay. Led kitchen brigades of 30+ cooks. Passionate about sustainable sourcing, menu innovation, and creating unforgettable dining experiences.',
            experiences: [
                { id: '1', company: 'Le Petit Bistro Paris', position: 'Executive Chef & Owner', startDate: '2017-03', endDate: 'Present', current: true, description: 'Owner and culinary director of 2-Michelin star restaurant serving 80 covers nightly. Designing seasonal menus showcasing modern French cuisine. Managing all kitchen operations, supplier relationships, and staff development.', achievements: ['Awarded 2 Michelin Stars (2019, 2021)', 'Featured in World\'s 50 Best Restaurants', 'Reduced food waste by 40%', 'Trained 12 sous chefs'] },
                { id: '2', company: 'The Dorchester, London', position: 'Head Chef - Alain Ducasse', startDate: '2013-06', endDate: '2017-02', current: false, description: 'Head Chef at the 3-Michelin star restaurant under Chef Alain Ducasse. Oversaw a brigade of 25 cooks. Developed signature dishes featured on the tasting menu. Ensured consistency across all service periods.', achievements: ['Maintained 3-Michelin star rating', 'Created 15 signature dishes', 'Promoted from Sous Chef in 18 months'] },
                { id: '3', company: 'Restaurant Gordon Ramsay, Chelsea', position: 'Sous Chef', startDate: '2010-01', endDate: '2013-05', current: false, description: 'Sous Chef at the flagship Gordon Ramsay restaurant. Responsible for fish and sauce sections. Trained apprentice cooks and maintained kitchen standards during high-pressure services.', achievements: ['Learned classical French techniques', 'Managed team of 8 cooks'] }
            ],
            education: [
                { id: '1', institution: 'Le Cordon Bleu Paris', degree: 'Grand Diplôme in Cuisine & Pastry', graduationYear: '2010', field: 'Culinary Arts', startDate: '2008', endDate: '2010', current: false, description: 'Top of the class | Specialized in French Haute Cuisine | Pastry Excellence Award' },
                { id: '2', institution: 'Institut Paul Bocuse', degree: 'Bachelor in Culinary Arts Management', graduationYear: '2008', field: 'Hospitality Management', startDate: '2005', endDate: '2008', current: false, description: 'Focus on restaurant management and culinary innovation' }
            ],
            skills: [
                { id: '1', name: 'French Haute Cuisine', level: 98, category: 'technical' },
                { id: '2', name: 'Menu Development', level: 96, category: 'technical' },
                { id: '3', name: 'Kitchen Management', level: 95, category: 'technical' },
                { id: '4', name: 'Food Costing', level: 92, category: 'technical' },
                { id: '5', name: 'Pastry Arts', level: 88, category: 'technical' },
                { id: '6', name: 'Wine Pairing', level: 90, category: 'technical' },
                { id: '7', name: 'Sustainable Sourcing', level: 92, category: 'technical' },
                { id: '8', name: 'Staff Training', level: 94, category: 'soft' },
                { id: '9', name: 'Food Photography', level: 80, category: 'technical' },
                { id: '10', name: 'Crisis Management', level: 88, category: 'soft' }
            ],
            languages: [
                { id: '1', name: 'French', proficiency: 'native' },
                { id: '2', name: 'English', proficiency: 'fluent' },
                { id: '3', name: 'Italian', proficiency: 'conversational' },
                { id: '4', name: 'Spanish', proficiency: 'basic' }
            ],
            template: 'professional-chef',
            contentLanguage: 'en',
            metadata: { version: 1, createdAt: '', updatedAt: '', lastAutoSave: '' }
        }
    },
    // 7. Research Scientist
    {
        id: 'research-scientist',
        name: { en: 'Research Scientist', fr: 'Chercheur Scientifique', ar: 'الباحث العلمي' },
        description: {
            en: 'Minimalist layout with small photo, focusing on extensive data and accuracy.',
            fr: 'Mise en page minimaliste avec petite photo, axée sur des données étendues et la précision.',
            ar: 'تصميم بسيط مع صورة صغيرة، يركز على البيانات الدقيقة والشاملة.'
        },
        atsScore: 97,
        photoPosition: PhotoPosition.MINIMAL,
        tags: ['science', 'research', 'biology', 'chemistry', 'lab'],
        design: {
            layout: 'technical',
            colors: { primary: '#0891b2', secondary: '#0e7490', accent: '#22d3ee', background: '#ecfeff', text: '#164e63' },
            typography: { headingFont: 'Roboto Mono', fontFamily: 'Inter', fontSize: '12px' },
            spacing: 'compact'
        },
        imageOptions: {
            position: PhotoPosition.TOP_RIGHT,
            style: PhotoStyle.MINIMAL,
            width: 80,
            height: 80,
            enhancementEffects: []
        },
        exampleData: {
            personalInfo: {
                fullName: 'Dr. Emily Carter',
                email: 'emily.carter@mit.edu',
                phone: '+1 617 555 1234',
                address: 'Cambridge, MA, USA',
                profession: 'Principal Research Scientist',
                linkedin: 'linkedin.com/in/ecarterphd'
            },
            summary: 'NIH-funded Principal Research Scientist with 12+ years of experience in immunology, vaccine development, and infectious disease research. Published 45+ peer-reviewed articles in Nature, Science, and Cell with h-index of 32. Led a team of 8 researchers securing $5M+ in grant funding. Expert in CRISPR gene editing, flow cytometry, and computational immunology. Dedicated to translating laboratory discoveries into clinical applications.',
            experiences: [
                { id: '1', company: 'Massachusetts Institute of Technology (MIT)', position: 'Principal Research Scientist', startDate: '2020-01', endDate: 'Present', current: true, description: 'Leading a laboratory of 8 researchers focused on next-generation mRNA vaccine platforms. Managing $2.5M annual research budget. Collaborating with pharmaceutical partners on clinical translation of discoveries.', achievements: ['Published 12 papers in top-tier journals', 'Secured NIH R01 grant ($1.8M)', 'Co-inventor on 3 patents', 'Mentored 5 PhD students'] },
                { id: '2', company: 'BioTech Innovations Inc.', position: 'Senior Research Scientist', startDate: '2016-06', endDate: '2019-12', current: false, description: 'Led vaccine development team for emerging infectious diseases. Designed and executed Phase 1/2 clinical trials. Developed novel lipid nanoparticle delivery systems for mRNA therapeutics.', achievements: ['Advanced 2 candidates to clinical trials', '15 peer-reviewed publications', 'R&D Excellence Award 2018'] },
                { id: '3', company: 'Stanford University School of Medicine', position: 'Postdoctoral Fellow', startDate: '2013-07', endDate: '2016-05', current: false, description: 'Conducted research on T-cell immunology and autoimmune diseases under Professor Mark Davis. Developed novel assay methods for detecting antigen-specific T cells.', achievements: ['Published in Nature Immunology', 'Damon Runyon Postdoctoral Fellowship'] }
            ],
            education: [
                { id: '1', institution: 'Stanford University', degree: 'Doctor of Philosophy (PhD) in Immunology', graduationYear: '2013', field: 'Immunology', startDate: '2008', endDate: '2013', current: false, description: 'Dissertation: "Mechanisms of T Cell Memory Formation" | Advisor: Dr. Mark Davis | Graduate Research Fellowship' },
                { id: '2', institution: 'Harvard University', degree: 'Bachelor of Science in Molecular Biology', graduationYear: '2008', field: 'Molecular Biology', startDate: '2004', endDate: '2008', current: false, description: 'Summa Cum Laude | Phi Beta Kappa | Undergraduate Research Award' }
            ],
            skills: [
                { id: '1', name: 'CRISPR Gene Editing', level: 95, category: 'technical' },
                { id: '2', name: 'Flow Cytometry', level: 98, category: 'technical' },
                { id: '3', name: 'mRNA Vaccine Design', level: 92, category: 'technical' },
                { id: '4', name: 'PCR/qPCR', level: 96, category: 'technical' },
                { id: '5', name: 'Bioinformatics (R, Python)', level: 88, category: 'technical' },
                { id: '6', name: 'Scientific Writing', level: 95, category: 'technical' },
                { id: '7', name: 'Grant Writing', level: 90, category: 'technical' },
                { id: '8', name: 'Cell Culture', level: 98, category: 'technical' },
                { id: '9', name: 'Western Blotting', level: 94, category: 'technical' },
                { id: '10', name: 'Team Leadership', level: 88, category: 'soft' },
                { id: '11', name: 'Data Analysis (GraphPad, Prism)', level: 95, category: 'technical' },
                { id: '12', name: 'Scientific Presentation', level: 92, category: 'soft' }
            ],
            languages: [
                { id: '1', name: 'English', proficiency: 'native' },
                { id: '2', name: 'German', proficiency: 'conversational' }
            ],
            template: 'research-scientist',
            contentLanguage: 'en',
            metadata: { version: 1, createdAt: '', updatedAt: '', lastAutoSave: '' }
        }
    },
    // 8. HR Manager
    {
        id: 'hr-manager',
        name: { en: 'HR Manager', fr: 'Responsable RH', ar: 'مدير الموارد البشرية' },
        description: {
            en: 'Approachable, rounded photo design emphasizing people skills and organization.',
            fr: 'Design accessible avec photo arrondie mettant l’accent sur les compétences relationnelles et l’organisation.',
            ar: 'تصميم ودود مع صورة دائرية يركز على مهارات التواصل والتنظيم.'
        },
        atsScore: 94,
        photoPosition: PhotoPosition.CIRCULAR,
        tags: ['hr', 'manager', 'human resources', 'recruitment', 'people'],
        design: {
            layout: 'modern',
            colors: { primary: '#7e22ce', secondary: '#6b21a8', accent: '#a855f7', background: '#faf5ff', text: '#3b0764' },
            typography: { headingFont: 'Lato', fontFamily: 'Open Sans', fontSize: '14px' },
            spacing: 'normal'
        },
        imageOptions: {
            position: PhotoPosition.TOP_LEFT,
            style: PhotoStyle.ROUNDED,
            width: 130,
            height: 130,
            enhancementEffects: ['professional-lighting']
        },
        exampleData: {
            personalInfo: {
                fullName: 'Sarah Jenkins',
                email: 'sarah.jenkins@globalhr.com',
                phone: '+44 7700 900900',
                address: 'Manchester, United Kingdom',
                profession: 'Senior HR Director',
                linkedin: 'linkedin.com/in/sarahjenkins',
                photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face'
            },
            summary: 'Strategic HR Director with 14+ years of experience transforming human capital operations for FTSE 100 companies. CIPD Chartered Fellow with expertise in talent acquisition, employee engagement, and organizational development. Led HR transformation programs impacting 5,000+ employees across 8 countries. Reduced turnover by 35% and improved employee satisfaction scores by 40%. Passionate about building inclusive, high-performance cultures.',
            experiences: [
                { id: '1', company: 'GlobalTech Solutions', position: 'HR Director', startDate: '2019-03', endDate: 'Present', current: true, description: 'Leading HR strategy for 2,500-employee technology company operating in 12 countries. Oversee talent acquisition, L&D, compensation, and employee relations. Partnering with C-suite to align HR initiatives with business objectives.', achievements: ['Reduced time-to-hire by 45%', 'Implemented DEI program reaching 98% employee participation', 'Launched leadership development program for 200 managers', 'Reduced attrition from 22% to 14%'] },
                { id: '2', company: 'Barclays Bank', position: 'Senior HR Business Partner', startDate: '2015-06', endDate: '2019-02', current: false, description: 'HR Business Partner for Investment Banking division with 1,200 employees. Led workforce restructuring and change management programs. Designed performance management framework aligned with regulatory requirements.', achievements: ['Managed £5M training budget', 'Led redundancy program with 100% compliance', 'Improved engagement scores by 25%'] },
                { id: '3', company: 'KPMG UK', position: 'HR Manager - Recruitment', startDate: '2011-09', endDate: '2015-05', current: false, description: 'Managed graduate and experienced hire recruitment across audit and tax practices. Built relationships with 25 target universities. Designed and delivered assessment center methodology.', achievements: ['Hired 500+ graduates over 4 years', 'Reduced cost-per-hire by 30%', 'Achieved 92% offer acceptance rate'] }
            ],
            education: [
                { id: '1', institution: 'University of Manchester', degree: 'MSc Human Resource Management', graduationYear: '2011', field: 'Human Resources', startDate: '2010', endDate: '2011', current: false, description: 'Distinction | CIPD Advanced Diploma | Dissertation on Employee Engagement' },
                { id: '2', institution: 'University of Leeds', degree: 'BA (Hons) Business Management', graduationYear: '2009', field: 'Business', startDate: '2006', endDate: '2009', current: false, description: 'First Class Honours | President of Business Society' }
            ],
            skills: [
                { id: '1', name: 'Talent Acquisition', level: 98, category: 'technical' },
                { id: '2', name: 'Employee Relations', level: 95, category: 'technical' },
                { id: '3', name: 'Performance Management', level: 94, category: 'technical' },
                { id: '4', name: 'Compensation & Benefits', level: 90, category: 'technical' },
                { id: '5', name: 'HRIS (Workday, SAP)', level: 88, category: 'technical' },
                { id: '6', name: 'Employment Law', level: 92, category: 'technical' },
                { id: '7', name: 'Change Management', level: 90, category: 'soft' },
                { id: '8', name: 'Conflict Resolution', level: 95, category: 'soft' },
                { id: '9', name: 'Leadership Development', level: 92, category: 'soft' },
                { id: '10', name: 'DEI Strategy', level: 88, category: 'soft' },
                { id: '11', name: 'HR Analytics', level: 85, category: 'technical' },
                { id: '12', name: 'Stakeholder Management', level: 95, category: 'soft' }
            ],
            languages: [
                { id: '1', name: 'English', proficiency: 'native' },
                { id: '2', name: 'French', proficiency: 'conversational' }
            ],
            template: 'hr-manager',
            contentLanguage: 'en',
            metadata: { version: 1, createdAt: '', updatedAt: '', lastAutoSave: '' }
        }
    },
    // 9. Civil Engineer
    {
        id: 'civil-engineer',
        name: { en: 'Civil Engineer', fr: 'Ingénieur Civil', ar: 'مهندس مدني' },
        description: {
            en: 'Structural layout with technical aesthetics, suitable for engineering projects.',
            fr: 'Mise en page structurée avec esthétique technique, adaptée aux projets d’ingénierie.',
            ar: 'تصميم هيكلي مع جماليات تقنية، مناسب للمشاريع الهندسية.'
        },
        atsScore: 96,
        photoPosition: PhotoPosition.TOP_LEFT,
        tags: ['engineering', 'civil', 'construction', 'structural', 'architect'],
        design: {
            layout: 'technical',
            colors: { primary: '#1e3a8a', secondary: '#172554', accent: '#3b82f6', background: '#eff6ff', text: '#172554' },
            typography: { headingFont: 'Oswald', fontFamily: 'Roboto', fontSize: '13px' },
            spacing: 'compact'
        },
        imageOptions: {
            position: PhotoPosition.TOP_LEFT,
            style: PhotoStyle.CLASSIC,
            width: 140,
            height: 160, // Portrait
            enhancementEffects: []
        },
        exampleData: {
            personalInfo: {
                fullName: 'Eng. Ahmed Hassan Mohamed',
                email: 'ahmed.hassan@arabengineers.com',
                phone: '+20 100 123 4567',
                address: 'Cairo, Egypt',
                profession: 'Senior Civil & Structural Engineer',
                linkedin: 'linkedin.com/in/engahmed'
            },
            summary: 'Licensed Professional Engineer (PE) with 12+ years of experience in structural design, project management, and infrastructure development. Successfully delivered $500M+ in construction projects including high-rise buildings, bridges, and industrial facilities across MENA region. Expert in BIM workflows, seismic design, and sustainable construction practices. Managed multidisciplinary teams of 40+ engineers and technicians.',
            experiences: [
                { id: '1', company: 'Arab Contractors (Osman Ahmed Osman)', position: 'Senior Structural Engineer', startDate: '2018-01', endDate: 'Present', current: true, description: 'Leading structural design for mega projects including 50-story commercial towers and metro stations. Managing team of 15 structural engineers. Coordinating with architects, MEP engineers, and contractors on integrated project delivery.', achievements: ['Delivered $200M high-rise on time and under budget', 'Implemented BIM reducing RFIs by 60%', 'Mentored 10 junior engineers', 'Zero safety incidents over 3 years'] },
                { id: '2', company: 'Dar Al-Handasah (Shair & Partners)', position: 'Structural Engineer', startDate: '2014-06', endDate: '2017-12', current: false, description: 'Designed reinforced concrete and steel structures for commercial, residential, and industrial projects. Performed structural analysis using ETABS, SAP2000, and SAFE. Prepared detailed design drawings and specifications.', achievements: ['Designed 15+ buildings exceeding 20 stories', 'Led seismic retrofit of historical structures', 'Published paper on innovative foundation systems'] },
                { id: '3', company: 'AECOM Middle East', position: 'Junior Structural Engineer', startDate: '2012-07', endDate: '2014-05', current: false, description: 'Assisted senior engineers in structural analysis and design. Prepared shop drawings and coordinated with fabricators. Conducted site inspections and quality control.', achievements: ['Promoted from Graduate to Junior Engineer in 1 year', 'Completed LEED Green Associate certification'] }
            ],
            education: [
                { id: '1', institution: 'Cairo University - Faculty of Engineering', degree: 'Master of Science in Structural Engineering', graduationYear: '2016', field: 'Structural Engineering', startDate: '2014', endDate: '2016', current: false, description: 'Thesis: "Seismic Performance of High-Rise Buildings in Egypt" | GPA: 3.8/4.0' },
                { id: '2', institution: 'Cairo University - Faculty of Engineering', degree: 'Bachelor of Science in Civil Engineering', graduationYear: '2012', field: 'Civil Engineering', startDate: '2007', endDate: '2012', current: false, description: 'Graduated Top 5% | Dean\'s Honor List | Best Graduation Project Award' }
            ],
            skills: [
                { id: '1', name: 'AutoCAD / Civil 3D', level: 96, category: 'technical' },
                { id: '2', name: 'Revit Structure', level: 94, category: 'technical' },
                { id: '3', name: 'ETABS / SAP2000', level: 95, category: 'technical' },
                { id: '4', name: 'SAFE / STAAD Pro', level: 92, category: 'technical' },
                { id: '5', name: 'Structural Analysis', level: 96, category: 'technical' },
                { id: '6', name: 'Reinforced Concrete Design', level: 94, category: 'technical' },
                { id: '7', name: 'Steel Structure Design', level: 90, category: 'technical' },
                { id: '8', name: 'Foundation Engineering', level: 88, category: 'technical' },
                { id: '9', name: 'Project Management', level: 85, category: 'soft' },
                { id: '10', name: 'BIM Coordination', level: 90, category: 'technical' },
                { id: '11', name: 'Construction Supervision', level: 88, category: 'technical' },
                { id: '12', name: 'Team Leadership', level: 86, category: 'soft' }
            ],
            languages: [
                { id: '1', name: 'Arabic', proficiency: 'native' },
                { id: '2', name: 'English', proficiency: 'fluent' },
                { id: '3', name: 'French', proficiency: 'basic' }
            ],
            template: 'civil-engineer',
            contentLanguage: 'en',
            metadata: { version: 1, createdAt: '', updatedAt: '', lastAutoSave: '' }
        }
    },
    // 10. Artist / Musician
    {
        id: 'artist-musician',
        name: { en: 'Artist / Musician', fr: 'Artiste / Musicien', ar: 'فنان / موسيقي' },
        description: {
            en: 'Expressive layout with creative freedom, center stage photo.',
            fr: 'Mise en page expressive avec liberté créative, photo au centre de la scène.',
            ar: 'تصميم تعبيري مع حرية إبداعية، وصورة في المنتصف.'
        },
        atsScore: 80, // Lower ATS score for creative templates usually
        photoPosition: PhotoPosition.CENTER,
        tags: ['artist', 'musician', 'creative', 'music', 'art'],
        design: {
            layout: 'creative',
            colors: { primary: '#c026d3', secondary: '#a21caf', accent: '#e879f9', background: '#18181b', text: '#f4f4f5' }, // Dark theme default?
            typography: { headingFont: 'Dancing Script', fontFamily: 'Raleway', fontSize: '15px' },
            spacing: 'spacious'
        },
        imageOptions: {
            position: PhotoPosition.CENTER,
            style: PhotoStyle.CREATIVE,
            width: 160,
            height: 160,
            enhancementEffects: ['professional-lighting', 'background-removal']
        },
        exampleData: {
            personalInfo: {
                fullName: 'Luna Melody Castellanos',
                email: 'hello@lunamelody.com',
                phone: '+1 323 555 0199',
                address: 'Los Angeles, CA, USA',
                profession: 'Concert Violinist & Recording Artist',
                linkedin: 'linkedin.com/in/luna-music',
                photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face'
            },
            summary: 'Grammy-nominated concert violinist and recording artist with 15+ years of performance experience. Principal positions with LA Philharmonic and guest soloist appearances with Berlin Philharmonic, Vienna Symphony, and NHK Symphony Orchestra. Recorded on 50+ film scores including 3 Academy Award-winning soundtracks. Passionate about bridging classical and contemporary music, reaching new audiences through innovative cross-genre collaborations. Instagram following of 2M+ music enthusiasts.',
            experiences: [
                { id: '1', company: 'Los Angeles Philharmonic', position: 'Associate Concertmaster', startDate: '2018-09', endDate: 'Present', current: true, description: 'Second chair violin performing 100+ concerts annually at Walt Disney Concert Hall. Soloist for concerto performances. Mentoring young artists through LA Phil fellowship program.', achievements: ['Performed 8 world premieres', 'Soloist in Brahms Violin Concerto', 'Featured on 5 Grammy-nominated recordings'] },
                { id: '2', company: 'Hollywood Studios (Freelance)', position: 'Session Musician & Soloist', startDate: '2014-01', endDate: 'Present', current: true, description: 'Recording solo violin parts for major film and television productions. Worked with composers including Hans Zimmer, John Williams, and Hildur Guðnadóttir. Featured soloist on 50+ soundtracks.', achievements: ['3 Academy Award-winning score contributions', 'Solo on Succession (HBO) theme', 'Live with Hans Zimmer World Tour'] },
                { id: '3', company: 'Berlin Philharmonic', position: 'Guest Principal Violin', startDate: '2016-06', endDate: '2018-08', current: false, description: 'Guest principal positions during international tours. Performed chamber music series at Philharmonie Berlin. Collaborated with conductors including Sir Simon Rattle and Kirill Petrenko.', achievements: ['Toured 15 countries', 'Featured in Deutsche Grammophon recordings'] }
            ],
            education: [
                { id: '1', institution: 'The Juilliard School', degree: 'Master of Music in Violin Performance', graduationYear: '2014', field: 'Violin Performance', startDate: '2012', endDate: '2014', current: false, description: 'Studied with Itzhak Perlman | John Erskine Prize for Outstanding Achievement | Full Scholarship' },
                { id: '2', institution: 'Curtis Institute of Music', degree: 'Bachelor of Music in Violin', graduationYear: '2012', field: 'Violin Performance', startDate: '2008', endDate: '2012', current: false, description: 'Full tuition scholarship | Student of Pamela Frank | Chamber Music Award' }
            ],
            skills: [
                { id: '1', name: 'Violin Performance', level: 99, category: 'technical' },
                { id: '2', name: 'Chamber Music', level: 96, category: 'technical' },
                { id: '3', name: 'Orchestral Performance', level: 98, category: 'technical' },
                { id: '4', name: 'Studio Recording', level: 94, category: 'technical' },
                { id: '5', name: 'Music Theory', level: 95, category: 'technical' },
                { id: '6', name: 'Sight Reading', level: 98, category: 'technical' },
                { id: '7', name: 'Improvisation', level: 85, category: 'technical' },
                { id: '8', name: 'Stage Performance', level: 96, category: 'soft' },
                { id: '9', name: 'Arts Education', level: 88, category: 'soft' },
                { id: '10', name: 'Social Media Marketing', level: 80, category: 'soft' },
                { id: '11', name: 'Music Production (Logic Pro)', level: 75, category: 'technical' },
                { id: '12', name: 'Public Speaking', level: 85, category: 'soft' }
            ],
            languages: [
                { id: '1', name: 'English', proficiency: 'native' },
                { id: '2', name: 'Spanish', proficiency: 'fluent' },
                { id: '3', name: 'German', proficiency: 'conversational' },
                { id: '4', name: 'Italian', proficiency: 'basic' }
            ],
            template: 'artist-musician',
            contentLanguage: 'en',
            metadata: { version: 1, createdAt: '', updatedAt: '', lastAutoSave: '' }
        }
    }
];

export function getAITemplateById(id: string): AICVTemplate | undefined {
    return aiTemplates.find(t => t.id === id);
}
