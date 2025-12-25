
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://moncvpro.com';

    // Core pages
    const routes = [
        '',
        '/cv-builder',
        '/cv-examples',
        '/ai-resume-review',
        '/blog',
        '/blog/how-to-write-a-cv',
        '/blog/ats-friendly-resume',
        '/blog/resume-mistakes',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    return routes;
}
