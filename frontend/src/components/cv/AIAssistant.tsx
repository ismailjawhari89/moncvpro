'use client';

import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    Sparkles,
    Wand2,
    Loader2,
    X,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Lightbulb,
    Target,
    Brain,
    ChevronRight,
    Zap,
    BarChart3,
    Undo2,
    Redo2,
    History,
    Check,
    Eye,
    EyeOff,
    ArrowRight,
    RefreshCw,
    Briefcase,
    FileText,
    Award,
    PenTool,
    Settings2,
    Crosshair,
    Download,
    ChevronDown
} from 'lucide-react';
import type { CVData } from '@/types/cv';
import { useCVStore } from '@/stores/useCVStore';
import { generateCVContent } from '@/services/api';
import { aiService } from '@/services/aiService';
import HistoryPanel from './HistoryPanel';
import ATSDashboard from './ATSDashboard';
import JobMatcher from './JobMatcher';
import STARBuilder from './STARBuilder';
import { streamCoverLetter } from '@/lib/cover-letter-service';
import { generateFullCVContent } from '@/lib/cv-generation-service';
import { useTranslations } from 'next-intl';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CoverLetterPDF } from './pdf-templates/CoverLetterPDF';

interface AIAssistantProps {
    onGenerate?: (data: Partial<CVData>) => void;
    currentData?: CVData;
}
interface ATSAnalysis {
    score: number;
    missingKeywords: string[];
    suggestions: string[];
    strengths: string[];
    weaknesses: string[];
}

interface PreviewChanges {
    section: string;
    before: string;
    after: string;
    applied: boolean;
}

import ProWaitlistForm from '@/components/marketing/ProWaitlistForm';

// Limit Reached Modal
function LimitModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const t = useTranslations('aiAssistant.limitModal');
    if (!isOpen) return null;
    // ...

    const [showWaitlist, setShowWaitlist] = useState(false);

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors bg-gray-100 dark:bg-gray-800 rounded-full"
                >
                    <X size={16} />
                </button>

                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Sparkles size={32} className="text-blue-600 dark:text-blue-400" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {showWaitlist ? t('titlePro') : t('titleReached')}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        {showWaitlist
                            ? t('descPro')
                            : t('descReached')}
                    </p>

                    {showWaitlist ? (
                        <ProWaitlistForm source="limit_modal" onSuccess={() => setTimeout(onClose, 2500)} />
                    ) : (
                        <div className="space-y-3">
                            <button
                                onClick={() => setShowWaitlist(true)}
                                className="block w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
                            >
                                {t('unlockBtn')}
                            </button>

                            <button
                                onClick={onClose}
                                className="block w-full py-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                {t('continueBtn')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Modal Portal Component
function ModalPortal({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    return createPortal(children, document.body);
}

export default function AIAssistant({ onGenerate, currentData }: AIAssistantProps) {
    const t = useTranslations('aiAssistant');
    const [isOpen, setIsOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'generate' | 'analyze' | 'match' | 'star' | 'improve' | 'letter'>('generate');
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
    const [improvements, setImprovements] = useState<{ section: string; improvement: string }[]>([]);
    const [coverLetterLoading, setCoverLetterLoading] = useState(false);
    const [coverLetterTone, setCoverLetterTone] = useState<'professional' | 'confident' | 'friendly'>('professional');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [usageStats, setUsageStats] = useState({ used: 0, limit: 3, remaining: 3 });

    // Preview Mode for AI Suggestions
    const [previewMode, setPreviewMode] = useState(false);
    const [pendingChanges, setPendingChanges] = useState<Partial<CVData> | null>(null);
    const [previewChanges, setPreviewChanges] = useState<PreviewChanges[]>([]);

    // Load usage stats on mount and when modal opens
    useEffect(() => {
        setUsageStats(aiService.getUsageState());
    }, [isOpen]);

    // Smart Improve settings
    const [improveSettings, setImproveSettings] = useState({
        actionVerbs: true,
        keywords: true,
        metrics: true,
        summaryExpansion: true,
        skillSuggestions: true
    });

    // Get store data and actions
    const cvData = useCVStore(state => state.cvData);
    const canUndo = useCVStore(state => state.canUndo);
    const canRedo = useCVStore(state => state.canRedo);
    const history = useCVStore(state => state.history);
    const historyIndex = useCVStore(state => state.historyIndex);

    const applyAISuggestion = useCVStore(state => state.applyAISuggestion);
    const undo = useCVStore(state => state.undo);
    const redo = useCVStore(state => state.redo);
    const updatePersonalInfo = useCVStore(state => state.updatePersonalInfo);
    const updateSummary = useCVStore(state => state.updateSummary);
    const updateExperience = useCVStore(state => state.updateExperience);
    const addSkill = useCVStore(state => state.addSkill);

    // AI Streaming Store
    const streaming = useCVStore(state => state.streaming);
    const startSmartFix = useCVStore(state => state.startSmartFix);
    const stopStreaming = useCVStore(state => state.stopStreaming);
    const applyStreamingResults = useCVStore(state => state.applyStreamingResults);
    const clearStreaming = useCVStore(state => state.clearStreaming);
    const setTargetJob = useCVStore(state => state.setTargetJob);
    const updateCoverLetter = useCVStore(state => state.updateCoverLetter);

    // Cover Letter Generation logic
    const handleGenerateCoverLetter = async () => {
        if (!checkLimitBeforeAction()) return;

        setCoverLetterLoading(true);
        setError('');

        try {
            const result = await streamCoverLetter(cvData, coverLetterTone);
            let fullText = '';

            for await (const delta of result.textStream) {
                fullText += delta;
                updateCoverLetter({ content: fullText });
            }

            aiService.trackUsage();
            setUsageStats(aiService.getUsageState());
        } catch (err: any) {
            console.error('Cover letter generation failed:', err);
            setError(err.message || 'Failed to generate cover letter');
        } finally {
            setCoverLetterLoading(false);
        }
    };

    // Check usage wrapper
    const checkLimitBeforeAction = () => {
        const stats = aiService.getUsageState();
        if (stats.remaining <= 0) {
            setShowLimitModal(true);
            return false;
        }
        return true;
    };

    // Use store data if currentData not provided
    const data = currentData || cvData;

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen || isHistoryOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '15px';
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [isOpen, isHistoryOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isHistoryOpen) setIsHistoryOpen(false);
                else if (previewMode) {
                    setPreviewMode(false);
                    setPendingChanges(null);
                    setPreviewChanges([]);
                } else setIsOpen(false);
            }
        };
        if (isOpen || isHistoryOpen) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, isHistoryOpen, previewMode]);

    // Calculate ATS Score
    const calculateATSScore = (): ATSAnalysis => {
        let score = 0;
        const missingKeywords: string[] = [];
        const suggestions: string[] = [];
        const strengths: string[] = [];
        const weaknesses: string[] = [];

        if (data.personalInfo.fullName) {
            score += 10;
            strengths.push(t('feedback.strengths.personal'));
        } else {
            weaknesses.push(t('feedback.weaknesses.name'));
            suggestions.push(t('feedback.suggestions.name'));
        }

        if (data.personalInfo.email && data.personalInfo.phone) {
            score += 10;
            strengths.push(t('feedback.strengths.contact'));
        } else {
            weaknesses.push(t('feedback.weaknesses.contact'));
            suggestions.push(t('feedback.suggestions.contact'));
        }

        if (data.summary && data.summary.length > 100) {
            score += 15;
            strengths.push(t('feedback.strengths.summary'));
        } else {
            weaknesses.push(t('feedback.weaknesses.summary'));
            suggestions.push(t('feedback.suggestions.summary'));
        }

        if (data.experiences.length >= 2) {
            score += 20;
            strengths.push(t('feedback.strengths.experience', { count: data.experiences.length }));
        } else {
            weaknesses.push(t('feedback.weaknesses.experience'));
            suggestions.push(t('feedback.suggestions.experience'));
        }

        const actionVerbs = t.raw('feedback.keywords.verbs') as string[];
        const hasActionVerbs = data.experiences.some(exp =>
            actionVerbs.some(verb => exp.description.toLowerCase().includes(verb.toLowerCase()))
        );

        if (hasActionVerbs) {
            score += 15;
            strengths.push(t('feedback.strengths.verbs'));
        } else {
            weaknesses.push(t('feedback.weaknesses.verbs'));
            suggestions.push(t('feedback.suggestions.verbs'));
            missingKeywords.push(...actionVerbs);
        }

        if (data.education.length >= 1) {
            score += 10;
            strengths.push(t('feedback.strengths.education'));
        } else {
            weaknesses.push(t('feedback.weaknesses.education'));
            suggestions.push(t('feedback.suggestions.education'));
        }

        if (data.skills.length >= 5) {
            score += 15;
            strengths.push(t('feedback.strengths.skills', { count: data.skills.length }));
        } else {
            weaknesses.push(t('feedback.weaknesses.skills'));
            suggestions.push(t('feedback.suggestions.skills'));
            missingKeywords.push(t('feedback.keywords.industry'));
        }

        const metricsRegex = /\d+%|\$\d+|increased|decreased|improved|حققت|زادت|نسبة|augmenté|diminué|amélioré/i;
        const hasMetrics = data.experiences.some(exp =>
            metricsRegex.test(exp.description)
        );

        if (hasMetrics) {
            score += 10;
            strengths.push(t('feedback.strengths.metrics'));
        } else {
            weaknesses.push(t('feedback.weaknesses.metrics'));
            suggestions.push(t('feedback.suggestions.metrics'));
        }

        score += 5;

        return { score, missingKeywords, suggestions, strengths, weaknesses };
    };

    const handleAnalyze = () => {
        setLoading(true);
        setError('');
        setTimeout(() => {
            const analysis = calculateATSScore();
            setAtsAnalysis(analysis);
            setLoading(false);
        }, 1000);
    };

    // Generate preview of changes before applying
    const generatePreview = (newContent: Partial<CVData>) => {
        const changes: PreviewChanges[] = [];

        if (newContent.summary && newContent.summary !== data.summary) {
            changes.push({
                section: t('sections.summary'),
                before: data.summary?.substring(0, 100) + (data.summary?.length > 100 ? '...' : '') || t('previewMode.empty'),
                after: newContent.summary.substring(0, 100) + (newContent.summary.length > 100 ? '...' : ''),
                applied: false
            });
        }

        if (newContent.experiences && newContent.experiences.length > 0) {
            const newExp = newContent.experiences[0];
            changes.push({
                section: `${t('sections.experience')}: ${newExp.position || t('sections.newPosition')}`,
                before: data.experiences.length > 0 ? data.experiences[0].description.substring(0, 80) + '...' : t('previewMode.noExperiences'),
                after: newExp.description?.substring(0, 80) + '...' || t('sections.newExperienceAdded'),
                applied: false
            });
        }

        if (newContent.skills && newContent.skills.length > data.skills.length) {
            const newSkillsCount = newContent.skills.length - data.skills.length;
            changes.push({
                section: t('sections.skills'),
                before: t('feedback.strengths.skills', { count: data.skills.length }),
                after: t('sections.skillsAdded', { count: newContent.skills.length, new: newSkillsCount }),
                applied: false
            });
        }

        return changes;
    };

    const handleGenerate = async () => {
        if (!jobTitle.trim()) {
            setError(t('errors.noJobTitle'));
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await generateFullCVContent(jobTitle, data);

            const newContent: Partial<CVData> = {
                personalInfo: { ...data.personalInfo },
                summary: result.summary || data.summary,
                experiences: result.experiences ? result.experiences.map((exp: any, index: number) => ({
                    id: `ai-exp-${Date.now()}-${index}`,
                    position: exp.position,
                    company: exp.company,
                    startDate: '2023',
                    endDate: 'Present',
                    current: false,
                    description: exp.description,
                    achievements: []
                })) : [],
                skills: result.skills ? [
                    ...data.skills,
                    ...result.skills.map((s, i) => ({
                        id: `ai-skill-${Date.now()}-${i}`,
                        name: s,
                        level: 80,
                        category: 'technical' as const
                    }))
                ] : data.skills
            };

            // Show preview first
            setPendingChanges(newContent);
            setPreviewChanges(generatePreview(newContent));
            setPreviewMode(true);
            setLoading(false);

        } catch (err: any) {
            console.error('AI Full Generation Error:', err);
            setError(err.message || t('errors.generateFailed'));
            setLoading(false);
        }
    };

    // Apply pending changes from preview
    const applyPendingChanges = () => {
        if (!pendingChanges) return;

        // Apply to store directly
        applyAISuggestion(pendingChanges, `AI Generated Content for ${jobTitle}`);

        // Also call onGenerate callback if provided
        if (onGenerate) {
            onGenerate(pendingChanges);
        }

        setShowSuccess(true);
        setPreviewMode(false);
        setPendingChanges(null);
        setPreviewChanges([]);
        setJobTitle('');

        setTimeout(() => {
            setShowSuccess(false);
            setIsOpen(false);
        }, 1500);
    };

    // Cancel preview and discard changes
    const cancelPreview = () => {
        setPreviewMode(false);
        setPendingChanges(null);
        setPreviewChanges([]);
    };

    const handleSmartImprove = async (type: 'all' | 'action-verbs' | 'keywords' | 'metrics' | 'custom' | 'grammar') => {
        if (!checkLimitBeforeAction()) return;

        setLoading(true);
        const result: { section: string; improvement: string }[] = [];

        try {
            // Grammar Check
            if (type === 'grammar' || type === 'all') {
                // Check Summary
                if (data.summary) {
                    try {
                        const res = await aiService.checkGrammar(data.summary);
                        setUsageStats(aiService.getUsageState());
                        if (res.correctedText && res.correctedText !== data.summary) {
                            updateSummary(res.correctedText);
                            result.push({ section: t('sections.summary'), improvement: t('sections.fixedGrammar') });
                        }
                    } catch (e) { /* silent fail */ }
                }
                // Check Experience
                for (const exp of data.experiences) {
                    try {
                        const res = await aiService.checkGrammar(exp.description);
                        setUsageStats(aiService.getUsageState());
                        if (res.correctedText && res.correctedText !== exp.description) {
                            updateExperience(exp.id, 'description', res.correctedText);
                            result.push({ section: exp.position, improvement: t('sections.fixedGrammar') });
                        }
                    } catch (e) { /* silent fail */ }
                }
            }

            // Action Verbs (Experience)
            if (type === 'action-verbs' || type === 'all' || (type === 'custom' && improveSettings.actionVerbs)) {
                if (data.experiences.length > 0) {
                    for (const exp of data.experiences) {
                        try {
                            const res = await aiService.improveContent(exp.description, 'professional');
                            setUsageStats(aiService.getUsageState());

                            // VALIDATION: Check if improvement is substantial
                            if (res.improvedText && res.improvedText !== exp.description && res.improvedText.length > exp.description.length * 0.8) {
                                updateExperience(exp.id, 'description', res.improvedText);
                                result.push({ section: exp.position, improvement: t('sections.aiEnhanced') });
                            }
                        } catch (e) {
                            // console.error('Failed to improve experience:', exp.position);
                        }
                    }
                }
            }

            // Keywords (Summary)
            if (type === 'keywords' || type === 'all' || (type === 'custom' && improveSettings.keywords)) {
                if (data.summary) {
                    try {
                        const keywordsRes = await aiService.extractKeywords(data.summary);
                        setUsageStats(aiService.getUsageState());
                        if (keywordsRes.suggestions && keywordsRes.suggestions.length > 0) {
                            // Check if keywords are already present to avoid duplication
                            const newKeywords = keywordsRes.suggestions.filter(k => !data.summary.includes(k));

                            if (newKeywords.length > 0) {
                                const newSummary = data.summary + `\n\n${t('sections.keyExpertise')}: ` + newKeywords.join(", ");
                                updateSummary(newSummary);
                                result.push({ section: t('sections.summary'), improvement: t('sections.addedKeywords', { count: newKeywords.length }) });
                            }
                        }
                    } catch (e) {
                        // console.error('Failed to extract keywords:', e);
                    }
                }
            }

            setImprovements(result);
            if (result.length > 0) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            } else if (!error) {
                // Nothing changed
                setError(t('errors.noImprovements'));
                setTimeout(() => setError(''), 4000);
            }

        } catch (error: any) {
            // console.error('Smart Improve error:', error);
            if (error.message?.includes('usage limit')) {
                setShowLimitModal(true);
            } else {
                setError(t('errors.improveFailed'));
            }
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'generate' as const, label: t('tabs.generate'), icon: Wand2, description: t('generate.description').substring(0, 30) + '...' },
        { id: 'analyze' as const, label: t('tabs.analyze'), icon: Target, description: t('tabs.analyze') },
        { id: 'match' as const, label: t('tabs.match'), icon: Crosshair, description: t('tabs.match') },
        { id: 'star' as const, label: t('tabs.star'), icon: PenTool, description: t('tabs.star') },
        { id: 'improve' as const, label: t('tabs.improve'), icon: Lightbulb, description: t('tabs.improve') },
    ];

    return (
        <>
            <LimitModal isOpen={showLimitModal} onClose={() => setShowLimitModal(false)} />

            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="group relative w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl font-bold text-lg overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] rtl:translate-x-[100%] rtl:group-hover:translate-x-[-100%] transition-transform duration-1000" />
                <Brain className="animate-pulse" size={24} />
                <div className="flex items-center gap-2">
                    <span>{t('triggerButton')}</span>
                    <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold border border-white/10">{t('beta')}</span>
                </div>
                <Sparkles size={20} />
            </button>

            {/* History Panel */}
            <HistoryPanel
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
            />

            {/* Modal */}
            {isOpen && (
                <ModalPortal>
                    <div
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8"
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                    >
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                            onClick={() => !previewMode && setIsOpen(false)}
                        />

                        {/* Modal Container */}
                        <div
                            className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-300"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 sm:p-8">
                                {/* Undo/Redo & Close Buttons */}
                                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
                                    {/* Usage Hint */}
                                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full text-white/90 text-xs font-medium border border-white/10 mr-2" title={t('dailyLimit', { used: usageStats.used, limit: usageStats.limit })}>
                                        <Zap size={12} className="text-yellow-300" />
                                        <span>{t('dailyLimit', { used: usageStats.used, limit: usageStats.limit })}</span>
                                    </div>

                                    {/* Undo */}
                                    <button
                                        onClick={undo}
                                        disabled={!canUndo}
                                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${canUndo
                                            ? 'text-white/80 hover:text-white hover:bg-white/20'
                                            : 'text-white/30 cursor-not-allowed'
                                            }`}
                                        title={t('undo')}
                                    >
                                        <Undo2 size={20} />
                                    </button>

                                    {/* Redo */}
                                    <button
                                        onClick={redo}
                                        disabled={!canRedo}
                                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${canRedo
                                            ? 'text-white/80 hover:text-white hover:bg-white/20'
                                            : 'text-white/30 cursor-not-allowed'
                                            }`}
                                        title={t('redo')}
                                    >
                                        <Redo2 size={20} />
                                    </button>

                                    {/* History Button */}
                                    <button
                                        onClick={() => setIsHistoryOpen(true)}
                                        className="flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-white/80 hover:text-white text-sm transition-all"
                                        title={t('history')}
                                    >
                                        <History size={14} />
                                        <span>{historyIndex + 1}/{history.length}</span>
                                    </button>

                                    {/* Close */}
                                    <button
                                        onClick={() => !previewMode && setIsOpen(false)}
                                        disabled={previewMode}
                                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${previewMode
                                            ? 'text-white/30 cursor-not-allowed'
                                            : 'text-white/80 hover:text-white hover:bg-white/20'
                                            }`}
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Header Content */}
                                <div className="flex items-center gap-4 sm:gap-6">
                                    <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                                        <Brain size={36} className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl sm:text-3xl font-bold text-white">
                                            {previewMode ? t('previewMode.title') : t('title')}
                                        </h2>
                                        <p className="text-blue-100 mt-1">
                                            {previewMode
                                                ? t('previewMode.description')
                                                : t('assistantSubtitle')}
                                        </p>
                                    </div>
                                </div>

                                {/* Tabs - Hidden in preview mode */}
                                {!previewMode && (
                                    <div className="flex gap-2 sm:gap-4 mt-6 overflow-x-auto pb-1">
                                        {tabs.map((tab) => {
                                            const Icon = tab.icon;
                                            return (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => {
                                                        setActiveTab(tab.id);
                                                        if (tab.id === 'analyze') handleAnalyze();
                                                    }}
                                                    className={`flex-shrink-0 flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === tab.id
                                                        ? 'bg-white text-blue-600 shadow-lg'
                                                        : 'bg-white/10 text-white hover:bg-white/20'
                                                        }`}
                                                >
                                                    <Icon size={20} />
                                                    <span className="hidden sm:inline">{tab.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Success Banner */}
                            {showSuccess && (
                                <div className="bg-green-500 text-white p-4 flex flex-col md:flex-row items-center justify-center gap-3 animate-in slide-in-from-top text-center">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={24} />
                                        <span className="font-medium">{t('success.applied')}</span>
                                    </div>
                                    <span className="hidden md:inline text-white/50">|</span>
                                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full flex items-center gap-2">
                                        <Sparkles size={14} />
                                        {t('success.unlockPro').split(' — ')[0]} — <a href="/pricing" className="underline font-bold hover:text-green-100">{t('success.unlockPro').split(' — ')[1]}</a>
                                    </span>
                                </div>
                            )}

                            {/* Content Area */}
                            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                                {/* Preview Mode Content */}
                                {previewMode && pendingChanges && (
                                    <div className="space-y-6">
                                        {/* Preview Banner */}
                                        <div className="flex items-start gap-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5">
                                            <div className="p-3 bg-amber-100 dark:bg-amber-800 rounded-xl">
                                                <Eye size={24} className="text-amber-600 dark:text-amber-300" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white">{t('previewMode.title')}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {t('previewMode.description')}
                                                    <strong className="text-amber-600"> {t('previewMode.warning')}</strong>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Changes List */}
                                        <div className="space-y-4">
                                            <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                                                {t('previewMode.changesCount', { count: previewChanges.length })}
                                            </h3>

                                            {previewChanges.map((change, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden"
                                                >
                                                    <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                                                        <Sparkles size={18} className="text-purple-500" />
                                                        <span className="font-semibold text-gray-900 dark:text-white">{change.section}</span>
                                                    </div>
                                                    <div className="p-5 grid md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                                <EyeOff size={14} />
                                                                <span>{t('previewMode.before')}</span>
                                                            </div>
                                                            <p className="text-gray-700 dark:text-gray-300 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800">
                                                                {change.before}
                                                            </p>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                                <Eye size={14} />
                                                                <span>{t('previewMode.after')}</span>
                                                            </div>
                                                            <p className="text-gray-700 dark:text-gray-300 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-sm border border-green-200 dark:border-green-800">
                                                                {change.after}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-4 pt-4">
                                            <button
                                                onClick={cancelPreview}
                                                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-all"
                                            >
                                                <X size={20} />
                                                <span>{t('previewMode.discard')}</span>
                                            </button>
                                            <button
                                                onClick={applyPendingChanges}
                                                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                                            >
                                                <Check size={20} />
                                                <span>{t('previewMode.apply')}</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Generate Tab */}
                                {!previewMode && activeTab === 'generate' && (
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5">
                                            <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-xl">
                                                <Zap size={24} className="text-blue-600 dark:text-blue-300" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white">{t('generate.info.title')}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {t('generate.info.description')}
                                                    <strong className="text-blue-600"> {t('generate.info.warning')}</strong>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                                    {t('generate.jobTitle')} <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={jobTitle}
                                                    onChange={(e) => setJobTitle(e.target.value)}
                                                    placeholder={t('generate.placeholder')}
                                                    className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg rtl:text-right rtl:placeholder:text-right"
                                                    autoFocus
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                                    {t('generate.jobDescription')} <span className="text-gray-400 font-normal">{t('generate.optional')}</span>
                                                </label>
                                                <textarea
                                                    value={jobDescription}
                                                    onChange={(e) => setJobDescription(e.target.value)}
                                                    placeholder={t('generate.placeholderDesc')}
                                                    rows={5}
                                                    className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none rtl:text-right rtl:placeholder:text-right"
                                                />
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="flex items-center gap-3 text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
                                                <AlertCircle size={20} />
                                                <span className="font-medium">{error}</span>
                                            </div>
                                        )}

                                        <button
                                            onClick={handleGenerate}
                                            disabled={loading || !jobTitle.trim()}
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 shadow-lg hover:shadow-xl text-lg"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 size={24} className="animate-spin" />
                                                    {t('generate.generating')}
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles size={24} />
                                                    {t('generate.button')}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}

                                {/* ATS Analysis Tab */}
                                {!previewMode && activeTab === 'analyze' && (
                                    <ATSDashboard
                                        cvData={data as any}
                                        jobDescription={jobDescription || undefined}
                                        onImprove={(metricId) => {
                                            // Auto-fix based on metric type
                                            setActiveTab('improve');
                                            if (metricId.includes('action') || metricId.includes('experience')) {
                                                handleSmartImprove('action-verbs');
                                            } else if (metricId.includes('keyword') || metricId.includes('summary')) {
                                                handleSmartImprove('keywords');
                                            } else {
                                                handleSmartImprove('all');
                                            }
                                        }}
                                    />
                                )}

                                {/* Job Match Tab */}
                                {!previewMode && activeTab === 'match' && (
                                    <JobMatcher
                                        cvData={data as any}
                                        onAddSkill={(skill) => {
                                            const newSkill = {
                                                id: `skill-${Date.now()}`,
                                                name: skill,
                                                level: 70,
                                                category: 'technical' as const
                                            };
                                            addSkill(newSkill);
                                        }}
                                    />
                                )}

                                {/* Cover Letter Tab */}
                                {!previewMode && activeTab === 'letter' && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-800/50">
                                            <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center">
                                                <FileText size={32} className="text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{t('coverLetter.title')}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{t('coverLetter.description')}</p>
                                            </div>
                                        </div>

                                        {/* Tone Selector */}
                                        <div className="flex items-center gap-3 mb-2 justify-center">
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('coverLetter.tones.label')}:</span>
                                            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                                                {(['professional', 'confident', 'friendly'] as const).map((tone) => (
                                                    <button
                                                        key={tone}
                                                        onClick={() => setCoverLetterTone(tone)}
                                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${coverLetterTone === tone
                                                            ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                                            }`}
                                                    >
                                                        {t(`coverLetter.tones.${tone}`)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        {!cvData.coverLetter?.content && !coverLetterLoading ? (
                                            <div className="text-center py-10">
                                                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                                    <PenTool size={40} className="text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <button
                                                    onClick={handleGenerateCoverLetter}
                                                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
                                                >
                                                    <Sparkles size={20} />
                                                    {t('coverLetter.button')}
                                                </button>
                                                <p className="mt-4 text-xs text-gray-500 italic max-w-sm mx-auto">
                                                    {t('coverLetter.tailorNote')}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="relative group">
                                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                                                    <div className="relative p-7 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm min-h-[400px]">
                                                        {coverLetterLoading && !cvData.coverLetter?.content ? (
                                                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                                                <Loader2 size={40} className="text-indigo-600 animate-spin" />
                                                                <p className="text-gray-500 animate-pulse font-medium">{t('coverLetter.generating')}</p>
                                                            </div>
                                                        ) : (
                                                            <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed font-serif text-lg custom-scrollbar max-h-[500px] overflow-y-auto pr-2">
                                                                {cvData.coverLetter?.content || t('coverLetter.placeholder')}
                                                                {coverLetterLoading && <span className="inline-block w-2 h-5 bg-indigo-500 animate-pulse ml-1 align-middle" />}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-3">
                                                    <button
                                                        onClick={handleGenerateCoverLetter}
                                                        disabled={coverLetterLoading}
                                                        className="flex-1 min-w-[150px] px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                                                    >
                                                        {coverLetterLoading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                                                        {t('coverLetter.button')}
                                                    </button>

                                                    {cvData.coverLetter?.content && !coverLetterLoading && (
                                                        <PDFDownloadLink
                                                            document={<CoverLetterPDF data={cvData} />}
                                                            fileName={`Cover_Letter_${cvData.personalInfo.fullName.replace(/\s+/g, '_') || 'Pro'}.pdf`}
                                                            className="flex-1 min-w-[150px] px-4 py-3 bg-indigo-50 dark:bg-indigo-900/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-indigo-200/50 dark:border-indigo-800/50"
                                                        >
                                                            {({ loading }) => (
                                                                <>
                                                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                                                                    {t('coverLetter.download')}
                                                                </>
                                                            )}
                                                        </PDFDownloadLink>
                                                    )}

                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(cvData.coverLetter?.content || '');
                                                            alert(t('coverLetter.copied'));
                                                        }}
                                                        className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-all flex items-center gap-2"
                                                    >
                                                        <Zap size={18} />
                                                        {t('coverLetter.copy')}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* STAR Builder Tab */}
                                {!previewMode && activeTab === 'star' && (
                                    <div className="h-[600px]">
                                        <STARBuilder
                                            onSave={(text) => {
                                                // Create a preview for the user to approve
                                                const newContent = {
                                                    ...data,
                                                    experiences: data.experiences?.map((exp, i) =>
                                                        i === 0 ? {
                                                            ...exp,
                                                            description: exp.description
                                                                ? `${exp.description}\n• ${text}`
                                                                : `• ${text}`
                                                        } : exp
                                                    )
                                                };
                                                setPreviewChanges([{
                                                    section: t('sections.latestExperience'),
                                                    before: t('sections.currentDescription'),
                                                    after: `...added:\n• ${text}`,
                                                    applied: false
                                                }]);
                                                setPendingChanges(newContent);
                                                setPreviewMode(true);
                                            }}
                                            isDark={document.documentElement.classList.contains('dark')}
                                        />
                                    </div>
                                )}

                                {/* Smart Improve Tab */}
                                {!previewMode && activeTab === 'improve' && (
                                    <div className="space-y-6">
                                        {/* Info Banner */}
                                        <div className="flex items-start gap-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-5">
                                            <div className="p-3 bg-purple-100 dark:bg-purple-800 rounded-xl">
                                                <Lightbulb size={24} className="text-purple-600 dark:text-purple-300" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white">{t('improve.title')}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {t('improve.description')}
                                                    <strong className="text-purple-600"> {t('improve.warning')}</strong>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Target Job Description Section */}
                                        <div className="bg-white dark:bg-gray-800 border-2 border-purple-500/20 rounded-2xl p-5 shadow-sm">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Target size={18} className="text-purple-500" />
                                                <h4 className="font-bold text-gray-900 dark:text-white">{t('improve.targetJob.title')}</h4>
                                            </div>
                                            <textarea
                                                className="w-full h-32 p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                                                placeholder={t('improve.targetJob.placeholder')}
                                                value={data.targetJob || ''}
                                                onChange={(e) => setTargetJob(e.target.value)}
                                            />
                                            <p className="text-[10px] text-gray-500 mt-2 italic px-1">
                                                💡 {t('improve.targetJob.tip')}
                                            </p>
                                        </div>

                                        {/* Improvement Results */}
                                        {improvements.length > 0 && (
                                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-5">
                                                <h4 className="font-bold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
                                                    <CheckCircle2 size={20} />
                                                    {t('improve.applied')}
                                                </h4>
                                                <ul className="space-y-2">
                                                    {improvements.map((imp, i) => (
                                                        <li key={i} className="text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                                                            <Check size={16} />
                                                            <strong>{imp.section}:</strong> {imp.improvement}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Quick Improvements */}
                                        <div className="grid gap-4">
                                            <h3 className="font-bold text-xl text-gray-900 dark:text-white">{t('improve.quick')}</h3>

                                            {[
                                                { type: 'grammar' as const, title: t('improve.grammar.title'), desc: t('improve.grammar.desc'), icon: CheckCircle2 },
                                                { type: 'action-verbs' as const, title: t('improve.verbs.title'), desc: t('improve.verbs.desc'), icon: Zap },
                                                { type: 'keywords' as const, title: t('improve.keywords.title'), desc: t('improve.keywords.desc'), icon: Target },
                                                { type: 'metrics' as const, title: t('improve.metrics.title'), desc: t('improve.metrics.desc'), icon: BarChart3 },
                                            ].map((item) => {
                                                const Icon = item.icon;
                                                return (
                                                    <button
                                                        key={item.type}
                                                        onClick={() => handleSmartImprove(item.type)}
                                                        disabled={loading}
                                                        className="w-full p-5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:border-purple-500 dark:hover:border-purple-500 transition-all text-left rtl:text-right group"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                                                                <Icon size={24} className="text-purple-600 dark:text-purple-400" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 text-lg">
                                                                    {item.title}
                                                                </h4>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                                                            </div>
                                                            <ChevronRight className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-all rtl:rotate-180" size={24} />
                                                        </div>
                                                    </button>
                                                );
                                            })}

                                            {/* Custom Settings */}
                                            <div className="p-5 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-2xl">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <Settings2 size={20} className="text-gray-500" />
                                                    <h4 className="font-semibold text-gray-900 dark:text-white">{t('improve.custom.title')}</h4>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {[
                                                        { key: 'actionVerbs', label: t('improve.custom.actionVerbs') },
                                                        { key: 'keywords', label: t('improve.custom.atsKeywords') },
                                                        { key: 'summaryExpansion', label: t('improve.custom.expandSummary') },
                                                        { key: 'skillSuggestions', label: t('improve.custom.suggestSkills') },
                                                    ].map(({ key, label }) => (
                                                        <label
                                                            key={key}
                                                            className="flex items-center gap-2 cursor-pointer"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={improveSettings[key as keyof typeof improveSettings]}
                                                                onChange={(e) => setImproveSettings(prev => ({
                                                                    ...prev,
                                                                    [key]: e.target.checked
                                                                }))}
                                                                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                                                            />
                                                            <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={() => handleSmartImprove('custom')}
                                                    disabled={loading || !Object.values(improveSettings).some(Boolean)}
                                                    className="w-full mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-medium rounded-xl transition-all disabled:cursor-not-allowed"
                                                >
                                                    {t('improve.custom.apply')}
                                                </button>
                                            </div>

                                            {/* Apply All Button */}
                                            <button
                                                onClick={() => startSmartFix(jobTitle)}
                                                disabled={streaming.isStreaming}
                                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-5 rounded-xl transition-all flex justify-center items-center gap-3 shadow-lg hover:shadow-xl text-lg mt-4"
                                            >
                                                {streaming.isStreaming ? (
                                                    <>
                                                        <Loader2 size={24} className="animate-spin" />
                                                        {t('improve.all.applying')}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles size={24} />
                                                        {t('improve.all.button')}
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {/* AI Streaming Results Live View */}
                                        {(streaming.isStreaming || streaming.summary || streaming.experiences.length > 0) && (
                                            <div className="mt-8 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                                <div className="p-6 bg-gray-900 rounded-3xl border border-blue-500/30 shadow-2xl relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-4">
                                                        {streaming.isStreaming ? (
                                                            <button
                                                                onClick={stopStreaming}
                                                                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full text-xs font-bold transition-all border border-red-500/20"
                                                            >
                                                                <X size={14} />
                                                                <span>{t('streaming.stop')}</span>
                                                            </button>
                                                        ) : (
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={clearStreaming}
                                                                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-xs font-bold"
                                                                >
                                                                    {t('streaming.reject')}
                                                                </button>
                                                                <button
                                                                    onClick={applyStreamingResults}
                                                                    className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-bold shadow-lg shadow-green-500/20 transition-all"
                                                                >
                                                                    <Check size={16} />
                                                                    <span>{t('streaming.apply')}</span>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-3 mb-6">
                                                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                                            <Sparkles className="text-blue-400 animate-pulse" size={20} />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-bold text-white">
                                                                {streaming.isStreaming ? t('streaming.status') : t('streaming.ready')}
                                                            </h3>
                                                            {streaming.isStreaming && (
                                                                <p className="text-blue-400/60 text-xs animate-pulse font-mono uppercase tracking-widest mt-0.5">
                                                                    Analyzing experience...
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                        {/* Live Summary */}
                                                        {streaming.summary && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                                    <FileText size={14} />
                                                                    <span>{t('sections.summary')}</span>
                                                                </div>
                                                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                                                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap italic">
                                                                        "{streaming.summary}"
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Live Experiences */}
                                                        {streaming.experiences.map((exp, idx) => {
                                                            const original = data.experiences.find(e => e.id === exp.id);
                                                            return (
                                                                <div key={exp.id} className="space-y-2 animate-in fade-in duration-300">
                                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                                        <Briefcase size={14} />
                                                                        <span>{original?.position || 'Experience'}</span>
                                                                    </div>
                                                                    <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/20">
                                                                        <p className="text-gray-300 text-sm leading-relaxed">
                                                                            {exp.description}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}

                                                        {/* Live Skills */}
                                                        {streaming.skills.length > 0 && (
                                                            <div className="space-y-3">
                                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                                    <Award size={14} />
                                                                    <span>{t('sections.suggestedSkills')}</span>
                                                                </div>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {streaming.skills.map((skill, i) => (
                                                                        <span key={i} className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-bold text-blue-400 animate-in zoom-in-95">
                                                                            + {skill}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </ModalPortal >
            )
            }
        </>
    );
}
