'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { CVData, PersonalInfo, Experience, Education, Skill, Language } from '@/types/cv';

interface CVFormProps {
    initialData?: CVData;
    onDataChange: (data: CVData) => void;
}

export default function CVForm({ initialData, onDataChange }: CVFormProps) {
    const t = useTranslations('cv-form');

    const [personal, setPersonal] = useState<PersonalInfo>(
        initialData?.personal || {
            fullName: '',
            email: '',
            phone: '',
            location: '',
            summary: ''
        }
    );

    const [experiences, setExperiences] = useState<Experience[]>(initialData?.experiences || []);
    const [education, setEducation] = useState<Education[]>(initialData?.education || []);
    const [skills, setSkills] = useState<Skill[]>(initialData?.skills || []);
    const [languages, setLanguages] = useState<Language[]>(initialData?.languages || []);

    // Update parent whenever data changes
    const updateCV = () => {
        onDataChange({
            personal,
            experiences,
            education,
            skills,
            languages
        });
    };

    const updateExperience = (id: string, field: keyof Experience, value: any) => {
        setExperiences(experiences.map(exp =>
            exp.id === id ? { ...exp, [field]: value } : exp
        ));
        updateCV();
    };

    const deleteExperience = (id: string) => {
        setExperiences(experiences.filter(exp => exp.id !== id));
        updateCV();
    };

    const addExperience = () => {
        setExperiences([...experiences, {
            id: Date.now().toString(),
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            current: false,
            achievements: ['']
        }]);
    };

    const updateEducation = (id: string, field: keyof Education, value: any) => {
        setEducation(education.map(edu =>
            edu.id === id ? { ...edu, [field]: value } : edu
        ));
        updateCV();
    };

    const deleteEducation = (id: string) => {
        setEducation(education.filter(edu => edu.id !== id));
        updateCV();
    };

    const addEducation = () => {
        setEducation([...education, {
            id: Date.now().toString(),
            institution: '',
            degree: '',
            field: '',
            startDate: '',
            endDate: '',
            current: false
        }]);
    };

    const updateSkill = (id: string, field: keyof Skill, value: any) => {
        setSkills(skills.map(skill =>
            skill.id === id ? { ...skill, [field]: value } : skill
        ));
        updateCV();
    };

    const deleteSkill = (id: string) => {
        setSkills(skills.filter(skill => skill.id !== id));
        updateCV();
    };

    const addSkill = () => {
        setSkills([...skills, {
            id: Date.now().toString(),
            name: '',
            category: 'technical'
        }]);
    };

    const updateLanguage = (id: string, field: keyof Language, value: any) => {
        setLanguages(languages.map(lang =>
            lang.id === id ? { ...lang, [field]: value } : lang
        ));
        updateCV();
    };

    const deleteLanguage = (id: string) => {
        setLanguages(languages.filter(lang => lang.id !== id));
        updateCV();
    };

    const addLanguage = () => {
        setLanguages([...languages, {
            id: Date.now().toString(),
            name: '',
            proficiency: 'conversational'
        }]);
    };

    return (
        <div className="space-y-8 p-6 bg-white rounded-lg shadow-sm">
            {/* Personal Information */}
            <section>
                <h2 className="text-2xl font-bold mb-4">{t('personal.title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder={t('personal.fullName')}
                        value={personal.fullName}
                        onChange={(e) => {
                            setPersonal({ ...personal, fullName: e.target.value });
                            updateCV();
                        }}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="email"
                        placeholder={t('personal.email')}
                        value={personal.email}
                        onChange={(e) => {
                            setPersonal({ ...personal, email: e.target.value });
                            updateCV();
                        }}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="tel"
                        placeholder={t('personal.phone')}
                        value={personal.phone}
                        onChange={(e) => {
                            setPersonal({ ...personal, phone: e.target.value });
                            updateCV();
                        }}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        placeholder={t('personal.location')}
                        value={personal.location}
                        onChange={(e) => {
                            setPersonal({ ...personal, location: e.target.value });
                            updateCV();
                        }}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <textarea
                    placeholder={t('personal.summary')}
                    value={personal.summary}
                    onChange={(e) => {
                        setPersonal({ ...personal, summary: e.target.value });
                        updateCV();
                    }}
                    rows={4}
                    className="mt-4 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
            </section>

            {/* Experience Section */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{t('experience.title')}</h2>
                    <button
                        onClick={addExperience}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        + {t('experience.add')}
                    </button>
                </div>
                {experiences.length === 0 && (
                    <p className="text-gray-500 text-center py-4">{t('experience.empty')}</p>
                )}
                <div className="space-y-4">
                    {experiences.map((exp) => (
                        <div key={exp.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex justify-end">
                                <button
                                    onClick={() => deleteExperience(exp.id)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                >
                                    🗑️ Supprimer
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="Entreprise"
                                    value={exp.company}
                                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                    className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Poste"
                                    value={exp.position}
                                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                                    className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="month"
                                    placeholder="Date début"
                                    value={exp.startDate}
                                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                    className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="month"
                                    placeholder="Date fin"
                                    value={exp.endDate}
                                    disabled={exp.current}
                                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                    className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                />
                            </div>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={exp.current}
                                    onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm">Poste actuel</span>
                            </label>
                            <textarea
                                placeholder="Réalisations (une par ligne)"
                                value={exp.achievements.join('\n')}
                                onChange={(e) => updateExperience(exp.id, 'achievements', e.target.value.split('\n'))}
                                rows={3}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Education Section */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{t('education.title')}</h2>
                    <button
                        onClick={addEducation}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        + {t('education.add')}
                    </button>
                </div>
                {education.length === 0 && (
                    <p className="text-gray-500 text-center py-4">{t('education.empty')}</p>
                )}
                <div className="space-y-4">
                    {education.map((edu) => (
                        <div key={edu.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex justify-end">
                                <button
                                    onClick={() => deleteEducation(edu.id)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                >
                                    🗑️ Supprimer
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="Institution"
                                    value={edu.institution}
                                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                    className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Diplôme"
                                    value={edu.degree}
                                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                    className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Domaine"
                                    value={edu.field}
                                    onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                                    className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="month"
                                        value={edu.startDate}
                                        onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                                        className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="month"
                                        value={edu.endDate}
                                        disabled={edu.current}
                                        onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                        className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    />
                                </div>
                            </div>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={edu.current}
                                    onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm">En cours</span>
                            </label>
                        </div>
                    ))}
                </div>
            </section>

            {/* Skills Section */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{t('skills.title')}</h2>
                    <button
                        onClick={addSkill}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        + {t('skills.add')}
                    </button>
                </div>
                {skills.length === 0 && (
                    <p className="text-gray-500 text-center py-4">{t('skills.empty')}</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {skills.map((skill) => (
                        <div key={skill.id} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Compétence"
                                value={skill.name}
                                onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                                className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <select
                                value={skill.category}
                                onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                                className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="technical">Technique</option>
                                <option value="soft">Soft Skill</option>
                            </select>
                            <button
                                onClick={() => deleteSkill(skill.id)}
                                className="px-3 py-2 text-red-600 hover:text-red-800"
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Languages Section */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{t('languages.title')}</h2>
                    <button
                        onClick={addLanguage}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        + {t('languages.add')}
                    </button>
                </div>
                {languages.length === 0 && (
                    <p className="text-gray-500 text-center py-4">{t('languages.empty')}</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {languages.map((lang) => (
                        <div key={lang.id} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Langue"
                                value={lang.name}
                                onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                                className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <select
                                value={lang.proficiency}
                                onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                                className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="basic">Basique</option>
                                <option value="conversational">Conversationnel</option>
                                <option value="fluent">Courant</option>
                                <option value="native">Natif</option>
                            </select>
                            <button
                                onClick={() => deleteLanguage(lang.id)}
                                className="px-3 py-2 text-red-600 hover:text-red-800"
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
