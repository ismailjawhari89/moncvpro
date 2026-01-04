
'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from '@/navigation';
import { createLoginSchema, LoginSchema } from '@/lib/validation/auth';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import axios from '@/lib/axios';
import { Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { oauthService } from '@/services/oauthService';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
    const t = useTranslations('Auth');
    const router = useRouter();
    const searchParams = useSearchParams();
    const login = useAuthStore((state) => state.login);

    // States
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [mfaRequired, setMfaRequired] = useState(false);
    const [tempToken, setTempToken] = useState<string | null>(null);

    useEffect(() => {
        const mfa = searchParams.get('mfaRequired');
        const token = searchParams.get('tempToken');
        if (mfa === 'true' && token) {
            setMfaRequired(true);
            setTempToken(token);
        }
    }, [searchParams]);
    const [otp, setOtp] = useState('');
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

    // Create schema
    const schema = createLoginSchema((key) => t(`validation.${key}`));

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginSchema>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: LoginSchema) => {
        setGlobalError(null);
        try {
            const response = await axios.post('/auth/login', {
                email: data.email,
                password: data.password,
            });

            if (response.data.mfaRequired) {
                setMfaRequired(true);
                setTempToken(response.data.tempToken);
                return;
            }

            const { user } = response.data;
            login(user); // Cookie handled by browser
            router.push('/dashboard');
        } catch (error: any) {
            setGlobalError(error.response?.data?.error || t('errors.networkError'));
        }
    };

    const handleOtpVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsVerifyingOtp(true);
        setGlobalError(null);

        try {
            const response = await axios.post('/auth/verify-2fa', {
                tempToken,
                otpToken: otp
            });

            const { user } = response.data;
            login(user);
            router.push('/dashboard');
        } catch (error: any) {
            setGlobalError(error.response?.data?.error || t('invalidOtp'));
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    if (mfaRequired) {
        return (
            <AuthLayout
                headerTitle={t('twoFactorTitle')}
                headerSubtitle={t('twoFactorSubtitle')}
            >
                <form onSubmit={handleOtpVerify} className="space-y-6">
                    {globalError && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-lg flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            <span>{globalError}</span>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="otp" className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
                            <ShieldCheck className="h-4 w-4" />
                            {t('otpLabel')}
                        </Label>
                        <Input
                            id="otp"
                            maxLength={6}
                            placeholder="000000"
                            className="text-center text-2xl tracking-[0.5em] font-mono h-14"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                            autoFocus
                        />
                    </div>

                    <Button className="w-full bg-violet-600 hover:bg-violet-700 h-12 text-lg" type="submit" disabled={isVerifyingOtp || otp.length !== 6}>
                        {isVerifyingOtp ? <Loader2 className="animate-spin mr-2" /> : null}
                        {t('verifyButton')}
                    </Button>

                    <button
                        type="button"
                        onClick={() => setMfaRequired(false)}
                        className="w-full text-center text-sm text-slate-500 hover:text-slate-700"
                    >
                        {t('backToLogin')}
                    </button>
                </form>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout headerTitle={t('loginTitle')} headerSubtitle={t('loginSubtitle')}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {globalError && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <span>{globalError}</span>
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="email">{t('emailLabel')}</Label>
                    <Input id="email" type="email" placeholder="name@example.com" {...register('email')} className={errors.email ? 'border-red-500' : ''} />
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">{t('passwordLabel')}</Label>
                        <Link href="/auth/forgot-password" className="text-sm font-medium text-violet-600">{t('forgotPasswordLink')}</Link>
                    </div>
                    <Input id="password" type="password" {...register('password')} className={errors.password ? 'border-red-500' : ''} />
                    {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>

                <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t('loginButton')}
                </Button>

                <div className="text-center text-sm text-gray-500 mt-4">
                    {t('noAccount')} <Link href="/auth/register" className="font-medium text-violet-600">{t('registerLink')}</Link>
                </div>

                <SocialLoginButtons
                    onGoogleClick={() => oauthService.initiateGoogleOAuth()}
                    onLinkedInClick={() => oauthService.initiateLinkedInOAuth()}
                    isLoading={false}
                />
            </form>
        </AuthLayout>
    );
}
