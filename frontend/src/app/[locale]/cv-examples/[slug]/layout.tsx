import { cvExamplesService } from '@/services/cvExamplesService';
import { Metadata } from 'next';

type Props = {
    params: Promise<{ slug: string; locale: string }>;
    children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const example = await cvExamplesService.getExampleBySlug(slug);

    if (!example) {
        return {
            title: 'Resume Example Not Found | MonCVPro',
        };
    }

    return {
        title: `${example.title} Resume Example | ATS Friendly CV`,
        description: `Professional ${example.title} resume example optimized for ATS. Copy this template and build your own CV in minutes.`,
    };
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
