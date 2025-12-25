'use client';

import { useState } from 'react';
import {
    History,
    Clock,
    ChevronDown,
    ChevronUp,
    RotateCcw,
    Sparkles,
    Undo2,
    Redo2,
    X,
    FileText,
    User,
    Briefcase,
    GraduationCap,
    Award,
    Wand2,
    CheckCircle2,
    AlertTriangle
} from 'lucide-react';
import { useCVStore } from '@/stores/useCVStore';
import { useTranslations } from 'next-intl';

interface HistoryPanelProps {
    isDark?: boolean;
    isOpen: boolean;
    onClose: () => void;
}

export default function HistoryPanel({ isDark = false, isOpen, onClose }: HistoryPanelProps) {
    const t = useTranslations('history');
    const history = useCVStore(state => state.history);
    const historyIndex = useCVStore(state => state.historyIndex);
    const canUndo = useCVStore(state => state.canUndo);
    const canRedo = useCVStore(state => state.canRedo);
    const undo = useCVStore(state => state.undo);
    const redo = useCVStore(state => state.redo);
    const clearHistory = useCVStore(state => state.clearHistory);

    const [showConfirmClear, setShowConfirmClear] = useState(false);

    if (!isOpen) return null;

    // Get icon for action type
    const getActionIcon = (action: string) => {
        const lowerAction = action.toLowerCase();
        if (lowerAction.includes('ai') || lowerAction.includes('generate')) return <Sparkles size={16} className="text-purple-500" />;
        if (lowerAction.includes('personal')) return <User size={16} className="text-blue-500" />;
        if (lowerAction.includes('experience')) return <Briefcase size={16} className="text-green-500" />;
        if (lowerAction.includes('education')) return <GraduationCap size={16} className="text-amber-500" />;
        if (lowerAction.includes('skill')) return <Award size={16} className="text-pink-500" />;
        if (lowerAction.includes('improve')) return <Wand2 size={16} className="text-indigo-500" />;
        if (lowerAction.includes('template')) return <FileText size={16} className="text-cyan-500" />;
        return <History size={16} className="text-gray-500" />;
    };

    // Format timestamp
    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return t('time.justNow');
        if (diffMins < 60) return t('time.minutesAgo', { count: diffMins });
        if (diffHours < 24) return t('time.hoursAgo', { count: diffHours });
        if (diffDays < 7) return t('time.daysAgo', { count: diffDays });
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    // Check if action is AI-related
    const isAIAction = (action: string) => {
        const lowerAction = action.toLowerCase();
        return lowerAction.includes('ai') || lowerAction.includes('generate') || lowerAction.includes('improve');
    };

    const handleClearHistory = () => {
        clearHistory();
        setShowConfirmClear(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className={`relative w-full max-w-lg max-h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                {/* Header */}
                <div className={`flex items-center justify-between p-5 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                            <History className="text-white" size={20} />
                        </div>
                        <div>
                            <h2 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {t('title')}
                            </h2>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {t('subtitle', { count: history.length, index: historyIndex + 1, total: history.length })}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                            }`}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Quick Actions */}
                <div className={`flex items-center gap-2 p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button
                        onClick={undo}
                        disabled={!canUndo}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${canUndo
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                            : isDark
                                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <Undo2 size={18} />
                        <span>{t('undo')}</span>
                    </button>
                    <button
                        onClick={redo}
                        disabled={!canRedo}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${canRedo
                            ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl'
                            : isDark
                                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <Redo2 size={18} />
                        <span>{t('redo')}</span>
                    </button>
                </div>

                {/* History List */}
                <div className="flex-1 overflow-y-auto p-4">
                    {history.length === 0 ? (
                        <div className={`text-center py-12 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            <Clock className="mx-auto mb-3 opacity-50" size={40} />
                            <p className="font-medium">{t('empty.title')}</p>
                            <p className="text-sm mt-1">{t('empty.desc')}</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {[...history].reverse().map((entry, reversedIndex) => {
                                const actualIndex = history.length - 1 - reversedIndex;
                                const isCurrent = actualIndex === historyIndex;
                                const isAI = isAIAction(entry.action);

                                return (
                                    <div
                                        key={`${entry.timestamp}-${actualIndex}`}
                                        className={`group relative p-4 rounded-xl border transition-all ${isCurrent
                                            ? isDark
                                                ? 'bg-blue-900/30 border-blue-500'
                                                : 'bg-blue-50 border-blue-300'
                                            : isDark
                                                ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                                                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                            }`}
                                    >
                                        {/* AI Badge */}
                                        {isAI && (
                                            <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-xs font-medium shadow-lg">
                                                {t('ai')}
                                            </div>
                                        )}

                                        <div className="flex items-start gap-3">
                                            {/* Icon */}
                                            <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-white'
                                                } shadow-sm`}>
                                                {getActionIcon(entry.action)}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'
                                                        }`}>
                                                        {t(`actions.${entry.action}`, { defaultValue: entry.action })}
                                                    </p>
                                                    {isCurrent && (
                                                        <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                                                            {t('current')}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'
                                                    }`}>
                                                    <Clock size={12} className="inline mr-1" />
                                                    {formatTime(entry.timestamp)}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            {!isCurrent && (
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {actualIndex < historyIndex ? (
                                                        <button
                                                            onClick={() => {
                                                                // Undo multiple times to reach this state
                                                                const timesToUndo = historyIndex - actualIndex;
                                                                for (let i = 0; i < timesToUndo; i++) {
                                                                    undo();
                                                                }
                                                            }}
                                                            className={`p-2 rounded-lg transition-colors ${isDark
                                                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                                                : 'bg-white hover:bg-gray-200 text-gray-600'
                                                                }`}
                                                            title={t('restore')}
                                                        >
                                                            <RotateCcw size={16} />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                // Redo multiple times to reach this state
                                                                const timesToRedo = actualIndex - historyIndex;
                                                                for (let i = 0; i < timesToRedo; i++) {
                                                                    redo();
                                                                }
                                                            }}
                                                            className={`p-2 rounded-lg transition-colors ${isDark
                                                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                                                : 'bg-white hover:bg-gray-200 text-gray-600'
                                                                }`}
                                                            title={t('goto')}
                                                        >
                                                            <Redo2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {history.length > 0 && (
                    <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        {showConfirmClear ? (
                            <div className={`p-4 rounded-xl ${isDark ? 'bg-red-900/30 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <AlertTriangle className="text-red-500" size={20} />
                                    <p className={`font-medium ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                                        {t('clear.confirmTitle')}
                                    </p>
                                </div>
                                <p className={`text-sm mb-4 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                                    {t('clear.confirmDesc', { count: history.length })}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowConfirmClear(false)}
                                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark
                                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                            }`}
                                    >
                                        {t('clear.cancel')}
                                    </button>
                                    <button
                                        onClick={handleClearHistory}
                                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        {t('clear.confirm')}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowConfirmClear(true)}
                                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${isDark
                                    ? 'bg-gray-800 hover:bg-gray-700 text-red-400 hover:text-red-300'
                                    : 'bg-gray-100 hover:bg-gray-200 text-red-600 hover:text-red-700'
                                    }`}
                            >
                                <RotateCcw size={18} />
                                <span>{t('clear.button')}</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
