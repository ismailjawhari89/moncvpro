'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, TrendingUp, Sparkles, Eye, Star, Layout, FileText,
    Search, Heart, Bookmark, BookmarkPlus, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useCVStore } from '@/stores/useCVStore';
import { useTemplatePreferences } from '@/hooks/useTemplatePreferences';
import { useTemplateTranslations, useRTLStyles } from '@/hooks/useTemplateTranslations';
import {
    enhancedTemplates,
    categoryOptions,
    type EnhancedCVTemplate
} from '@/data/enhanced-templates';

// ========== TYPES ==========
interface TemplatesGalleryProps {
    isDark?: boolean;
    selectedTemplate?: string;
    onTemplateChange?: (id: string) => void;
    compact?: boolean;
}

// ========== HELPER COMPONENTS ==========

// ATS Score Badge with RTL support
const ATSBadge: React.FC<{ score: number; isRTL?: boolean }> = ({ score, isRTL }) => {
    const getColor = (s: number) => {
        if (s >= 95) return 'from-green-500 to-emerald-600';
        if (s >= 90) return 'from-blue-500 to-blue-600';
        if (s >= 85) return 'from-yellow-500 to-orange-500';
        return 'from-gray-400 to-gray-500';
    };

    return (
        <div className={`bg-gradient-to-r ${getColor(score)} text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1`}>
            <TrendingUp size={10} className={isRTL ? 'flip-rtl' : ''} />
            <span dir="ltr">{score}%</span>
        </div>
    );
};

// Category Icon
const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
        tech: '💻',
        business: '💼',
        creative: '🎨',
        medical: '⚕️',
        education: '📚',
        all: '📋'
    };
    return icons[category] || '📄';
};

// ========== MAIN COMPONENT ==========
export default function TemplatesGallery({
    isDark = false,
    selectedTemplate,
    onTemplateChange,
    compact = false
}: TemplatesGalleryProps) {
    // Store
    const storeTemplateId = useCVStore(state => state.cvData.template || 'modern');
    const applyTemplateWithSampleData = useCVStore(state => state.applyTemplateWithSampleData);

    // Template preferences (synced across components)
    const {
        favorites,
        toggleFavorite: toggleFav,
        addToRecent,
        isFavorite
    } = useTemplatePreferences();

    // Translation hooks
    const {
        translateTemplate,
        translateCategory,
        t,
        isRTL,
        locale
    } = useTemplateTranslations();
    const rtlStyles = useRTLStyles();

    // Local state
    const [searchQuery, setSearchQuery] = useState('');
    const [scrollPosition, setScrollPosition] = useState(0);
    const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
    const [isApplying, setIsApplying] = useState<string | null>(null);

    // Active template (controlled or from store)
    const activeId = selectedTemplate || storeTemplateId;

    // Translate and filter templates
    const translatedTemplates = useMemo(() => {
        return enhancedTemplates.map(t => translateTemplate(t));
    }, [translateTemplate]);

    const filteredTemplates = useMemo(() => {
        if (!searchQuery) return translatedTemplates;
        const query = searchQuery.toLowerCase();
        return translatedTemplates.filter(t =>
            t.name.toLowerCase().includes(query) ||
            t.originalName.toLowerCase().includes(query) ||
            t.keywords.some(k => k.toLowerCase().includes(query)) ||
            t.category.some(c => c.toLowerCase().includes(query))
        );
    }, [searchQuery, translatedTemplates]);

    // Handlers
    const handleSelect = useCallback((template: EnhancedCVTemplate) => {
        // Visual feedback
        setIsApplying(template.id);

        // Add to recent (synced via hook)
        addToRecent(template.id);

        if (onTemplateChange) {
            onTemplateChange(template.id);
        } else {
            // Use the smart template application with sample data
            // This will apply template styling AND fill empty sections with sample data
            applyTemplateWithSampleData(template.id, true);
        }

        // Clear visual feedback after animation
        setTimeout(() => setIsApplying(null), 500);
    }, [onTemplateChange, applyTemplateWithSampleData, addToRecent]);

    const toggleFavorite = useCallback((templateId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFav(templateId);
    }, [toggleFav]);

    const scrollGallery = (direction: 'left' | 'right') => {
        const container = document.getElementById('templates-scroll-container');
        if (container) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="space-y-4" dir={rtlStyles.direction}>
            {/* Header */}
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div>
                    <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {isRTL ? 'قوالب احترافية' : 'Pro Templates'}
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {filteredTemplates.length} {isRTL ? 'قوالب محسنة لـ ATS' : 'ATS-optimized templates'}
                    </p>
                </div>

                {/* Quick Search */}
                <div className="relative">
                    <Search className={`absolute ${isRTL ? 'right-2.5' : 'left-2.5'} top-1/2 -translate-y-1/2 text-gray-400`} size={14} />
                    <input
                        type="text"
                        placeholder={isRTL ? 'بحث...' : 'Search...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`${isRTL ? 'pr-8 pl-3' : 'pl-8 pr-3'} py-1.5 text-xs rounded-lg border transition-all w-32 focus:w-40 ${isDark
                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        dir={isRTL ? 'rtl' : 'ltr'}
                    />
                </div>
            </div>

            {/* Scroll Navigation for Compact Mode */}
            {compact && (
                <div className={`flex items-center justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <button
                        onClick={() => scrollGallery(isRTL ? 'right' : 'left')}
                        className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                            }`}
                    >
                        <ChevronLeft size={18} className={isRTL ? 'rotate-180' : ''} />
                    </button>
                    <button
                        onClick={() => scrollGallery(isRTL ? 'left' : 'right')}
                        className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                            }`}
                    >
                        <ChevronRight size={18} className={isRTL ? 'rotate-180' : ''} />
                    </button>
                </div>
            )}

            {/* Templates Grid/Scroll */}
            <div
                id="templates-scroll-container"
                className={compact
                    ? `flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`
                    : 'grid grid-cols-2 md:grid-cols-3 gap-4'
                }
            >
                <AnimatePresence mode="popLayout">
                    {filteredTemplates.map((template) => {
                        const isSelected = activeId === template.id;
                        const isFavorite = favorites.includes(template.id);
                        const isHovered = hoveredTemplate === template.id;
                        const primaryCategory = template.category.find(c => c !== 'all') || 'all';

                        return (
                            <motion.div
                                key={template.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                whileHover={{ y: -4 }}
                                className={`group relative flex-shrink-0 ${compact ? 'w-40' : ''}`}
                                onMouseEnter={() => setHoveredTemplate(template.id)}
                                onMouseLeave={() => setHoveredTemplate(null)}
                            >
                                {/* Clickable Card Area */}
                                <div
                                    onClick={() => handleSelect(template)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            handleSelect(template);
                                        }
                                    }}
                                    className={`w-full aspect-[210/297] rounded-xl border-2 overflow-hidden transition-all cursor-pointer relative ${isSelected
                                        ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900 ring-offset-2 shadow-lg shadow-blue-500/20'
                                        : isDark
                                            ? 'border-gray-700 hover:border-gray-600 hover:shadow-lg bg-gray-800'
                                            : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                                        }`}
                                >
                                    {/* Thumbnail Image */}
                                    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 relative">
                                        <Image
                                            src={template.previewImage}
                                            alt={template.altText}
                                            fill
                                            sizes="(max-width: 768px) 50vw, 33vw"
                                            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                if (target.parentElement) {
                                                    target.parentElement.style.backgroundColor = template.colors.primary + '15';
                                                    target.parentElement.innerHTML = `
                                                        <div class="w-full h-full flex flex-col items-center justify-center p-2">
                                                            <span class="text-3xl mb-2">${getCategoryIcon(primaryCategory)}</span>
                                                            <span class="text-xs font-medium text-gray-600 dark:text-gray-300 text-center">${template.name}</span>
                                                        </div>
                                                    `;
                                                }
                                            }}
                                        />

                                        {/* Hover Overlay */}
                                        <AnimatePresence>
                                            {isHovered && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end p-3"
                                                >
                                                    <div className="text-center text-white mb-2">
                                                        <p className="text-xs font-medium truncate max-w-full">
                                                            {template.name}
                                                        </p>
                                                        <p className="text-[10px] opacity-75">
                                                            {template.style[0]} • {categoryOptions.find(c => c.id === primaryCategory)?.label || 'Universal'}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Eye size={12} className="text-white/80" />
                                                        <span className="text-[10px] text-white/80">{isRTL ? 'انقر للاستخدام' : 'Click to use'}</span>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Top Badges */}
                                        <div className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'}`}>
                                            <ATSBadge score={template.atsScore} isRTL={isRTL} />
                                        </div>

                                        {/* Free Badge */}
                                        {!template.isPremium && (
                                            <div className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg flex items-center gap-0.5`}>
                                                <Sparkles size={8} />{isRTL ? 'مجاني' : 'FREE'}
                                            </div>
                                        )}

                                        {/* Selected Indicator */}
                                        {isSelected && (
                                            <div className={`absolute top-2 ${isRTL ? 'left-8' : 'right-8'} bg-blue-600 text-white p-1 rounded-full shadow-lg animate-pulse`}>
                                                <CheckCircle size={12} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Favorite Button - Outside the main clickable area */}
                                <button
                                    onClick={(e) => toggleFavorite(template.id, e)}
                                    className={`absolute bottom-14 ${isRTL ? 'left-2' : 'right-2'} p-1.5 rounded-full shadow-lg transition-all z-10 ${isFavorite
                                        ? 'bg-red-500 text-white'
                                        : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500'
                                        }`}
                                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                >
                                    {isFavorite ? (
                                        <Bookmark size={12} fill="currentColor" />
                                    ) : (
                                        <BookmarkPlus size={12} />
                                    )}
                                </button>

                                {/* Label */}
                                <div className="mt-2 text-center">
                                    <h4 className={`font-semibold text-sm truncate ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                                        {template.name}
                                    </h4>
                                    <div className="flex items-center justify-center gap-1.5 mt-1">
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                                            {getCategoryIcon(primaryCategory)} {categoryOptions.find(c => c.id === primaryCategory)?.label}
                                        </span>
                                        {template.rating && (
                                            <span className="flex items-center gap-0.5 text-[10px] text-amber-500">
                                                <Star size={10} fill="currentColor" />
                                                {template.rating}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredTemplates.length === 0 && (
                <div className="text-center py-8">
                    <FileText className={`mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} size={40} />
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        No templates match your search
                    </p>
                    <button
                        onClick={() => setSearchQuery('')}
                        className="mt-2 text-xs text-blue-500 hover:text-blue-600"
                    >
                        Clear search
                    </button>
                </div>
            )}

            {/* Quick Stats */}
            <div className={`flex items-center justify-center gap-4 pt-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                <span className="flex items-center gap-1">
                    <TrendingUp size={12} className="text-green-500" />
                    Avg. ATS: 92%
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                    <Layout size={12} className="text-blue-500" />
                    {enhancedTemplates.length} Templates
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                    <Sparkles size={12} className="text-amber-500" />
                    100% Free
                </span>
            </div>
        </div>
    );
}
