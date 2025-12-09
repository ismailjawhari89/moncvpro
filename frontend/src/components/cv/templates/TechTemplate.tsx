'use client';

import type { TemplateData } from '@/types/cv';

interface TechTemplateProps {
    data: TemplateData;
    customizations?: {
        primaryColor?: string;
        secondaryColor?: string;
        fontFamily?: string;
    };
}

export default function TechTemplate({ data, customizations }: TechTemplateProps) {
    const primaryColor = customizations?.primaryColor || '#0f172a';
    const accentColor = customizations?.secondaryColor || '#3b82f6';

    return (
        <div
            className="bg-slate-900 text-white shadow-lg max-w-4xl mx-auto"
            style={{
                minHeight: '842px',
                fontFamily: customizations?.fontFamily || "'JetBrains Mono', 'Fira Code', monospace"
            }}
        >
            {/* Terminal-style Header */}
            <header className="p-6 border-b border-slate-700">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-4 text-slate-400 text-xs">~/career/profile</span>
                </div>
                <div className="font-mono">
                    <p className="text-slate-400 text-sm">
                        <span className="text-green-400">const</span> <span style={{ color: accentColor }}>developer</span> = {'{'}
                    </p>
                    <p className="ml-4 text-lg">
                        <span className="text-purple-400">name:</span> <span className="text-amber-300">'{data.personal.fullName || 'Your Name'}'</span>,
                    </p>
                    <p className="ml-4 text-sm">
                        <span className="text-purple-400">email:</span> <span className="text-amber-300">'{data.personal.email}'</span>,
                    </p>
                    <p className="ml-4 text-sm">
                        <span className="text-purple-400">phone:</span> <span className="text-amber-300">'{data.personal.phone}'</span>,
                    </p>
                    {data.personal.location && (
                        <p className="ml-4 text-sm">
                            <span className="text-purple-400">location:</span> <span className="text-amber-300">'{data.personal.location}'</span>,
                        </p>
                    )}
                    <p className="text-slate-400 text-sm">{'}'}</p>
                </div>
            </header>

            <div className="p-6 space-y-6">
                {/* Bio/Summary */}
                {data.personal.summary && (
                    <section>
                        <p className="text-slate-400 text-xs mb-2">
                            <span className="text-green-400">/*</span> About Me <span className="text-green-400">*/</span>
                        </p>
                        <p className="text-slate-300 text-sm leading-relaxed pl-4 border-l-2" style={{ borderColor: accentColor }}>
                            {data.personal.summary}
                        </p>
                    </section>
                )}

                {/* Experience */}
                {data.experiences.length > 0 && (
                    <section>
                        <h2 className="text-xs text-slate-400 mb-4">
                            <span style={{ color: accentColor }}>{'<'}</span>Experience<span style={{ color: accentColor }}>{' />'}</span>
                        </h2>
                        <div className="space-y-4">
                            {data.experiences.map((exp, index) => (
                                <div key={exp.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold" style={{ color: accentColor }}>{exp.position}</h3>
                                            <p className="text-slate-400 text-sm">{exp.company}</p>
                                        </div>
                                        <span className="text-xs text-slate-500 font-mono">
                                            {exp.startDate} → {exp.current ? 'now' : exp.endDate}
                                        </span>
                                    </div>
                                    {exp.achievements && exp.achievements.length > 0 && (
                                        <ul className="text-sm text-slate-300 space-y-1 mt-2">
                                            {exp.achievements.map((achievement, idx) => (
                                                achievement && (
                                                    <li key={idx} className="flex items-start gap-2">
                                                        <span className="text-green-400">→</span>
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

                {/* Skills as Tags */}
                {data.skills.length > 0 && (
                    <section>
                        <h2 className="text-xs text-slate-400 mb-4">
                            <span style={{ color: accentColor }}>{'<'}</span>TechStack<span style={{ color: accentColor }}>{' />'}</span>
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill) => (
                                <span
                                    key={skill.id}
                                    className="px-3 py-1 rounded text-xs font-mono border"
                                    style={{
                                        borderColor: accentColor,
                                        color: accentColor,
                                        backgroundColor: `${accentColor}10`
                                    }}
                                >
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                <div className="grid grid-cols-2 gap-6">
                    {/* Education */}
                    {data.education.length > 0 && (
                        <section>
                            <h2 className="text-xs text-slate-400 mb-4">
                                <span style={{ color: accentColor }}>{'<'}</span>Education<span style={{ color: accentColor }}>{' />'}</span>
                            </h2>
                            <div className="space-y-3">
                                {data.education.map((edu) => (
                                    <div key={edu.id} className="text-sm">
                                        <p className="text-slate-200">{edu.degree}</p>
                                        <p className="text-slate-400 text-xs">{edu.institution}</p>
                                        <p className="text-slate-500 text-xs">{edu.field}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Languages */}
                    {data.languages.length > 0 && (
                        <section>
                            <h2 className="text-xs text-slate-400 mb-4">
                                <span style={{ color: accentColor }}>{'<'}</span>Languages<span style={{ color: accentColor }}>{' />'}</span>
                            </h2>
                            <div className="space-y-2">
                                {data.languages.map((lang) => (
                                    <div key={lang.id} className="flex items-center gap-2">
                                        <span className="text-sm text-slate-300">{lang.name}</span>
                                        <div className="flex-1 h-1 bg-slate-700 rounded overflow-hidden">
                                            <div
                                                className="h-full rounded"
                                                style={{
                                                    width: lang.proficiency === 'native' ? '100%' :
                                                        lang.proficiency === 'fluent' ? '85%' :
                                                            lang.proficiency === 'conversational' ? '60%' : '35%',
                                                    backgroundColor: accentColor
                                                }}
                                            />
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
