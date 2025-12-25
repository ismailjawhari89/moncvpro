
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiTemplates, AICVTemplate, PhotoPosition } from '@/data/ai-templates/ai-templates';
import { AITemplatePreview } from './AITemplatePreview';
import { Sparkles, CheckCircle, Search, Filter, X, LayoutTemplate, Image as ImageIcon } from 'lucide-react';

import { useTranslations } from 'next-intl';

interface AITemplatesGalleryProps {
    selectedTemplate: string;
    onTemplateChange: (templateId: string) => void;
    isDark?: boolean;
    locale?: string;
}

// Categories will be handled inside component to use translations

export default function AITemplatesGallery({
    selectedTemplate,
    onTemplateChange,
    isDark = false,
    locale = 'en'
}: AITemplatesGalleryProps) {
    const t = useTranslations('templates');
    const isRTL = locale === 'ar';
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [previewId, setPreviewId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPhotoPos, setFilterPhotoPos] = useState<PhotoPosition | 'all'>('all');
    const [filterLayout, setFilterLayout] = useState<string>('all');
    const [showFilters, setShowFilters] = useState(false);

    const categories = [
        { id: 'all', label: t('categories.all') },
        { id: 'tech', label: t('categories.tech') },
        { id: 'medical', label: t('categories.medical') },
        { id: 'creative', label: t('categories.creative') },
        { id: 'business', label: t('categories.business') },
        { id: 'academic', label: t('categories.education') }, // Mapping 'academic' to 'education' key
        { id: 'engineering', label: t('categories.tech') } // fallback or add new key
    ];

    // Advanced Filtering Logic
    const filteredTemplates = useMemo(() => {
        return aiTemplates.filter(template => {
            // 1. Category Filter
            if (selectedCategory !== 'all') {
                const hasTag = template.tags.some(tag =>
                    tag.includes(selectedCategory) ||
                    (selectedCategory === 'business' && (tag.includes('executive') || tag.includes('manager'))) ||
                    (selectedCategory === 'engineering' && tag.includes('engineer'))
                );
                if (!hasTag) return false;
            }

            // 2. Search Filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                // Get localized strings for search with fallback
                const name = (t(`names.${template.id}`) || template.name[locale as 'en' | 'ar' | 'fr'] || template.name.en).toLowerCase();
                const description = (t(`descriptions.${template.id}`) || template.description[locale as 'en' | 'ar' | 'fr'] || template.description.en).toLowerCase();

                // Search in localized and raw data
                const matchesName = name.includes(query) || template.name.en.toLowerCase().includes(query) || template.name.ar.includes(query);
                const matchesDesc = description.includes(query) || template.description.en.toLowerCase().includes(query) || template.description.ar.includes(query);
                const matchesTags = template.tags.some(tag => tag.includes(query));
                if (!matchesName && !matchesDesc && !matchesTags) return false;
            }

            // 3. Photo Position Filter
            if (filterPhotoPos !== 'all' && template.photoPosition !== filterPhotoPos) {
                return false;
            }

            // 4. Layout Filter
            if (filterLayout !== 'all' && template.design.layout !== filterLayout) {
                return false;
            }

            return true;
        });
    }, [selectedCategory, searchQuery, filterPhotoPos, filterLayout, t, locale]);

    const handleSelect = (id: string) => {
        onTemplateChange(id);
    };

    return (
        <div className={`w-full ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {/* Header & Controls */}
            <div className="mb-6 flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Sparkles className="text-blue-500 w-5 h-5" />
                            {t('pageTitle')}
                        </h2>
                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {filteredTemplates.length} {t('count')} - {t('atsOptimized')}
                        </p>
                    </div>

                    {/* Search & Filter Toggles */}
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`} />
                            <input
                                type="text"
                                placeholder={t('search')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 rounded-lg text-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64`}
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-2 rounded-lg border ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700'}`}
                        >
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                {/* Advanced Filters Panel */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                        >
                            {/* Photo Position Filter */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block flex items-center gap-1">
                                    <ImageIcon size={12} /> {t('filters.photoPosition')}
                                </label>
                                <select
                                    className="w-full p-2 text-sm rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                    value={filterPhotoPos}
                                    onChange={(e) => setFilterPhotoPos(e.target.value as any)}
                                >
                                    <option value="all">{t('all')}</option>
                                    <option value="top-left">{t('photoPositions.topLeft')}</option>
                                    <option value="top-right">{t('photoPositions.topRight')}</option>
                                    <option value="center">{t('photoPositions.center')}</option>
                                    <option value="left-sidebar">{t('photoPositions.sidebar')}</option>
                                    <option value="circular">{t('photoPositions.circular')}</option>
                                    <option value="no-photo">{t('photoPositions.noPhoto')}</option>
                                </select>
                            </div>

                            {/* Layout Filter */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block flex items-center gap-1">
                                    <LayoutTemplate size={12} /> {t('filters.designStyle')}
                                </label>
                                <select
                                    className="w-full p-2 text-sm rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                    value={filterLayout}
                                    onChange={(e) => setFilterLayout(e.target.value)}
                                >
                                    <option value="all">{t('all')}</option>
                                    <option value="modern">{t('designStyles.modern')}</option>
                                    <option value="classic">{t('designStyles.classic')}</option>
                                    <option value="creative">{t('designStyles.creative')}</option>
                                    <option value="executive">{t('designStyles.executive')}</option>
                                    <option value="academic">{t('designStyles.academic')}</option>
                                    <option value="technical">{t('designStyles.technical')}</option>
                                </select>
                            </div>

                            {/* Clear Filters */}
                            <div className="flex items-end">
                                <button
                                    onClick={() => {
                                        setFilterPhotoPos('all');
                                        setFilterLayout('all');
                                        setSearchQuery('');
                                        setSelectedCategory('all');
                                    }}
                                    className="px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors w-full"
                                >
                                    {t('emptyState.resetFilters')}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Categories Pills */}
                <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${selectedCategory === cat.id
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                                : isDark ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Dense Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredTemplates.map((template) => (
                        <motion.div
                            key={template.id}
                            initial={{ opacity: 1, scale: 1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                            className="relative"
                        >
                            <AITemplatePreview
                                template={template}
                                onSelect={() => handleSelect(template.id)}
                                onPreview={() => setPreviewId(template.id)}
                                locale={locale}
                                width={300} // Render width for cards
                                variant="compact" // Uses dense miniature
                            />

                            {/* Selected Indicator */}
                            {selectedTemplate === template.id && (
                                <div className={`absolute -top-2 -right-2 z-20 bg-blue-600 text-white p-1.5 rounded-full shadow-lg border-2 border-white dark:border-gray-900 ${isRTL ? '-left-2 right-auto' : ''}`}>
                                    <CheckCircle size={16} />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredTemplates.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
                        <p className="text-lg">{t('emptyState.noTemplates')}</p>
                        <button
                            onClick={() => {
                                setFilterPhotoPos('all');
                                setFilterLayout('all');
                                setSearchQuery('');
                                setSelectedCategory('all');
                            }}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {t('emptyState.resetFilters')}
                        </button>
                    </div>
                )}
            </div>

            {/* Full Screen Preview Modal */}
            <AnimatePresence>
                {previewId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setPreviewId(null)}>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden max-w-6xl w-full h-[90vh] flex flex-col md:flex-row shadow-2xl"
                        >
                            {/* Detailed Side Panel */}
                            <div className="w-full md:w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-y-auto">
                                <div className="p-6 sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur z-10 border-b border-gray-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-2xl font-bold">
                                            {t(`names.${previewId}`)}
                                        </h3>
                                        <button onClick={() => setPreviewId(null)} className="p-1 hover:bg-gray-100 rounded-full">
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-sm">
                                        <span className="px-2 py-1 bg-green-100 text-green-700 font-bold rounded">
                                            ATS Score: {aiTemplates.find(t => t.id === previewId)?.atsScore}%
                                        </span>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                            {aiTemplates.find(t => t.id === previewId)?.design.layout}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-500 uppercase mb-2">{t('bestFor')}</h4>
                                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                            {t(`descriptions.${previewId}`)}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                            <h4 className="font-bold text-xs text-gray-500 uppercase mb-1 flex items-center gap-1">
                                                <LayoutTemplate size={12} /> {t('filters.designStyle')}
                                            </h4>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                                {t(`designStyles.${aiTemplates.find(t => t.id === previewId)?.design.layout}`)}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                            <h4 className="font-bold text-xs text-gray-500 uppercase mb-1 flex items-center gap-1">
                                                <ImageIcon size={12} /> {t('filters.photoPosition')}
                                            </h4>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                                {t(`photoPositions.${aiTemplates.find(t => t.id === previewId)?.photoPosition.replace('-', '').replace('_', '').replace(' ', '').toLowerCase().replace('topleft', 'topLeft').replace('topright', 'topRight').replace('leftsidebar', 'sidebar').replace('rightsidebar', 'sidebar').replace('nophoto', 'noPhoto')}`)}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-sm text-gray-500 uppercase mb-2">{t('atsScore')}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {aiTemplates.find(t => t.id === previewId)?.tags.slice(0, 5).map(tag => (
                                                <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-100">
                                        <button
                                            onClick={() => {
                                                handleSelect(previewId);
                                                setPreviewId(null);
                                            }}
                                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            <Sparkles size={20} />
                                            {t('actions.use')}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Main Preview */}
                            <div className="flex-1 bg-gray-100 dark:bg-black/50 overflow-y-auto p-8 flex justify-center items-start">
                                <div className="shadow-2xl pointer-events-none origin-top scale-90 sm:scale-100">
                                    <AITemplatePreview
                                        template={aiTemplates.find(t => t.id === previewId)!}
                                        onSelect={() => { }}
                                        onPreview={() => { }}
                                        width={600} // Large preview width
                                        locale={locale}
                                        variant="full" // Use Full TemplateRenderer here
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
