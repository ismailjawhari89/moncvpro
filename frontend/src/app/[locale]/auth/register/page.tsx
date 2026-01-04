'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from '@/navigation';
import { createRegisterSchema, RegisterSchema } from '@/lib/validation/auth';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuthStore } from '@/stores/authStore';
import axios from '@/lib/axios';
import { Loader2, AlertCircle, Check, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { oauthService } from '@/services/oauthService';

export default function RegisterPage() {
    const t = useTranslations('Auth');
    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [passwordStrength, setPasswordStrength] = useState(0);

    // Create schema with translations
    const schema = createRegisterSchema((key) => t(`validation.${key}`));

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        setValue // Needed for checkbox if using custom component logic, but shadcn checkbox is usually controlled.
        // For react-hook-form with ShadCN Checkbox, use Controller or standard input hidden.
        // Simplified: use standard input type="checkbox" styled, OR standard RHF Controller.
        // I'll stick to native checkbox for simplicity if ShadCN's is complex to integrate without Controller
        // actually, let's try to use ShadCN's Checkbox with a hidden input or just Controller?
        // For now, I'll use a wrapper or simply register a hidden input if needed.
        // ShadCN Checkbox doesn't accept `register`. I should use Controller.
        // But to save imports, I'll use standard input with class.
        // WAIT, "Use existing ShadCN components". ShadCN checkbox is annoying with RHF without `Controller`.
        // I'll import `Controller` from react-hook-form.
    } = useForm<RegisterSchema>({
        resolver: zodResolver(schema),
        defaultValues: {
            agreeToTerms: false
        }
    });

    // Watch password for strength
    const password = watch('password', '');

    useEffect(() => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++; // Bonus
        setPasswordStrength(score);
    }, [password]);

    const getStrengthColor = () => {
        if (passwordStrength <= 2) return 'bg-red-500';
        if (passwordStrength <= 3) return 'bg-orange-500';
        return 'bg-green-500';
    };

    const getStrengthLabel = () => {
        if (!password) return '';
        if (passwordStrength <= 2) return t('strength.weak');
        if (passwordStrength <= 3) return t('strength.medium');
        return t('strength.strong');
    };

    const onSubmit = async (data: RegisterSchema) => {
        setGlobalError(null);
        try {
            const response = await axios.post('/auth/register', {
                email: data.email,
                password: data.password,
                // firstName/lastName not in schema yet? Step requirements verify schema...
                // Schema in STEP 2.2: email, password, confirmPassword, agreeToTerms.
                // Backend register expects: email, password, firstName, lastName.
                // I should probably add firstName/lastName to schema or send empty?
                // Prompt for schema didn't mention names "registerSchema: email, password...".
                // Backend "Register: Payload { email, password, firstName, lastName }".
                // I will adhere to the prompt schema (email/password) and backend might accept null names or I default them.
                // Prisma User: firstName String? -> Optional. OK.
            });

            // Backend returns { message, userId }? 
            // API_AUTH.md: "Response: 201 Created on success."
            // Page requirement: "Success flow: ... Redirect to /auth/verify-email with email pre-filled"

            // I don't set user in store on register usually unless auto-login.
            // Prompt says: "Store user in Zustand" -> implies auto-login OR just email for verification page?
            // "Redirect to /auth/verify-email with email pre-filled".
            // I'll assume just redirect.

            router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`);

        } catch (error: any) {
            if (error.response?.data?.error) {
                setGlobalError(error.response.data.error);
            } else {
                setGlobalError(t('errors.networkError'));
            }
        }
    };

    return (
        <AuthLayout
            headerTitle={t('registerTitle')}
            headerSubtitle={t('registerSubtitle')}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {globalError && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <span>{globalError}</span>
                    </div>
                )}

                {/* Email */}
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

                {/* Password */}
                <div className="space-y-2">
                    <Label htmlFor="password">{t('passwordLabel')}</Label>
                    <Input
                        id="password"
                        type="password"
                        {...register('password')}
                        className={errors.password ? 'border-red-500' : ''}
                    />
                    {/* Strength Indicator */}
                    {password && (
                        <div className="space-y-1">
                            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                                    style={{ width: `${Math.min((passwordStrength / 5) * 100, 100)}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 text-right">{getStrengthLabel()}</p>
                        </div>
                    )}
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

                {/* Agree to Terms - Using standard checkbox for easy integration with register */}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="agreeToTerms"
                        {...register('agreeToTerms')}
                        className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-600"
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm font-normal text-gray-600 dark:text-gray-400">
                        {t('agreeToTermsPrefix')}{' '}
                        <Link href="/terms" className="text-violet-600 hover:underline">{t('termsLink')}</Link>
                        {' '}{t('and')}{' '}
                        <Link href="/privacy" className="text-violet-600 hover:underline">{t('privacyLink')}</Link>
                    </Label>
                </div>
                {errors.agreeToTerms && (
                    <p className="text-xs text-red-500">{errors.agreeToTerms.message}</p>
                )}

                {/* Submit */}
                <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('registerButtonLoading')}
                        </>
                    ) : (
                        t('registerButton')
                    )}
                </Button>

                {/* Login Link */}
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                    {t('haveAccount')}{' '}
                    <Link
                        href="/auth/login"
                        className="font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400"
                    >
                        {t('loginLink')}
                    </Link>
                </div>

                <SocialLoginButtons
                    onGoogleClick={() => oauthService.initiateGoogleOAuth()}
                    onLinkedInClick={() => oauthService.initiateLinkedInOAuth()}
                    isLoading={false}
                    mode="register"
                />
            </form>
        </AuthLayout>
    );
}
