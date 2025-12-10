import React from 'react';
import { CVData } from '@/types/cv';
import { getTemplate } from '../definitions';
import { getEnhancedTemplateById } from '@/data/enhanced-templates';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Calendar, Briefcase, GraduationCap, Star, Award, Languages } from 'lucide-react';

interface TemplateRendererProps {
    templateId: string;
    data: CVData;
    locale?: string; // Add locale for RTL support
}

// Skill level to percentage
const skillLevelToPercent = (level: number) => Math.min(100, (level / 5) * 100);

// Proficiency to display text
const proficiencyLabels: Record<string, string> = {
    native: 'Native',
    fluent: 'Fluent',
    conversational: 'Conversational',
    basic: 'Basic'
};

// RTL proficiency labels for Arabic
const proficiencyLabelsAr: Record<string, string> = {
    native: 'اللغة الأم',
    fluent: 'طلاقة تامة',
    conversational: 'محادثة',
    basic: 'مبتدئ'
};

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ templateId, data, locale = 'en' }) => {
    // Determine RTL direction
    const isRTL = locale === 'ar';
    const direction = isRTL ? 'rtl' : 'ltr';

    // Use appropriate labels based on locale
    const labels = isRTL ? proficiencyLabelsAr : proficiencyLabels;

    // Try to get enhanced template first for colors
    const enhancedTemplate = getEnhancedTemplateById(templateId);
    const baseTemplate = getTemplate(templateId) as any;

    // Merge variants
    const variantId = data.theme;
    const variant = variantId && baseTemplate.variants ? baseTemplate.variants[variantId] : undefined;

    const template = {
        ...baseTemplate,
        palette: variant?.palette ? { ...baseTemplate.palette, ...variant.palette } : baseTemplate.palette,
        typography: variant?.typography ? { ...baseTemplate.typography, ...variant.typography } : baseTemplate.typography
    };

    // Use enhanced template colors if available, otherwise fall back to definition
    const primaryColor = enhancedTemplate?.colors?.primary || template.palette?.primary || '#3b82f6';
    const accentColor = enhancedTemplate?.colors?.accent || template.palette?.accent || '#1d4ed8';
    const secondaryColor = enhancedTemplate?.colors?.secondary || template.palette?.secondary || primaryColor;
    const textColor = template.palette?.text || '#1f2937';
    const mutedColor = template.palette?.muted || '#6b7280';
    const bgColor = template.palette?.background || '#ffffff';

    // Use enhanced template typography if available
    // For Arabic, prefer Cairo font
    const headingFont = isRTL
        ? 'Cairo, sans-serif'
        : enhancedTemplate?.typography?.heading
            ? `${enhancedTemplate.typography.heading}, sans-serif`
            : template.typography?.heading || 'Inter, sans-serif';
    const bodyFont = isRTL
        ? 'Cairo, sans-serif'
        : enhancedTemplate?.typography?.body
            ? `${enhancedTemplate.typography.body}, sans-serif`
            : template.typography?.body || 'Inter, sans-serif';

    const { personalInfo, summary, experiences, education, skills, languages } = data;

    // Section titles based on locale
    const sectionTitles = isRTL ? {
        contact: 'معلومات الاتصال',
        skills: 'المهارات',
        languages: 'اللغات',
        summary: 'الملخص المهني',
        experience: 'الخبرة المهنية',
        education: 'التعليم',
        present: 'حتى الآن'
    } : {
        contact: 'Contact',
        skills: 'Skills',
        languages: 'Languages',
        summary: 'Professional Summary',
        experience: 'Work Experience',
        education: 'Education',
        present: 'Present'
    };

    // Check if we have any content
    const hasContent = personalInfo?.fullName || summary || experiences?.length || education?.length || skills?.length;

    if (!hasContent) {
        return (
            <div
                className="w-full h-full flex items-center justify-center text-gray-400 p-8"
                style={{ fontFamily: bodyFont, backgroundColor: bgColor }}
                dir={direction}
            >
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <Briefcase size={24} className="text-gray-400" />
                    </div>
                    <p className="text-lg font-medium">
                        {isRTL ? 'ابدأ ببناء سيرتك الذاتية' : 'Start Building Your CV'}
                    </p>
                    <p className="text-sm mt-2">
                        {isRTL ? 'املأ النموذج لترى معاينة سيرتك الذاتية' : 'Fill in the form to see your CV preview'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="w-full min-h-full cv-preview"
            dir={direction}
            style={{
                fontFamily: bodyFont,
                backgroundColor: bgColor,
                color: textColor
            }}
        >
            {/* Two Column Layout */}
            <div className="flex min-h-full">
                {/* Left Sidebar - 35% */}
                <div
                    className="w-[35%] p-6 text-white"
                    style={{ backgroundColor: primaryColor }}
                >
                    {/* Profile Photo */}
                    <div className="flex justify-center mb-6">
                        {personalInfo.photoUrl ? (
                            <div
                                className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-lg"
                            >
                                <img
                                    src={personalInfo.photoUrl}
                                    alt={personalInfo.fullName || 'Profile'}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30">
                                <span className="text-4xl font-bold text-white/80">
                                    {(personalInfo.fullName || 'U').charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Name & Title */}
                    <div className="text-center mb-8">
                        <h1
                            className="text-xl font-bold mb-1"
                            style={{ fontFamily: headingFont }}
                        >
                            {personalInfo.fullName || 'Your Name'}
                        </h1>
                        <p className="text-white/80 text-sm">
                            {personalInfo.profession || 'Professional Title'}
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div className="mb-8">
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-white/60 border-b border-white/20 pb-2">
                            {sectionTitles.contact}
                        </h3>
                        <div className="space-y-3 text-sm">
                            {personalInfo.email && (
                                <div className="flex items-center gap-3">
                                    <Mail size={14} className="text-white/60 shrink-0" />
                                    <span className="text-white/90 break-all">{personalInfo.email}</span>
                                </div>
                            )}
                            {personalInfo.phone && (
                                <div className="flex items-center gap-3">
                                    <Phone size={14} className="text-white/60 shrink-0" />
                                    <span className="text-white/90">{personalInfo.phone}</span>
                                </div>
                            )}
                            {personalInfo.address && (
                                <div className="flex items-center gap-3">
                                    <MapPin size={14} className="text-white/60 shrink-0" />
                                    <span className="text-white/90">{personalInfo.address}</span>
                                </div>
                            )}
                            {personalInfo.linkedin && (
                                <div className="flex items-center gap-3">
                                    <Linkedin size={14} className="text-white/60 shrink-0" />
                                    <span className="text-white/90 break-all">{personalInfo.linkedin}</span>
                                </div>
                            )}
                            {personalInfo.github && (
                                <div className="flex items-center gap-3">
                                    <Github size={14} className="text-white/60 shrink-0" />
                                    <span className="text-white/90">{personalInfo.github}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Skills with Progress Bars */}
                    {skills && skills.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-white/60 border-b border-white/20 pb-2">
                                {sectionTitles.skills}
                            </h3>
                            <div className="space-y-3">
                                {skills.map((skill, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-white/90">{skill.name}</span>
                                            <span className="text-white/60 text-xs">{skill.level}/5</span>
                                        </div>
                                        <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-white/80 rounded-full transition-all duration-300"
                                                style={{ width: `${skillLevelToPercent(skill.level)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Languages */}
                    {languages && languages.length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-white/60 border-b border-white/20 pb-2">
                                {sectionTitles.languages}
                            </h3>
                            <div className="space-y-2">
                                {languages.map((lang, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm">
                                        <span className="text-white/90">{lang.name}</span>
                                        <span className="text-xs px-2 py-0.5 bg-white/20 rounded text-white/80">
                                            {labels[lang.proficiency] || lang.proficiency}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Content - 65% */}
                <div className="w-[65%] p-6" style={{ color: textColor }}>
                    {/* Professional Summary */}
                    {summary && (
                        <div className="mb-6">
                            <h2
                                className="text-lg font-bold mb-3 pb-2 border-b-2 flex items-center gap-2"
                                style={{ fontFamily: headingFont, color: primaryColor, borderColor: primaryColor }}
                            >
                                <Award size={18} />
                                {sectionTitles.summary}
                            </h2>
                            <p className="text-sm leading-relaxed" style={{ color: mutedColor }}>
                                {summary}
                            </p>
                        </div>
                    )}

                    {/* Work Experience */}
                    {experiences && experiences.length > 0 && (
                        <div className="mb-6">
                            <h2
                                className="text-lg font-bold mb-4 pb-2 border-b-2 flex items-center gap-2"
                                style={{ fontFamily: headingFont, color: primaryColor, borderColor: primaryColor }}
                            >
                                <Briefcase size={18} />
                                {sectionTitles.experience}
                            </h2>
                            <div className="space-y-4">
                                {experiences.map((exp, idx) => (
                                    <div key={idx} className="relative pl-4 border-l-2" style={{ borderColor: primaryColor + '40' }}>
                                        {/* Timeline dot */}
                                        <div
                                            className="absolute -left-[5px] top-1 w-2 h-2 rounded-full"
                                            style={{ backgroundColor: primaryColor }}
                                        />

                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-sm" style={{ color: textColor }}>
                                                {exp.position}
                                            </h3>
                                            <span
                                                className="text-xs px-2 py-0.5 rounded shrink-0 ml-2"
                                                style={{ backgroundColor: primaryColor + '15', color: primaryColor }}
                                            >
                                                <Calendar size={10} className="inline mr-1" />
                                                {exp.startDate} - {exp.current ? sectionTitles.present : exp.endDate}
                                            </span>
                                        </div>

                                        <p className="text-sm font-medium mb-2" style={{ color: primaryColor }}>
                                            {exp.company}
                                        </p>

                                        {exp.description && (
                                            <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: mutedColor }}>
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {education && education.length > 0 && (
                        <div className="mb-6">
                            <h2
                                className="text-lg font-bold mb-4 pb-2 border-b-2 flex items-center gap-2"
                                style={{ fontFamily: headingFont, color: primaryColor, borderColor: primaryColor }}
                            >
                                <GraduationCap size={18} />
                                {sectionTitles.education}
                            </h2>
                            <div className="space-y-3">
                                {education.map((edu, idx) => (
                                    <div key={idx} className="relative pl-4 border-l-2" style={{ borderColor: primaryColor + '40' }}>
                                        <div
                                            className="absolute -left-[5px] top-1 w-2 h-2 rounded-full"
                                            style={{ backgroundColor: primaryColor }}
                                        />

                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-sm" style={{ color: textColor }}>
                                                    {edu.degree} {edu.field && `in ${edu.field}`}
                                                </h3>
                                                <p className="text-sm" style={{ color: primaryColor }}>
                                                    {edu.institution}
                                                </p>
                                            </div>
                                            <span
                                                className="text-xs px-2 py-0.5 rounded shrink-0 ml-2"
                                                style={{ backgroundColor: primaryColor + '15', color: primaryColor }}
                                            >
                                                {edu.graduationYear || `${edu.startDate} - ${edu.endDate}`}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* If no main content, show placeholder */}
                    {!summary && (!experiences || experiences.length === 0) && (!education || education.length === 0) && (
                        <div className="text-center py-12 text-gray-400">
                            <p className="text-sm">Add your experience, education, and summary to see them here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
