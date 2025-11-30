import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n/config';

const intlMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
    // Handle other routes with next-intl middleware
    return intlMiddleware(request);
}

export const config = {
    matcher: ['/(ar|fr)/:path*']
};
