import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Eye, Sparkles, CheckCircle, FileText, Bookmark, BookmarkPlus, Star
} from 'lucide-react';
import { type EnhancedCVTemplate, categoryOptions } from '@/data/enhanced-templates';
import { ATSScoreBadge, CategoryBadge, LevelBadge } from './Badges';

interface TemplateCardProps {
    template: EnhancedCVTemplate;
    isSelected: boolean;
    isFavorite: boolean;
    onSelect: () => void;
    onPreview: () => void;
    onToggleFavorite: () => void;
    compact?: boolean;
    isDark?: boolean;
    isRTL?: boolean;
    categoryLabel: string; // Translated category label
    levelLabels: string[]; // Translated level labels
    labels: {
        preview: string;
        useTemplate: string;
        free: string;
        clickToUse: string;
    };
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
    template, isSelected, isFavorite, onSelect, onPreview, onToggleFavorite,
    compact, isDark, isRTL, categoryLabel, levelLabels, labels
}) => {
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const primaryCategory = template.category.find(c => c !== 'all') || 'all';

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
                } ${compact ? 'w-48 flex-shrink-0' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onSelect}
            // compact mode handling in parent usually, but here flex-shrink helps if in flex container
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            {/* Template Preview Image */}
            <div className={`relative ${compact ? 'aspect-[210/297]' : 'aspect-[210/297]'} bg-gray-100 dark:bg-gray-800 overflow-hidden`}>
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
                    {isHovered && !compact && (
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
                                    <Eye size={16} /> {labels.preview}
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onSelect(); }}
                                    className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Sparkles size={16} /> {labels.useTemplate}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Compact Mode Overlay (Click hint) */}
                <AnimatePresence>
                    {isHovered && compact && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center"
                        >
                            <span className="text-white text-xs font-medium flex items-center gap-1">
                                <Eye size={12} /> {labels.clickToUse}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Top Badges */}
                <div className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'} flex flex-col gap-2`}>
                    <ATSScoreBadge score={template.atsScore} reason={template.atsReason} size="sm" isRTL={isRTL} />
                </div>

                {/* Free/Premium Badge */}
                {!template.isPremium && (
                    <div className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1`}>
                        <Sparkles size={10} /> {labels.free}
                    </div>
                )}

                {/* Favorite Button */}
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
                    className={`absolute bottom-2 ${isRTL ? 'left-2' : 'right-2'} p-2 rounded-full shadow-lg transition-all z-10 ${isFavorite
                        ? 'bg-red-500 text-white'
                        : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500'
                        }`}
                >
                    {isFavorite ? <Bookmark size={16} fill="currentColor" /> : <BookmarkPlus size={16} />}
                </button>

                {/* Selected Indicator */}
                {isSelected && (
                    <div className={`absolute top-2 ${isRTL ? 'left-10' : 'right-10'} bg-blue-600 text-white p-1.5 rounded-full shadow-lg animate-pulse`}>
                        <CheckCircle size={14} />
                    </div>
                )}
            </div>

            {/* Template Info */}
            {!compact ? (
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

                    <p className={`text-sm mb-3 line-clamp-2 min-h-[40px] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {template.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        <CategoryBadge category={primaryCategory} label={categoryLabel} />
                        {template.experienceLevel.slice(0, 2).map((level, i) => (
                            <LevelBadge key={level} level={level} label={levelLabels[i]} />
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
                    </div>
                </div>
            ) : (
                /* Compact Mode Label */
                <div className="p-3 text-center">
                    <h4 className={`font-semibold text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {template.name}
                    </h4>
                    <p className="text-xs text-gray-500">{template.style[0]}</p>
                </div>
            )}
        </motion.div>
    );
};
