import { generateObject } from 'ai';
import { z } from 'zod';
import { CVData } from '@/types/cv';
import { groq, hasGroqKey } from './groq-client';

const cvGenerationSchema = z.object({
    summary: z.string().describe('A professional summary for the CV'),
    experiences: z.array(z.object({
        position: z.string(),
        company: z.string(),
        description: z.string().describe('Highly detailed and professional description with bullet points if possible'),
    })).describe('List of potential relevant experiences for this job title'),
    skills: z.array(z.string()).describe('List of top 10 relevant skills')
});

export async function generateFullCVContent(jobTitle: string, currentData: CVData) {
    if (!hasGroqKey()) {
        throw new Error('GROQ_API_KEY is missing. Please check your .env.local file.');
    }
    const { contentLanguage } = currentData;

    const systemPrompt = contentLanguage === 'ar'
        ? "أنت خبير توظيف محترف متخصص في صياغة محتوى السيرة الذاتية بجودة عالمية."
        : contentLanguage === 'fr'
            ? "Vous êtes un expert en recrutement professionnel spécialisé dans la rédaction de contenu de CV de qualité mondiale."
            : "You are a professional recruiting expert specializing in crafting world-class CV content.";

    try {
        const { object } = await generateObject({
            model: groq('llama-3.3-70b-versatile'),
            schema: cvGenerationSchema,
            prompt: `
                ${systemPrompt}
                
                Build a professional CV content for the job title: "${jobTitle}".
                
                The candidate's current background (use as context):
                Full Name: ${currentData.personalInfo.fullName}
                Current Profession: ${currentData.personalInfo.profession || 'Not specified'}
                Current Summary: ${currentData.summary || 'None'}
                
                TASKS:
                1. Generate a powerful 3-4 line summary tailored to the target job: ${jobTitle}.
                2. Generate 2 detailed experience placeholders that would perfectly fit this candidate for this role.
                3. List the top 10 most critical skills for this role.
                4. Match the language: ${contentLanguage === 'ar' ? 'Arabic' : contentLanguage === 'fr' ? 'French' : 'English'}.
            `,
        });

        return object;
    } catch (error) {
        console.error('Groq Generation Error:', error);
        throw error;
    }
}
