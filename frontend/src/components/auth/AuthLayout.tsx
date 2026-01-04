import React from 'react';
import { Link } from '@/navigation'; // Assuming navigation is set up for next-intl
import { useTranslations } from 'next-intl';

interface AuthLayoutProps {
    children: React.ReactNode;
    headerTitle: string;
    headerSubtitle?: string;
    showSocialAuth?: boolean; // Future proofing
}

export function AuthLayout({ children, headerTitle, headerSubtitle }: AuthLayoutProps) {
    const t = useTranslations('Auth');

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 p-4 sm:p-8">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-800/50 pointer-events-none" />

            {/* Brand Logo */}
            <div className="relative z-10 mb-8">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
                        CV
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200">
                        MonCVPro
                    </span>
                </Link>
            </div>

            {/* Card Container */}
            <div className="relative z-10 w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 overflow-hidden">
                {/* Header */}
                <div className="px-8 pt-8 pb-6 text-center">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {headerTitle}
                    </h1>
                    {headerSubtitle && (
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            {headerSubtitle}
                        </p>
                    )}
                </div>

                {/* Content */}
                <div className="px-8 pb-8">
                    {children}
                </div>
            </div>

            {/* Footer / Copyright */}
            <div className="mt-8 text-center text-sm text-slate-400 relative z-10">
                &copy; {new Date().getFullYear()} MonCVPro. {t('allRightsReserved')}
            </div>
        </div>
    );
}
