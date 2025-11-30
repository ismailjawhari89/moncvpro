import { useTranslations } from 'next-intl';

export const runtime = 'edge';


export default function Home() {
    const t = useTranslations('hero');

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-center text-center">
                <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
                <p className="text-xl text-gray-600">{t('subtitle')}</p>
            </div>
        </main>
    );
}
