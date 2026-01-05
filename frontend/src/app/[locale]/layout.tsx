
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { VerificationBanner } from '@/components/layout/VerificationBanner';

export function generateStaticParams() {
    return [{ locale: 'en' }, { locale: 'ar' }, { locale: 'fr' }];
}

export default async function LocaleLayout(props: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await props.params;
    const { children } = props;
    let messages;
    try {
        messages = (await import(`../../../messages/${locale}.json`)).default;
    } catch (error) {
        notFound();
    }

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <VerificationBanner />
            {children}
        </NextIntlClientProvider>
    );
}
