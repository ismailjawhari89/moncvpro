'use client';

import type { TemplateData } from '@/types/cv';

interface ClassicTemplateProps {
    data: TemplateData;
    customizations?: {
        primaryColor?: string;
        fontFamily?: string;
    };
}

export default function ClassicTemplate({ data, customizations }: ClassicTemplateProps) {
    const primaryColor = customizations?.primaryColor || '#1f2937';

    return (
        <div
            className="bg-white p-8 shadow-lg max-w-4xl mx-auto"
            style={{ minHeight: '842px', fontFamily: customizations?.fontFamily || 'Georgia, serif' }}
        >
            {/* Header - Centered */}
            <header className="text-center border-b-2 pb-4 mb-6" style={{ borderColor: primaryColor }}>
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                    {data.personal.fullName || 'VOTRE NOM'}
                </h1>
                <div className="text-sm text-gray-600 space-x-3">
                    {data.personal.email && <span>{data.personal.email}</span>}
                    {data.personal.phone && <span>•</span>}
                    {data.personal.phone && <span>{data.personal.phone}</span>}
                    {data.personal.location && <span>•</span>}
                    {data.personal.location && <span>{data.personal.location}</span>}
                </div>
            </header>

            {/* Summary */}
            {data.personal.summary && (
                <section className="mb-5">
                    <h2
                        className="text-sm font-bold mb-2 uppercase border-b pb-1"
                        style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                    >
                        Résumé Professionnel
                    </h2>
                    <p className="text-gray-700 text-sm leading-relaxed">{data.personal.summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experiences.length > 0 && (
                <section className="mb-5">
                    <h2
                        className="text-sm font-bold mb-2 uppercase border-b pb-1"
                        style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                    >
                        Expérience Professionnelle
                    </h2>
                    <div className="space-y-3">
                        {data.experiences.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">{exp.position}</h3>
                                        <p className="text-gray-700 italic text-sm">{exp.company}</p>
                                    </div>
                                    <span className="text-xs text-gray-600">
                                        {exp.startDate} - {exp.current ? 'Présent' : exp.endDate}
                                    </span>
                                </div>
                                {exp.achievements && exp.achievements.length > 0 && (
                                    <ul className="list-disc list-inside text-gray-600 text-xs space-y-0.5 mt-1">
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
                <section className="mb-5">
                    <h2
                        className="text-sm font-bold mb-2 uppercase border-b pb-1"
                        style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                    >
                        Formation
                    </h2>
                    <div className="space-y-2">
                        {data.education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">{edu.degree}</h3>
                                        <p className="text-gray-700 text-sm">{edu.institution}</p>
                                        {edu.field && <p className="text-gray-600 italic text-xs">{edu.field}</p>}
                                    </div>
                                    <span className="text-xs text-gray-600">
                                        {edu.startDate} - {edu.current ? 'En cours' : edu.endDate}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills.length > 0 && (
                <section className="mb-5">
                    <h2
                        className="text-sm font-bold mb-2 uppercase border-b pb-1"
                        style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                    >
                        Compétences
                    </h2>
                    <p className="text-gray-700 text-sm">
                        {data.skills.map(s => s.name).join(', ')}
                    </p>
                </section>
            )}

            {/* Languages */}
            {data.languages.length > 0 && (
                <section>
                    <h2
                        className="text-sm font-bold mb-2 uppercase border-b pb-1"
                        style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                    >
                        Langues
                    </h2>
                    <div className="text-sm text-gray-700">
                        {data.languages.map((lang, idx) => (
                            <span key={lang.id}>
                                {lang.name} ({lang.proficiency})
                                {idx < data.languages.length - 1 && ', '}
                            </span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
