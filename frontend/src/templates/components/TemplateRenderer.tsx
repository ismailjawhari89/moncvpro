import React from 'react';
import { CVData } from '@/types/cv';
import { getTemplate } from '../definitions';
import { getAITemplateById, PhotoPosition } from '@/data/ai-templates/ai-templates';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Calendar, Briefcase, GraduationCap, Star, Award, Languages, User } from 'lucide-react';

interface TemplateRendererProps {
    templateId: string;
    data: CVData;
    locale?: string;
}

// Skill level handling - support both 1-5 and 1-100 scales
const getSkillPercent = (level: number) => {
    if (level > 5) return Math.min(100, level);
    return Math.min(100, (level / 5) * 100);
};

// Proficiency labels
const proficiencyLabels: Record<string, Record<string, string>> = {
    en: { native: 'Native', fluent: 'Fluent', conversational: 'Conversational', basic: 'Basic' },
    ar: { native: 'اللغة الأم', fluent: 'طلاقة تامة', conversational: 'محادثة', basic: 'مبتدئ' },
    fr: { native: 'Langue maternelle', fluent: 'Courant', conversational: 'Intermédiaire', basic: 'Débutant' }
};

// Section titles
const sectionLabels: Record<string, Record<string, string>> = {
    en: {
        contact: 'Contact', skills: 'Skills', languages: 'Languages',
        summary: 'Professional Summary', experience: 'Work Experience',
        education: 'Education', present: 'Present'
    },
    ar: {
        contact: 'معلومات الاتصال', skills: 'المهارات', languages: 'اللغات',
        summary: 'الملخص المهني', experience: 'الخبرة المهنية',
        education: 'التعليم', present: 'حتى الآن'
    },
    fr: {
        contact: 'Contact', skills: 'Compétences', languages: 'Langues',
        summary: 'Résumé Professionnel', experience: 'Expérience Professionnelle',
        education: 'Éducation', present: 'Présent'
    }
};

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ templateId, data, locale = 'en' }) => {
    const isRTL = locale === 'ar';
    const direction = isRTL ? 'rtl' : 'ltr';
    const labels = sectionLabels[locale] || sectionLabels.en;
    const profLabels = proficiencyLabels[locale] || proficiencyLabels.en;

    // Directional Utilities (Manual to ensure compatibility)
    const textAlign = isRTL ? 'text-right' : 'text-left';
    const borderStart = isRTL ? 'border-r-2' : 'border-l-2';
    const borderEnd = isRTL ? 'border-l-2' : 'border-r-2';
    const paddingStart = isRTL ? 'pr-4' : 'pl-4';
    const paddingEnd = isRTL ? 'pl-4' : 'pr-4';
    const marginStart = isRTL ? 'mr-4' : 'ml-4';
    const marginEnd = isRTL ? 'ml-4' : 'mr-4';
    const floatEnd = isRTL ? 'float-left' : 'float-right';

    // For absolute positioning (Timeline dots)
    const timelineDotStyle = isRTL ? { right: '-5px' } : { left: '-5px' };
    const timelineLineStyle = isRTL ? { right: '0' } : { left: '0' };

    // Get template config
    const aiTemplate = getAITemplateById(templateId);
    const baseTemplate = getTemplate(templateId) as any;

    // Colors
    const primary = aiTemplate?.design.colors.primary || baseTemplate?.palette?.primary || '#3b82f6';
    const secondary = aiTemplate?.design.colors.secondary || primary;
    const accent = aiTemplate?.design.colors.accent || '#60a5fa';
    const text = aiTemplate?.design.colors.text || '#1f2937';
    const muted = '#6b7280';
    const bg = aiTemplate?.design.colors.background || '#ffffff';

    // Typography
    const headingFont = isRTL ? 'Cairo, sans-serif' :
        (aiTemplate?.design.typography.headingFont ? `${aiTemplate.design.typography.headingFont}, sans-serif` : 'Inter, sans-serif');
    const bodyFont = isRTL ? 'Cairo, sans-serif' :
        (aiTemplate?.design.typography.fontFamily ? `${aiTemplate.design.typography.fontFamily}, sans-serif` : 'Inter, sans-serif');

    // Get layout type from AI template
    const layout = aiTemplate?.design.layout || 'modern';
    const photoPosition = aiTemplate?.photoPosition || PhotoPosition.LEFT_SIDEBAR;

    const { personalInfo, summary, experiences, education, skills, languages } = data;

    // Photo component
    const PhotoPlaceholder = ({ size = 120, rounded = true, className = "" }: { size?: number; rounded?: boolean; className?: string }) => (
        <div
            className={`flex items-center justify-center shrink-0 ${rounded ? 'rounded-full' : 'rounded-lg'} ${className}`}
            style={{
                width: size,
                height: size,
                background: `linear-gradient(135deg, ${accent}40, ${primary}60)`,
                border: `3px solid ${primary}30`
            }}
        >
            {personalInfo.photoUrl ? (
                <img src={personalInfo.photoUrl} alt="" className={`w-full h-full object-cover ${rounded ? 'rounded-full' : 'rounded-lg'}`} />
            ) : (
                <span className="text-3xl font-bold" style={{ color: primary }}>
                    {(personalInfo.fullName || 'U').charAt(0).toUpperCase()}
                </span>
            )}
        </div>
    );

    // Contact info component - Adjusted for RTL/LTR icons
    const ContactInfo = ({ iconColor = "currentColor", textClass = "" }) => (
        <div className={`space-y-2 text-sm ${textClass}`}>
            {personalInfo.email && (
                <div className="flex items-center gap-2">
                    <Mail size={14} style={{ color: iconColor }} className="shrink-0" />
                    <span className="break-all" dir="ltr">{personalInfo.email}</span>
                </div>
            )}
            {personalInfo.phone && (
                <div className="flex items-center gap-2">
                    <Phone size={14} style={{ color: iconColor }} className="shrink-0" />
                    <span dir="ltr">{personalInfo.phone}</span>
                </div>
            )}
            {personalInfo.address && (
                <div className="flex items-center gap-2">
                    <MapPin size={14} style={{ color: iconColor }} className="shrink-0" />
                    <span>{personalInfo.address}</span>
                </div>
            )}
            {personalInfo.linkedin && (
                <div className="flex items-center gap-2">
                    <Linkedin size={14} style={{ color: iconColor }} className="shrink-0" />
                    <span className="break-all" dir="ltr">{personalInfo.linkedin}</span>
                </div>
            )}
            {personalInfo.github && (
                <div className="flex items-center gap-2">
                    <Github size={14} style={{ color: iconColor }} className="shrink-0" />
                    <span dir="ltr">{personalInfo.github}</span>
                </div>
            )}
        </div>
    );

    // Skills component - Progress bar direction
    const SkillsSection = ({ showBars = true, light = false }) => (
        skills && skills.length > 0 ? (
            <div className="space-y-2">
                {skills.map((skill, idx) => (
                    <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className={light ? 'text-white/90' : ''}>{skill.name}</span>
                            {showBars && <span className={`text-xs ${light ? 'text-white/60' : 'text-gray-500'}`}>{Math.round(getSkillPercent(skill.level))}%</span>}
                        </div>
                        {showBars && (
                            <div
                                className={`h-1.5 rounded-full overflow-hidden ${light ? 'bg-white/20' : 'bg-gray-200'}`}
                                dir={direction} // Ensure progress bar fills from the correct side
                            >
                                <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                        width: `${getSkillPercent(skill.level)}%`,
                                        backgroundColor: light ? 'rgba(255,255,255,0.8)' : accent
                                    }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        ) : null
    );

    // Languages component
    const LanguagesSection = ({ light = false }) => (
        languages && languages.length > 0 ? (
            <div className="space-y-2">
                {languages.map((lang, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                        <span className={light ? 'text-white/90' : ''}>{lang.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${light ? 'bg-white/20 text-white/80' : 'bg-gray-100'}`}>
                            {profLabels[lang.proficiency] || lang.proficiency}
                        </span>
                    </div>
                ))}
            </div>
        ) : null
    );

    // Experience section - Timeline direction
    const ExperienceSection = () => (
        experiences && experiences.length > 0 ? (
            <div className="mb-6">
                <h2 className={`text-lg font-bold mb-4 pb-2 border-b-2 flex items-center gap-2 ${textAlign}`}
                    style={{ fontFamily: headingFont, color: primary, borderColor: primary }}>
                    <Briefcase size={18} className={isRTL ? "ml-2" : "mr-2"} /> {labels.experience}
                </h2>
                <div className="space-y-4">
                    {experiences.map((exp, idx) => (
                        <div
                            key={idx}
                            className={`relative ${paddingStart} ${borderStart}`}
                            style={{ borderColor: primary + '40' }}
                        >
                            <div
                                className="absolute top-1 w-2 h-2 rounded-full"
                                style={{ backgroundColor: primary, ...timelineDotStyle }}
                            />
                            <div className="flex justify-between items-start mb-1 flex-wrap gap-2">
                                <h3 className="font-bold text-sm">{exp.position}</h3>
                                <div className="text-xs px-2 py-0.5 rounded shrink-0" style={{ backgroundColor: primary + '15', color: primary }}>
                                    <span dir="ltr" className="inline-block">{exp.startDate} - {exp.current ? labels.present : exp.endDate}</span>
                                </div>
                            </div>
                            <p className="text-sm font-medium mb-2" style={{ color: primary }}>{exp.company}</p>
                            {exp.description && <p className={`text-xs leading-relaxed ${textAlign}`} style={{ color: muted }}>{exp.description}</p>}
                        </div>
                    ))}
                </div>
            </div>
        ) : null
    );

    // Education section - Timeline direction
    const EducationSection = () => (
        education && education.length > 0 ? (
            <div className="mb-6">
                <h2 className={`text-lg font-bold mb-4 pb-2 border-b-2 flex items-center gap-2 ${textAlign}`}
                    style={{ fontFamily: headingFont, color: primary, borderColor: primary }}>
                    <GraduationCap size={18} className={isRTL ? "ml-2" : "mr-2"} /> {labels.education}
                </h2>
                <div className="space-y-3">
                    {education.map((edu, idx) => (
                        <div
                            key={idx}
                            className={`relative ${paddingStart} ${borderStart}`}
                            style={{ borderColor: primary + '40' }}
                        >
                            <div
                                className="absolute top-1 w-2 h-2 rounded-full"
                                style={{ backgroundColor: primary, ...timelineDotStyle }}
                            />
                            <div className="flex justify-between items-start flex-wrap gap-2">
                                <div>
                                    <h3 className="font-bold text-sm">{edu.degree} {edu.field && (isRTL ? `في ${edu.field}` : `in ${edu.field}`)}</h3>
                                    <p className="text-sm" style={{ color: primary }}>{edu.institution}</p>
                                </div>
                                <span className="text-xs px-2 py-0.5 rounded shrink-0" style={{ backgroundColor: primary + '15', color: primary }}>
                                    <span dir="ltr">{edu.graduationYear || `${edu.startDate} - ${edu.endDate}`}</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ) : null
    );

    // ============ LAYOUT 1: MODERN (Sidebar Left in LTR, Right in RTL) ============
    if (layout === 'modern' || photoPosition === PhotoPosition.LEFT_SIDEBAR) {
        return (
            <div className="w-full cv-preview" dir={direction} style={{ fontFamily: bodyFont, backgroundColor: bg, color: text }}>
                <div className="flex min-h-[1123px]">
                    {/* Sidebar - Position depends on flex direction (row vs row-reverse which is auto handled by dir=rtl) */}
                    <div className="w-[35%] p-6 text-white" style={{ backgroundColor: primary }}>
                        <div className="flex justify-center mb-6">
                            <PhotoPlaceholder size={120} className="border-4 border-white/30" />
                        </div>
                        <div className="text-center mb-8">
                            <h1 className="text-xl font-bold mb-1" style={{ fontFamily: headingFont }}>{personalInfo.fullName || 'Your Name'}</h1>
                            <p className="text-white/80 text-sm">{personalInfo.profession || 'Professional Title'}</p>
                        </div>
                        <div className="mb-8">
                            <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-white/60 border-b border-white/20 pb-2">{labels.contact}</h3>
                            <ContactInfo iconColor="rgba(255,255,255,0.6)" textClass="text-white/90" />
                        </div>
                        {skills && skills.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-white/60 border-b border-white/20 pb-2">{labels.skills}</h3>
                                <SkillsSection showBars={true} light={true} />
                            </div>
                        )}
                        {languages && languages.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-white/60 border-b border-white/20 pb-2">{labels.languages}</h3>
                                <LanguagesSection light={true} />
                            </div>
                        )}
                    </div>
                    {/* Main Content */}
                    <div className="w-[65%] p-6" style={{ color: text }}>
                        {summary && (
                            <div className="mb-6">
                                <h2 className={`text-lg font-bold mb-3 pb-2 border-b-2 flex items-center gap-2 ${textAlign}`} style={{ fontFamily: headingFont, color: primary, borderColor: primary }}>
                                    <Award size={18} className={isRTL ? "ml-2" : "mr-2"} /> {labels.summary}
                                </h2>
                                <p className={`text-sm leading-relaxed ${textAlign}`} style={{ color: muted }}>{summary}</p>
                            </div>
                        )}
                        <ExperienceSection />
                        <EducationSection />
                    </div>
                </div>
            </div>
        );
    }

    // ============ LAYOUT 2: CLASSIC (Header Top, Single Column) ============
    if (layout === 'classic' || photoPosition === PhotoPosition.TOP_LEFT) {
        return (
            <div className="w-full cv-preview min-h-[1123px]" dir={direction} style={{ fontFamily: bodyFont, backgroundColor: bg, color: text }}>
                {/* Header */}
                <div className="p-6 border-b-4" style={{ borderColor: primary }}>
                    <div className="flex items-start gap-6">
                        <PhotoPlaceholder size={100} rounded={false} />
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: headingFont, color: primary }}>{personalInfo.fullName || 'Your Name'}</h1>
                            <p className="text-lg mb-3" style={{ color: secondary }}>{personalInfo.profession || 'Professional Title'}</p>
                            <div className="flex flex-wrap gap-4 text-sm" style={{ color: muted }}>
                                {personalInfo.email && <span className="flex items-center gap-1"><Mail size={12} /> <span dir="ltr">{personalInfo.email}</span></span>}
                                {personalInfo.phone && <span className="flex items-center gap-1"><Phone size={12} /> <span dir="ltr">{personalInfo.phone}</span></span>}
                                {personalInfo.address && <span className="flex items-center gap-1"><MapPin size={12} /> {personalInfo.address}</span>}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Content */}
                <div className="p-6">
                    {summary && (
                        <div className="mb-6">
                            <h2 className="text-lg font-bold mb-3 uppercase tracking-wide" style={{ color: primary }}>{labels.summary}</h2>
                            <p className="text-sm leading-relaxed" style={{ color: muted }}>{summary}</p>
                        </div>
                    )}
                    <ExperienceSection />
                    <EducationSection />
                    {/* Skills as tags */}
                    {skills && skills.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-lg font-bold mb-3 uppercase tracking-wide" style={{ color: primary }}>{labels.skills}</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, idx) => (
                                    <span key={idx} className="px-3 py-1 rounded-full text-sm text-white" style={{ backgroundColor: accent }}>{skill.name}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ============ LAYOUT 3: CREATIVE (Center Photo, Bold Header) ============
    if (layout === 'creative' || photoPosition === PhotoPosition.CENTER || photoPosition === PhotoPosition.TOP_RIGHT) {
        return (
            <div className="w-full cv-preview min-h-[1123px]" dir={direction} style={{ fontFamily: bodyFont, backgroundColor: bg, color: text }}>
                {/* Bold Header with gradient */}
                <div className="p-8 text-center text-white" style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}>
                    <div className="flex justify-center mb-4">
                        <PhotoPlaceholder size={100} className="border-4 border-white shadow-xl" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: headingFont }}>{personalInfo.fullName || 'Your Name'}</h1>
                    <p className="text-lg text-white/90 mb-4">{personalInfo.profession || 'Professional Title'}</p>
                    <div className="flex justify-center flex-wrap gap-4 text-sm text-white/80">
                        {personalInfo.email && <span className="flex items-center gap-1"><Mail size={14} /> <span dir="ltr">{personalInfo.email}</span></span>}
                        {personalInfo.phone && <span className="flex items-center gap-1"><Phone size={14} /> <span dir="ltr">{personalInfo.phone}</span></span>}
                        {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin size={14} /> <span dir="ltr">{personalInfo.linkedin}</span></span>}
                    </div>
                </div>
                {/* Two Column Content */}
                <div className="flex p-6 gap-6">
                    <div className="w-2/3">
                        {summary && (
                            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: primary + '08' }}>
                                <h2 className="text-lg font-bold mb-2" style={{ color: primary }}>{labels.summary}</h2>
                                <p className="text-sm leading-relaxed" style={{ color: muted }}>{summary}</p>
                            </div>
                        )}
                        <ExperienceSection />
                        <EducationSection />
                    </div>
                    {/* Side Column - order handled by flex-row in RTL */}
                    <div className="w-1/3 space-y-6">
                        {skills && skills.length > 0 && (
                            <div className="p-4 rounded-lg" style={{ backgroundColor: primary + '08' }}>
                                <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: primary }}>{labels.skills}</h3>
                                <SkillsSection showBars={true} />
                            </div>
                        )}
                        {languages && languages.length > 0 && (
                            <div className="p-4 rounded-lg" style={{ backgroundColor: primary + '08' }}>
                                <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: primary }}>{labels.languages}</h3>
                                <LanguagesSection />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ============ LAYOUT 4: ACADEMIC (Narrow Sidebar, Dense Content) ============
    if (layout === 'academic') {
        return (
            <div className="w-full cv-preview min-h-[1123px]" dir={direction} style={{ fontFamily: bodyFont, backgroundColor: bg, color: text }}>
                <div className="flex">
                    {/* Narrow Left Bar */}
                    <div className="w-[28%] p-5 text-white text-sm" style={{ backgroundColor: primary }}>
                        <div className="flex justify-center mb-4">
                            <PhotoPlaceholder size={90} className="border-2 border-white/30" />
                        </div>
                        <div className="text-center mb-6">
                            <h1 className="text-lg font-bold" style={{ fontFamily: headingFont }}>{personalInfo.fullName}</h1>
                            <p className="text-white/80 text-xs mt-1">{personalInfo.profession}</p>
                        </div>
                        <div className="mb-6">
                            <h3 className="text-[10px] font-bold uppercase tracking-wider mb-3 text-white/60">{labels.contact}</h3>
                            <ContactInfo iconColor="rgba(255,255,255,0.6)" textClass="text-white/90 text-xs" />
                        </div>
                        {skills && skills.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-[10px] font-bold uppercase tracking-wider mb-3 text-white/60">{labels.skills}</h3>
                                <div className="space-y-1.5">
                                    {skills.map((s, i) => (
                                        <div key={i} className="flex justify-between text-xs">
                                            <span className="text-white/90">{s.name}</span>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, j) => (
                                                    <div key={j} className={`w-2 h-2 rounded-full ${j < Math.ceil(getSkillPercent(s.level) / 20) ? 'bg-white' : 'bg-white/30'}`} />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {languages && languages.length > 0 && (
                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-wider mb-3 text-white/60">{labels.languages}</h3>
                                <LanguagesSection light={true} />
                            </div>
                        )}
                    </div>
                    {/* Main Content - Dense */}
                    <div className="w-[72%] p-5" style={{ color: text }}>
                        {summary && (
                            <div className="mb-5">
                                <h2 className={`text-base font-bold mb-2 pb-1 border-b flex items-center gap-2 ${textAlign}`} style={{ color: primary, borderColor: primary + '40' }}>
                                    <Award size={16} className={isRTL ? "ml-2" : "mr-2"} /> {labels.summary}
                                </h2>
                                <p className="text-xs leading-relaxed" style={{ color: muted }}>{summary}</p>
                            </div>
                        )}
                        <ExperienceSection />
                        <EducationSection />
                    </div>
                </div>
            </div>
        );
    }

    // ============ LAYOUT 5: EXECUTIVE (No Photo, Dark Header) ============
    if (layout === 'executive' || photoPosition === PhotoPosition.NO_PHOTO) {
        return (
            <div className="w-full cv-preview min-h-[1123px]" dir={direction} style={{ fontFamily: bodyFont, backgroundColor: bg, color: text }}>
                {/* Dark Header - No Photo */}
                <div className="p-8" style={{ backgroundColor: primary }}>
                    <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: headingFont }}>{personalInfo.fullName || 'Your Name'}</h1>
                    <p className="text-xl text-white/80 mb-4">{personalInfo.profession || 'Professional Title'}</p>
                    <div className="flex flex-wrap gap-6 text-sm text-white/70">
                        {personalInfo.email && <span className="flex items-center gap-2"><Mail size={14} /> <span dir="ltr">{personalInfo.email}</span></span>}
                        {personalInfo.phone && <span className="flex items-center gap-2"><Phone size={14} /> <span dir="ltr">{personalInfo.phone}</span></span>}
                        {personalInfo.address && <span className="flex items-center gap-2"><MapPin size={14} /> {personalInfo.address}</span>}
                        {personalInfo.linkedin && <span className="flex items-center gap-2"><Linkedin size={14} /> <span dir="ltr">{personalInfo.linkedin}</span></span>}
                    </div>
                </div>
                {/* Two Column Content */}
                <div className="flex gap-6 p-6">
                    <div className="w-2/3">
                        {summary && (
                            <div className="mb-6">
                                <h2 className="text-lg font-bold mb-3 uppercase tracking-wide border-b-2 pb-2" style={{ color: primary, borderColor: primary }}>{labels.summary}</h2>
                                <p className="text-sm leading-relaxed" style={{ color: muted }}>{summary}</p>
                            </div>
                        )}
                        <ExperienceSection />
                        <EducationSection />
                    </div>
                    {/* Fixed border side */}
                    <div className={`w-1/3 ${borderStart} ${paddingStart}`} style={{ borderColor: primary + '20' }}>
                        {skills && skills.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: primary }}>{labels.skills}</h3>
                                <SkillsSection showBars={true} />
                            </div>
                        )}
                        {languages && languages.length > 0 && (
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: primary }}>{labels.languages}</h3>
                                <LanguagesSection />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ============ LAYOUT 6: TECHNICAL (Two Equal Columns, Minimal) ============
    if (layout === 'technical') {
        return (
            <div className="w-full cv-preview min-h-[1123px]" dir={direction} style={{ fontFamily: bodyFont, backgroundColor: bg, color: text }}>
                {/* Minimal Header */}
                <div className="p-6 border-b-2 flex items-center justify-between ml-auto" style={{ borderColor: primary }}>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: primary, fontFamily: headingFont }}>{personalInfo.fullName}</h1>
                        <p className="text-lg" style={{ color: muted }}>{personalInfo.profession}</p>
                    </div>
                    {/* Contact - Force LTR for contact details in technical layout or handle gracefully */}
                    <div className={`flex gap-4 text-xs ${isRTL ? 'flex-row-reverse' : ''}`} style={{ color: muted }}>
                        {personalInfo.email && <span dir="ltr">{personalInfo.email}</span>}
                        {personalInfo.phone && <span dir="ltr">{personalInfo.phone}</span>}
                        {personalInfo.github && <span dir="ltr">{personalInfo.github}</span>}
                    </div>
                </div>
                {/* Two Equal Columns */}
                <div className="flex gap-6 p-6">
                    <div className="w-1/2">
                        {summary && (
                            <div className={`mb-5 p-3 rounded ${borderStart}-4`} style={{ borderColor: primary, backgroundColor: primary + '05' }}>
                                <p className="text-xs leading-relaxed" style={{ color: muted }}>{summary}</p>
                            </div>
                        )}
                        <ExperienceSection />
                    </div>
                    <div className="w-1/2">
                        <EducationSection />
                        {skills && skills.length > 0 && (
                            <div className="mb-6">
                                <h2 className={`text-lg font-bold mb-3 pb-2 border-b flex items-center gap-2 ${textAlign}`} style={{ color: primary, borderColor: primary + '40' }}>
                                    <Star size={16} className={isRTL ? "ml-2" : "mr-2"} /> {labels.skills}
                                </h2>
                                <div className="grid grid-cols-2 gap-2">
                                    {skills.map((s, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs p-2 rounded" style={{ backgroundColor: primary + '08' }}>
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
                                            {s.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {languages && languages.length > 0 && (
                            <div>
                                <h2 className={`text-lg font-bold mb-3 pb-2 border-b flex items-center gap-2 ${textAlign}`} style={{ color: primary, borderColor: primary + '40' }}>
                                    <Languages size={16} className={isRTL ? "ml-2" : "mr-2"} /> {labels.languages}
                                </h2>
                                <LanguagesSection />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ============ DEFAULT FALLBACK (Modern Layout) ============
    return (
        <div className="w-full cv-preview min-h-[1123px]" dir={direction} style={{ fontFamily: bodyFont, backgroundColor: bg, color: text }}>
            <div className="flex">
                <div className="w-[35%] p-6 text-white" style={{ backgroundColor: primary }}>
                    <PhotoPlaceholder size={100} className="mx-auto mb-4" />
                    <h1 className="text-lg font-bold text-center">{personalInfo.fullName}</h1>
                    <p className="text-sm text-center text-white/80 mb-4">{personalInfo.profession}</p>
                    <ContactInfo iconColor="rgba(255,255,255,0.6)" textClass="text-white/90" />
                </div>
                <div className="w-[65%] p-6">
                    {summary && <div className="mb-4"><h2 className="text-lg font-bold mb-2" style={{ color: primary }}>{labels.summary}</h2><p className="text-sm" style={{ color: muted }}>{summary}</p></div>}
                    <ExperienceSection />
                    <EducationSection />
                </div>
            </div>
        </div>
    );
};
