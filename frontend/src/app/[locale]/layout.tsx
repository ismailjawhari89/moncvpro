import { Inter, Cairo } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { localeDirections, type Locale } from '@/i18n/config';
import '../globals.css';

// 1. Edge Runtime for Layout
export const runtime = 'edge';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // 2. Await params for Next.js 15
    const { locale } = await params;

    // 3. Get messages for client-side translations
    const messages = await getMessages();

    // 4. Determine direction based on locale
    const direction = localeDirections[locale as Locale] || 'ltr';
    const fontClass = locale === 'ar' ? cairo.className : inter.className;

    return (
        <html lang={locale} dir={direction} className={`${inter.variable} ${cairo.variable}`}>
            <body className={`${fontClass} antialiased min-h-screen bg-background`}>
                <NextIntlClientProvider messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
