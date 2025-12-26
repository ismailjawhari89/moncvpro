import { streamObject } from 'ai';
import { z } from 'zod';
import { CVData } from '@/types/cv';
import { groq, hasGroqKey } from './groq-client';

// 2. Define the Schema for CV Improvements
const ImprovementSchema = z.object({
    summary: z.string().describe('An improved professional summary.'),
    experiences: z.array(z.object({
        id: z.string(),
        description: z.string().describe('Improved job description with action verbs and metrics.'),
    })).optional(),
    skills: z.array(z.string()).optional().describe('Suggested new skills to add.'),
});

/**
 * Service to stream CV improvements section by section
 */
export async function streamCVImprovements(cvData: CVData, targetRole?: string, abortSignal?: AbortSignal) {
    if (!hasGroqKey()) {
        throw new Error('GROQ_API_KEY is missing. Please check your .env.local file.');
    }
    const targetJob = cvData.targetJob;

    // Use Vercel AI SDK streamObject
    const result = await streamObject({
        model: groq('llama-3.3-70b-versatile'),
        output: 'no-schema',
        schema: ImprovementSchema,
        abortSignal,
        prompt: `
      As a world-class career coach and ATS specialist, improve this CV ${targetRole ? `specifically for a "${targetRole}" position` : ''}.
      
      ${targetJob ? `TARGET JOB DESCRIPTION:
      "${targetJob}"
      
      INSTRUCTIONS:
      1. PERFORM KEYWORD INJECTION: Identify critical skills and keywords from the job description and naturally weave them into the summary and experience descriptions.
      2. TAILOR ACHIEVEMENTS: Rewrite achievements to highlight skills relevant to this specific job.
      3. QUANTIFY: Ensure every bullet point has a metric or result if possible.` :
                `INSTRUCTIONS:
      1. Focus on impact, ROI, and ATS optimization.
      2. Use strong action verbs.
      3. Quantify achievements with metrics (%, $, time).`}
      
      CURRENT CV DATA:
      ${JSON.stringify({
                    summary: cvData.summary,
                    experiences: cvData.experiences.map(e => ({ id: e.id, position: e.position, company: e.company, description: e.description })),
                    skills: cvData.skills.map(s => s.name)
                })}
    `,
        onFinish({ object }) {
            console.log('Streaming finished:', object);
        },
    });

    return result;
}

/**
 * Example Usage in a Component/Action:
 * 
 * const { element, object } = await streamCVImprovements(cvData);
 * 
 * for await (const partialObject of object) {
 *   // Update Zustand store with partial results in real-time!
 *   if (partialObject.summary) updateSummary(partialObject.summary);
 *   // ... handle other fields
 * }
 */
