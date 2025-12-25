import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                hostname: 'localhost',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'fal.media',
            },
            {
                protocol: 'https',
                hostname: 'replicate.delivery',
            },
            {
                protocol: 'https',
                hostname: 'pbxt.replicate.delivery',
            }
        ],
    },
    serverExternalPackages: ['puppeteer'],
    async redirects() {
        return [
            {
                source: '/:locale/privacy',
                destination: '/:locale/privacy-policy',
                permanent: true,
            },
        ];
    },
};

export default withNextIntl(nextConfig);
