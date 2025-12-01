import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n/config';

const intlMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
    // Handle locale routing with next-intl middleware
    return intlMiddleware(request);
}

export const config = {
    // Match all pathnames except for
    // - api routes
    // - _next (Next.js internals)
    // - static files
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
export const runtime = 'edge';
