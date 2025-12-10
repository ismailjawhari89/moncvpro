'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Sparkles, Star, TrendingUp, Eye, X, CheckCircle, Zap,
    Shield, Layout, Palette, ArrowRight, Filter, Briefcase, GraduationCap,
    ChevronDown, Users, Heart, BookmarkPlus, Bookmark, FileText
} from 'lucide-react';
import {
    enhancedTemplates,
    categoryOptions,
    styleOptions,
    levelOptions,
    sortOptions,
    filterTemplates,
    getSampleDataForTemplate,
    type EnhancedCVTemplate,
    type TemplateCategory,
    type TemplateStyle,
    type ExperienceLevel
} from '@/data/enhanced-templates';

// Edge Runtime for Cloudflare Pages
export const runtime = 'edge';

// ========== SUB-COMPONENTS ==========

// ATS Score Badge with hover explanation
const ATSScoreBadge: React.FC<{ score: number; reason?: string; size?: 'sm' | 'md' | 'lg' }> = ({ score, reason, size = 'md' }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const getScoreColor = (s: number) => {
        if (s >= 95) return 'from-green-500 to-emerald-600';
        if (s >= 90) return 'from-blue-500 to-blue-600';
        if (s >= 85) return 'from-yellow-500 to-orange-500';
        return 'from-gray-400 to-gray-500';
    };

    const sizes = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2'
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <div className={`bg-gradient-to-r ${getScoreColor(score)} text-white font-bold rounded-full shadow-lg flex items-center gap-1.5 ${sizes[size]}`}>
                <TrendingUp size={size === 'sm' ? 12 : 14} />
                {score}%
            </div>

            <AnimatePresence>
                {showTooltip && reason && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl pointer-events-none"
                    >
                        <div className="font-semibold mb-1 flex items-center gap-1">
                            <Shield size={12} /> ATS Compatibility
                        </div>
                        <p className="text-gray-300">{reason}</p>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                            <div className="border-8 border-transparent border-t-gray-900" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Filter Dropdown
const FilterDropdown: React.FC<{
    label: string;
    icon: React.ReactNode;
    options: Array<{ id: string; label: string }>;
    value: string | null;
    onChange: (value: string | null) => void;
}> = ({ label, icon, options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedLabel = options.find(o => o.id === value)?.label || label;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                    }`}
            >
                {icon}
                <span className="text-sm font-medium hidden sm:inline">{selectedLabel}</span>
                <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                        >
                            <button
                                onClick={() => { onChange(null); setIsOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${!value ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 font-medium' : 'text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                All {label}s
                            </button>
                            {options.map(option => (
                                <button
                                    key={option.id}
                                    onClick={() => { onChange(option.id); setIsOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${value === option.id ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 font-medium' : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

// Template Preview Modal
const TemplatePreviewModal: React.FC<{
    template: EnhancedCVTemplate | null;
    isOpen: boolean;
    onClose: () => void;
    onUseTemplate: (id: string) => void;
}> = ({ template, isOpen, onClose, onUseTemplate }) => {
    if (!isOpen || !template) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-6xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[90vh]"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors backdrop-blur-md"
                    >
                        <X size={20} className="text-gray-600 dark:text-gray-300" />
                    </button>

                    {/* Preview Image */}
                    <div className="w-full lg:w-3/5 bg-gray-100 dark:bg-gray-800 overflow-y-auto p-6 lg:p-8">
                        <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden max-w-md mx-auto">
                            <Image
                                src={template.previewImage}
                                alt={template.altText}
                                width={600}
                                height={800}
                                className="w-full h-auto"
                                priority
                            />
                            <div className="absolute top-4 left-4">
                                <ATSScoreBadge score={template.atsScore} reason={template.atsReason} size="md" />
                            </div>
                        </div>
                    </div>

                    {/* Details Panel */}
                    <div className="w-full lg:w-2/5 flex flex-col border-l border-gray-200 dark:border-gray-800">
                        <div className="p-6 flex-1 overflow-y-auto">
                            {/* Header */}
                            <div className="mb-6">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                                        {categoryOptions.find(c => c.id === template.category.find(cat => cat !== 'all'))?.icon} {categoryOptions.find(c => c.id === template.category.find(cat => cat !== 'all'))?.label || 'Universal'}
                                    </span>
                                    {!template.isPremium && (
                                        <span className="px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold">
                                            FREE
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {template.name}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {template.description}
                                </p>
                            </div>

                            {/* ATS Explanation */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 mb-6 border border-blue-100 dark:border-blue-800">
                                <div className="flex items-center gap-2 mb-2 text-blue-700 dark:text-blue-300">
                                    <Shield size={18} />
                                    <span className="font-bold">ATS Score: {template.atsScore}%</span>
                                </div>
                                <p className="text-sm text-blue-600 dark:text-blue-400">
                                    {template.atsReason}
                                </p>
                            </div>

                            {/* Best For */}
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Users size={18} className="text-purple-500" />
                                    Best For
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {template.bestFor.map((item, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Features */}
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Zap size={18} className="text-yellow-500" />
                                    Key Features
                                </h3>
                                <ul className="space-y-2">
                                    {template.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                            <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Sections */}
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Layout size={18} className="text-blue-500" />
                                    Sections Included
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {template.sections.map((section, i) => (
                                        <span key={i} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-medium">
                                            {section}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Star size={18} className="text-amber-500" />
                                    Pro Tips
                                </h3>
                                <ul className="space-y-2">
                                    {template.tips.map((tip, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                            <span className="text-amber-500 mt-0.5">💡</span>
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Color Palette */}
                            <div className="mb-4">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Palette size={18} className="text-pink-500" />
                                    Color Palette
                                </h3>
                                <div className="flex items-center gap-4">
                                    {[
                                        { color: template.colors.primary, label: 'Primary' },
                                        { color: template.colors.secondary, label: 'Secondary' },
                                        { color: template.colors.accent, label: 'Accent' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex flex-col items-center gap-1">
                                            <div
                                                className="w-10 h-10 rounded-xl shadow-md border border-gray-200"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <span className="text-[10px] text-gray-500">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                            <button
                                onClick={() => onUseTemplate(template.id)}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 text-lg"
                            >
                                Use This Template
                                <ArrowRight size={20} />
                            </button>
                            <p className="text-center text-xs text-gray-500 mt-3">
                                ✨ No credit card required • Instant access
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

// ========== MAIN PAGE COMPONENT ==========
export default function TemplatesGalleryPage() {
    const router = useRouter();

    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<TemplateCategory | null>(null);
    const [styleFilter, setStyleFilter] = useState<TemplateStyle | null>(null);
    const [levelFilter, setLevelFilter] = useState<ExperienceLevel | null>(null);
    const [sortBy, setSortBy] = useState<string>('popularity');
    const [previewTemplate, setPreviewTemplate] = useState<EnhancedCVTemplate | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);

    // Filter templates
    const filteredTemplates = useMemo(() => {
        let result = filterTemplates({
            category: categoryFilter || undefined,
            style: styleFilter || undefined,
            level: levelFilter || undefined,
            searchQuery: searchQuery || undefined
        });

        // Sort
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

        return result;
    }, [searchQuery, categoryFilter, styleFilter, levelFilter, sortBy]);

    // Top templates by ATS score
    const topTemplates = useMemo(() =>
        enhancedTemplates.filter(t => t.atsScore >= 95).slice(0, 3)
        , []);

    // Handlers
    const handleUseTemplate = (templateId: string) => {
        router.push(`/cv-builder?template=${templateId}`);
    };

    const toggleFavorite = (templateId: string) => {
        setFavorites(prev =>
            prev.includes(templateId)
                ? prev.filter(id => id !== templateId)
                : [...prev, templateId]
        );
    };

    const clearFilters = () => {
        setSearchQuery('');
        setCategoryFilter(null);
        setStyleFilter(null);
        setLevelFilter(null);
    };

    const hasActiveFilters = searchQuery || categoryFilter || styleFilter || levelFilter;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
            {/* Hero Header */}
            <section className="bg-white/90 dark:bg-gray-800/90 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
                            <Sparkles size={14} />
                            <span>{enhancedTemplates.length} Professional Templates - 100% Free</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Professional CV Templates
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Choose from our curated collection of ATS-optimized templates designed for every industry
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-6 max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search templates by name, industry, or keyword..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                                >
                                    <X size={16} className="text-gray-400" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <FilterDropdown
                            label="Category"
                            icon={<Briefcase size={16} />}
                            options={categoryOptions.filter(c => c.id !== 'all')}
                            value={categoryFilter}
                            onChange={(v) => setCategoryFilter(v as TemplateCategory | null)}
                        />
                        <FilterDropdown
                            label="Style"
                            icon={<Palette size={16} />}
                            options={styleOptions}
                            value={styleFilter}
                            onChange={(v) => setStyleFilter(v as TemplateStyle | null)}
                        />
                        <FilterDropdown
                            label="Experience"
                            icon={<GraduationCap size={16} />}
                            options={levelOptions}
                            value={levelFilter}
                            onChange={(v) => setLevelFilter(v as ExperienceLevel | null)}
                        />

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                <X size={14} />
                                Clear
                            </button>
                        )}
                    </div>

                    <FilterDropdown
                        label="Sort By"
                        icon={<Filter size={16} />}
                        options={sortOptions}
                        value={sortBy}
                        onChange={(v) => setSortBy(v || 'popularity')}
                    />
                </div>
            </section>

            {/* Top Rated Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Star className="text-amber-500" fill="currentColor" size={24} />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Top Rated - Highest ATS Score
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {topTemplates.map((template) => (
                            <motion.div
                                key={template.id}
                                whileHover={{ y: -2 }}
                                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-amber-200 dark:border-amber-800 hover:shadow-lg transition-all cursor-pointer"
                                onClick={() => setPreviewTemplate(template)}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                                    <ATSScoreBadge score={template.atsScore} size="sm" />
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{template.description}</p>
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {template.bestFor.slice(0, 2).map((item, i) => (
                                        <span key={i} className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleUseTemplate(template.id);
                                    }}
                                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-lg transition-colors"
                                >
                                    Use This Template
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Templates Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {categoryFilter ? categoryOptions.find(c => c.id === categoryFilter)?.label : 'All Templates'}
                        <span className="text-gray-500 dark:text-gray-400 ml-2 text-lg font-normal">
                            ({filteredTemplates.length} templates)
                        </span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredTemplates.map((template, index) => (
                            <motion.div
                                key={template.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.02 }}
                                className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                onClick={() => setPreviewTemplate(template)}
                            >
                                {/* Preview Image */}
                                <div className="relative aspect-[3/4] bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                    <Image
                                        src={template.previewImage}
                                        alt={template.altText || template.name}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                    />

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center p-4">
                                        <div className="w-full space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setPreviewTemplate(template);
                                                }}
                                                className="w-full py-2.5 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                                            >
                                                <Eye size={16} /> Preview
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUseTemplate(template.id);
                                                }}
                                                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                                            >
                                                <Sparkles size={16} /> Use Template
                                            </button>
                                        </div>
                                    </div>

                                    {/* Badges */}
                                    <div className="absolute top-3 left-3">
                                        <ATSScoreBadge score={template.atsScore} reason={template.atsReason} size="sm" />
                                    </div>

                                    {!template.isPremium && (
                                        <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                                            <Sparkles size={10} /> FREE
                                        </div>
                                    )}

                                    {/* Favorite Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(template.id);
                                        }}
                                        className={`absolute bottom-3 right-3 p-2 rounded-full shadow-lg transition-all ${favorites.includes(template.id)
                                                ? 'bg-red-500 text-white'
                                                : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500'
                                            }`}
                                    >
                                        {favorites.includes(template.id) ? (
                                            <Heart size={16} fill="currentColor" />
                                        ) : (
                                            <Heart size={16} />
                                        )}
                                    </button>
                                </div>

                                {/* Template Info */}
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                            {template.name}
                                        </h3>
                                        {template.rating && (
                                            <div className="flex items-center gap-1 text-amber-500">
                                                <Star size={14} fill="currentColor" />
                                                <span className="text-sm font-medium">{template.rating}</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                        {template.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                            {categoryOptions.find(c => c.id === template.category.find(cat => cat !== 'all'))?.icon} {categoryOptions.find(c => c.id === template.category.find(cat => cat !== 'all'))?.label || 'Universal'}
                                        </span>
                                        {template.style.slice(0, 1).map((style) => (
                                            <span key={style} className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                                {styleOptions.find(s => s.id === style)?.label || style}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Features */}
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {template.features.slice(0, 2).map((feature) => (
                                            <span
                                                key={feature}
                                                className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                        {template.features.length > 2 && (
                                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500">
                                                +{template.features.length - 2}
                                            </span>
                                        )}
                                    </div>

                                    {/* Use Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUseTemplate(template.id);
                                        }}
                                        className="w-full py-2.5 rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm hover:shadow-md"
                                    >
                                        Use This Template
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Empty State */}
                {filteredTemplates.length === 0 && (
                    <div className="text-center py-16">
                        <FileText className="mx-auto mb-4 text-gray-400 dark:text-gray-600" size={64} />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No templates found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Try adjusting your search or filters
                        </p>
                        <button
                            onClick={clearFilters}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </section>

            {/* Bottom CTA */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 border-t border-blue-500">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">
                        Can't decide? Start with our most popular template
                    </h2>
                    <p className="text-blue-100 mb-6 text-lg">
                        The Classic Simple template has the highest ATS score and works for any industry
                    </p>
                    <button
                        onClick={() => handleUseTemplate('classic-simple')}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                        <Sparkles size={20} />
                        Start with Classic Simple (98% ATS)
                    </button>
                </div>
            </section>

            {/* Preview Modal */}
            <TemplatePreviewModal
                template={previewTemplate}
                isOpen={!!previewTemplate}
                onClose={() => setPreviewTemplate(null)}
                onUseTemplate={handleUseTemplate}
            />

            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'ItemList',
                        itemListElement: enhancedTemplates.map((template, index) => ({
                            '@type': 'ListItem',
                            position: index + 1,
                            item: {
                                '@type': 'Product',
                                name: template.name,
                                description: template.metaDescription || template.description,
                                image: template.previewImage,
                                offers: {
                                    '@type': 'Offer',
                                    price: '0',
                                    priceCurrency: 'USD',
                                    availability: 'https://schema.org/InStock',
                                },
                            },
                        })),
                    }),
                }}
            />
        </div>
    );
}
