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
    Crosshair
} from 'lucide-react';
import type { CVData } from '@/types/cv';
import { useCVStore } from '@/stores/useCVStore';
import { generateCVContent } from '@/services/api';
import HistoryPanel from './HistoryPanel';
import ATSDashboard from './ATSDashboard';
import JobMatcher from './JobMatcher';
import STARBuilder from './STARBuilder';

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
    const [isOpen, setIsOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'generate' | 'analyze' | 'match' | 'star' | 'improve'>('generate');
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
    const [improvements, setImprovements] = useState<{ section: string; improvement: string }[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);

    // Preview Mode for AI Suggestions
    const [previewMode, setPreviewMode] = useState(false);
    const [pendingChanges, setPendingChanges] = useState<Partial<CVData> | null>(null);
    const [previewChanges, setPreviewChanges] = useState<PreviewChanges[]>([]);

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
    const autoImproveAll = useCVStore(state => state.autoImproveAll);
    const improveExperienceWithActionVerbs = useCVStore(state => state.improveExperienceWithActionVerbs);
    const improveSummaryWithKeywords = useCVStore(state => state.improveSummaryWithKeywords);
    const addSkill = useCVStore(state => state.addSkill);

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
            strengths.push('Complete personal information');
        } else {
            weaknesses.push('Missing full name');
            suggestions.push('Add your full name');
        }

        if (data.personalInfo.email && data.personalInfo.phone) {
            score += 10;
            strengths.push('Contact information provided');
        } else {
            weaknesses.push('Incomplete contact information');
            suggestions.push('Add email and phone number');
        }

        if (data.summary && data.summary.length > 100) {
            score += 15;
            strengths.push('Professional summary included');
        } else {
            weaknesses.push('No professional summary');
            suggestions.push('Add a compelling professional summary (150-200 words)');
        }

        if (data.experiences.length >= 2) {
            score += 20;
            strengths.push(`${data.experiences.length} work experiences listed`);
        } else {
            weaknesses.push('Limited work history');
            suggestions.push('Add at least 2-3 relevant work experiences');
        }

        const actionVerbs = ['led', 'managed', 'developed', 'created', 'implemented', 'achieved', 'increased', 'improved'];
        const hasActionVerbs = data.experiences.some(exp =>
            actionVerbs.some(verb => exp.description.toLowerCase().includes(verb))
        );

        if (hasActionVerbs) {
            score += 15;
            strengths.push('Uses strong action verbs');
        } else {
            weaknesses.push('Limited use of action verbs');
            suggestions.push('Use action verbs: Led, Managed, Developed, Achieved, etc.');
            missingKeywords.push(...['Led', 'Managed', 'Developed', 'Achieved']);
        }

        if (data.education.length >= 1) {
            score += 10;
            strengths.push('Education history provided');
        } else {
            weaknesses.push('No education information');
            suggestions.push('Add your educational background');
        }

        if (data.skills.length >= 5) {
            score += 15;
            strengths.push(`${data.skills.length} skills listed`);
        } else {
            weaknesses.push('Limited skills listed');
            suggestions.push('Add at least 5-8 relevant skills');
            missingKeywords.push('Industry-specific skills');
        }

        const hasMetrics = data.experiences.some(exp =>
            /\d+%|\$\d+|increased|decreased|improved/i.test(exp.description)
        );

        if (hasMetrics) {
            score += 10;
            strengths.push('Includes quantifiable achievements');
        } else {
            weaknesses.push('Lacks quantifiable results');
            suggestions.push('Add numbers and metrics to show your impact');
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
                section: 'Professional Summary',
                before: data.summary?.substring(0, 100) + (data.summary?.length > 100 ? '...' : '') || 'Empty',
                after: newContent.summary.substring(0, 100) + (newContent.summary.length > 100 ? '...' : ''),
                applied: false
            });
        }

        if (newContent.experiences && newContent.experiences.length > 0) {
            const newExp = newContent.experiences[0];
            changes.push({
                section: `Experience: ${newExp.position || 'New Position'}`,
                before: data.experiences.length > 0 ? data.experiences[0].description.substring(0, 80) + '...' : 'No experiences',
                after: newExp.description?.substring(0, 80) + '...' || 'New experience added',
                applied: false
            });
        }

        if (newContent.skills && newContent.skills.length > data.skills.length) {
            const newSkillsCount = newContent.skills.length - data.skills.length;
            changes.push({
                section: 'Skills',
                before: `${data.skills.length} skills`,
                after: `${newContent.skills.length} skills (+${newSkillsCount} new)`,
                applied: false
            });
        }

        return changes;
    };

    const handleGenerate = async () => {
        if (!jobTitle.trim()) {
            setError('Please enter a job title');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await generateCVContent(jobTitle, data);

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
                })) : []
            };

            // Show preview first
            setPendingChanges(newContent);
            setPreviewChanges(generatePreview(newContent));
            setPreviewMode(true);
            setLoading(false);

        } catch (err) {
            console.error(err);
            setError('Failed to generate content. Please try again.');
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

    const handleSmartImprove = (type: 'all' | 'action-verbs' | 'keywords' | 'metrics' | 'custom') => {
        setLoading(true);

        setTimeout(() => {
            let result: { section: string; improvement: string }[] = [];

            switch (type) {
                case 'all':
                    result = autoImproveAll();
                    break;
                case 'action-verbs':
                    data.experiences.forEach(exp => {
                        improveExperienceWithActionVerbs(exp.id);
                        result.push({ section: exp.position, improvement: 'Added action verb' });
                    });
                    break;
                case 'keywords':
                    const keywords = ['leadership', 'innovation', 'results-driven', 'strategic thinking', 'problem-solving'];
                    improveSummaryWithKeywords(keywords);
                    result.push({ section: 'Summary', improvement: 'Added professional keywords' });
                    break;
                case 'metrics':
                    result.push({ section: 'Experiences', improvement: 'Suggested adding quantifiable metrics' });
                    break;
                case 'custom':
                    // Custom improvements based on settings
                    if (improveSettings.actionVerbs) {
                        data.experiences.forEach(exp => {
                            const improved = improveExperienceWithActionVerbs(exp.id);
                            if (improved) {
                                result.push({ section: `${exp.position}`, improvement: 'Enhanced with action verbs' });
                            }
                        });
                    }
                    if (improveSettings.keywords) {
                        const professionalKeywords = ['strategic', 'results-oriented', 'proactive', 'collaborative'];
                        improveSummaryWithKeywords(professionalKeywords);
                        result.push({ section: 'Summary', improvement: 'Optimized with ATS keywords' });
                    }
                    if (improveSettings.skillSuggestions && data.skills.length < 5) {
                        result.push({ section: 'Skills', improvement: 'Consider adding more relevant skills' });
                    }
                    break;
            }

            setImprovements(result);
            setLoading(false);
            setShowSuccess(true);

            setTimeout(() => setShowSuccess(false), 3000);
        }, 1500);
    };

    const tabs = [
        { id: 'generate' as const, label: 'Generate', icon: Wand2, description: 'AI-powered content' },
        { id: 'analyze' as const, label: 'ATS Analysis', icon: Target, description: 'Score your CV' },
        { id: 'match' as const, label: 'Job Match', icon: Crosshair, description: 'Compare with job' },
        { id: 'star' as const, label: 'STAR Builder', icon: PenTool, description: 'Write achievements' },
        { id: 'improve' as const, label: 'Smart Improve', icon: Lightbulb, description: 'Auto-enhance' },
    ];

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="group relative w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl font-bold text-lg overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <Brain className="animate-pulse" size={24} />
                <span>AI Assistant</span>
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
                                    {/* Undo */}
                                    <button
                                        onClick={undo}
                                        disabled={!canUndo}
                                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${canUndo
                                            ? 'text-white/80 hover:text-white hover:bg-white/20'
                                            : 'text-white/30 cursor-not-allowed'
                                            }`}
                                        title="Undo (Ctrl+Z)"
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
                                        title="Redo (Ctrl+Y)"
                                    >
                                        <Redo2 size={20} />
                                    </button>

                                    {/* History Button */}
                                    <button
                                        onClick={() => setIsHistoryOpen(true)}
                                        className="flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-white/80 hover:text-white text-sm transition-all"
                                        title="View History"
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
                                            {previewMode ? 'Preview Changes' : 'AI Assistant'}
                                        </h2>
                                        <p className="text-blue-100 mt-1">
                                            {previewMode
                                                ? 'Review AI suggestions before applying'
                                                : 'Your intelligent CV optimization companion'}
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
                                <div className="bg-green-500 text-white p-4 flex items-center justify-center gap-3 animate-in slide-in-from-top">
                                    <CheckCircle2 size={24} />
                                    <span className="font-medium">Changes applied successfully! You can undo anytime.</span>
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
                                                <h3 className="font-bold text-gray-900 dark:text-white">Preview Mode</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    Review the AI-generated changes before they're applied to your CV.
                                                    <strong className="text-amber-600"> Nothing is saved until you confirm!</strong>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Changes List */}
                                        <div className="space-y-4">
                                            <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                                                Proposed Changes ({previewChanges.length})
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
                                                                <span>Before</span>
                                                            </div>
                                                            <p className="text-gray-700 dark:text-gray-300 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800">
                                                                {change.before}
                                                            </p>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                                <Eye size={14} />
                                                                <span>After</span>
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
                                                <span>Discard</span>
                                            </button>
                                            <button
                                                onClick={applyPendingChanges}
                                                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                                            >
                                                <Check size={20} />
                                                <span>Apply Changes</span>
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
                                                <h3 className="font-bold text-gray-900 dark:text-white">AI-Powered Generation</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    Enter your target job title and let AI generate professional content.
                                                    <strong className="text-blue-600"> You'll preview changes before they're applied!</strong>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                                    Target Job Title <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={jobTitle}
                                                    onChange={(e) => setJobTitle(e.target.value)}
                                                    placeholder="e.g. Senior Full Stack Developer"
                                                    className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg"
                                                    autoFocus
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                                    Job Description <span className="text-gray-400 font-normal">(Optional)</span>
                                                </label>
                                                <textarea
                                                    value={jobDescription}
                                                    onChange={(e) => setJobDescription(e.target.value)}
                                                    placeholder="Paste the job description here for better results..."
                                                    rows={5}
                                                    className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
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
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles size={24} />
                                                    Generate & Preview
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
                                            // Add skill to CV
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
                                                    section: "Latest Experience",
                                                    before: "Current description...",
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
                                                <h3 className="font-bold text-gray-900 dark:text-white">Smart Improvements</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    AI analyzes your CV and applies improvements automatically.
                                                    <strong className="text-purple-600"> Use Undo to revert any changes!</strong>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Improvement Results */}
                                        {improvements.length > 0 && (
                                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-5">
                                                <h4 className="font-bold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
                                                    <CheckCircle2 size={20} />
                                                    Applied Improvements
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
                                            <h3 className="font-bold text-xl text-gray-900 dark:text-white">Quick Improvements</h3>

                                            {[
                                                { type: 'action-verbs' as const, title: 'Add Action Verbs', desc: 'Replace weak verbs with impactful action words', icon: Zap },
                                                { type: 'keywords' as const, title: 'Optimize Keywords', desc: 'Add industry-specific keywords for ATS', icon: Target },
                                                { type: 'metrics' as const, title: 'Quantify Achievements', desc: 'Add numbers and metrics to showcase impact', icon: BarChart3 },
                                            ].map((item) => {
                                                const Icon = item.icon;
                                                return (
                                                    <button
                                                        key={item.type}
                                                        onClick={() => handleSmartImprove(item.type)}
                                                        disabled={loading}
                                                        className="w-full p-5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:border-purple-500 dark:hover:border-purple-500 transition-all text-left group"
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
                                                            <ChevronRight className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" size={24} />
                                                        </div>
                                                    </button>
                                                );
                                            })}

                                            {/* Custom Settings */}
                                            <div className="p-5 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-2xl">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <Settings2 size={20} className="text-gray-500" />
                                                    <h4 className="font-semibold text-gray-900 dark:text-white">Custom Improvements</h4>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {[
                                                        { key: 'actionVerbs', label: 'Action Verbs' },
                                                        { key: 'keywords', label: 'ATS Keywords' },
                                                        { key: 'summaryExpansion', label: 'Expand Summary' },
                                                        { key: 'skillSuggestions', label: 'Suggest Skills' },
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
                                                    Apply Custom Improvements
                                                </button>
                                            </div>

                                            {/* Apply All Button */}
                                            <button
                                                onClick={() => handleSmartImprove('all')}
                                                disabled={loading}
                                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-5 rounded-xl transition-all flex justify-center items-center gap-3 shadow-lg hover:shadow-xl text-lg mt-4"
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 size={24} className="animate-spin" />
                                                        Applying Improvements...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles size={24} />
                                                        Auto-Improve All Sections
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </ModalPortal>
            )}
        </>
    );
}
