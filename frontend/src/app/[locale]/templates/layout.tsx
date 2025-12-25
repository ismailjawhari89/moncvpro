import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const titles = {
        en: "Professional CV Templates - Free Download | MonCVPro",
        fr: "Modèles de CV Professionnels - Téléchargement Gratuit | MonCVPro",
        ar: "قوالب سيرة ذاتية احترافية - تحميل مجاني | MonCVPro"
    };

    const descriptions = {
        en: "Browse our collection of professionally designed, ATS-optimized CV templates. Free to download and customize for Tech, Business, Medical, and Creative industries.",
        fr: "Parcourez notre collection de modèles de CV professionnels optimisés pour les ATS. Téléchargement gratuit et personnalisation pour les secteurs Tech, Business, Médical et Créatif.",
        ar: "تصفح مجموعتنا من قوالب السيرة الذاتية المصممة احترافياً والمحسنة لأنظمة ATS. تحميل مجاني وتخصيص لمجالات التقنية والأعمال والطب والإبداع."
    };

    const title = titles[locale as keyof typeof titles] || titles.en;
    const description = descriptions[locale as keyof typeof descriptions] || descriptions.en;

    return {
        title,
        description,
        keywords: locale === 'ar' ? 'قوالب سيرة ذاتية، نماذج سي في، سيرة ذاتية مجانية، متوافق مع ATS، تصميم سيرة ذاتية' :
            locale === 'fr' ? 'modèles de cv, exemples de cv, cv gratuit, cv compatible ats, design de cv professionnel' :
                'cv templates, resume templates, free cv templates, ats friendly resume, professional cv design',
        openGraph: {
            title,
            description,
            type: 'website',
            images: [
                {
                    url: '/templates/tech-software-engineer.png',
                    width: 800,
                    height: 1000,
                    alt: locale === 'ar' ? 'معاينة قوالب السيرة الذاتية' : locale === 'fr' ? 'Aperçu des modèles de CV' : 'Professional CV Templates Preview',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ['/templates/tech-software-engineer.png'],
        },
    };
}

export default function TemplatesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
