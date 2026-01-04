
import Groq from 'groq-sdk';
import { PrismaClient } from '@prisma/client';
import { datasources } from '../../prisma/prisma.config';

const db = new PrismaClient({ datasources });
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

/**
 * Service to calculate ATS compatibility score using Groq AI
 */
export async function calculateATSScore(cvId: string, jobDescription?: string) {
    const cv: any = await (db as any).cV.findUnique({
        where: { id: cvId },
        include: {
            experiences: true,
            education: true,
            skills: true
        }
    });

    if (!cv) throw new Error('CV not found');

    const atsPrompt = `
  Analyze this CV for ATS (Applicant Tracking System) compatibility:

  CV Data:
  ${JSON.stringify(cv, null, 2)}

  ${jobDescription ? `Job Description: ${jobDescription}` : ''}

  Rate on a scale of 1-100 based on:
  1. Keyword optimization (25 points)
  2. Formatting compatibility (20 points)
  3. Contact info clarity (15 points)
  4. Content structure (20 points)
  5. Skills clarity (20 points)

  Return ONLY a valid JSON object:
  {
    "overallScore": number,
    "breakdown": {
      "keywords": { "score": number, "feedback": string },
      "formatting": { "score": number, "feedback": string },
      "contactInfo": { "score": number, "feedback": string },
      "structure": { "score": number, "feedback": string },
      "skills": { "score": number, "feedback": string }
    },
    "improvements": [
      { "priority": "high|medium|low", "suggestion": string }
    ],
    "matchPercentage": number
  }
  `;

    try {
        const chatCompletion = await groq.chat.completions.create({
            model: 'mixtral-8x7b-32768',
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'user',
                    content: atsPrompt
                }
            ]
        });

        const responseText = chatCompletion.choices[0]?.message?.content || '{}';
        const response = JSON.parse(responseText);

        // Save score to database
        await (db as any).atsScore.upsert({
            where: { cvId },
            create: {
                cvId,
                score: response.overallScore,
                breakdown: response.breakdown as any,
                improvements: response.improvements as any,
                matchPercentage: response.matchPercentage,
                updatedAt: new Date()
            },
            update: {
                score: response.overallScore,
                breakdown: response.breakdown as any,
                improvements: response.improvements as any,
                matchPercentage: response.matchPercentage,
                updatedAt: new Date()
            }
        });

        return response;
    } catch (error: any) {
        console.error('ATS scoring failed:', error);
        throw new Error(`Failed to calculate ATS score: ${error.message}`);
    }
}
