'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Globe, Check, ChevronDown, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Available languages with full metadata
export const languages = [
    {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        flag: '🇺🇸',
        rtl: false,
        dateFormat: 'MM/DD/YYYY',
        fontFamily: 'Inter, sans-serif'
    },
    {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        flag: '🇫🇷',
        rtl: false,
        dateFormat: 'DD/MM/YYYY',
        fontFamily: 'Inter, sans-serif'
    },
    {
        code: 'ar',
        name: 'Arabic',
        nativeName: 'العربية',
        flag: '🇸🇦',
        rtl: true,
        dateFormat: 'DD/MM/YYYY',
        fontFamily: 'Cairo, sans-serif'
    }
] as const;

export type LanguageCode = typeof languages[number]['code'];

interface LanguageSwitcherProps {
    variant?: 'dropdown' | 'buttons' | 'minimal' | 'full';
    showFlags?: boolean;
    showNativeName?: boolean;
    showIndicator?: boolean;
    className?: string;
    onLanguageChange?: (lang: LanguageCode) => void;
}

// Storage key for language preference
const LANGUAGE_PREF_KEY = 'moncvpro_preferred_language';

/**
 * Save language preference to localStorage
 */
const saveLanguagePreference = (lang: LanguageCode) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(LANGUAGE_PREF_KEY, lang);
    }
};

/**
 * Get saved language preference
 */
export const getSavedLanguagePreference = (): LanguageCode | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(LANGUAGE_PREF_KEY) as LanguageCode | null;
};

/**
 * Get language info by code
 */
export const getLanguageByCode = (code: string) => {
    return languages.find(l => l.code === code) || languages[0];
};

/**
 * Enhanced Language Switcher Component
 */
export default function LanguageSwitcher({
    variant = 'dropdown',
    showFlags = true,
    showNativeName = true,
    showIndicator = true,
    className = '',
    onLanguageChange
}: LanguageSwitcherProps) {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const currentLocale = (params?.locale as LanguageCode) || 'en';

    const [isOpen, setIsOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get current language object
    const currentLanguage = getLanguageByCode(currentLocale);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Switch language with transition effect
    const switchLanguage = useCallback(async (newLocale: LanguageCode) => {
        if (newLocale === currentLocale) {
            setIsOpen(false);
            return;
        }

        setIsTransitioning(true);

        // Save preference
        saveLanguagePreference(newLocale);

        // Callback
        onLanguageChange?.(newLocale);

        // Replace the locale in the current path
        const segments = pathname.split('/');
        segments[1] = newLocale;
        const newPath = segments.join('/');

        // Navigate with smooth transition
        router.push(newPath);

        setIsOpen(false);

        // Reset transition state after navigation
        setTimeout(() => setIsTransitioning(false), 500);
    }, [currentLocale, pathname, router, onLanguageChange]);

    // ========== FULL VARIANT (with label) ==========
    if (variant === 'full') {
        return (
            <div ref={dropdownRef} className={`relative ${className}`}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={isTransitioning}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl 
                               bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700
                               hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600
                               border border-gray-200 dark:border-gray-600 transition-all duration-200
                               text-sm font-medium shadow-sm hover:shadow-md
                               ${isTransitioning ? 'opacity-50 cursor-wait' : ''}`}
                    aria-label="Select language"
                >
                    <Languages size={18} className="text-blue-600 dark:text-blue-400" />
                    {showFlags && <span className="text-lg">{currentLanguage.flag}</span>}
                    <div className="flex flex-col items-start">
                        <span className="text-gray-900 dark:text-white font-semibold">
                            {currentLanguage.nativeName}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {currentLanguage.name}
                        </span>
                    </div>
                    <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full mt-2 right-0 w-56 bg-white dark:bg-gray-800 
                                       rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 
                                       overflow-hidden z-50"
                        >
                            <div className="p-2">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => switchLanguage(lang.code)}
                                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg
                                                   transition-all duration-150 text-sm
                                                   ${currentLocale === lang.code
                                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                                            }`}
                                        dir={lang.rtl ? 'rtl' : 'ltr'}
                                    >
                                        <span className="text-xl">{lang.flag}</span>
                                        <div className="flex-1 text-left">
                                            <div className="font-semibold">{lang.nativeName}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{lang.name}</div>
                                        </div>
                                        {showIndicator && currentLocale === lang.code && (
                                            <div className="flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                <Check size={16} className="text-blue-600 dark:text-blue-400" />
                                            </div>
                                        )}
                                        {lang.rtl && (
                                            <span className="text-xs px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                                                RTL
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // ========== DROPDOWN VARIANT ==========
    if (variant === 'dropdown') {
        return (
            <div ref={dropdownRef} className={`relative ${className}`}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={isTransitioning}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg 
                               bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                               hover:bg-white dark:hover:bg-gray-700 
                               border border-gray-200 dark:border-gray-700 transition-all duration-200
                               text-sm font-medium shadow-sm hover:shadow
                               ${isTransitioning ? 'opacity-50 cursor-wait' : ''}`}
                    aria-label="Select language"
                >
                    {showFlags && <span className="text-lg">{currentLanguage.flag}</span>}
                    <span className="text-gray-700 dark:text-gray-200">
                        {showNativeName ? currentLanguage.nativeName : currentLanguage.code.toUpperCase()}
                    </span>
                    {showIndicator && currentLanguage.rtl && (
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" title="RTL" />
                    )}
                    <ChevronDown
                        size={14}
                        className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full mt-2 right-0 w-48 bg-white dark:bg-gray-800 
                                       rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 
                                       overflow-hidden z-50"
                        >
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => switchLanguage(lang.code)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left
                                               transition-colors duration-150 text-sm
                                               ${currentLocale === lang.code
                                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                                        }`}
                                    dir={lang.rtl ? 'rtl' : 'ltr'}
                                >
                                    {showFlags && <span className="text-lg">{lang.flag}</span>}
                                    <span className="flex-1 font-medium">
                                        {showNativeName ? lang.nativeName : lang.name}
                                    </span>
                                    {currentLocale === lang.code && (
                                        <Check size={16} className="text-blue-600 dark:text-blue-400" />
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // ========== BUTTONS VARIANT ==========
    if (variant === 'buttons') {
        return (
            <div className={`flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}>
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => switchLanguage(lang.code)}
                        disabled={isTransitioning}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                                   ${currentLocale === lang.code
                                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }
                                   ${isTransitioning ? 'opacity-50 cursor-wait' : ''}`}
                        title={lang.name}
                    >
                        {showFlags ? (
                            <span className="text-base">{lang.flag}</span>
                        ) : (
                            <span>{lang.code.toUpperCase()}</span>
                        )}
                    </button>
                ))}
            </div>
        );
    }

    // ========== MINIMAL VARIANT ==========
    return (
        <button
            onClick={() => {
                // Cycle through languages
                const currentIndex = languages.findIndex(l => l.code === currentLocale);
                const nextIndex = (currentIndex + 1) % languages.length;
                switchLanguage(languages[nextIndex].code);
            }}
            disabled={isTransitioning}
            className={`flex items-center gap-1.5 p-2 rounded-full 
                       hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                       ${isTransitioning ? 'opacity-50 cursor-wait' : ''} 
                       ${className}`}
            title={`Current: ${currentLanguage.name}. Click to switch.`}
        >
            <Globe size={18} className="text-gray-600 dark:text-gray-300" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                {currentLocale.toUpperCase()}
            </span>
            {showIndicator && currentLanguage.rtl && (
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            )}
        </button>
    );
}
