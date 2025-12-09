'use client';

import React, { useState, useEffect } from 'react';
import {
    User as UserIcon,
    Briefcase,
    GraduationCap,
    Award,
    Languages as LanguagesIcon,
    Save,
    FileText,
    Moon,
    Sun,
    CheckCircle2,
    AlertCircle,
    Sparkles,
    RotateCcw,
    Loader2,
    Layout,
    Undo2,
    Redo2,
    History
} from 'lucide-react';
import { useCVStore } from '@/stores/useCVStore';
import CVPreview from './CVPreview';
import AIAssistant from './AIAssistant';
import PersonalInfoForm from './PersonalInfoForm';
import ExperienceSection from './ExperienceSection';
import EducationSection from './EducationSection';
import SkillsManager from './SkillsManager';
import LanguagesSection from './LanguagesSection';
import TemplatesGallery from './TemplatesGallery';
import { AutoSaveIndicator } from './AutoSaveIndicator';
import { Card } from '@/components/ui/FormFields';
import { cvApi } from '@/lib/api/cvApi';
import ExportPanel from './ExportPanel';
import HistoryPanel from './HistoryPanel';

type SectionType = 'personal' | 'experience' | 'education' | 'skills' | 'languages' | 'templates';

interface Toast {
    type: 'success' | 'error' | 'info';
    message: string;
}

export default function CVBuilder() {
    // --- Store (Using cvData with selectors for performance) ---
    const cvData = useCVStore((state) => state.cvData);
    const selectedTemplateFromStore = useCVStore((state) => state.cvData.template);
    const updatePersonalInfo = useCVStore((state) => state.updatePersonalInfo);
    const resetToDefault = useCVStore((state) => state.resetToDefault);
    const isApplyingTemplate = useCVStore((state) => state.isApplyingTemplate);

    // History
    const canUndo = useCVStore((state) => state.canUndo);
    const canRedo = useCVStore((state) => state.canRedo);
    const history = useCVStore((state) => state.history);
    const historyIndex = useCVStore((state) => state.historyIndex);
    const undo = useCVStore((state) => state.undo);
    const redo = useCVStore((state) => state.redo);

    // --- Local State ---
    const [selectedSection, setSelectedSection] = useState<SectionType>('personal');
    const [selectedTemplate, setSelectedTemplate] = useState<string>(selectedTemplateFromStore || 'modern');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [toast, setToast] = useState<Toast | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const isDark = theme === 'dark';

    // Sync template from store
    useEffect(() => {
        if (selectedTemplateFromStore) {
            setSelectedTemplate(selectedTemplateFromStore);
        }
    }, [selectedTemplateFromStore]);

    // Keyboard shortcuts for Undo/Redo
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            }
            if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
                e.preventDefault();
                redo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    // --- Handlers ---
    const handleTemplateChange = (templateId: string) => {
        setSelectedTemplate(templateId);
        // Scroll to personal section after applying template
        setSelectedSection('personal');
        showToast('success', 'Template applied successfully!');
    };

    const handleManualSave = async () => {
        setIsLoading(true);
        try {
            await cvApi.saveCV(cvData as any);
            showToast('success', 'CV saved to cloud successfully!');
        } catch (error) {
            console.error('Cloud save failed, saving locally:', error);
            try {
                localStorage.setItem('cv-backup', JSON.stringify(cvData));
                showToast('info', 'Saved locally (offline mode)');
            } catch (localError) {
                showToast('error', 'Failed to save.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
            resetToDefault();
            showToast('info', 'CV reset to blank form');
        }
    };

    const showToast = (type: Toast['type'], message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleAIGenerate = async (generatedData: any) => {
        try {
            const result = await cvApi.analyzeCV(cvData as any);
            if (result.success && result.analysis) {
                showToast('success', 'AI Analysis complete!');
            }
        } catch (error) {
            showToast('error', 'AI Analysis failed');
        }

        if (generatedData.personal) {
            updatePersonalInfo(generatedData.personal);
        }
        showToast('success', 'AI content applied!');
    };

    const sections = [
        { id: 'personal' as SectionType, icon: UserIcon, label: 'Personal Info' },
        { id: 'experience' as SectionType, icon: Briefcase, label: 'Experience' },
        { id: 'education' as SectionType, icon: GraduationCap, label: 'Education' },
        { id: 'skills' as SectionType, icon: Award, label: 'Skills' },
        { id: 'languages' as SectionType, icon: LanguagesIcon, label: 'Languages' },
        { id: 'templates' as SectionType, icon: Layout, label: 'Templates' },
    ];

    const renderSection = () => {
        switch (selectedSection) {
            case 'personal': return <PersonalInfoForm isDark={isDark} />;
            case 'experience': return <ExperienceSection isDark={isDark} />;
            case 'education': return <EducationSection isDark={isDark} />;
            case 'skills': return <SkillsManager isDark={isDark} />;
            case 'languages': return <LanguagesSection isDark={isDark} />;
            case 'templates': return (
                <TemplatesGallery
                    selectedTemplate={selectedTemplate as any}
                    onTemplateChange={handleTemplateChange}
                    isDark={isDark}
                />
            );
            default: return null;
        }
    };

    // Prevent hydration mismatch by waiting for mount
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
            {/* Header */}
            <header className={`sticky top-0 z-40 ${isDark ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-xl border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                                <FileText className="text-white" size={24} />
                            </div>
                            <div>
                                <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    CV Builder
                                </h1>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            {/* Undo Button */}
                            <button
                                onClick={undo}
                                disabled={!canUndo}
                                className={`p-2 rounded-lg transition-colors ${isDark
                                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 disabled:text-gray-600 disabled:hover:bg-gray-700'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:text-gray-300 disabled:hover:bg-gray-100'
                                    } disabled:cursor-not-allowed`}
                                title="Undo (Ctrl+Z)"
                            >
                                <Undo2 size={18} />
                            </button>

                            {/* Redo Button */}
                            <button
                                onClick={redo}
                                disabled={!canRedo}
                                className={`p-2 rounded-lg transition-colors ${isDark
                                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 disabled:text-gray-600 disabled:hover:bg-gray-700'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:text-gray-300 disabled:hover:bg-gray-100'
                                    } disabled:cursor-not-allowed`}
                                title="Redo (Ctrl+Y)"
                            >
                                <Redo2 size={18} />
                            </button>

                            {/* History Button */}
                            <button
                                onClick={() => setIsHistoryOpen(true)}
                                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${isDark
                                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                                title="View History"
                            >
                                <History size={16} />
                                <span className="text-xs font-medium">{historyIndex + 1}/{history.length || 0}</span>
                            </button>

                            <div className={`w-px h-6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />

                            {/* Reset Button */}
                            <button
                                onClick={handleReset}
                                className={`p-2 rounded-lg transition-colors ${isDark
                                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                                title="Reset to blank form"
                            >
                                <RotateCcw size={18} />
                            </button>

                            <ExportPanel
                                cvData={cvData as any}
                                previewElementId="cv-preview-content"
                                isDark={isDark}
                            />

                            <button
                                onClick={handleManualSave}
                                disabled={isLoading}
                                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                <span>{isLoading ? 'Saving...' : 'Save'}</span>
                            </button>

                            <button
                                onClick={toggleTheme}
                                className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-700" />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Loading Overlay when applying template */}
            {isApplyingTemplate && (
                <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
                    <div className="bg-white rounded-xl p-6 shadow-2xl flex items-center gap-3">
                        <Loader2 className="animate-spin text-blue-600" size={24} />
                        <span className="font-medium">Applying template...</span>
                    </div>
                </div>
            )}

            {/* Main Content - 3 Column Layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Sidebar - Sections Navigation */}
                    <div className="lg:col-span-3">
                        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'} p-4 lg:sticky lg:top-24 space-y-2`}>
                            <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide px-3 mb-3`}>
                                Sections
                            </h3>
                            {sections.map((section) => {
                                const Icon = section.icon;
                                const isActive = selectedSection === section.id;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setSelectedSection(section.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                            : isDark
                                                ? 'text-gray-300 hover:bg-gray-700'
                                                : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">{section.label}</span>
                                    </button>
                                );
                            })}
                            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                                <AIAssistant
                                    currentData={cvData as any}
                                    onGenerate={handleAIGenerate}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Middle - Editor */}
                    <div className="lg:col-span-5">
                        <Card isDark={isDark} className="p-6">
                            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
                                {sections.find(s => s.id === selectedSection)?.label}
                            </h2>
                            {renderSection()}
                        </Card>
                    </div>

                    {/* Right - Preview (STICKY) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
                            <CVPreview
                                selectedTemplate={selectedTemplate}
                                onTemplateChange={handleTemplateChange}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* History Panel */}
            <HistoryPanel
                isDark={isDark}
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
            />

            {/* Auto Save Indicator */}
            <AutoSaveIndicator />

            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-2 duration-300">
                    <div className={`px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 ${toast.type === 'success' ? 'bg-green-600 text-white' :
                        toast.type === 'error' ? 'bg-red-600 text-white' :
                            'bg-blue-600 text-white'
                        }`}>
                        {toast.type === 'success' && <CheckCircle2 size={20} />}
                        {toast.type === 'error' && <AlertCircle size={20} />}
                        {toast.type === 'info' && <Sparkles size={20} />}
                        <span className="font-medium">{toast.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
