/**
 * CV Templates Database
 * Professional templates organized by industry and style
 */

export type TemplateCategory = 'tech' | 'business' | 'creative' | 'medical' | 'education' | 'all';
export type TemplateStyle = 'modern' | 'minimalist' | 'creative' | 'professional' | 'bold';

export interface CVTemplate {
    id: string;
    name: string;
    description: string;
    category: TemplateCategory[];
    style: TemplateStyle[];
    atsScore: number; // 0-100
    isPremium: boolean;
    previewImage: string;
    usePlaceholder?: boolean; // Use SVG placeholder instead of image
    altText: string; // SEO Optimized Alt Text
    metaDescription: string; // SEO Meta Description
    colors: {
        primary: string;
        secondary: string;
        accent: string;
    };
    features: string[];
}

export const templates: CVTemplate[] = [
    // ========== TECH / IT Templates ==========
    {
        id: 'tech-modern-developer',
        name: 'Modern Developer',
        description: 'Clean, professional template perfect for software developers and engineers',
        category: ['tech', 'all'],
        style: ['modern', 'minimalist'],
        atsScore: 95,
        isPremium: false,
        previewImage: '/templates/modern-professional.png',
        altText: 'Modern Developer CV Template - ATS Optimized for Software Engineers',
        metaDescription: 'Download this ATS-friendly Modern Developer CV template. Perfect for software engineers and developers looking for a clean, professional design.',
        colors: { primary: '#3B82F6', secondary: '#1E40AF', accent: '#60A5FA' },
        features: ['ATS-Optimized', 'Two-Column', 'Skills Bar', 'Project Section']
    },
    {
        id: 'tech-full-stack',
        name: 'Full Stack Pro',
        description: 'Showcase your full-stack skills with this comprehensive layout',
        category: ['tech', 'all'],
        style: ['modern', 'professional'],
        atsScore: 92,
        isPremium: false,
        previewImage: '/templates/modern-professional.png',
        altText: 'Full Stack Developer Resume Template with Tech Stack Icons',
        metaDescription: 'Showcase your full-stack development skills with this professional resume template. Features sections for tech stack, GitHub integration, and portfolio links.',
        colors: { primary: '#10B981', secondary: '#059669', accent: '#34D399' },
        features: ['Tech Stack Icons', 'GitHub Integration', 'Portfolio Links', 'ATS-Friendly']
    },
    {
        id: 'tech-data-scientist',
        name: 'Data Scientist Elite',
        description: 'Highlight your data analysis and ML expertise',
        category: ['tech', 'all'],
        style: ['professional', 'modern'],
        atsScore: 94,
        isPremium: false,
        previewImage: '/templates/business-manager.png',
        altText: 'Data Scientist CV Template for Machine Learning Experts',
        metaDescription: ' specialized CV template for Data Scientists and ML Engineers. Highlight your research, publications, and technical skills matrix effectively.',
        colors: { primary: '#8B5CF6', secondary: '#7C3AED', accent: '#A78BFA' },
        features: ['Publications Section', 'Research Highlights', 'Technical Skills Matrix']
    },
    {
        id: 'tech-devops-engineer',
        name: 'DevOps Specialist',
        description: 'Perfect for DevOps, SRE, and Cloud Engineers',
        category: ['tech', 'all'],
        style: ['modern', 'minimalist'],
        atsScore: 91,
        isPremium: false,
        previewImage: '/templates/modern-professional.png',
        altText: 'DevOps Engineer Resume Template with Cloud Certifications',
        metaDescription: 'Build a strong DevOps or SRE resume with this template. Designed to showcase infrastructure skills, certifications, and tool proficiency.',
        colors: { primary: '#F59E0B', secondary: '#D97706', accent: '#FBBF24' },
        features: ['Certifications Badge', 'Infrastructure Skills', 'Tool Proficiency']
    },
    {
        id: 'tech-ui-ux-designer',
        name: 'UI/UX Designer',
        description: 'Beautiful portfolio-style CV for designers',
        category: ['tech', 'creative', 'all'],
        style: ['creative', 'modern'],
        atsScore: 88,
        isPremium: false,
        previewImage: '/templates/creative-designer.png',
        usePlaceholder: false,
        altText: 'Creative UI/UX Designer Resume Template with Portfolio Gallery',
        metaDescription: 'Stand out as a UI/UX Designer with this portfolio-style resume template. Features a visual gallery, design tools section, and case study links.',
        colors: { primary: '#EC4899', secondary: '#DB2777', accent: '#F472B6' },
        features: ['Portfolio Gallery', 'Design Tools', 'Case Study Links', 'Color Palette']
    },

    // ========== BUSINESS Templates ==========
    {
        id: 'business-executive',
        name: 'Executive Professional',
        description: 'Premium template for C-level and senior executives',
        category: ['business', 'all'],
        style: ['professional', 'minimalist'],
        atsScore: 96,
        isPremium: false,
        previewImage: '/templates/business-manager.png',
        altText: 'Executive Resume Template for C-Level Professionals',
        metaDescription: 'Premium executive resume template designed for C-suite leaders. Focuses on leadership, board experience, and strategic achievements.',
        colors: { primary: '#1F2937', secondary: '#374151', accent: '#6B7280' },
        features: ['Leadership Focus', 'Board Experience', 'Strategic Achievements']
    },
    {
        id: 'business-manager',
        name: 'Modern Manager',
        description: 'Ideal for project managers and team leaders',
        category: ['business', 'all'],
        style: ['modern', 'professional'],
        atsScore: 93,
        isPremium: false,
        previewImage: '/templates/business-manager.png',
        usePlaceholder: false,
        altText: 'Project Manager Resume Template with KPI Highlights',
        metaDescription: 'Effective resume template for Project Managers and Team Leaders. Highlight team size, budget management, and key performance indicators.',
        colors: { primary: '#3B82F6', secondary: '#2563EB', accent: '#60A5FA' },
        features: ['Team Size Metrics', 'Budget Management', 'KPI Highlights']
    },
    {
        id: 'business-consultant',
        name: 'Strategy Consultant',
        description: 'Perfect for consultants and business analysts',
        category: ['business', 'all'],
        style: ['professional', 'minimalist'],
        atsScore: 94,
        isPremium: false,
        previewImage: '/templates/business-manager.png',
        usePlaceholder: false,
        altText: 'Business Consultant CV Template - Professional & Minimalist',
        metaDescription: 'Professional CV template for Strategy Consultants and Business Analysts. Clean layout to present client portfolios and industry expertise.',
        colors: { primary: '#059669', secondary: '#047857', accent: '#10B981' },
        features: ['Client Portfolio', 'Industry Expertise', 'Consulting Frameworks']
    },
    {
        id: 'business-entrepreneur',
        name: 'Entrepreneur',
        description: 'Showcase your ventures and business achievements',
        category: ['business', 'all'],
        style: ['bold', 'modern'],
        atsScore: 89,
        isPremium: false,
        previewImage: '/templates/modern-professional.png',
        usePlaceholder: false,
        altText: 'Entrepreneur Resume Template for Founders and Business Owners',
        metaDescription: 'Dynamic resume template for Entrepreneurs and Founders. Showcase your ventures, revenue growth, and exit stories effectively.',
        colors: { primary: '#DC2626', secondary: '#B91C1C', accent: '#F87171' },
        features: ['Ventures Founded', 'Revenue Growth', 'Exit Stories', 'Investment Raised']
    },
    {
        id: 'business-sales',
        name: 'Sales Champion',
        description: 'Highlight your sales achievements and targets exceeded',
        category: ['business', 'all'],
        style: ['bold', 'modern'],
        atsScore: 90,
        isPremium: false,
        previewImage: '/templates/business-manager.png',
        usePlaceholder: false,
        altText: 'Sales Professional Resume Template with Revenue Metrics',
        metaDescription: 'High-impact resume template for Sales Professionals. Highlight quotas exceeded, revenue generated, and client wins.',
        colors: { primary: '#F59E0B', secondary: '#D97706', accent: '#FBBF24' },
        features: ['Revenue Numbers', 'Quota Achievement', 'Sales Metrics', 'Client Wins']
    },

    // ========== CREATIVE Templates ==========
    {
        id: 'creative-graphic-designer',
        name: 'Creative Designer',
        description: 'Bold and colorful template for graphic designers',
        category: ['creative', 'all'],
        style: ['creative', 'bold'],
        atsScore: 85,
        isPremium: false,
        previewImage: '/templates/creative-designer.png',
        altText: 'Creative Graphic Designer Resume Template - Bold & Colorful',
        metaDescription: 'Bold and colorful resume template for Graphic Designers. Perfect for showcasing your visual portfolio, awards, and creative tools.',
        colors: { primary: '#8B5CF6', secondary: '#7C3AED', accent: '#C084FC' },
        features: ['Visual Portfolio', 'Design Awards', 'Creative Tools', 'Brand Work']
    },
    {
        id: 'creative-photographer',
        name: 'Photographer Pro',
        description: 'Image-focused CV for photographers',
        category: ['creative', 'all'],
        style: ['creative', 'minimalist'],
        atsScore: 83,
        isPremium: false,
        previewImage: '/templates/creative-designer.png',
        usePlaceholder: false,
        altText: 'Photographer CV Template with Image Gallery Layout',
        metaDescription: 'Image-focused CV template for Photographers. Features sections for photo gallery, exhibitions, published work, and equipment.',
        colors: { primary: '#000000', secondary: '#1F2937', accent: '#6B7280' },
        features: ['Photo Gallery', 'Exhibition History', 'Published Work', 'Equipment']
    },
    {
        id: 'creative-writer',
        name: 'Content Writer',
        description: 'Perfect for writers, journalists, and content creators',
        category: ['creative', 'all'],
        style: ['minimalist', 'modern'],
        atsScore: 91,
        isPremium: false,
        previewImage: '/templates/modern-professional.png',
        usePlaceholder: false,
        altText: 'Content Writer Resume Template - Minimalist & Text-Focused',
        metaDescription: 'Minimalist resume template for Content Writers and Journalists. Emphasizes published articles, writing samples, and SEO skills.',
        colors: { primary: '#6366F1', secondary: '#4F46E5', accent: '#818CF8' },
        features: ['Published Articles', 'Writing Samples', 'Bylines', 'SEO Skills']
    },
    {
        id: 'creative-marketing',
        name: 'Marketing Specialist',
        description: 'Dynamic template for marketing professionals',
        category: ['creative', 'business', 'all'],
        style: ['modern', 'bold'],
        atsScore: 92,
        isPremium: false,
        previewImage: '/templates/creative-designer.png',
        usePlaceholder: false,
        altText: 'Marketing Specialist Resume Template with Campaign Metrics',
        metaDescription: 'Dynamic resume template for Marketing Professionals. Showcase campaign highlights, ROI metrics, and social media statistics.',
        colors: { primary: '#EC4899', secondary: '#DB2777', accent: '#F472B6' },
        features: ['Campaign Highlights', 'ROI Metrics', 'Social Media Stats', 'Brand Projects']
    },
    {
        id: 'creative-artist',
        name: 'Visual Artist',
        description: 'Expressive template for artists and illustrators',
        category: ['creative', 'all'],
        style: ['creative', 'bold'],
        atsScore: 80,
        isPremium: false,
        previewImage: '/templates/creative-designer.png',
        usePlaceholder: false,
        altText: 'Visual Artist CV Template - Expressive & Artistic',
        metaDescription: 'Expressive CV template for Visual Artists and Illustrators. Includes sections for artwork gallery, exhibitions, and artist statement.',
        colors: { primary: '#F59E0B', secondary: '#D97706', accent: '#FBBF24' },
        features: ['Artwork Gallery', 'Exhibitions', 'Collections', 'Art Statement']
    },

    // ========== MEDICAL / HEALTH Templates ==========
    {
        id: 'medical-doctor',
        name: 'Medical Professional',
        description: 'Professional template for doctors and physicians',
        category: ['medical', 'all'],
        style: ['professional', 'minimalist'],
        atsScore: 97,
        isPremium: false,
        previewImage: '/templates/business-manager.png',
        usePlaceholder: false,
        altText: 'Medical Doctor CV Template - Professional & Clinical',
        metaDescription: 'Professional CV template for Doctors and Physicians. Detailed sections for medical license, specializations, and clinical experience.',
        colors: { primary: '#0EA5E9', secondary: '#0284C7', accent: '#38BDF8' },
        features: ['Medical License', 'Specializations', 'Publications', 'Clinical Experience']
    },
    {
        id: 'medical-nurse',
        name: 'Nursing Professional',
        description: 'Clear and organized template for nurses',
        category: ['medical', 'all'],
        style: ['professional', 'modern'],
        atsScore: 95,
        isPremium: false,
        previewImage: '/templates/modern-professional.png',
        usePlaceholder: false,
        altText: 'Nursing Resume Template - Organized & Patient-Care Focused',
        metaDescription: 'Organized resume template for Nurses. Highlight clinical skills, patient care experience, and ward certifications.',
        colors: { primary: '#10B981', secondary: '#059669', accent: '#34D399' },
        features: ['Certifications', 'Clinical Skills', 'Patient Care', 'Ward Experience']
    },
    {
        id: 'medical-pharmacist',
        name: 'Pharmacist CV',
        description: 'Specialized template for pharmacy professionals',
        category: ['medical', 'all'],
        style: ['professional', 'minimalist'],
        atsScore: 94,
        isPremium: false,
        previewImage: '/templates/business-manager.png',
        usePlaceholder: false,
        altText: 'Pharmacist CV Template - Specialized for Pharmacy',
        metaDescription: 'Specialized CV template for Pharmacists. Features sections for license info, pharmacy systems, and clinical knowledge.',
        colors: { primary: '#8B5CF6', secondary: '#7C3AED', accent: '#A78BFA' },
        features: ['License Info', 'Pharmacy Systems', 'Clinical Knowledge', 'Certifications']
    },

    // ========== EDUCATION Templates ==========
    {
        id: 'education-teacher',
        name: 'Educator Professional',
        description: 'Comprehensive template for teachers and educators',
        category: ['education', 'all'],
        style: ['professional', 'modern'],
        atsScore: 93,
        isPremium: false,
        previewImage: '/templates/business-manager.png',
        usePlaceholder: false,
        altText: 'Teacher Resume Template - Comprehensive for Educators',
        metaDescription: 'Comprehensive resume template for Teachers and Educators. Include your teaching philosophy, student outcomes, and curriculum development.',
        colors: { primary: '#F59E0B', secondary: '#D97706', accent: '#FBBF24' },
        features: ['Teaching Philosophy', 'Student Outcomes', 'Curriculum Development']
    },
    {
        id: 'education-academic',
        name: 'Academic Researcher',
        description: 'Detailed CV for researchers and professors',
        category: ['education', 'all'],
        style: ['professional', 'minimalist'],
        atsScore: 96,
        isPremium: false,
        previewImage: '/templates/business-manager.png',
        usePlaceholder: false,
        altText: 'Academic CV Template for Researchers and Professors',
        metaDescription: 'Detailed CV template for Academic Researchers and Professors. Perfect for listing publications, research grants, and citations.',
        colors: { primary: '#1F2937', secondary: '#374151', accent: '#6B7280' },
        features: ['Publications', 'Research Grants', 'Citations', 'Teaching Experience']
    },

    // ========== CLASSIC / UNIVERSAL Templates ==========
    {
        id: 'classic-simple',
        name: 'Classic Simple',
        description: 'Timeless, ATS-friendly template that works for any industry',
        category: ['all'],
        style: ['minimalist', 'professional'],
        atsScore: 98,
        isPremium: false,
        previewImage: '/templates/minimalist-elegant.png',
        usePlaceholder: false,
        altText: 'Classic Simple Resume Template - High ATS Score',
        metaDescription: 'Timeless, ATS-friendly resume template suitable for any industry. Maximizes ATS readability with a clean, universal format.',
        colors: { primary: '#000000', secondary: '#1F2937', accent: '#6B7280' },
        features: ['Maximum ATS Score', 'Universal Format', 'Easy to Read', 'Print-Friendly']
    },
    {
        id: 'minimalist-elegant',
        name: 'Minimalist Elegant',
        description: 'Clean and sophisticated design for any profession',
        category: ['all'],
        style: ['minimalist', 'modern'],
        atsScore: 97,
        isPremium: false,
        previewImage: '/templates/minimalist-elegant.png',
        altText: 'Minimalist Elegant Resume Template - Clean & Sophisticated',
        metaDescription: 'Clean and sophisticated resume template for any profession. Features professional typography and subtle accents.',
        colors: { primary: '#3B82F6', secondary: '#2563EB', accent: '#60A5FA' },
        features: ['Clean Layout', 'Professional Typography', 'Subtle Accents', 'ATS-Safe']
    }
];

// Helper functions
export const getTemplatesByCategory = (category: TemplateCategory): CVTemplate[] => {
    if (category === 'all') return templates;
    return templates.filter(t => t.category.includes(category));
};

export const getTemplatesByStyle = (style: TemplateStyle): CVTemplate[] => {
    return templates.filter(t => t.style.includes(style));
};

export const getTemplateById = (id: string): CVTemplate | undefined => {
    return templates.find(t => t.id === id);
};

export const getHighATSTemplates = (minScore: number = 90): CVTemplate[] => {
    return templates.filter(t => t.atsScore >= minScore).sort((a, b) => b.atsScore - a.atsScore);
};

export const categories: { id: TemplateCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'All Templates', icon: '📋' },
    { id: 'tech', label: 'Tech & IT', icon: '💻' },
    { id: 'business', label: 'Business', icon: '💼' },
    { id: 'creative', label: 'Creative', icon: '🎨' },
    { id: 'medical', label: 'Medical', icon: '⚕️' },
    { id: 'education', label: 'Education', icon: '📚' }
];

export const styles: { id: TemplateStyle; label: string }[] = [
    { id: 'modern', label: 'Modern' },
    { id: 'minimalist', label: 'Minimalist' },
    { id: 'creative', label: 'Creative' },
    { id: 'professional', label: 'Professional' },
    { id: 'bold', label: 'Bold' }
];
