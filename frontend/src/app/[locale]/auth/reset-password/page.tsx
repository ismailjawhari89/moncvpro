'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from '@/navigation';
import { useSearchParams } from 'next/navigation';
import { createResetPasswordSchema, ResetPasswordSchema } from '@/lib/validation/auth';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from '@/lib/axios';
import { Loader2, AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';

export default function ResetPasswordPage() {
    const t = useTranslations('Auth');
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [globalError, setGlobalError] = useState<string | null>(null);

    const schema = createResetPasswordSchema((key) => t(`validation.${key}`));

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordSchema>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: ResetPasswordSchema) => {
        setGlobalError(null);
        if (!token) {
            setGlobalError(t('errors.missingToken'));
            return;
        }

        try {
            await axios.post('/auth/reset-password', {
                token,
                newPassword: data.password
            });

            // Success - Redirect to login with toast or just push
            // Since I don't have a global toast confirmed, I'll rely on redirect only or maybe a success state.
            // Prompt: "Success: Redirect to /auth/login".
            // I'll push to login.
            router.push('/auth/login');
        } catch (error: any) {
            if (error.response?.data?.error) {
                setGlobalError(error.response.data.error);
            } else {
                setGlobalError(t('errors.networkError'));
            }
        }
    };

    if (!token) {
        return (
            <AuthLayout headerTitle={t('resetPasswordTitle')}>
                <div className="text-center text-red-500">
                    {t('errors.missingToken')}
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            headerTitle={t('resetPasswordTitle')}
            headerSubtitle={t('resetPasswordSubtitle')}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {globalError && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <span>{globalError}</span>
                    </div>
                )}

                {/* New Password */}
                <div className="space-y-2">
                    <Label htmlFor="password">{t('newPasswordLabel')}</Label>
                    <Input
                        id="password"
                        type="password"
                        {...register('password')}
                        className={errors.password ? 'border-red-500' : ''}
                    />
                    {errors.password && (
                        <p className="text-xs text-red-500">{errors.password.message}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t('confirmPasswordLabel')}</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        {...register('confirmPassword')}
                        className={errors.confirmPassword ? 'border-red-500' : ''}
                    />
                    {errors.confirmPassword && (
                        <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
                    )}
                </div>

                {/* Submit */}
                <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('resetting')}
                        </>
                    ) : (
                        t('resetPasswordButton')
                    )}
                </Button>
            </form>
        </AuthLayout>
    );
}
