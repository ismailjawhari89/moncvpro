import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale, Locale } from './settings';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!locale || !locales.includes(locale as Locale)) {
        locale = defaultLocale;
    }

    let messages;
    try {
        messages = (await import(`./locales/${locale}.json`)).default;
    } catch (error) {
        console.warn(`Could not load messages for locale "${locale}". Falling back to "${defaultLocale}".`);
        try {
            messages = (await import(`./locales/${defaultLocale}.json`)).default;
        } catch (fallbackError) {
            console.error(`Could not load fallback messages for "${defaultLocale}".`);
            messages = {};
        }
    }

    return {
        locale,
        messages
    };
});
