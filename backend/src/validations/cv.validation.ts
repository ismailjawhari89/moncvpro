import { z } from 'zod';
import validator from 'validator';

const sanitizeString = (val: string) => validator.escape(val.trim());

export const cvSchema = z.object({
    title: z.string().min(1).max(200).transform(sanitizeString),
    template: z.string().default('modern-pro'),
    personalInfo: z.object({
        fullName: z.string().min(2).max(100).transform(sanitizeString).optional(),
        email: z.string().email().optional(),
        phone: z.string().max(20).optional(),
        location: z.string().max(200).transform(sanitizeString).optional(),
        website: z.string().url().optional().or(z.literal('')),
    }).optional(),
    summary: z.string().max(2000).transform(sanitizeString).optional(),
    experiences: z.array(z.object({
        company: z.string().min(1).max(200).transform(sanitizeString),
        position: z.string().min(1).max(200).transform(sanitizeString),
        startDate: z.string(),
        endDate: z.string().optional().nullable(),
        current: z.boolean().default(false),
        description: z.string().max(5000).transform(sanitizeString).optional(),
    })).optional(),
    education: z.array(z.object({
        institution: z.string().min(1).max(200).transform(sanitizeString),
        degree: z.string().min(1).max(200).transform(sanitizeString),
        field: z.string().max(200).transform(sanitizeString).optional(),
        graduationYear: z.string().max(10).optional(),
    })).optional(),
    skills: z.array(z.object({
        name: z.string().min(1).max(100).transform(sanitizeString),
        level: z.number().min(1).max(5).default(3),
        category: z.string().default('technical').transform(sanitizeString),
    })).optional(),
});

export type CVInput = z.infer<typeof cvSchema>;
