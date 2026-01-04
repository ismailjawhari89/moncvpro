import { z } from 'zod';

export const createLoginSchema = (t: (key: string) => string) => {
    return z.object({
        email: z.string()
            .min(1, { message: t('emailRequired') })
            .email({ message: t('emailInvalid') }),
        password: z.string()
            .min(8, { message: t('passwordMin') }),
    });
};

export const createRegisterSchema = (t: (key: string) => string) => {
    return z.object({
        email: z.string()
            .min(1, { message: t('emailRequired') })
            .email({ message: t('emailInvalid') }),
        password: z.string()
            .min(12, { message: t('passwordMin') })
            .regex(/[A-Z]/, { message: t('passwordUppercase') })
            .regex(/[a-z]/, { message: t('passwordLowercase') })
            .regex(/[0-9]/, { message: t('passwordNumber') })
            .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, { message: t('passwordSpecial') }),
        confirmPassword: z.string()
            .min(1, { message: t('confirmPasswordRequired') }),
        agreeToTerms: z.boolean()
            .refine((val) => val === true, { message: t('termsRequired') }),
    }).refine((data) => data.password === data.confirmPassword, {
        message: t('passwordsMismatch'),
        path: ['confirmPassword'],
    });
};

export const createForgotPasswordSchema = (t: (key: string) => string) => {
    return z.object({
        email: z.string()
            .min(1, { message: t('emailRequired') })
            .email({ message: t('emailInvalid') }),
    });
};

export const createResetPasswordSchema = (t: (key: string) => string) => {
    return z.object({
        password: z.string()
            .min(12, { message: t('passwordMin') })
            .regex(/[A-Z]/, { message: t('passwordUppercase') })
            .regex(/[a-z]/, { message: t('passwordLowercase') })
            .regex(/[0-9]/, { message: t('passwordNumber') })
            .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, { message: t('passwordSpecial') }),
        confirmPassword: z.string()
            .min(1, { message: t('confirmPasswordRequired') }),
    }).refine((data) => data.password === data.confirmPassword, {
        message: t('passwordsMismatch'),
        path: ['confirmPassword'],
    });
};

// Types are helpful
export type LoginSchema = z.infer<ReturnType<typeof createLoginSchema>>;
export type RegisterSchema = z.infer<ReturnType<typeof createRegisterSchema>>;
export type ForgotPasswordSchema = z.infer<ReturnType<typeof createForgotPasswordSchema>>;
export type ResetPasswordSchema = z.infer<ReturnType<typeof createResetPasswordSchema>>;
