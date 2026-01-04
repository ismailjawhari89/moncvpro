
'use client';

import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useTranslations } from 'next-intl';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';
import { Button } from '@/components/ui/button';

export const VerificationBanner = () => {
    const { user, isAuthenticated } = useAuthStore();
    const t = useTranslations('Auth');

    if (!isAuthenticated || !user || user.emailVerified) {
        return null;
    }

    return (
        <div className="bg-amber-50 dark:bg-amber-900/10 border-b border-amber-200 dark:border-amber-900">
            <div className="container mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
                <div className="flex items-center gap-3 text-amber-800 dark:text-amber-400">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm font-medium">
                        {t('verificationRequiredMessage')}
                    </p>
                </div>
                <Link href={`/auth/verify-email?email=${encodeURIComponent(user.email)}`}>
                    <Button size="sm" variant="outline" className="h-8 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-xs font-bold uppercase tracking-wider">
                        {t('verifyEmailNow')}
                        <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                </Link>
            </div>
        </div>
    );
};
