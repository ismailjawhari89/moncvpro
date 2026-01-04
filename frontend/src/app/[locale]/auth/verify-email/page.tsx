'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/navigation';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import axios from '@/lib/axios';
import { Loader2, Mail, CheckCircle, XCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function VerifyEmailPage() {
    const t = useTranslations('Auth');
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const emailParam = searchParams.get('email');

    const [verifying, setVerifying] = useState(!!token);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resending, setResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);

    // Handled manual email input if not provided
    const [emailInput, setEmailInput] = useState(emailParam || '');

    useEffect(() => {
        if (token) {
            verifyToken(token);
        } else if (searchParams.get('error') === 'unverified') {
            setError(t('emailVerificationBlocked'));
        }
    }, [token, searchParams]);

    const verifyToken = async (tokenToVerify: string) => {
        try {
            setVerifying(true);
            const { data } = await axios.post('/auth/verify-email', { token: tokenToVerify });

            // Update auth state with verified user
            if (data.user) {
                useAuthStore.getState().setUser(data.user);
            }

            setVerified(true);
            // Optional: Auto redirect after few seconds
            setTimeout(() => router.push('/dashboard'), 3000);
        } catch (err: any) {
            setError(err.response?.data?.error || t('errors.verificationFailed'));
        } finally {
            setVerifying(false);
        }
    };

    const onResend = async () => {
        if (!emailInput) return;
        setResending(true);
        setResendSuccess(false);
        setError(null);
        try {
            await axios.post('/auth/send-verification-email', { email: emailInput });
            setResendSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.error || t('errors.resendFailed'));
        } finally {
            setResending(false);
        }
    };

    if (verified) {
        return (
            <AuthLayout headerTitle={t('emailVerifiedTitle')}>
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                    <p className="text-gray-600 dark:text-gray-300">
                        {t('emailVerifiedMessage')}
                    </p>
                    <Button
                        onClick={() => router.push('/dashboard')}
                        className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                    >
                        {t('continueToDashboard')}
                    </Button>
                </div>
            </AuthLayout>
        );
    }

    if (token && verifying) {
        return (
            <AuthLayout headerTitle={t('verifyingEmailTitle')}>
                <div className="flex flex-col items-center justify-center space-y-4 py-8">
                    <Loader2 className="h-12 w-12 text-violet-600 animate-spin" />
                    <p className="text-gray-500">{t('verifyingMessage')}</p>
                </div>
            </AuthLayout>
        );
    }

    // Default view: "Check your email" or error state
    return (
        <AuthLayout
            headerTitle={t('verifyEmailTitle')}
            headerSubtitle={t('verifyEmailSubtitle')}
        >
            <div className="space-y-6">
                {!error && !token && (
                    <div className="flex justify-center">
                        <div className="h-16 w-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center">
                            <Mail className="h-8 w-8 text-violet-600" />
                        </div>
                    </div>
                )}

                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-lg flex items-center gap-2">
                        <XCircle className="h-4 w-4" />
                        <span>{error}</span>
                    </div>
                )}

                {resendSuccess && (
                    <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900 rounded-lg flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>{t('resendSuccess')}</span>
                    </div>
                )}

                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    {t('checkEmailInstructions', { email: emailInput })}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="resend-email">{t('emailLabel')}</Label>
                    <div className="flex gap-2">
                        <Input
                            id="resend-email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder="name@example.com"
                            disabled={!!emailParam}
                        />
                    </div>
                </div>

                <Button
                    onClick={onResend}
                    disabled={resending || !emailInput}
                    variant="outline"
                    className="w-full"
                >
                    {resending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {t('resendButton')}
                </Button>

                <div className="text-center">
                    <Button variant="ghost" onClick={() => router.push('/auth/login')}>
                        {t('backToLogin')}
                    </Button>
                </div>
            </div>
        </AuthLayout>
    );
}
