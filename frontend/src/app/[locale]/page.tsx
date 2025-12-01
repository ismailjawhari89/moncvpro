import { useTranslations } from 'next-intl';

export const runtime = 'edge';

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function LocalePage({ params }: PageProps) {
    const { locale } = await params;
    const t = useTranslations('hero');

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-center text-center">
                <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
                <p className="text-xl text-gray-600">{t('subtitle')}</p>
                <p className="text-sm text-gray-400 mt-4">Current locale: {locale}</p>
            </div>
        </main>
    );
}
