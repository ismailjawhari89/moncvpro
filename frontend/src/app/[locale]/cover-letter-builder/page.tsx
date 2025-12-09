'use client';

import React, { useState, useEffect } from 'react';
import { CoverLetterData } from '@/types/cover-letter';
import { defaultCoverLetterData } from '@/data/cover-letter-templates';
import CoverLetterForm from '@/components/cover-letter/CoverLetterForm';
import CoverLetterPreview from '@/components/cover-letter/CoverLetterPreview';
import TemplateSelector from '@/components/cover-letter/TemplateSelector';
import AIAssistantPanel from '@/components/cover-letter/AIAssistantPanel';
import ExportPanel from '@/components/cover-letter/ExportPanel';
import { Moon, Sun, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CoverLetterBuilderPage() {
    const [data, setData] = useState<CoverLetterData>(defaultCoverLetterData);
    const [isDark, setIsDark] = useState(false);
    const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Load from local storage on mount
    useEffect(() => {
        const savedData = localStorage.getItem('coverLetterDraft');
        if (savedData) {
            try {
                setData(JSON.parse(savedData));
            } catch (e) {
                console.error('Failed to load draft', e);
            }
        }

        // Check system theme
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDark(true);
        }
    }, []);

    // Auto-save
    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem('coverLetterDraft', JSON.stringify(data));
            setLastSaved(new Date());
        }, 2000);
        return () => clearTimeout(timer);
    }, [data]);

    const updateData = (section: keyof CoverLetterData, field: string, value: any) => {
        setData(prev => {
            if (section === 'tone' || section === 'templateId') {
                return { ...prev, [section]: value };
            }

            // Explicitly cast to Record<string, any> to satisfy TypeScript
            const sectionData = prev[section] as Record<string, any>;

            return {
                ...prev,
                [section]: {
                    ...sectionData,
                    [field]: value
                }
            };
        });
    };

    const handleTemplateSelect = (id: string) => {
        updateData('templateId', '', id);
    };

    const handleAIContentUpdate = (field: string, text: string) => {
        updateData('content', field, text);
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'
            }`}>
            {/* Sticky Header */}
            <header className={`sticky top-0 z-50 border-b backdrop-blur-md ${isDark ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                                CL
                            </div>
                            <span className="font-bold text-lg hidden sm:inline">Cover Letter Builder</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className={`text-xs hidden sm:flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                            <Save size={14} />
                            {lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Unsaved'}
                        </div>

                        <button
                            onClick={() => setIsDark(!isDark)}
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'
                                }`}
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Mobile Tab Switcher */}
                <div className="lg:hidden mb-6 flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                    <button
                        onClick={() => setActiveTab('editor')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'editor'
                                ? 'bg-blue-600 text-white'
                                : isDark ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-600'
                            }`}
                    >
                        Editor
                    </button>
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'preview'
                                ? 'bg-blue-600 text-white'
                                : isDark ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-600'
                            }`}
                    >
                        Preview
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column - Editor */}
                    <div className={`lg:col-span-7 space-y-6 ${activeTab === 'editor' ? 'block' : 'hidden lg:block'
                        }`}>
                        <CoverLetterForm
                            data={data}
                            updateData={updateData}
                            isDark={isDark}
                        />
                    </div>

                    {/* Right Column - Preview & Tools */}
                    <div className={`lg:col-span-5 space-y-6 ${activeTab === 'preview' ? 'block' : 'hidden lg:block'
                        }`}>
                        {/* Sticky Preview Container */}
                        <div className="sticky top-24 space-y-6">
                            {/* Live Preview */}
                            <div className={`rounded-xl overflow-hidden border shadow-lg ${isDark ? 'border-gray-800' : 'border-gray-200'
                                } h-[600px]`}>
                                <CoverLetterPreview data={data} isDark={isDark} />
                            </div>

                            {/* Tools Grid */}
                            <div className="grid grid-cols-1 gap-6">
                                <TemplateSelector
                                    currentTemplateId={data.templateId}
                                    onSelectTemplate={handleTemplateSelect}
                                    isDark={isDark}
                                />

                                <AIAssistantPanel
                                    data={data}
                                    onUpdateContent={handleAIContentUpdate}
                                    isDark={isDark}
                                />

                                <ExportPanel
                                    data={data}
                                    isDark={isDark}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
