import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

// 1. Create middleware with next-intl
const intlMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always' // Ensures /fr or /ar is always present
});

export default intlMiddleware;

// 2. Configure matcher to handle all routes except internal Next.js paths and APIs
export const config = {
    matcher: [
        // Match all pathnames except for
        // - /api routes
        // - /_next (Next.js internals)
        // - /_vercel (Vercel internals)
        // - static files (images, fonts, etc.)
        '/((?!api|_next|_vercel|.*\\..*).*)'
    ]
};

// 3. NO explicit runtime export here (Edge by default in Next.js 15)
