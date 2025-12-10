'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu,
    X,
    FileText,
    Sparkles,
    LayoutTemplate,
    BookOpen,
    Home,
    ChevronDown
} from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

interface NavItem {
    label: string;
    labelAr: string;
    href: string;
    icon: React.ElementType;
}

const navItems: NavItem[] = [
    { label: 'Home', labelAr: 'الرئيسية', href: '/', icon: Home },
    { label: 'Templates', labelAr: 'القوالب', href: '/templates', icon: LayoutTemplate },
    { label: 'CV Builder', labelAr: 'منشئ السيرة', href: '/cv-builder', icon: FileText },
    { label: 'Examples', labelAr: 'أمثلة', href: '/examples', icon: BookOpen },
];

export default function Header() {
    const params = useParams();
    const pathname = usePathname();
    const locale = (params?.locale as string) || 'en';
    const isRTL = locale === 'ar';

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Get localized href
    const getLocalizedHref = (href: string) => `/${locale}${href}`;

    // Check if link is active
    const isActive = (href: string) => {
        const localizedHref = getLocalizedHref(href);
        if (href === '/') {
            return pathname === `/${locale}` || pathname === `/${locale}/`;
        }
        return pathname.startsWith(localizedHref);
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-md'
                        : 'bg-transparent'
                    }`}
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Logo */}
                        <Link
                            href={getLocalizedHref('/')}
                            className="flex items-center gap-2 group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
                                MonCV<span className="text-blue-600">Pro</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={getLocalizedHref(item.href)}
                                    className={`nav-item flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(item.href)
                                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <item.icon size={18} />
                                    <span>{isRTL ? item.labelAr : item.label}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Right side actions */}
                        <div className="flex items-center gap-3">
                            {/* Language Switcher */}
                            <LanguageSwitcher variant="dropdown" showFlags={true} />

                            {/* CTA Button - Desktop */}
                            <Link
                                href={getLocalizedHref('/cv-builder')}
                                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                            >
                                <FileText size={18} />
                                <span>{isRTL ? 'ابدأ الآن' : 'Start Free'}</span>
                            </Link>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? (
                                    <X size={24} className="text-gray-700 dark:text-gray-300" />
                                ) : (
                                    <Menu size={24} className="text-gray-700 dark:text-gray-300" />
                                )}
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 overflow-hidden"
                        >
                            <div className="px-4 py-4 space-y-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={getLocalizedHref(item.href)}
                                        className={`nav-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive(item.href)
                                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        <item.icon size={20} />
                                        <span className="font-medium">
                                            {isRTL ? item.labelAr : item.label}
                                        </span>
                                    </Link>
                                ))}

                                {/* Mobile CTA */}
                                <Link
                                    href={getLocalizedHref('/cv-builder')}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl"
                                >
                                    <FileText size={20} />
                                    <span>{isRTL ? 'ابدأ الآن مجاناً' : 'Start Building Free'}</span>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Spacer for fixed header */}
            <div className="h-16 lg:h-20" />
        </>
    );
}
