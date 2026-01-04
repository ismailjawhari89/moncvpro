
import Groq from 'groq-sdk';
import { PrismaClient } from '@prisma/client';
import { datasources } from '../../prisma/prisma.config';

const db = new PrismaClient({ datasources });
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

/**
 * Service to provide smart content suggestions for CV sections using Groq AI
 */
export async function getSectionSuggestions(
    cvId: string,
    section: 'experiences' | 'skills' | 'summary',
    jobDescription?: string
) {
    const cv: any = await (db as any).cV.findUnique({
        where: { id: cvId },
        include: { experiences: true, skills: true }
    });

    if (!cv) throw new Error('CV not found');

    // Prepare section content for AI
    let sectionContent = '';
    if (section === 'experiences') {
        sectionContent = JSON.stringify(cv.experiences);
    } else if (section === 'skills') {
        sectionContent = JSON.stringify(cv.skills);
    } else {
        sectionContent = cv.summary || '';
    }

    const prompt = `
  You are an expert CV writer and career coach.
  
  Current CV ${section} data:
  ${sectionContent}

  ${jobDescription ? `Target Job Description: ${jobDescription}` : ''}

  Provide 3 specific, actionable suggestions to improve this section.
  Focus on impact, quantifiable achievements, industry keywords, and matching job requirements.

  Return ONLY a valid JSON object:
  {
    "suggestions": [
      {
        "originalText": string,
        "improvedText": string,
        "explanation": string,
        "impact": "high|medium|low"
      }
    ]
  }
  `;

    try {
        const chatCompletion = await groq.chat.completions.create({
            model: 'mixtral-8x7b-32768',
            response_format: { type: 'json_object' },
            messages: [{ role: 'user', content: prompt }]
        });

        const responseText = chatCompletion.choices[0]?.message?.content || '{}';
        const suggestionsData = JSON.parse(responseText);

        // Save suggestions
        await (db as any).aiSuggestion.create({
            data: {
                cvId,
                section,
                suggestions: suggestionsData.suggestions as any,
                jobDescription,
            }
        });

        return suggestionsData;
    } catch (error: any) {
        console.error('AI content suggestions failed:', error);
        throw new Error(`Failed to get suggestions: ${error.message}`);
    }
}
