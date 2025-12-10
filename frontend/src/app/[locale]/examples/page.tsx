'use client';

import React from 'react';
import Link from 'next/link';
import { use } from 'react';

export default function ExamplesPage({ params }: { params: Promise<{ locale: string }> }) {
    // Unwrap params using React.use() or await in async component (but this is client, so use hook/promise unwrapping)
    // Actually, in Next.js 15, params is a Promise. Since this is a client component, we should use `use(params)`.
    const resolvedParams = use(params);
    const locale = resolvedParams.locale || 'en';

    // Simple translations
    const t = {
        title: locale === 'ar' ? 'أمثلة السير الذاتية' : 'CV Examples',
        subtitle: locale === 'ar'
            ? 'تصفح مكتبة واسعة من أمثلة السير الذاتية الاحترافية لمختلف المجالات.'
            : 'Browse a wide library of professional CV examples for various industries.',
        comingSoon: locale === 'ar' ? 'سيتم إطلاق هذه الصفحة قريباً...' : 'This page will be launched soon...',
        cta: locale === 'ar' ? 'ابدأ بإنشاء سيرتك الذاتية' : 'Start Building Your CV'
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {t.title}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
                    {t.subtitle}
                </p>

                <div className="p-16 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 mb-12 flex flex-col items-center justify-center min-h-[300px]">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                        <span className="text-3xl">🚀</span>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                        {t.comingSoon}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md">
                        {locale === 'ar'
                            ? 'نحن نعمل بجد لإعداد مجموعة مميزة من الأمثلة الحقيقية لمساعدتك.'
                            : 'We are working hard to curate a collection of exceptional real-world examples to guide you.'}
                    </p>
                </div>

                <Link
                    href={`/${locale}/cv-builder`}
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
                >
                    {t.cta}
                </Link>
            </div>
        </div>
    );
}
