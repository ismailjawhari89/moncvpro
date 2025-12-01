'use client';

import { useState } from 'react';
import { getTranslations } from 'next-intl/server';
import CVForm from '@/components/cv/CVForm';
import type { CVData } from '@/types/cv';

// Edge Runtime for Page
export const runtime = 'edge';

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function LocalePage({ params }: PageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'hero' });

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
                    <p className="text-gray-600 mt-2">{t('subtitle')}</p>
                </div>
            </header>

            {/* Main Content - Split View */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
                        <CVFormWrapper />
                    </div>

                    {/* Preview Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4">Prévisualisation</h2>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                            <p>Le CV apparaîtra ici en temps réel</p>
                            <p className="text-sm mt-2">Commencez à remplir le formulaire →</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

// Client component wrapper for form state
function CVFormWrapper() {
    const [cvData, setCVData] = useState<CVData | null>(null);

    const handleDataChange = (data: CVData) => {
        setCVData(data);
        console.log('CV Data updated:', data);
    };

    return <CVForm onDataChange={handleDataChange} />;
}
