import { getTranslations } from 'next-intl/server';
import CVBuilderClient from '@/components/cv/CVBuilderClient';

// Edge Runtime for Page
export const runtime = 'edge';

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function LocalePage({ params }: PageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'hero' });

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">
                        {t('title')}
                    </h1>
                    <p className="text-xl opacity-90">
                        {t('subtitle')}
                    </p>
                </div>
            </div>

            {/* Main Content - Split View */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <CVBuilderClient />
                </div>
            </div>
        </main>
    );
}
