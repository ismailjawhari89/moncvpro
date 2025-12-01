import { useState } from 'react';
import { getTranslations } from 'next-intl/server';
import CVForm from '@/components/cv/CVForm';
import CVPreview from '@/components/cv/CVPreview';
import type { CVData, TemplateType } from '@/types/cv';

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
                    <CVFormWrapper />
                </div>
            </div>
        </main>
    );
}

// Client component wrapper for form state
function CVFormWrapper() {
    const [cvData, setCVData] = useState<CVData>({
        personal: { fullName: '', email: '', phone: '', location: '', summary: '' },
        experiences: [],
        education: [],
        skills: [],
        languages: []
    });
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');

    const handleDataChange = (data: CVData) => {
        setCVData(data);
    };

    return (
        <>
            <div className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
                <CVForm onDataChange={handleDataChange} initialData={cvData} />
            </div>

            <div>
                <CVPreview
                    data={cvData}
                    selectedTemplate={selectedTemplate}
                    onTemplateChange={setSelectedTemplate}
                />
            </div>
        </>
    );
}
