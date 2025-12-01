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

    const addSkill = () => {
        setSkills([...skills, {
            id: Date.now().toString(),
            name: '',
            category: 'technical'
        }]);
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
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        + {t('experience.add')}
                    </button>
                </div>
                {experiences.length === 0 && (
                    <p className="text-gray-500 text-center py-4">{t('experience.empty')}</p>
                )}
                {/* Experience items will be rendered here */}
            </section>

            {/* Education Section */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{t('education.title')}</h2>
                    <button
                        onClick={addEducation}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        + {t('education.add')}
                    </button>
                </div>
                {education.length === 0 && (
                    <p className="text-gray-500 text-center py-4">{t('education.empty')}</p>
                )}
            </section>

            {/* Skills Section */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{t('skills.title')}</h2>
                    <button
                        onClick={addSkill}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        + {t('skills.add')}
                    </button>
                </div>
                {skills.length === 0 && (
                    <p className="text-gray-500 text-center py-4">{t('skills.empty')}</p>
                )}
            </section>

            {/* Languages Section */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{t('languages.title')}</h2>
                    <button
                        onClick={addLanguage}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        + {t('languages.add')}
                    </button>
                </div>
                {languages.length === 0 && (
                    <p className="text-gray-500 text-center py-4">{t('languages.empty')}</p>
                )}
            </section>
        </div>
    );
}
