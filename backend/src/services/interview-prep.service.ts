
import Groq from 'groq-sdk';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/**
 * Service to generate tailored interview questions based on the CV
 */
export async function generateInterviewQuestions(cvId: string) {
  const cv: any = await (db as any).cV.findUnique({
    where: { id: cvId },
    include: { experiences: true, skills: true }
  });

  if (!cv) throw new Error('CV not found');

  const prompt = `
  You are an experienced interview coach.
  
  Based on this CV:
  ${JSON.stringify({
    personalInfo: cv.personalInfo,
    summary: cv.summary,
    experiences: cv.experiences,
    skills: cv.skills
  }, null, 2)}

  Generate 10 likely interview questions for this candidate.
  Include behavioral, technical, and situational questions.

  Return ONLY a valid JSON object:
  {
    "questions": [
      {
        "question": string,
        "type": "behavioral|technical|situational",
        "answerFramework": string,
        "tips": string[]
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
    return JSON.parse(responseText);
  } catch (error: any) {
    console.error('Interview questions generation failed:', error);
    throw new Error(`Failed to generate questions: ${error.message}`);
  }
}
