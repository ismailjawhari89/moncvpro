'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@/navigation';
import { createForgotPasswordSchema, ForgotPasswordSchema } from '@/lib/validation/auth';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from '@/lib/axios';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
    const t = useTranslations('Auth');
    const [success, setSuccess] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);

    const schema = createForgotPasswordSchema((key) => t(`validation.${key}`));

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordSchema>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: ForgotPasswordSchema) => {
        setGlobalError(null);
        try {
            await axios.post('/auth/request-password-reset', { email: data.email });
            setSuccess(true);
        } catch (error: any) {
            if (error.response?.data?.error) {
                setGlobalError(error.response.data.error);
            } else {
                setGlobalError(t('errors.networkError'));
            }
        }
    };

    if (success) {
        return (
            <AuthLayout headerTitle={t('checkEmailTitle')}>
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                    <p className="text-gray-600 dark:text-gray-300">
                        {t('resetEmailSentMessage')}
                    </p>
                    <Link href="/auth/login">
                        <Button variant="outline" className="w-full mt-4">
                            {t('backToLogin')}
                        </Button>
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            headerTitle={t('forgotPasswordTitle')}
            headerSubtitle={t('forgotPasswordSubtitle')}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {globalError && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <span>{globalError}</span>
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="email">{t('emailLabel')}</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        {...register('email')}
                        className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                        <p className="text-xs text-red-500">{errors.email.message}</p>
                    )}
                </div>

                <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('sending')}
                        </>
                    ) : (
                        t('sendResetLink')
                    )}
                </Button>

                <div className="text-center mt-4">
                    <Link href="/auth/login" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        {t('backToLogin')}
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
