'use client';

import React from 'react';
import { coverLetterTemplates } from '@/data/cover-letter-templates';
import { Check } from 'lucide-react';

interface TemplateSelectorProps {
    currentTemplateId: string;
    onSelectTemplate: (id: string) => void;
    isDark?: boolean;
}

export default function TemplateSelector({ currentTemplateId, onSelectTemplate, isDark = false }: TemplateSelectorProps) {
    return (
        <div className={`p-6 rounded-xl border shadow-sm ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
            }`}>
            <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Choose Template
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {coverLetterTemplates.map((template) => (
                    <button
                        key={template.id}
                        onClick={() => onSelectTemplate(template.id)}
                        className={`group relative rounded-lg overflow-hidden border-2 transition-all text-left ${currentTemplateId === template.id
                                ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900'
                                : isDark
                                    ? 'border-gray-700 hover:border-gray-500'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        {/* Preview Image Placeholder */}
                        <div className={`aspect-[3/4] w-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'
                            } relative`}>
                            {/* In a real app, use Next.js Image here */}
                            <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 p-2 text-center">
                                {template.name} Preview
                            </div>

                            {/* Selected Overlay */}
                            {currentTemplateId === template.id && (
                                <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                                    <div className="bg-blue-500 text-white p-1.5 rounded-full shadow-lg">
                                        <Check size={16} />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={`p-2 text-xs font-medium truncate border-t ${isDark
                                ? 'bg-gray-800 border-gray-700 text-gray-300'
                                : 'bg-white border-gray-200 text-gray-700'
                            }`}>
                            {template.name}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
