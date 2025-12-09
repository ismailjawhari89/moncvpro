'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Sparkles } from 'lucide-react';

interface AIGeneratorProps {
    onGenerate: (data: any) => void;
    sectionType?: string;
    currentData?: any;
}

const AIGenerator: React.FC<AIGeneratorProps> = ({ onGenerate, sectionType, currentData }) => {
    const t = useTranslations('AIGenerator');
    const [isLoading, setIsLoading] = useState(false);
    const [prompt, setPrompt] = useState('');

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsLoading(true);

        try {
            // Mock AI response
            const isGeneral = !sectionType;

            let response: any;

            if (isGeneral) {
                // General generation (e.g. "Create a CV for a software engineer")
                response = {
                    summary: `Experienced professional with 5+ years in ${prompt}.`,
                    experiences: [
                        {
                            id: Date.now().toString(),
                            company: 'Tech Corp',
                            position: 'Senior Developer',
                            startDate: '2020-01',
                            endDate: '2023-01',
                            current: false,
                            achievements: [`Worked on ${prompt} related projects.`],
                            description: `Worked on ${prompt} related projects.`
                        }
                    ]
                };
            } else {
                // Section specific
                response = `AI content for ${sectionType}: ${prompt}`;
            }

            setTimeout(() => {
                onGenerate(response);
                setIsLoading(false);
                setPrompt('');
            }, 1000);

        } catch (error) {
            console.error('AI Generation error:', error);
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                    AI Assistant
                </h4>
            </div>

            <div className="space-y-3">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={sectionType ? `Describe your ${sectionType}...` : "Describe your role (e.g. 'Software Engineer')..."}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800"
                    rows={3}
                />

                <div className="flex justify-between items-center">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt.trim()}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Generate
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIGenerator;
