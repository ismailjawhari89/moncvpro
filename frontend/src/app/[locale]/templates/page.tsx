'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import AITemplatesGallery from '@/components/cv/AITemplatesGallery';

export default function TemplatesGalleryPage() {
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;

    const t = useTranslations('templates');

    const handleTemplateChange = (templateId: string) => {
        router.push(`/${locale}/cv-builder?template=${templateId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {t('pageTitle')}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {t('pageSubtitle')}
                    </p>
                </div>

                <AITemplatesGallery
                    selectedTemplate=""
                    onTemplateChange={handleTemplateChange}
                    locale={locale}
                    isDark={false} // You might want to hook into your theme provider here
                />
            </div>
        </div>
    );
}
