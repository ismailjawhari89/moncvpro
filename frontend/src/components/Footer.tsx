'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const t = useTranslations('footer');
    const pathname = usePathname();
    const currentLocale = pathname.split('/')[1] || 'en';

    const footerLinks = [
        { key: 'privacy', href: '/privacy-policy' },
        { key: 'terms', href: '/terms' },
        { key: 'contact', href: '/contact' },
    ];

    return (
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-start">
                        <p className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                            MonCVPro
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {t('tagline')}
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                        {footerLinks.map((link) => (
                            <Link
                                key={link.key}
                                href={`/${currentLocale}${link.href}`}
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                {t(`links.${link.key}`)}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        &copy; {new Date().getFullYear()} MonCVPro. {t('copyright')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
