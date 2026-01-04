
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/navigation';
import { useAuthStore } from '@/stores/authStore';
import axios from '@/lib/axios';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AuthCallback() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const t = useTranslations('Auth');
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const login = useAuthStore((state) => state.login);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleCallback = async () => {
            const accessToken = searchParams.get('accessToken');
            const mfaRequired = searchParams.get('mfaRequired');
            const tempToken = searchParams.get('tempToken');

            if (mfaRequired === 'true' && tempToken) {
                router.push(`/auth/login?mfaRequired=true&tempToken=${tempToken}`);
                return;
            }

            try {
                // If accessToken is in URL (older flow fallback), set it
                if (accessToken) {
                    setAccessToken(accessToken);
                }

                // Fetch user info - if cookie is used, this works automatically
                const { data: user } = await axios.get('/auth/me');

                // Update store
                login(user, accessToken);

                // Redirect to dashboard
                router.push('/dashboard');
            } catch (err: any) {
                console.error('OAuth callback error:', err);
                setError(err.response?.data?.error || 'Authentication failed');
            }
        };

        handleCallback();
    }, [searchParams, router, setAccessToken, login]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-200 dark:border-red-900 max-w-md w-full">
                    <h1 className="text-xl font-bold text-red-600 mb-2">Authentication Error</h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/auth/login')}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
            <Loader2 className="h-10 w-10 text-violet-600 animate-spin mb-4" />
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                {t('loggingIn')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
                Please wait while we complete your authentication...
            </p>
        </div>
    );
}
