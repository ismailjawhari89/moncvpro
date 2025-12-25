import { z } from 'zod';

// ATS Analysis Schema
export const ATSAnalysisSchema = z.object({
    score: z.number().min(0).max(100),
    summary: z.string(),
    strengths: z.array(z.string()),
    improvements: z.array(z.string()),
    keywords: z.object({
        found: z.array(z.string()),
        missing: z.array(z.string()),
    }),
    sections: z.array(
        z.object({
            name: z.string(),
            score: z.number(),
            feedback: z.string(),
        })
    ).optional(),
});

// Content Improvement Schema
export const ContentImproveSchema = z.object({
    originalText: z.string(),
    improvedText: z.string(),
    changes: z.array(z.string()),
    improvementType: z.string(),
});

// Grammar Check Schema
export const GrammarCheckSchema = z.object({
    correctedText: z.string(),
    errors: z.array(
        z.object({
            type: z.string(),
            original: z.string(),
            correction: z.string(),
            explanation: z.string(),
        })
    ),
    score: z.number().optional(),
});

// Keyword Analysis Schema
export const KeywordAnalysisSchema = z.object({
    keywords: z.array(z.string()),
    density: z.record(z.string(), z.number()),
    suggestions: z.array(z.string()),
    industryMatch: z.number(),
});

// Export inferred types
export type ATSAnalysisResult = z.infer<typeof ATSAnalysisSchema>;
export type ContentImproveResult = z.infer<typeof ContentImproveSchema>;
export type GrammarCheckResult = z.infer<typeof GrammarCheckSchema>;
export type KeywordAnalysisResult = z.infer<typeof KeywordAnalysisSchema>;
