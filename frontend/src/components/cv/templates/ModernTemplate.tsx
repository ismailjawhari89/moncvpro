'use client';

import type { TemplateData } from '@/types/cv';

interface ModernTemplateProps {
    data: TemplateData;
    customizations?: {
        primaryColor?: string;
        fontFamily?: string;
    };
}

export default function ModernTemplate({ data, customizations }: ModernTemplateProps) {
    const primaryColor = customizations?.primaryColor || '#2563eb';

    return (
        <div
            className="bg-white p-8 shadow-lg max-w-4xl mx-auto"
            style={{ minHeight: '842px', fontFamily: customizations?.fontFamily }}
        >
            {/* Header */}
            <header className="border-b-4 pb-6 mb-6" style={{ borderColor: primaryColor }}>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {data.personal.fullName || 'Votre Nom'}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {data.personal.email && <span>✉️ {data.personal.email}</span>}
                    {data.personal.phone && <span>📱 {data.personal.phone}</span>}
                    {data.personal.location && <span>📍 {data.personal.location}</span>}
                </div>
            </header>

            {/* Summary */}
            {data.personal.summary && (
                <section className="mb-6">
                    <h2
                        className="text-xl font-semibold mb-3 uppercase tracking-wide"
                        style={{ color: primaryColor }}
                    >
                        Profil
                    </h2>
                    <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experiences.length > 0 && (
                <section className="mb-6">
                    <h2
                        className="text-xl font-semibold mb-3 uppercase tracking-wide"
                        style={{ color: primaryColor }}
                    >
                        Expérience Professionnelle
                    </h2>
                    <div className="space-y-4">
                        {data.experiences.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                                    <span className="text-sm text-gray-600">
                                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                    </span>
                                </div>
                                <p className="text-gray-700 font-medium mb-2">{exp.company}</p>
                                {exp.achievements && exp.achievements.length > 0 && (
                                    <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                                        {exp.achievements.map((achievement, idx) => (
                                            achievement && <li key={idx}>{achievement}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {data.education.length > 0 && (
                <section className="mb-6">
                    <h2
                        className="text-xl font-semibold mb-3 uppercase tracking-wide"
                        style={{ color: primaryColor }}
                    >
                        Formation
                    </h2>
                    <div className="space-y-3">
                        {data.education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                                    <span className="text-sm text-gray-600">
                                        {edu.startDate} - {edu.current ? 'En cours' : edu.endDate}
                                    </span>
                                </div>
                                <p className="text-gray-700">{edu.institution}</p>
                                {edu.field && <p className="text-gray-600 text-sm">{edu.field}</p>}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills & Languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Skills */}
                {data.skills.length > 0 && (
                    <section>
                        <h2
                            className="text-xl font-semibold mb-3 uppercase tracking-wide"
                            style={{ color: primaryColor }}
                        >
                            Compétences
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill) => (
                                <span
                                    key={skill.id}
                                    className="px-3 py-1 rounded-full text-sm font-medium"
                                    style={{
                                        backgroundColor: `${primaryColor}20`,
                                        color: primaryColor
                                    }}
                                >
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Languages */}
                {data.languages.length > 0 && (
                    <section>
                        <h2
                            className="text-xl font-semibold mb-3 uppercase tracking-wide"
                            style={{ color: primaryColor }}
                        >
                            Langues
                        </h2>
                        <div className="space-y-1">
                            {data.languages.map((lang) => (
                                <div key={lang.id} className="flex justify-between">
                                    <span className="text-gray-700">{lang.name}</span>
                                    <span className="text-gray-600 text-sm capitalize">{lang.proficiency}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
