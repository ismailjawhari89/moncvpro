'use client';

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Search, Filter, X, Layout, Heart, Clock, ChevronLeft, ChevronRight, FileText,
    Briefcase, Palette, GraduationCap
} from 'lucide-react';
import { useTemplateTranslations, useRTLStyles } from '@/hooks/useTemplateTranslations';
import { useTemplatePreferences } from '@/hooks/useTemplatePreferences';
import {
    enhancedTemplates,
    categoryOptions,
    styleOptions,
    levelOptions,
    sortOptions,
    filterTemplates,
    type EnhancedCVTemplate,
    type TemplateCategory,
    type TemplateStyle,
    type ExperienceLevel
} from '@/data/enhanced-templates';
import { TemplateCard } from './TemplateCard';
import { TemplatePreviewModal } from './TemplatePreviewModal';
import { FilterDropdown } from './FilterDropdown';

// ========== TYPES ==========
interface UnifiedTemplatesGalleryProps {
    isDark?: boolean;
    selectedTemplate?: string;
    onTemplateChange?: (id: string) => void;
    showFilters?: boolean;
    compact?: boolean;
}

// ========== MAIN COMPONENT ==========
export default function UnifiedTemplatesGallery({
    isDark = false,
    selectedTemplate,
    onTemplateChange,
    showFilters = true,
    compact = false
}: UnifiedTemplatesGalleryProps) {
    // Hooks
    const {
        t,
        isRTL,
        translateTemplate,
        translateCategory
    } = useTemplateTranslations();
    const rtlStyles = useRTLStyles();

    const {
        favorites,
        toggleFavorite,
        addToRecent,
        getRecentTemplates
    } = useTemplatePreferences();

    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<TemplateCategory | null>(null);
    const [styleFilter, setStyleFilter] = useState<TemplateStyle | null>(null);
    const [levelFilter, setLevelFilter] = useState<ExperienceLevel | null>(null);
    const [sortBy, setSortBy] = useState<string>('popularity');
    const [previewTemplate, setPreviewTemplate] = useState<EnhancedCVTemplate | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'recent'>('all');

    // Scroll ref for compact mode
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Filter and Sort Logic
    const filteredTemplates = useMemo(() => {
        // 1. Base Filter (Search & Facets)
        let result = filterTemplates({
            category: categoryFilter || undefined,
            style: styleFilter || undefined,
            level: levelFilter || undefined,
            searchQuery: searchQuery || undefined
        });

        // 2. Tab Filter
        if (activeTab === 'favorites') {
            result = result.filter(t => favorites.includes(t.id));
        } else if (activeTab === 'recent') {
            const recentIds = getRecentTemplates();
            result = result.filter(t => recentIds.includes(t.id));
            // Sort by recency (index in recentIds array)
            result.sort((a, b) => recentIds.indexOf(a.id) - recentIds.indexOf(b.id));
            return result.map(t => translateTemplate(t)); // Translate and return early to preserve order
        }

        // 3. Sorting (if not recent)
        switch (sortBy) {
            case 'popularity':
                result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
                break;
            case 'atsScore':
                result.sort((a, b) => b.atsScore - a.atsScore);
                break;
            case 'rating':
                result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'name':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }

        // 4. Translate 
        return result.map(t => translateTemplate(t));
    }, [searchQuery, categoryFilter, styleFilter, levelFilter, sortBy, activeTab, favorites, getRecentTemplates, translateTemplate]);

    // Handlers
    const handleTemplateSelect = useCallback((template: EnhancedCVTemplate) => {
        addToRecent(template.id);
        if (onTemplateChange) {
            onTemplateChange(template.id);
        } else {
            // If no handler (e.g. Marketing Page), just open preview or handle navigation
            // For now, we open preview if not compact, or select if compact? 
            // Usually marketing page -> Preview Modal -> "Use Template" -> Redirect to Builder
            setPreviewTemplate(template);
        }
    }, [onTemplateChange, addToRecent]);

    const handleUseFromModal = useCallback((id: string) => {
        addToRecent(id);
        if (onTemplateChange) {
            onTemplateChange(id);
            setPreviewTemplate(null);
        } else {
            // Redirect to builder with template param
            window.location.href = `/${isRTL ? 'ar' : 'en'}/cv-builder?template=${id}`;
        }
    }, [onTemplateChange, addToRecent, isRTL]);

    const clearFilters = () => {
        setSearchQuery('');
        setCategoryFilter(null);
        setStyleFilter(null);
        setLevelFilter(null);
    };

    const scrollGallery = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            // Adjust direction for RTL
            const finalScrollAmount = isRTL ? -scrollAmount : scrollAmount;
            scrollContainerRef.current.scrollBy({ left: finalScrollAmount, behavior: 'smooth' });
        }
    };

    // Derived State
    const hasActiveFilters = searchQuery || categoryFilter || styleFilter || levelFilter;

    // Translations for UI
    const uiLabels = {
        title: isRTL ? 'قوالب احترافية' : 'Professional Templates',
        subtitle: isRTL
            ? `${filteredTemplates.length} قالب متاح • 100% مجاني`
            : `${filteredTemplates.length} templates available • 100% Free`,
        all: isRTL ? 'الكل' : 'All',
        favorites: isRTL ? 'المفضلة' : 'Favorites',
        recent: isRTL ? 'الأخيرة' : 'Recent',
        searchPlaceholder: isRTL ? 'بحث عن قوالب بالاسم، المجال، أو الكلمة المفتاحية...' : 'Search templates by name, industry, or keyword...',
        filters: {
            category: isRTL ? 'المجال' : 'Category',
            style: isRTL ? 'النمط' : 'Style',
            experience: isRTL ? 'الخبرة' : 'Experience',
            sortBy: isRTL ? 'ترتيب حسب' : 'Sort By',
            clearAll: isRTL ? 'مسح الكل' : 'Clear All',
            allOptions: isRTL ? 'الكل' : 'All'
        },
        card: {
            preview: isRTL ? 'معاينة' : 'Preview',
            useTemplate: isRTL ? 'استخدام' : 'Use Template',
            free: isRTL ? 'مجاني' : 'FREE',
            clickToUse: isRTL ? 'انقر للاستخدام' : 'Click to use'
        },
        empty: {
            title: isRTL ? 'لا توجد قوالب' : 'No templates found',
            desc: isRTL ? 'جرب ضبط البحث أو الفلاتر للعثور على ما تبحث عنه' : 'Try adjusting your search or filters to find what you\'re looking for.'
        }
    };

    return (
        <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Header - Only show if filters are enabled or not compact (Builder uses simple header usually) */}
            {(!compact || showFilters) && (
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {uiLabels.title}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {uiLabels.subtitle}
                        </p>
                    </div>
                </div>
            )}

            {/* Quick Actions / Tabs */}
            {showFilters && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {(['all', 'favorites', 'recent'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${activeTab === tab
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            {tab === 'all' && <><Layout size={14} className={`inline ${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />{uiLabels.all}</>}
                            {tab === 'favorites' && <><Heart size={14} className={`inline ${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />{uiLabels.favorites} ({favorites.length})</>}
                            {tab === 'recent' && <><Clock size={14} className={`inline ${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />{uiLabels.recent}</>}
                        </button>
                    ))}
                </div>
            )}

            {/* Search and Filters */}
            {showFilters && (
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400`} size={18} />
                        <input
                            type="text"
                            placeholder={uiLabels.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'}`}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full`}
                            >
                                <X size={16} className="text-gray-400" />
                            </button>
                        )}
                    </div>

                    {/* Filter Row */}
                    <div className="flex flex-wrap items-center gap-3">
                        <FilterDropdown
                            label={uiLabels.filters.category}
                            icon={<Briefcase size={16} />}
                            options={categoryOptions.filter(c => c.id !== 'all')}
                            value={categoryFilter}
                            onChange={(v) => setCategoryFilter(v as TemplateCategory | null)}
                            isRTL={isRTL}
                            allLabel={uiLabels.filters.allOptions}
                        />
                        <FilterDropdown
                            label={uiLabels.filters.style}
                            icon={<Palette size={16} />}
                            options={styleOptions}
                            value={styleFilter}
                            onChange={(v) => setStyleFilter(v as TemplateStyle | null)}
                            isRTL={isRTL}
                            allLabel={uiLabels.filters.allOptions}
                        />
                        <FilterDropdown
                            label={uiLabels.filters.experience}
                            icon={<GraduationCap size={16} />}
                            options={levelOptions}
                            value={levelFilter}
                            onChange={(v) => setLevelFilter(v as ExperienceLevel | null)}
                            isRTL={isRTL}
                            allLabel={uiLabels.filters.allOptions}
                        />
                        <FilterDropdown
                            label={uiLabels.filters.sortBy}
                            icon={<Filter size={16} />}
                            options={sortOptions}
                            value={sortBy}
                            onChange={(v) => setSortBy(v || 'popularity')}
                            isRTL={isRTL}
                            allLabel={uiLabels.filters.allOptions}
                        />

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                <X size={14} />
                                {uiLabels.filters.clearAll}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Compact Mode Navigation Buttons */}
            {compact && (
                <div className={`flex items-center justify-between px-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <button
                        onClick={() => scrollGallery(isRTL ? 'right' : 'left')}
                        className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                        aria-label="Scroll Left"
                    >
                        <ChevronLeft size={18} className={isRTL ? 'rotate-180' : ''} />
                    </button>
                    <span className="text-xs text-gray-400 font-medium">
                        {activeTab === 'all' ? (isRTL ? 'جميع القوالب' : 'All Templates') : uiLabels[activeTab]} ({filteredTemplates.length})
                    </span>
                    <button
                        onClick={() => scrollGallery(isRTL ? 'left' : 'right')}
                        className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                        aria-label="Scroll Right"
                    >
                        <ChevronRight size={18} className={isRTL ? 'rotate-180' : ''} />
                    </button>
                </div>
            )}

            {/* Templates Grid/List */}
            <div
                ref={scrollContainerRef}
                className={compact
                    ? `flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`
                    : `grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
                }
            >
                <AnimatePresence mode="popLayout">
                    {filteredTemplates.map((template) => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            isSelected={selectedTemplate === template.id}
                            isFavorite={favorites.includes(template.id)}
                            onSelect={() => handleTemplateSelect(template)}
                            onPreview={() => setPreviewTemplate(template)}
                            onToggleFavorite={() => toggleFavorite(template.id)}
                            compact={compact}
                            isDark={isDark}
                            isRTL={isRTL}
                            categoryLabel={translateCategory(template.category.find(c => c !== 'all') || 'all')}
                            levelLabels={template.experienceLevel.map(l => l.toUpperCase() /* Simplified for now, or fetch translated label map */)}
                            labels={uiLabels.card}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredTemplates.length === 0 && (
                <div className="text-center py-16 w-full">
                    <FileText className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} size={64} />
                    <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {uiLabels.empty.title}
                    </h3>
                    <p className={`text-sm max-w-md mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {uiLabels.empty.desc}
                    </p>
                    <button
                        onClick={clearFilters}
                        className="mt-4 text-sm text-blue-500 hover:text-blue-600 font-medium underline"
                    >
                        {uiLabels.filters.clearAll}
                    </button>
                </div>
            )}

            {/* Preview Modal */}
            <TemplatePreviewModal
                template={previewTemplate}
                isOpen={!!previewTemplate}
                onClose={() => setPreviewTemplate(null)}
                onUse={handleUseFromModal}
                isDark={isDark}
            />
        </div>
    );
}
