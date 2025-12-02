import CVBuilderPro from '@/components/cv/CVBuilderPro';

// Edge Runtime for Page
export const runtime = 'edge';

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function LocalePage({ params }: PageProps) {
    await params; // Consume params to avoid unused warning

    return <CVBuilderPro />;
}
