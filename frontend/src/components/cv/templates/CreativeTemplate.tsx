'use client';

import type { TemplateData } from '@/types/cv';

interface CreativeTemplateProps {
    data: TemplateData;
    customizations?: {
        primaryColor?: string;
        secondaryColor?: string;
        fontFamily?: string;
    };
}

export default function CreativeTemplate({ data, customizations }: CreativeTemplateProps) {
    const primaryColor = customizations?.primaryColor || '#8b5cf6';
    const secondaryColor = customizations?.secondaryColor || '#ec4899';

    return (
        <div
            className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 shadow-lg max-w-4xl mx-auto"
            style={{ minHeight: '842px', fontFamily: customizations?.fontFamily }}
        >
            {/* Header with Gradient */}
            <header
                className="text-white p-6 rounded-2xl mb-6 shadow-md"
                style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
            >
                <h1 className="text-4xl font-black mb-3">
                    {data.personal.fullName || 'Votre Nom'}
                </h1>
                <div className="flex flex-wrap gap-3 text-sm">
                    {data.personal.email && (
                        <span className="bg-white/20 px-3 py-1 rounded-full">✉️ {data.personal.email}</span>
                    )}
                    {data.personal.phone && (
                        <span className="bg-white/20 px-3 py-1 rounded-full">📱 {data.personal.phone}</span>
                    )}
                    {data.personal.location && (
                        <span className="bg-white/20 px-3 py-1 rounded-full">📍 {data.personal.location}</span>
                    )}
                </div>
            </header>

            {/* Summary Card */}
            {data.personal.summary && (
                <section className="bg-white rounded-xl p-5 mb-5 shadow-sm">
                    <h2 className="text-lg font-bold text-purple-700 mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                        À Propos
                    </h2>
                    <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
                </section>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Left Column */}
                <div className="md:col-span-2 space-y-5">
                    {/* Experience */}
                    {data.experiences.length > 0 && (
                        <section className="bg-white rounded-xl p-5 shadow-sm">
                            <h2 className="text-lg font-bold text-purple-700 mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                                Expérience
                            </h2>
                            <div className="space-y-4">
                                {data.experiences.map((exp) => (
                                    <div key={exp.id} className="border-l-4 border-pink-400 pl-4">
                                        <h3 className="font-bold text-gray-900">{exp.position}</h3>
                                        <p className="text-purple-600 font-medium">{exp.company}</p>
                                        <p className="text-xs text-gray-500 mb-1">
                                            {exp.startDate} - {exp.current ? 'Présent' : exp.endDate}
                                        </p>
                                        {exp.achievements && exp.achievements.length > 0 && (
                                            <ul className="list-disc list-inside text-gray-600 text-sm space-y-0.5">
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
                        <section className="bg-white rounded-xl p-5 shadow-sm">
                            <h2 className="text-lg font-bold text-purple-700 mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                                Formation
                            </h2>
                            <div className="space-y-3">
                                {data.education.map((edu) => (
                                    <div key={edu.id} className="border-l-4 border-pink-400 pl-4">
                                        <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                                        <p className="text-purple-600">{edu.institution}</p>
                                        <p className="text-xs text-gray-500">
                                            {edu.startDate} - {edu.current ? 'En cours' : edu.endDate}
                                        </p>
                                        {edu.field && <p className="text-gray-600 text-sm">{edu.field}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="space-y-5">
                    {/* Skills */}
                    {data.skills.length > 0 && (
                        <section className="bg-white rounded-xl p-5 shadow-sm">
                            <h2 className="text-lg font-bold text-purple-700 mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                                Compétences
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map((skill) => (
                                    <span
                                        key={skill.id}
                                        className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs font-bold"
                                    >
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Languages */}
                    {data.languages.length > 0 && (
                        <section className="bg-white rounded-xl p-5 shadow-sm">
                            <h2 className="text-lg font-bold text-purple-700 mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                                Langues
                            </h2>
                            <div className="space-y-2">
                                {data.languages.map((lang) => (
                                    <div key={lang.id}>
                                        <p className="font-medium text-gray-900">{lang.name}</p>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                                style={{
                                                    width:
                                                        lang.proficiency === 'native' ? '100%' :
                                                            lang.proficiency === 'fluent' ? '85%' :
                                                                lang.proficiency === 'conversational' ? '65%' : '40%'
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
