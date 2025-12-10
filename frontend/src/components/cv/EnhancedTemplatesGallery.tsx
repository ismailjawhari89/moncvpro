'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, X, CheckCircle, TrendingUp, Sparkles, Eye, Star,
    Layout, Palette, Briefcase, GraduationCap, Heart, Clock, ChevronDown,
    Zap, Shield, Users, FileText, ArrowRight, BookmarkPlus, Bookmark
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

// ========== TYPES ==========
interface EnhancedTemplatesGalleryProps {
    isDark?: boolean;
    selectedTemplate?: string;
    onTemplateChange?: (id: string) => void;
    showFilters?: boolean;
    compact?: boolean;
}

// ========== LOCAL STORAGE HELPERS ==========
const FAVORITES_KEY = 'moncvpro_favorite_templates';
const RECENT_KEY = 'moncvpro_recent_templates';

const getFavorites = (): string[] => {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    } catch {
        return [];
    }
};

const saveFavorites = (favorites: string[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

const getRecent = (): string[] => {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    } catch {
        return [];
    }
};

const addToRecent = (templateId: string) => {
    if (typeof window === 'undefined') return;
    const recent = getRecent().filter(id => id !== templateId);
    recent.unshift(templateId);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, 5)));
};

// ========== SUB-COMPONENTS ==========

// ATS Score Badge with explanation tooltip
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
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <div className={`bg-gradient-to-r ${getScoreColor(score)} text-white font-bold rounded-full shadow-lg flex items-center gap-1.5 ${sizes[size]}`}>
                <TrendingUp size={size === 'sm' ? 12 : 14} />
                {score}%
            </div>

            {/* Tooltip */}
            <AnimatePresence>
                {showTooltip && reason && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl"
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

// Category Badge
const CategoryBadge: React.FC<{ category: string; icon?: string }> = ({ category, icon }) => {
    const option = categoryOptions.find(c => c.id === category);
    return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
            {icon || option?.icon} {option?.label || category}
        </span>
    );
};

// Level Badge
const LevelBadge: React.FC<{ level: ExperienceLevel }> = ({ level }) => {
    const option = levelOptions.find(l => l.id === level);
    const colors: Record<ExperienceLevel, string> = {
        entry: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
        mid: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
        senior: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
        executive: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    };
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colors[level]}`}>
            <Briefcase size={10} />
            {option?.label || level}
        </span>
    );
};

// Template Card Component
const TemplateCard: React.FC<{
    template: EnhancedCVTemplate;
    isSelected: boolean;
    isFavorite: boolean;
    onSelect: () => void;
    onPreview: () => void;
    onToggleFavorite: () => void;
    compact?: boolean;
    isDark?: boolean;
}> = ({ template, isSelected, isFavorite, onSelect, onPreview, onToggleFavorite, compact, isDark }) => {
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -4 }}
            className={`group relative bg-white dark:bg-gray-800 rounded-2xl border-2 overflow-hidden transition-all duration-300 cursor-pointer ${isSelected
                    ? 'border-blue-500 ring-4 ring-blue-200 dark:ring-blue-900 shadow-xl shadow-blue-500/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:shadow-xl'
                }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onSelect}
        >
            {/* Template Preview Image */}
            <div className={`relative ${compact ? 'aspect-[3/4]' : 'aspect-[210/297]'} bg-gray-100 dark:bg-gray-800 overflow-hidden`}>
                {!imageError ? (
                    <Image
                        src={template.previewImage}
                        alt={template.altText || template.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div
                        className="w-full h-full flex flex-col items-center justify-center p-4"
                        style={{ backgroundColor: template.colors.primary + '15' }}
                    >
                        <FileText size={48} style={{ color: template.colors.primary }} className="mb-3 opacity-50" />
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300 text-center">
                            {template.name}
                        </span>
                    </div>
                )}

                {/* Hover Overlay with Actions */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center p-4"
                        >
                            <div className="w-full space-y-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onPreview(); }}
                                    className="w-full py-2.5 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Eye size={16} /> Preview
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onSelect(); }}
                                    className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Sparkles size={16} /> Use Template
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Top Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                    <ATSScoreBadge score={template.atsScore} reason={template.atsReason} size="sm" />
                </div>

                {/* Free/Premium Badge */}
                {!template.isPremium && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <Sparkles size={10} /> FREE
                    </div>
                )}

                {/* Favorite Button */}
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
                    className={`absolute bottom-2 right-2 p-2 rounded-full shadow-lg transition-all ${isFavorite
                            ? 'bg-red-500 text-white'
                            : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500'
                        }`}
                >
                    {isFavorite ? <Bookmark size={16} fill="currentColor" /> : <BookmarkPlus size={16} />}
                </button>

                {/* Selected Indicator */}
                {isSelected && (
                    <div className="absolute top-2 right-10 bg-blue-600 text-white p-1.5 rounded-full shadow-lg animate-pulse">
                        <CheckCircle size={14} />
                    </div>
                )}
            </div>

            {/* Template Info */}
            {!compact && (
                <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {template.name}
                        </h3>
                        {template.rating && (
                            <div className="flex items-center gap-1 text-amber-500">
                                <Star size={14} fill="currentColor" />
                                <span className="text-sm font-medium">{template.rating}</span>
                            </div>
                        )}
                    </div>

                    <p className={`text-sm mb-3 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {template.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        <CategoryBadge category={template.category.find(c => c !== 'all') || 'all'} />
                        {template.experienceLevel.slice(0, 2).map(level => (
                            <LevelBadge key={level} level={level} />
                        ))}
                    </div>

                    {/* Features Pills */}
                    <div className="flex flex-wrap gap-1.5">
                        {template.features.slice(0, 2).map((feature) => (
                            <span
                                key={feature}
                                className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
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
                </div>
            )}

            {/* Compact Mode Label */}
            {compact && (
                <div className="p-3 text-center">
                    <h4 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {template.name}
                    </h4>
                    <p className="text-xs text-gray-500">{template.style[0]}</p>
                </div>
            )}
        </motion.div>
    );
};

// Preview Modal Component
const TemplatePreviewModal: React.FC<{
    template: EnhancedCVTemplate | null;
    isOpen: boolean;
    onClose: () => void;
    onUse: (id: string) => void;
}> = ({ template, isOpen, onClose, onUse }) => {
    if (!isOpen || !template) return null;

    const sampleData = getSampleDataForTemplate(template);

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-6xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[90vh]"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors backdrop-blur-md"
                    >
                        <X size={20} className="text-gray-600 dark:text-gray-300" />
                    </button>

                    {/* Left: Template Preview */}
                    <div className="w-full lg:w-3/5 bg-gray-100 dark:bg-gray-800 overflow-y-auto p-6">
                        <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden max-w-md mx-auto">
                            <Image
                                src={template.previewImage}
                                alt={template.altText}
                                width={600}
                                height={800}
                                className="w-full h-auto"
                                priority
                            />

                            {/* Floating ATS Badge */}
                            <div className="absolute top-4 left-4">
                                <ATSScoreBadge score={template.atsScore} reason={template.atsReason} size="md" />
                            </div>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="w-full lg:w-2/5 flex flex-col bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
                        <div className="p-6 flex-1 overflow-y-auto">
                            {/* Header */}
                            <div className="mb-6">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <CategoryBadge category={template.category.find(c => c !== 'all') || 'all'} />
                                    {!template.isPremium && (
                                        <span className="px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold uppercase">
                                            Free
                                        </span>
                                    )}
                                    {template.experienceLevel.map(level => (
                                        <LevelBadge key={level} level={level} />
                                    ))}
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {template.name}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {template.description}
                                </p>
                            </div>

                            {/* ATS Explanation */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
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
                                            <CheckCircle size={14} className="text-green-500" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Sections Included */}
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Layout size={18} className="text-blue-500" />
                                    Sections Included
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {template.sections.map((section, i) => (
                                        <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg text-xs">
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
                                            <span className="text-amber-500 mt-0.5">•</span>
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Color Palette */}
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Palette size={18} className="text-pink-500" />
                                    Color Palette
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-10 h-10 rounded-full shadow-md border" style={{ backgroundColor: template.colors.primary }} />
                                        <span className="text-[10px] text-gray-500">Primary</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-10 h-10 rounded-full shadow-md border" style={{ backgroundColor: template.colors.secondary }} />
                                        <span className="text-[10px] text-gray-500">Secondary</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-10 h-10 rounded-full shadow-md border" style={{ backgroundColor: template.colors.accent }} />
                                        <span className="text-[10px] text-gray-500">Accent</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                            <button
                                onClick={() => onUse(template.id)}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 text-lg"
                            >
                                Use This Template
                                <ArrowRight size={20} />
                            </button>
                            <p className="text-center text-xs text-gray-500 mt-3">
                                No credit card required • Instant access
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

// Filter Dropdown Component
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
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
            >
                {icon}
                <span className="text-sm font-medium">{selectedLabel}</span>
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
                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${!value ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                All
                            </button>
                            {options.map(option => (
                                <button
                                    key={option.id}
                                    onClick={() => { onChange(option.id); setIsOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${value === option.id ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'text-gray-700 dark:text-gray-300'
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

// ========== MAIN COMPONENT ==========
export default function EnhancedTemplatesGallery({
    isDark = false,
    selectedTemplate,
    onTemplateChange,
    showFilters = true,
    compact = false
}: EnhancedTemplatesGalleryProps) {
    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<TemplateCategory | null>(null);
    const [styleFilter, setStyleFilter] = useState<TemplateStyle | null>(null);
    const [levelFilter, setLevelFilter] = useState<ExperienceLevel | null>(null);
    const [sortBy, setSortBy] = useState<string>('popularity');
    const [previewTemplate, setPreviewTemplate] = useState<EnhancedCVTemplate | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'recent'>('all');

    // Load favorites from localStorage
    useEffect(() => {
        setFavorites(getFavorites());
    }, []);

    // Filter and sort templates
    const filteredTemplates = useMemo(() => {
        let result = filterTemplates({
            category: categoryFilter || undefined,
            style: styleFilter || undefined,
            level: levelFilter || undefined,
            searchQuery: searchQuery || undefined
        });

        // Apply tab filter
        if (activeTab === 'favorites') {
            result = result.filter(t => favorites.includes(t.id));
        } else if (activeTab === 'recent') {
            const recent = getRecent();
            result = result.filter(t => recent.includes(t.id));
            result.sort((a, b) => recent.indexOf(a.id) - recent.indexOf(b.id));
            return result; // Skip sorting for recent
        }

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
    }, [searchQuery, categoryFilter, styleFilter, levelFilter, sortBy, activeTab, favorites]);

    // Handlers
    const handleTemplateSelect = useCallback((template: EnhancedCVTemplate) => {
        addToRecent(template.id);
        onTemplateChange?.(template.id);
    }, [onTemplateChange]);

    const handleToggleFavorite = useCallback((templateId: string) => {
        setFavorites(prev => {
            const updated = prev.includes(templateId)
                ? prev.filter(id => id !== templateId)
                : [...prev, templateId];
            saveFavorites(updated);
            return updated;
        });
    }, []);

    const handlePreview = useCallback((template: EnhancedCVTemplate) => {
        setPreviewTemplate(template);
    }, []);

    const handleUseTemplate = useCallback((templateId: string) => {
        const template = enhancedTemplates.find(t => t.id === templateId);
        if (template) {
            handleTemplateSelect(template);
            setPreviewTemplate(null);
        }
    }, [handleTemplateSelect]);

    const clearFilters = () => {
        setSearchQuery('');
        setCategoryFilter(null);
        setStyleFilter(null);
        setLevelFilter(null);
    };

    const hasActiveFilters = searchQuery || categoryFilter || styleFilter || levelFilter;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Professional Templates
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {filteredTemplates.length} templates available • 100% Free
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2">
                {(['all', 'favorites', 'recent'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === tab
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                    >
                        {tab === 'all' && <><Layout size={14} className="inline mr-1.5" />All</>}
                        {tab === 'favorites' && <><Heart size={14} className="inline mr-1.5" />Favorites ({favorites.length})</>}
                        {tab === 'recent' && <><Clock size={14} className="inline mr-1.5" />Recent</>}
                    </button>
                ))}
            </div>

            {/* Search and Filters */}
            {showFilters && (
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search templates by name, industry, or keyword..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                            >
                                <X size={16} className="text-gray-400" />
                            </button>
                        )}
                    </div>

                    {/* Filter Row */}
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
                        <FilterDropdown
                            label="Sort By"
                            icon={<Filter size={16} />}
                            options={sortOptions}
                            value={sortBy}
                            onChange={(v) => setSortBy(v || 'popularity')}
                        />

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                <X size={14} />
                                Clear All
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Templates Grid */}
            <div className={`grid gap-6 ${compact
                    ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                }`}>
                <AnimatePresence mode="popLayout">
                    {filteredTemplates.map((template) => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            isSelected={selectedTemplate === template.id}
                            isFavorite={favorites.includes(template.id)}
                            onSelect={() => handleTemplateSelect(template)}
                            onPreview={() => handlePreview(template)}
                            onToggleFavorite={() => handleToggleFavorite(template.id)}
                            compact={compact}
                            isDark={isDark}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredTemplates.length === 0 && (
                <div className="text-center py-16">
                    <FileText className="mx-auto mb-4 text-gray-400" size={64} />
                    <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        No templates found
                    </h3>
                    <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {activeTab === 'favorites'
                            ? "You haven't saved any favorites yet"
                            : activeTab === 'recent'
                                ? "You haven't used any templates yet"
                                : "Try adjusting your search or filters"
                        }
                    </p>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            )}

            {/* Preview Modal */}
            <TemplatePreviewModal
                template={previewTemplate}
                isOpen={!!previewTemplate}
                onClose={() => setPreviewTemplate(null)}
                onUse={handleUseTemplate}
            />
        </div>
    );
}
