import { getTranslations } from 'next-intl/server';

// 1. Edge Runtime for Page
export const runtime = 'edge';

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function LocalePage({ params }: PageProps) {
    // 2. Await params for Next.js 15
    const { locale } = await params;

    // 3. Use getTranslations (Async) instead of useTranslations
    const t = await getTranslations({ locale, namespace: 'hero' });

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-center text-center">
                <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
                <p className="text-xl text-gray-600">{t('subtitle')}</p>

                {/* 4. Display current locale dynamically */}
                <div className="mt-8 p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
                    <p className="text-sm text-gray-500">Current Locale: <span className="font-bold uppercase">{locale}</span></p>
                </div>
            </div>
        </main>
    );
}
