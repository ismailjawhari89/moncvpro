'use client';

import type { TemplateData } from '@/types/cv';

interface ExecutiveTemplateProps {
    data: TemplateData;
    customizations?: {
        primaryColor?: string;
        fontFamily?: string;
    };
}

export default function ExecutiveTemplate({ data, customizations }: ExecutiveTemplateProps) {
    const primaryColor = customizations?.primaryColor || '#1e3a5f';

    return (
        <div
            className="bg-white shadow-lg max-w-4xl mx-auto font-serif"
            style={{ minHeight: '842px', fontFamily: customizations?.fontFamily || 'Georgia, serif' }}
        >
            {/* Elegant Header */}
            <header
                className="text-white p-8 text-center"
                style={{ backgroundColor: primaryColor }}
            >
                <h1 className="text-4xl font-bold tracking-wide mb-2">
                    {data.personal.fullName || 'Your Name'}
                </h1>
                <div className="flex justify-center items-center gap-6 text-sm opacity-90">
                    {data.personal.email && <span>{data.personal.email}</span>}
                    {data.personal.phone && <span>•</span>}
                    {data.personal.phone && <span>{data.personal.phone}</span>}
                    {data.personal.location && <span>•</span>}
                    {data.personal.location && <span>{data.personal.location}</span>}
                </div>
            </header>

            <div className="p-8">
                {/* Executive Summary */}
                {data.personal.summary && (
                    <section className="mb-8 pb-6 border-b-2" style={{ borderColor: primaryColor }}>
                        <h2
                            className="text-lg font-bold uppercase tracking-widest mb-4"
                            style={{ color: primaryColor }}
                        >
                            Executive Summary
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-justify italic">
                            "{data.personal.summary}"
                        </p>
                    </section>
                )}

                {/* Professional Experience */}
                {data.experiences.length > 0 && (
                    <section className="mb-8">
                        <h2
                            className="text-lg font-bold uppercase tracking-widest mb-4 pb-2 border-b-2"
                            style={{ color: primaryColor, borderColor: primaryColor }}
                        >
                            Professional Experience
                        </h2>
                        <div className="space-y-6">
                            {data.experiences.map((exp) => (
                                <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: primaryColor }}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-gray-900 text-lg">{exp.position}</h3>
                                        <span className="text-sm text-gray-600 italic">
                                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                        </span>
                                    </div>
                                    <p className="font-semibold mb-2" style={{ color: primaryColor }}>{exp.company}</p>
                                    {exp.achievements && exp.achievements.length > 0 && (
                                        <ul className="list-none space-y-1 text-gray-700 text-sm">
                                            {exp.achievements.map((achievement, idx) => (
                                                achievement && (
                                                    <li key={idx} className="flex items-start gap-2">
                                                        <span style={{ color: primaryColor }}>▸</span>
                                                        <span>{achievement}</span>
                                                    </li>
                                                )
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <div className="grid grid-cols-2 gap-8">
                    {/* Education */}
                    {data.education.length > 0 && (
                        <section>
                            <h2
                                className="text-lg font-bold uppercase tracking-widest mb-4 pb-2 border-b-2"
                                style={{ color: primaryColor, borderColor: primaryColor }}
                            >
                                Education
                            </h2>
                            <div className="space-y-4">
                                {data.education.map((edu) => (
                                    <div key={edu.id}>
                                        <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                                        <p className="text-gray-700">{edu.institution}</p>
                                        <p className="text-sm text-gray-500">{edu.field}</p>
                                        <p className="text-xs text-gray-500 italic">
                                            {edu.startDate} - {edu.current ? 'En cours' : edu.endDate}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills & Languages */}
                    <div className="space-y-6">
                        {data.skills.length > 0 && (
                            <section>
                                <h2
                                    className="text-lg font-bold uppercase tracking-widest mb-4 pb-2 border-b-2"
                                    style={{ color: primaryColor, borderColor: primaryColor }}
                                >
                                    Core Competencies
                                </h2>
                                <div className="grid grid-cols-2 gap-2">
                                    {data.skills.map((skill) => (
                                        <div key={skill.id} className="flex items-center gap-2">
                                            <span style={{ color: primaryColor }}>●</span>
                                            <span className="text-gray-700 text-sm">{skill.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.languages.length > 0 && (
                            <section>
                                <h2
                                    className="text-lg font-bold uppercase tracking-widest mb-4 pb-2 border-b-2"
                                    style={{ color: primaryColor, borderColor: primaryColor }}
                                >
                                    Languages
                                </h2>
                                <div className="space-y-1">
                                    {data.languages.map((lang) => (
                                        <div key={lang.id} className="flex justify-between text-sm">
                                            <span className="text-gray-700">{lang.name}</span>
                                            <span className="text-gray-500 capitalize">{lang.proficiency}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
