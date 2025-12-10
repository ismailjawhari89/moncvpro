import React from 'react';
import { CVData } from '@/types/cv';
import { getTemplate } from '../definitions';

interface TemplateBlock {
    type: 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'languages';
    layout?: string;
    [key: string]: any;
}

interface TemplateRendererProps {
    templateId: string;
    data: CVData;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ templateId, data }) => {
    const baseTemplate = getTemplate(templateId) as any;

    // Debug logging
    console.log('[TemplateRenderer] Rendering:', {
        templateId,
        hasData: !!data,
        personalInfo: data?.personalInfo?.fullName,
        template: baseTemplate?.id,
        hasBlocks: !!baseTemplate?.blocks,
        blocksCount: baseTemplate?.blocks?.length
    });

    // Merge variants
    const variantId = data.theme;
    const variant = variantId && baseTemplate.variants ? baseTemplate.variants[variantId] : undefined;

    const template = {
        ...baseTemplate,
        palette: variant?.palette ? { ...baseTemplate.palette, ...variant.palette } : baseTemplate.palette,
        typography: variant?.typography ? { ...baseTemplate.typography, ...variant.typography } : baseTemplate.typography
    };

    if (!data || !template.blocks || template.blocks.length === 0) {
        console.warn('[TemplateRenderer] No data or blocks:', { hasData: !!data, blocksLength: template.blocks?.length });
        return (
            <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500">No template content available</p>
            </div>
        );
    }

    const renderBlock = (block: TemplateBlock, index: number) => {
        // lowercase type to match JSON
        const type = block.type.toLowerCase();
        const { layout, ...options } = block;

        // Apply template typography
        const headingFont = template.typography?.heading || 'sans-serif';
        const bodyFont = template.typography?.body || 'sans-serif';
        const primaryColor = template.palette?.primary || '#3b82f6';
        const textColor = template.palette?.text || '#1f2937';

        const sectionStyle = { fontFamily: bodyFont, color: textColor };
        const headingStyle = { fontFamily: headingFont, color: primaryColor };

        switch (type) {
            case 'header':
                return (
                    <div key={index} className={`template-header mb-8 ${layout || 'centered'}`} style={sectionStyle}>
                        <div className="flex items-center gap-6">
                            {options.showProfileImage && data.personalInfo.photoUrl && (
                                <img
                                    src={data.personalInfo.photoUrl}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                    style={{ borderColor: primaryColor }}
                                />
                            )}
                            <div>
                                <h1 className="text-3xl font-bold mb-2" style={headingStyle}>
                                    {data.personalInfo.fullName || 'Your Name'}
                                </h1>
                                <p className="text-xl text-gray-600 mb-3">{data.personalInfo.profession || 'Professional Title'}</p>

                                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                    {data.personalInfo.email && (
                                        <span className="flex items-center gap-1">📧 {data.personalInfo.email}</span>
                                    )}
                                    {data.personalInfo.phone && (
                                        <span className="flex items-center gap-1">📱 {data.personalInfo.phone}</span>
                                    )}
                                    {data.personalInfo.address && (
                                        <span className="flex items-center gap-1">📍 {data.personalInfo.address}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'summary':
                return (
                    <div key={index} className="template-summary mb-6" style={sectionStyle}>
                        <h2 className="text-xl font-semibold mb-3 border-b pb-2" style={{ ...headingStyle, borderColor: primaryColor }}>
                            Professional Summary
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            {data.summary || 'Summary goes here...'}
                        </p>
                    </div>
                );

            case 'experience':
                return (
                    <div key={index} className="template-experience mb-6" style={sectionStyle}>
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2" style={{ ...headingStyle, borderColor: primaryColor }}>
                            Work Experience
                        </h2>
                        {data.experiences && data.experiences.length > 0 ? (
                            <div className="space-y-6">
                                {data.experiences.map((exp: any, idx: number) => (
                                    <div key={idx} className="relative pl-4 border-l-2" style={{ borderColor: primaryColor }}>
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-lg">{exp.position}</h3>
                                            <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                            </span>
                                        </div>
                                        <p className="font-medium text-gray-600 mb-2">{exp.company}</p>
                                        <div className="text-gray-700 text-sm whitespace-pre-line">{exp.description}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-400 italic">No experience added</div>
                        )}
                    </div>
                );

            case 'education':
                return (
                    <div key={index} className="template-education mb-6" style={sectionStyle}>
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2" style={{ ...headingStyle, borderColor: primaryColor }}>
                            Education
                        </h2>
                        {data.education.length > 0 ? (
                            <div className="space-y-4">
                                {data.education.map((edu, idx) => (
                                    <div key={idx} className="flex justify-between">
                                        <div>
                                            <h3 className="font-bold">{edu.degree}</h3>
                                            <p className="text-gray-600">{edu.institution}</p>
                                        </div>
                                        <span className="text-sm font-medium text-gray-500">
                                            {edu.startDate} - {edu.endDate}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-400 italic">No education added</div>
                        )}
                    </div>
                );

            case 'skills':
                return (
                    <div key={index} className="template-skills mb-6" style={sectionStyle}>
                        <h2 className="text-xl font-semibold mb-3 border-b pb-2" style={{ ...headingStyle, borderColor: primaryColor }}>
                            Skills
                        </h2>
                        {data.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 rounded-full text-sm font-medium"
                                        style={{ backgroundColor: `${primaryColor}1a`, color: primaryColor }}
                                    >
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-400 italic">No skills added</div>
                        )}
                    </div>
                );

            case 'languages':
                return (
                    <div key={index} className="template-languages mb-6" style={sectionStyle}>
                        <h2 className="text-xl font-semibold mb-3 border-b pb-2" style={{ ...headingStyle, borderColor: primaryColor }}>
                            Languages
                        </h2>
                        {data.languages && data.languages.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {data.languages.map((lang, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                        <span className="font-medium">{lang.name}</span>
                                        <span className="text-sm text-gray-500">{lang.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-400 italic">No languages added</div>
                        )}
                    </div>
                );

            default:
                return null; // Unknown block type
        }
    };

    return (
        <div
            id="cv-template-root"
            className={`template-renderer template-${template.id} w-full bg-white shadow-lg mx-auto overflow-hidden relative`}
            style={{
                minHeight: '297mm',
                width: '210mm',
                padding: '40px',
                backgroundColor: template.palette?.background || '#ffffff'
            }}
        >
            {template.blocks.map((block: any, index: number) => renderBlock(block, index))}
        </div>
    );
};
