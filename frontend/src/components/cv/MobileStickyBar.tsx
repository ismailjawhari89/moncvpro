'use client';

import React, { useState, useEffect } from 'react';
import { Save, Eye, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface MobileStickyBarProps {
    onSave: () => void;
    onPreview: () => void;
    onAI: () => void;
    isSaving: boolean;
}

export default function MobileStickyBar({ onSave, onPreview, onAI, isSaving }: MobileStickyBarProps) {
    const t = useTranslations('cvBuilder');
    const [isVisible, setIsVisible] = useState(true);
    // ...
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show when scrolling UP, hide when scrolling DOWN
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed bottom-4 left-4 right-4 z-40 lg:hidden"
                >
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-2 flex items-center justify-between">
                        {/* Save Button */}
                        <button
                            onClick={onSave}
                            disabled={isSaving}
                            className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl active:bg-gray-100 dark:active:bg-gray-700 transition-colors"
                        >
                            {isSaving ? (
                                <Loader2 className="animate-spin text-blue-600" size={20} />
                            ) : (
                                <Save className="text-gray-700 dark:text-gray-300" size={20} />
                            )}
                            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                                {isSaving ? t('saving') : t('save')}
                            </span>
                        </button>

                        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-1" />

                        {/* Preview Button */}
                        <button
                            onClick={onPreview}
                            className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl active:bg-gray-100 dark:active:bg-gray-700 transition-colors"
                        >
                            <Eye className="text-gray-700 dark:text-gray-300" size={20} />
                            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{t('preview')}</span>
                        </button>

                        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-1" />

                        {/* AI Assistant Button (Highlighted) */}
                        <button
                            onClick={onAI}
                            className="flex-1 flex flex-col items-center gap-1 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white shadow-lg active:scale-95 transition-all"
                        >
                            <Sparkles size={20} />
                            <span className="text-[10px] font-bold">{t('tabs.ai')}</span>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
