import { Inter, Cairo } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { localeDirections, type Locale } from '@/i18n/config';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });

export default async function RootLayout({
    children,
    params: { locale }
}: Readonly<{
    children: React.ReactNode;
    params: { locale: string };
}>) {
    const messages = await getMessages();
    const direction = localeDirections[locale as Locale] || 'rtl';
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
