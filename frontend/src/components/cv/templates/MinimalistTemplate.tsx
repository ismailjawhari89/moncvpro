'use client';

import type { TemplateData } from '@/types/cv';

interface MinimalistTemplateProps {
    data: TemplateData;
    customizations?: {
        primaryColor?: string;
        fontFamily?: string;
    };
}

export default function MinimalistTemplate({ data, customizations }: MinimalistTemplateProps) {
    const accentColor = customizations?.primaryColor || '#000000';

    return (
        <div
            className="bg-white p-10 shadow-lg max-w-4xl mx-auto"
            style={{
                minHeight: '842px',
                fontFamily: customizations?.fontFamily || 'system-ui, -apple-system, sans-serif'
            }}
        >
            {/* Clean Header */}
            <header className="mb-10">
                <h1 className="text-3xl font-light tracking-tight mb-4" style={{ color: accentColor }}>
                    {data.personal.fullName || 'Your Name'}
                </h1>
                <div className="flex flex-wrap gap-4 text-xs text-gray-500 uppercase tracking-widest">
                    {data.personal.email && <span>{data.personal.email}</span>}
                    {data.personal.phone && <span>{data.personal.phone}</span>}
                    {data.personal.location && <span>{data.personal.location}</span>}
                </div>
            </header>

            {/* Summary */}
            {data.personal.summary && (
                <section className="mb-10">
                    <p className="text-gray-600 leading-relaxed text-sm">
                        {data.personal.summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {data.experiences.length > 0 && (
                <section className="mb-10">
                    <h2
                        className="text-xs uppercase tracking-widest mb-6 pb-2 border-b"
                        style={{ color: accentColor, borderColor: accentColor }}
                    >
                        Experience
                    </h2>
                    <div className="space-y-6">
                        {data.experiences.map((exp) => (
                            <div key={exp.id} className="grid grid-cols-4 gap-4">
                                <div className="col-span-1 text-xs text-gray-400">
                                    <p>{exp.startDate}</p>
                                    <p>{exp.current ? 'Present' : exp.endDate}</p>
                                </div>
                                <div className="col-span-3">
                                    <h3 className="font-medium text-gray-900">{exp.position}</h3>
                                    <p className="text-gray-500 text-sm mb-2">{exp.company}</p>
                                    {exp.achievements && exp.achievements.length > 0 && (
                                        <ul className="text-gray-600 text-sm space-y-1">
                                            {exp.achievements.map((achievement, idx) => (
                                                achievement && <li key={idx}>— {achievement}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {data.education.length > 0 && (
                <section className="mb-10">
                    <h2
                        className="text-xs uppercase tracking-widest mb-6 pb-2 border-b"
                        style={{ color: accentColor, borderColor: accentColor }}
                    >
                        Education
                    </h2>
                    <div className="space-y-4">
                        {data.education.map((edu) => (
                            <div key={edu.id} className="grid grid-cols-4 gap-4">
                                <div className="col-span-1 text-xs text-gray-400">
                                    <p>{edu.startDate}</p>
                                    <p>{edu.current ? 'Present' : edu.endDate}</p>
                                </div>
                                <div className="col-span-3">
                                    <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                                    <p className="text-gray-500 text-sm">{edu.institution}</p>
                                    {edu.field && <p className="text-gray-400 text-xs">{edu.field}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Footer: Skills & Languages */}
            <footer className="grid grid-cols-2 gap-10">
                {data.skills.length > 0 && (
                    <section>
                        <h2
                            className="text-xs uppercase tracking-widest mb-4 pb-2 border-b"
                            style={{ color: accentColor, borderColor: accentColor }}
                        >
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill) => (
                                <span
                                    key={skill.id}
                                    className="text-xs text-gray-600 px-2 py-1 border border-gray-200 rounded"
                                >
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {data.languages.length > 0 && (
                    <section>
                        <h2
                            className="text-xs uppercase tracking-widest mb-4 pb-2 border-b"
                            style={{ color: accentColor, borderColor: accentColor }}
                        >
                            Languages
                        </h2>
                        <div className="space-y-1">
                            {data.languages.map((lang) => (
                                <div key={lang.id} className="flex justify-between text-xs">
                                    <span className="text-gray-700">{lang.name}</span>
                                    <span className="text-gray-400 capitalize">{lang.proficiency}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </footer>
        </div>
    );
}
