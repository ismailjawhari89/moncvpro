'use client';

import React, { useState } from 'react';
import { useCVStore } from '@/stores/useCVStore';
import {
    Zap,
    X,
    Check,
    ChevronRight,
    Sparkles,
    AlertCircle,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function AISmartFixManager() {
    const t = useTranslations('cvBuilder.smartFix');
    const {
        aiSuggestions,
        acceptAISuggestion,
        acceptAllSuggestions,
        rejectAISuggestion,
        clearAISuggestions
    } = useCVStore();
    const [isExpanded, setIsExpanded] = useState(true);

    if (aiSuggestions.length === 0) return null;

    return (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 pointer-events-none">
            <AnimatePresence>
                {isExpanded ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden pointer-events-auto flex flex-col max-h-[80vh]"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2">
                                <Sparkles className="text-yellow-300 animate-pulse" size={20} />
                                <span className="font-bold">{t('title')}</span>
                                <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
                                    {t('improvements', { count: aiSuggestions.length })}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Quick Fix All Button */}
                        <div className="p-3 bg-blue-50 border-b border-blue-100 shrink-0">
                            <button
                                onClick={acceptAllSuggestions}
                                className="w-full py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                            >
                                <Zap size={16} fill="white" />
                                {t('fixAll')}
                            </button>
                        </div>

                        {/* Suggestions List */}
                        <div className="overflow-y-auto p-4 space-y-4 bg-gray-50/50 flex-1">
                            {aiSuggestions.map((suggestion) => (
                                <div
                                    key={suggestion.id}
                                    className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 space-y-3"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                                <Zap size={14} />
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                {suggestion.type}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 leading-tight">
                                            {suggestion.improvementBrief}
                                        </h4>
                                        {suggestion.targetItemTitle && (
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase italic">
                                                {suggestion.targetItemTitle}
                                            </p>
                                        )}
                                    </div>

                                    {/* Diff View */}
                                    <div className="bg-gray-50 rounded-lg p-2 text-xs space-y-2 border border-gray-100">
                                        {suggestion.originalContent && (
                                            <div className="text-gray-400 line-through decoration-red-300 italic">
                                                {suggestion.originalContent}
                                            </div>
                                        )}
                                        <div className="text-blue-700 font-medium font-sans italic">
                                            "{suggestion.suggestedContent}"
                                        </div>
                                    </div>

                                    {suggestion.reason && (
                                        <div className="flex items-start gap-1.5 px-1">
                                            <AlertCircle size={10} className="text-blue-400 mt-0.5 shrink-0" />
                                            <p className="text-[10px] text-gray-500 italic leading-tight">
                                                {suggestion.reason}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => acceptAISuggestion(suggestion.id)}
                                            className="flex-1 py-1.5 bg-white border border-blue-600 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-1"
                                        >
                                            <Check size={14} />
                                            {t('apply')}
                                        </button>
                                        <button
                                            onClick={() => rejectAISuggestion(suggestion.id)}
                                            className="px-3 py-1.5 border border-gray-200 text-gray-400 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between shrink-0">
                            <button
                                onClick={clearAISuggestions}
                                className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors"
                            >
                                {t('dismissAll')}
                            </button>
                            <span className="text-[10px] text-gray-400">
                                {t('footer')}
                            </span>
                        </div>
                    </motion.div>
                ) : (
                    <motion.button
                        layoutId="smart-fix-button"
                        onClick={() => setIsExpanded(true)}
                        className="bg-blue-600 text-white px-5 py-4 rounded-full shadow-2xl flex items-center gap-3 pointer-events-auto hover:bg-blue-700 group transition-all"
                    >
                        <Sparkles className="group-hover:rotate-12 transition-transform" />
                        <span className="font-bold text-sm">
                            {t('ready', { count: aiSuggestions.length })}
                        </span>
                        <ChevronRight size={18} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
