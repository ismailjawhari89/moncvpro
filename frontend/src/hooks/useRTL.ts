'use client';

import { useLocale } from 'next-intl';

export function useRTL() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return {
    isRTL,
    dir: isRTL ? 'rtl' as const : 'ltr' as const,
    textAlign: isRTL ? 'right' as const : 'left' as const,
    flexDirection: isRTL ? 'row-reverse' as const : 'row' as const,
    locale
  };
}
