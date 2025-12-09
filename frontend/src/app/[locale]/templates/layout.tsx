import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Professional CV Templates - Free Download | MonCVPro',
    description: 'Browse our collection of 15+ professionally designed, ATS-optimized CV templates. Free to download and customize for Tech, Business, Medical, and Creative industries.',
    keywords: 'cv templates, resume templates, free cv templates, ats friendly resume, professional cv design',
    openGraph: {
        title: 'Professional CV Templates - Free Download',
        description: '15+ professionally designed CV templates with ATS optimization. Choose your industry and start building.',
        type: 'website',
        images: [
            {
                url: '/templates/tech-software-engineer.png',
                width: 800,
                height: 1000,
                alt: 'Professional CV Templates Preview',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Professional CV Templates - Free Download',
        description: '15+ professionally designed CV templates with ATS optimization.',
        images: ['/templates/tech-software-engineer.png'],
    },
};

export default function TemplatesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
