'use client';

import React from 'react';
import { CoverLetterData, ToneStyle } from '@/types/cover-letter';
import { User, Building2, FileText, Sparkles, MapPin, Phone, Mail, Linkedin, Briefcase } from 'lucide-react';

interface CoverLetterFormProps {
    data: CoverLetterData;
    updateData: (section: keyof CoverLetterData, field: string, value: any) => void;
    isDark?: boolean;
}

export default function CoverLetterForm({ data, updateData, isDark = false }: CoverLetterFormProps) {

    const handleChange = (section: keyof CoverLetterData, field: string, value: any) => {
        updateData(section, field, value);
    };

    const inputClasses = `w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${isDark
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
        }`;

    const labelClasses = `block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'
        }`;

    const sectionClasses = `p-6 rounded-xl border shadow-sm mb-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
        }`;

    const tones: { value: ToneStyle; label: string; emoji: string }[] = [
        { value: 'professional', label: 'Professional', emoji: '👔' },
        { value: 'creative', label: 'Creative', emoji: '🎨' },
        { value: 'concise', label: 'Concise', emoji: '⚡' },
        { value: 'friendly', label: 'Friendly', emoji: '👋' },
        { value: 'formal', label: 'Formal', emoji: '⚖️' },
    ];

    return (
        <div className="space-y-6">
            {/* Personal Information */}
            <div className={sectionClasses}>
                <div className="flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400">
                    <User size={20} />
                    <h2 className="text-lg font-bold">Personal Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClasses}>Full Name</label>
                        <input
                            type="text"
                            value={data.personalInfo.fullName}
                            onChange={(e) => handleChange('personalInfo', 'fullName', e.target.value)}
                            className={inputClasses}
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className={labelClasses}>Current Position</label>
                        <input
                            type="text"
                            value={data.personalInfo.currentPosition}
                            onChange={(e) => handleChange('personalInfo', 'currentPosition', e.target.value)}
                            className={inputClasses}
                            placeholder="Software Engineer"
                        />
                    </div>
                    <div>
                        <label className={labelClasses}>Email</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="email"
                                value={data.personalInfo.email}
                                onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
                                className={`${inputClasses} pl-10`}
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label className={labelClasses}>Phone</label>
                        <div className="relative">
                            <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="tel"
                                value={data.personalInfo.phone}
                                onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)}
                                className={`${inputClasses} pl-10`}
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClasses}>LinkedIn URL (Optional)</label>
                        <div className="relative">
                            <Linkedin size={16} className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="url"
                                value={data.personalInfo.linkedIn}
                                onChange={(e) => handleChange('personalInfo', 'linkedIn', e.target.value)}
                                className={`${inputClasses} pl-10`}
                                placeholder="linkedin.com/in/johndoe"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Company Details */}
            <div className={sectionClasses}>
                <div className="flex items-center gap-2 mb-4 text-purple-600 dark:text-purple-400">
                    <Building2 size={20} />
                    <h2 className="text-lg font-bold">Target Company</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClasses}>Company Name</label>
                        <input
                            type="text"
                            value={data.companyInfo.companyName}
                            onChange={(e) => handleChange('companyInfo', 'companyName', e.target.value)}
                            className={inputClasses}
                            placeholder="Tech Corp Inc."
                        />
                    </div>
                    <div>
                        <label className={labelClasses}>Job Title Applying For</label>
                        <input
                            type="text"
                            value={data.companyInfo.jobTitle}
                            onChange={(e) => handleChange('companyInfo', 'jobTitle', e.target.value)}
                            className={inputClasses}
                            placeholder="Senior Developer"
                        />
                    </div>
                    <div>
                        <label className={labelClasses}>Hiring Manager Name (Optional)</label>
                        <input
                            type="text"
                            value={data.companyInfo.hiringManagerName}
                            onChange={(e) => handleChange('companyInfo', 'hiringManagerName', e.target.value)}
                            className={inputClasses}
                            placeholder="Jane Smith"
                        />
                    </div>
                    <div>
                        <label className={labelClasses}>Job Reference (Optional)</label>
                        <input
                            type="text"
                            value={data.companyInfo.jobReference}
                            onChange={(e) => handleChange('companyInfo', 'jobReference', e.target.value)}
                            className={inputClasses}
                            placeholder="REF-12345"
                        />
                    </div>
                </div>
            </div>

            {/* Tone Selector */}
            <div className={sectionClasses}>
                <div className="flex items-center gap-2 mb-4 text-amber-600 dark:text-amber-400">
                    <Sparkles size={20} />
                    <h2 className="text-lg font-bold">Tone & Style</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {tones.map((tone) => (
                        <button
                            key={tone.value}
                            onClick={() => handleChange('tone', '', tone.value)}
                            className={`p-3 rounded-lg border text-sm font-medium transition-all flex flex-col items-center gap-2 ${data.tone === tone.value
                                    ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-300 ring-1 ring-blue-500'
                                    : isDark
                                        ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-750'
                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <span className="text-xl">{tone.emoji}</span>
                            {tone.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Letter Content */}
            <div className={sectionClasses}>
                <div className="flex items-center gap-2 mb-4 text-green-600 dark:text-green-400">
                    <FileText size={20} />
                    <h2 className="text-lg font-bold">Letter Content</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className={labelClasses}>Introduction</label>
                            <span className="text-xs text-gray-400">
                                {data.content.introduction.length} chars
                            </span>
                        </div>
                        <textarea
                            value={data.content.introduction}
                            onChange={(e) => handleChange('content', 'introduction', e.target.value)}
                            className={`${inputClasses} min-h-[100px]`}
                            placeholder="State who you are and what position you are applying for..."
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className={labelClasses}>Body Paragraph 1 (Experience)</label>
                            <span className="text-xs text-gray-400">
                                {data.content.bodyParagraph1.length} chars
                            </span>
                        </div>
                        <textarea
                            value={data.content.bodyParagraph1}
                            onChange={(e) => handleChange('content', 'bodyParagraph1', e.target.value)}
                            className={`${inputClasses} min-h-[120px]`}
                            placeholder="Highlight your relevant experience and achievements..."
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className={labelClasses}>Body Paragraph 2 (Why this company?)</label>
                            <span className="text-xs text-gray-400">
                                {data.content.bodyParagraph2.length} chars
                            </span>
                        </div>
                        <textarea
                            value={data.content.bodyParagraph2}
                            onChange={(e) => handleChange('content', 'bodyParagraph2', e.target.value)}
                            className={`${inputClasses} min-h-[120px]`}
                            placeholder="Explain why you want to work for this specific company..."
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className={labelClasses}>Body Paragraph 3 (Skills & Fit)</label>
                            <span className="text-xs text-gray-400">
                                {data.content.bodyParagraph3.length} chars
                            </span>
                        </div>
                        <textarea
                            value={data.content.bodyParagraph3}
                            onChange={(e) => handleChange('content', 'bodyParagraph3', e.target.value)}
                            className={`${inputClasses} min-h-[120px]`}
                            placeholder="Discuss your skills and cultural fit..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClasses}>Closing</label>
                            <textarea
                                value={data.content.closing}
                                onChange={(e) => handleChange('content', 'closing', e.target.value)}
                                className={`${inputClasses} min-h-[80px]`}
                                placeholder="Reiterate your enthusiasm..."
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Call to Action</label>
                            <textarea
                                value={data.content.callToAction}
                                onChange={(e) => handleChange('content', 'callToAction', e.target.value)}
                                className={`${inputClasses} min-h-[80px]`}
                                placeholder="Request an interview..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
