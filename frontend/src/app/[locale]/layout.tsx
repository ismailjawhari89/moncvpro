import { Inter, Cairo } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { localeDirections, type Locale } from '@/i18n/settings';
import { Providers } from '@/providers/Providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '../globals.css';

// 1. Edge Runtime for Layout
// export const runtime = 'edge'; // Commented out if not strictly needed or causing issues, sticking to original provided code structure.

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });

// Dynamic metadata based on locale
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const titles = {
        en: "Free AI Resume Builder | ATS-Friendly CV Creator",
        fr: "Créateur de CV IA Gratuit | Générateur de CV Optimisé ATS",
        ar: "منشئ السيرة الذاتية بالذكاء الاصطناعي مجاناً | أداة إنشاء CV متوافقة مع ATS"
    };

    const descriptions = {
        en: "Build a professional CV with AI. ATS-optimized resume builder with modern templates, instant PDF export, and AI-powered improvements.",
        fr: "Créez un CV professionnel avec l'IA. Générateur de CV optimisé ATS avec modèles modernes, export PDF instantané et améliorations par IA.",
        ar: "أنشئ سيرة ذاتية احترافية بالذكاء الاصطناعي. منشئ سيرة ذاتية محسّن لـ ATS مع قوالب حديثة وتصدير PDF فوري وتحسينات مدعومة بالذكاء الاصطناعي."
    };

    return {
        title: titles[locale as keyof typeof titles] || titles.en,
        description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    };
}


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
        <html lang={locale} dir={direction} className={`${inter.variable} ${cairo.variable}`} suppressHydrationWarning>
            <body className={`${fontClass} antialiased min-h-screen bg-background`} suppressHydrationWarning>
                <NextIntlClientProvider messages={messages}>
                    <Providers>
                        <Header />
                        <main className="min-h-screen">
                            {children}
                        </main>
                        <Footer />
                    </Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
