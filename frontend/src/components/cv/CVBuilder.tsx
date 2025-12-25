'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
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
    History,
    Menu,
    X,
    Bot
} from 'lucide-react';
import { useSearchParams, useParams } from 'next/navigation';
import { useCVStore } from '@/stores/useCVStore';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

import MobileStickyBar from './MobileStickyBar';

// Dynamic Import for heavy CVPreview component (contains html2canvas and jsPDF)
const CVPreview = dynamic(() => import('./CVPreview'), {
    ssr: false,
    loading: () => {
        // Use a static translation here since loading state is complex
        return (
            <div className="w-full h-full min-h-[800px] flex items-center justify-center bg-white/5 animate-pulse rounded-lg">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                </div>
            </div>
        );
    }
});
import AIAssistant from './AIAssistant';
import PersonalInfoForm from './PersonalInfoForm';
import ExperienceSection from './ExperienceSection';
import EducationSection from './EducationSection';
import SkillsManager from './SkillsManager';
import LanguagesSection from './LanguagesSection';
import AITemplatesGallery from './AITemplatesGallery';
import { AutoSaveIndicator } from './AutoSaveIndicator';
import { Card } from '@/components/ui/FormFields';
import { cvApi } from '@/lib/api/cvApi';
import ExportPanel from './ExportPanel';
import HistoryPanel from './HistoryPanel';
import AIPhotoEditor from './AIPhotoEditor';
import { compressImage } from '@/utils/imageUtils';
import AuthModal from '@/components/auth/AuthModal';
import AISmartFixManager from './AISmartFixManager';

type SectionType = 'personal' | 'experience' | 'education' | 'skills' | 'languages' | 'templates';

interface Toast {
    type: 'success' | 'error' | 'info';
    message: string;
}

export default function CVBuilder() {
    const t = useTranslations('cvBuilder');
    const tCommon = useTranslations('common');
    const params = useParams();

    // --- Store (Using cvData with selectors for performance) ---
    const cvData = useCVStore((state) => state.cvData);
    const selectedTemplateFromStore = useCVStore((state) => state.cvData.template);
    const updatePersonalInfo = useCVStore((state) => state.updatePersonalInfo);
    const resetToDefault = useCVStore((state) => state.resetToDefault);
    const isApplyingTemplate = useCVStore((state) => state.isApplyingTemplate);
    const setSelectedTemplateInStore = useCVStore((state) => state.setSelectedTemplate);

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
    const [isAIEditorOpen, setIsAIEditorOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAIMobileOpen, setIsAIMobileOpen] = useState(false);
    const [showMobilePreview, setShowMobilePreview] = useState(false);

    const isDark = theme === 'dark';

    // URL Params Handling
    const searchParams = useSearchParams();

    // Sync template from store
    useEffect(() => {
        if (selectedTemplateFromStore) {
            setSelectedTemplate(selectedTemplateFromStore);
        }
    }, [selectedTemplateFromStore]);

    // Apply template from URL
    useEffect(() => {
        const templateParam = searchParams.get('template');
        if (templateParam && templateParam !== selectedTemplateFromStore) {
            setSelectedTemplateInStore(templateParam as any);
        }
    }, [searchParams, setSelectedTemplateInStore, selectedTemplateFromStore]);

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
        setSelectedTemplateInStore(templateId as any);
        // Scroll to personal section after applying template
        setSelectedSection('personal');
        showToast('success', t('toasts.templateApplied'));
    };

    const cloudStatus = useCVStore((state) => state.cloud.status);
    const cloudError = useCVStore((state) => state.cloud.error);
    const resetCloudStatus = useCVStore((state) => state.resetCloudStatus);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Watch for Unauthorized error
    useEffect(() => {
        if (cloudStatus === 'error' && cloudError === 'UNAUTHORIZED') {
            setIsAuthModalOpen(true);
            resetCloudStatus(); // Reset so it doesn't loop
        }
    }, [cloudStatus, cloudError, resetCloudStatus]);

    const handleManualSave = async () => {
        setIsLoading(true);
        try {
            await cvApi.saveCV(cvData);
            showToast('success', t('toasts.cvSaved'));
        } catch (error: any) {
            console.error('Cloud save failed:', error);
            if (error?.message?.includes('Unauthorized') || error?.toString().includes('Unauthorized')) {
                setIsAuthModalOpen(true);
            } else {
                // Fallback to local
                try {
                    localStorage.setItem('cv-backup', JSON.stringify(cvData));
                    showToast('info', t('toasts.savedLocally'));
                } catch (localError) {
                    showToast('error', t('toasts.saveFailed'));
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        if (confirm(t('confirmations.reset'))) {
            resetToDefault();
            showToast('info', t('toasts.resetSuccess'));
        }
    };

    // Load sample/demo data for the current template
    const loadSampleDataForCurrentTemplate = useCVStore((state) => state.loadSampleDataForCurrentTemplate);

    const handleLoadDemoData = () => {
        if (confirm(t('confirmLoadDemo'))) {
            loadSampleDataForCurrentTemplate();
            showToast('success', t('demoLoaded'));
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
            const result = await cvApi.analyzeCV(cvData);
            if (result.success && result.analysis) {
                showToast('success', t('toasts.analysisComplete'));
            }
        } catch (error) {
            showToast('error', t('toasts.analysisFailed'));
        }

        if (generatedData.personal) {
            updatePersonalInfo(generatedData.personal);
        }
        showToast('success', t('toasts.contentApplied'));
    };

    const sections = [
        { id: 'personal' as SectionType, icon: UserIcon, label: t('tabs.personal') },
        { id: 'experience' as SectionType, icon: Briefcase, label: t('tabs.experience') },
        { id: 'education' as SectionType, icon: GraduationCap, label: t('tabs.education') },
        { id: 'skills' as SectionType, icon: Award, label: t('tabs.skills') },
        { id: 'languages' as SectionType, icon: LanguagesIcon, label: t('tabs.languages') },
        { id: 'templates' as SectionType, icon: Layout, label: t('tabs.templates') },
    ];

    const renderSection = () => {
        switch (selectedSection) {
            case 'personal': return (
                <PersonalInfoForm
                    isDark={isDark}
                    onEnhancePhoto={() => setIsAIEditorOpen(true)}
                />
            );
            case 'experience': return <ExperienceSection isDark={isDark} />;
            case 'education': return <EducationSection isDark={isDark} />;
            case 'skills': return <SkillsManager isDark={isDark} />;
            case 'languages': return <LanguagesSection isDark={isDark} />;
            case 'templates': return (
                <AITemplatesGallery
                    selectedTemplate={selectedTemplate}
                    onTemplateChange={handleTemplateChange}
                    isDark={isDark}
                    locale={params.locale as string}
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
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300 pb-24 lg:pb-0`}>
            {/* Header */}
            <header className={`sticky top-0 z-40 ${isDark ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-xl border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className={`lg:hidden p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                                    }`}
                            >
                                <Menu size={20} />
                            </button>

                            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                                <FileText className="text-white" size={24} />
                            </div>
                            <div>
                                <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} hidden sm:block`}>
                                    {t('title')}
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
                                title={t('undo') + " (Ctrl+Z)"}
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
                                title={t('redo') + " (Ctrl+Y)"}
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
                                title={t('history')}
                            >
                                <History size={16} />
                                <span className="text-xs font-medium hidden sm:inline">{historyIndex + 1}/{history.length || 0}</span>
                            </button>

                            <div className={`w-px h-6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />

                            {/* Reset Button */}
                            <button
                                onClick={handleReset}
                                className={`p-2 rounded-lg transition-colors ${isDark
                                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                                title={t('startFresh')}
                            >
                                <RotateCcw size={18} />
                            </button>

                            {/* Load Demo Data Button */}
                            <button
                                onClick={handleLoadDemoData}
                                className={`hidden sm:flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${isDark
                                    ? 'bg-purple-700 hover:bg-purple-600 text-white'
                                    : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                                    }`}
                                title={t('loadSampleData')}
                            >
                                <Sparkles size={16} />
                                <span className="text-sm font-medium">{t('demo')}</span>
                            </button>

                            <ExportPanel
                                cvData={cvData}
                                previewElementId="cv-preview-content"
                                isDark={isDark}
                            />

                            <button
                                onClick={handleManualSave}
                                disabled={isLoading}
                                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                <span>{isLoading ? t('saving') : tCommon('save')}</span>
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
                        <span className="font-medium">{t('applyingTemplate')}</span>
                    </div>
                </div>
            )}

            {/* Main Content - 3 Column Layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Sidebar - Sections Navigation */}
                    <div className="hidden lg:block lg:col-span-3">
                        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'} p-4 lg:sticky lg:top-24 space-y-2`}>
                            <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide px-3 mb-3`}>
                                {tCommon('all')}
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
                                    currentData={cvData}
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

                    {/* Right - Preview (Desktop: Sticky, Mobile: Hidden/Modal) */}
                    <div className="lg:col-span-4 hidden lg:block">
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

            {/* AI Photo Editor Modal */}
            {isAIEditorOpen && (
                <AIPhotoEditor
                    currentPhotoUrl={cvData.personalInfo.photoUrl}
                    onClose={() => setIsAIEditorOpen(false)}
                    onSave={async (newPhotoUrl) => {
                        try {
                            const compressed = await compressImage(newPhotoUrl);
                            updatePersonalInfo({ photoUrl: compressed });
                            showToast('success', t('toasts.photoEnhanced'));
                        } catch (e) {
                            console.error('Compression failed', e);
                            updatePersonalInfo({ photoUrl: newPhotoUrl });
                        } finally {
                            setIsAIEditorOpen(false);
                        }
                    }}
                />
            )}

            {/* Auth Modal for Saving */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={() => {
                    setIsAuthModalOpen(false);
                    // Retry save automatically after login
                    handleManualSave();
                }}
            />

            {/* Auto Save Indicator */}
            <AutoSaveIndicator />

            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-24 lg:bottom-6 right-6 z-50 animate-in slide-in-from-bottom-2 duration-300">
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

            {/* Mobile Sidebar Drawer */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className={`absolute left-0 top-0 bottom-0 w-3/4 max-w-sm ${isDark ? 'bg-gray-900 border-r border-gray-800' : 'bg-white border-r border-gray-200'} shadow-xl p-4 overflow-y-auto transition-transform duration-300`}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('menu')}</h2>
                            <button onClick={() => setIsMobileMenuOpen(false)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide px-3 mb-3`}>
                                {tCommon('all')}
                            </h3>
                            {sections.map((section) => {
                                const Icon = section.icon;
                                const isActive = selectedSection === section.id;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => {
                                            setSelectedSection(section.id);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                            : isDark
                                                ? 'text-gray-300 hover:bg-gray-800'
                                                : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">{section.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Actions Sticky Bar */}
            <MobileStickyBar
                isSaving={isLoading}
                onSave={handleManualSave}
                onPreview={() => setShowMobilePreview(true)}
                onAI={() => setIsAIMobileOpen(true)}
            />

            {/* Mobile AI Bottom Sheet (PersistentState) */}
            <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${isAIMobileOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAIMobileOpen(false)} />
                <motion.div
                    className={`absolute bottom-0 left-0 right-0 ${isDark ? 'bg-gray-900 border-t border-gray-800' : 'bg-white border-t border-gray-200'} rounded-t-2xl shadow-xl max-h-[85vh] h-[85vh] overflow-y-auto`}
                    initial={{ y: '100%' }}
                    animate={{ y: isAIMobileOpen ? 0 : '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    drag="y"
                    dragConstraints={{ top: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, info: PanInfo) => {
                        if (info.offset.y > 100 || info.velocity.y > 500) {
                            setIsAIMobileOpen(false);
                        }
                    }}
                >
                    <div className="sticky top-0 z-10 flex flex-col items-center p-2 border-b border-gray-100 dark:border-gray-800 bg-inherit rounded-t-2xl cursor-grab active:cursor-grabbing">
                        {/* Drag Handle */}
                        <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mb-3" />

                        <div className="w-full flex items-center justify-between px-2">
                            <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                <Sparkles className="text-purple-500" size={20} />
                                {t('tabs.ai')}
                            </h2>
                            <button onClick={() => setIsAIMobileOpen(false)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 80px)' }} onPointerDown={(e) => e.stopPropagation()}>
                        {/* stopPropagation on content to prevent dragging when scrolling content */}
                        <AIAssistant
                            currentData={cvData}
                            onGenerate={(data) => {
                                handleAIGenerate(data);
                                setIsAIMobileOpen(false);
                            }}
                        />
                    </div>
                </motion.div>
            </div>

            {/* Mobile Preview Modal */}
            {showMobilePreview && (
                <div className="fixed inset-0 z-[60] bg-gray-50 dark:bg-gray-900 lg:hidden flex flex-col">
                    <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
                        <h2 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('livePreview')}</h2>
                        <button onClick={() => setShowMobilePreview(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <CVPreview
                            selectedTemplate={selectedTemplate}
                            onTemplateChange={handleTemplateChange}
                        />
                    </div>
                </div>
            )}

            {/* AI Smart Fix Manager */}
            <AISmartFixManager />
        </div>
    );
}
