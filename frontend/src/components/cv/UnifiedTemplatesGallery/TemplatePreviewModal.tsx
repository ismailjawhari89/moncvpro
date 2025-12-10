import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Shield, Users, Zap, CheckCircle, Layout, Star, Palette, ArrowRight
} from 'lucide-react';
import { type EnhancedCVTemplate } from '@/data/enhanced-templates';
import { ATSScoreBadge, CategoryBadge, LevelBadge } from './Badges';
import { useTemplateTranslations } from '@/hooks/useTemplateTranslations';

interface TemplatePreviewModalProps {
    template: EnhancedCVTemplate | null;
    isOpen: boolean;
    onClose: () => void;
    onUse: (id: string) => void;
    isDark?: boolean;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
    template, isOpen, onClose, onUse, isDark
}) => {
    const { t, isRTL, translateTemplate } = useTemplateTranslations();

    if (!isOpen || !template) return null;

    const translatedTemplate = translateTemplate(template);
    const primaryCategory = template.category.find(c => c !== 'all') || 'all';

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
                    dir={isRTL ? 'rtl' : 'ltr'}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className={`absolute top-4 z-10 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors backdrop-blur-md ${isRTL ? 'left-4' : 'right-4'}`}
                    >
                        <X size={20} className="text-gray-600 dark:text-gray-300" />
                    </button>

                    {/* Left: Template Preview */}
                    <div className="w-full lg:w-3/5 bg-gray-100 dark:bg-gray-800 overflow-y-auto p-6 scrollbar-thin">
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
                            <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'}`}>
                                <ATSScoreBadge score={template.atsScore} reason={translatedTemplate.atsReason} size="md" isRTL={isRTL} />
                            </div>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="w-full lg:w-2/5 flex flex-col bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
                        <div className="p-6 flex-1 overflow-y-auto scrollbar-thin">
                            {/* Header */}
                            <div className="mb-6">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <CategoryBadge category={primaryCategory} />
                                    {!template.isPremium && (
                                        <span className="px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold uppercase">
                                            {isRTL ? 'مجاني' : 'Free'}
                                        </span>
                                    )}
                                    {template.experienceLevel.map(level => (
                                        <LevelBadge key={level} level={level} />
                                    ))}
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {translatedTemplate.name}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {translatedTemplate.description}
                                </p>
                            </div>

                            {/* ATS Explanation */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
                                <div className="flex items-center gap-2 mb-2 text-blue-700 dark:text-blue-300">
                                    <Shield size={18} />
                                    <span className="font-bold">{isRTL ? 'معدل ATS:' : 'ATS Score:'} {template.atsScore}%</span>
                                </div>
                                <p className="text-sm text-blue-600 dark:text-blue-400">
                                    {translatedTemplate.atsReason}
                                </p>
                            </div>

                            {/* Best For */}
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Users size={18} className="text-purple-500" />
                                    {isRTL ? 'مناسب لـ' : 'Best For'}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {translatedTemplate.bestFor.map((item, i) => (
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
                                    {isRTL ? 'المميزات الرئيسية' : 'Key Features'}
                                </h3>
                                <ul className="space-y-2">
                                    {translatedTemplate.features.map((feature, i) => (
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
                                    {isRTL ? 'الأقسام المضمنة' : 'Sections Included'}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {translatedTemplate.sections.map((section, i) => (
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
                                    {isRTL ? 'نصائح احترافية' : 'Pro Tips'}
                                </h3>
                                <ul className="space-y-2">
                                    {translatedTemplate.tips.map((tip, i) => (
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
                                    {isRTL ? 'لوحة الألوان' : 'Color Palette'}
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-10 h-10 rounded-full shadow-md border" style={{ backgroundColor: template.colors.primary }} />
                                        <span className="text-[10px] text-gray-500">{isRTL ? 'أساسي' : 'Primary'}</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-10 h-10 rounded-full shadow-md border" style={{ backgroundColor: template.colors.secondary }} />
                                        <span className="text-[10px] text-gray-500">{isRTL ? 'ثانوي' : 'Secondary'}</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-10 h-10 rounded-full shadow-md border" style={{ backgroundColor: template.colors.accent }} />
                                        <span className="text-[10px] text-gray-500">{isRTL ? 'تمييز' : 'Accent'}</span>
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
                                {isRTL ? 'استخدم هذا القالب' : 'Use This Template'}
                                <ArrowRight size={20} className={isRTL ? 'rotate-180' : ''} />
                            </button>
                            <p className="text-center text-xs text-gray-500 mt-3">
                                {isRTL ? 'لا حاجة لبطاقة ائتمان • وصول فوري' : 'No credit card required • Instant access'}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
