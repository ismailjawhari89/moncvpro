'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Check, Star, TrendingUp, Shield, Zap, ArrowRight, Layout, Palette } from 'lucide-react';
import { CVTemplate } from '@/data/templates';
import { motion, AnimatePresence } from 'framer-motion';

interface TemplatePreviewModalProps {
    template: CVTemplate | null;
    isOpen: boolean;
    onClose: () => void;
    onUseTemplate: (id: string) => void;
}

export default function TemplatePreviewModal({ template, isOpen, onClose, onUseTemplate }: TemplatePreviewModalProps) {
    const [activeTab, setActiveTab] = useState<'preview' | 'details'>('preview');

    if (!isOpen || !template) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors backdrop-blur-md"
                    >
                        <X size={20} className="text-gray-600 dark:text-gray-300" />
                    </button>

                    {/* Left Side: Image Preview */}
                    <div className="w-full md:w-3/5 bg-gray-100 dark:bg-gray-800 relative overflow-y-auto custom-scrollbar">
                        <div className="p-8 min-h-full flex items-center justify-center">
                            <div className="relative w-full max-w-md shadow-2xl rounded-lg overflow-hidden transform transition-transform duration-500 hover:scale-[1.02]">
                                <Image
                                    src={template.previewImage}
                                    alt={template.altText || template.name}
                                    width={800}
                                    height={1000}
                                    className="w-full h-auto"
                                    priority
                                />
                                {/* Floating Badges on Image */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    {template.atsScore >= 90 && (
                                        <div className="bg-blue-600/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1.5">
                                            <TrendingUp size={14} />
                                            {template.atsScore}% ATS Score
                                        </div>
                                    )}
                                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-gray-900 dark:text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1.5">
                                        <Layout size={14} />
                                        {template.style[0]} Style
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Details & Actions */}
                    <div className="w-full md:w-2/5 flex flex-col bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
                        <div className="p-6 flex-1 overflow-y-auto">
                            {/* Header */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wide">
                                        {template.category[0]}
                                    </span>
                                    {!template.isPremium && (
                                        <span className="px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold uppercase tracking-wide">
                                            Free
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

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                                        <Shield size={18} />
                                        <span className="font-bold text-sm">ATS Friendly</span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Optimized for parsing</p>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-2 text-amber-500 mb-1">
                                        <Star size={18} />
                                        <span className="font-bold text-sm">Premium Design</span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Professional layout</p>
                                </div>
                            </div>

                            {/* Features List */}
                            <div className="mb-8">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Zap size={18} className="text-yellow-500" />
                                    Key Features
                                </h3>
                                <ul className="space-y-3">
                                    {template.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                                            <div className="mt-0.5 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Color Palette Preview (Simulated) */}
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Palette size={18} className="text-purple-500" />
                                    Color Scheme
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-10 h-10 rounded-full shadow-sm border border-gray-200 dark:border-gray-700" style={{ backgroundColor: template.colors.primary }}></div>
                                        <span className="text-[10px] text-gray-500">Primary</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-10 h-10 rounded-full shadow-sm border border-gray-200 dark:border-gray-700" style={{ backgroundColor: template.colors.secondary }}></div>
                                        <span className="text-[10px] text-gray-500">Secondary</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-10 h-10 rounded-full shadow-sm border border-gray-200 dark:border-gray-700" style={{ backgroundColor: template.colors.accent }}></div>
                                        <span className="text-[10px] text-gray-500">Accent</span>
                                    </div>
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
                                No credit card required • Instant access
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
