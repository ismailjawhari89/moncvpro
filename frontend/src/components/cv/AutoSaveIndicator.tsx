'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Loader2, Cloud } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const AutoSaveIndicator = () => {
    const t = useTranslations('cvBuilder.sync');
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<string>('');
    const [showSaved, setShowSaved] = useState(false);

    // For now, this is a simplified indicator without cloud sync
    // It can be enhanced later when persistence is re-added

    return (
        <div className="fixed bottom-4 right-4 z-50 rtl:right-auto rtl:left-4">
            <div className={`
                flex items-center gap-2 px-4 py-2 rounded-full shadow-lg backdrop-blur-sm
                transition-all duration-300
                ${isSaving
                    ? 'bg-blue-500/90 text-white'
                    : showSaved
                        ? 'bg-green-500/90 text-white'
                        : 'bg-gray-800/80 text-gray-300'
                }
            `}>
                {isSaving ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm font-medium">{t('saving')}</span>
                    </>
                ) : showSaved ? (
                    <>
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">{t('saved')}</span>
                    </>
                ) : lastSaved ? (
                    <>
                        <Cloud className="h-4 w-4" />
                        <span className="text-sm">{t('lastSaved', { time: lastSaved })}</span>
                    </>
                ) : (
                    <>
                        <Cloud className="h-4 w-4" />
                        <span className="text-sm">{t('localMode')}</span>
                    </>
                )}
            </div>
        </div>
    );
};

export default AutoSaveIndicator;
