'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCVStore } from '@/stores/useCVStore';

/**
 * Hook to manage CV content language
 * Auto-syncs with UI locale if not explicitly set
 */
export function useContentLanguage() {
  const params = useParams();
  const uiLocale = (params?.locale as string) || 'en';
  const cvData = useCVStore(state => state.cvData);
  const setContentLanguage = useCVStore(state => state.setContentLanguage);

  // Auto-sync contentLanguage with uiLocale if not set
  useEffect(() => {
    if (!cvData.contentLanguage || cvData.contentLanguage !== uiLocale) {
      console.log('🔄 Syncing contentLanguage:', uiLocale);
      setContentLanguage(uiLocale as 'en' | 'ar' | 'fr');
    }
  }, [uiLocale, cvData.contentLanguage, setContentLanguage]);

  const changeLanguage = (lang: 'en' | 'ar' | 'fr') => {
    console.log('✅ Language changed to:', lang);
    setContentLanguage(lang);
  };

  return {
    contentLanguage: cvData.contentLanguage || uiLocale,
    setContentLanguage: changeLanguage,
    uiLocale,
    isRTL: (cvData.contentLanguage || uiLocale) === 'ar'
  };
}
