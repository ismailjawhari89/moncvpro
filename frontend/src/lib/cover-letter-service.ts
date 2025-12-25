import { streamText } from 'ai';
import { CVData } from '@/types/cv';
import { groq, hasGroqKey } from './groq-client';

export async function streamCoverLetter(cvData: CVData, tone: string = 'professional', abortSignal?: AbortSignal) {
    if (!hasGroqKey()) {
        throw new Error('GROQ_API_KEY is missing. Please check your .env.local file.');
    }
    const { personalInfo, experiences, skills, summary, targetJob, contentLanguage } = cvData;

    const systemPrompt = contentLanguage === 'ar'
        ? "أنت خبير توظيف محترف متخصص في كتابة خطابات التغطية المقنعة والعالية التأثير."
        : contentLanguage === 'fr'
            ? "Vous êtes un expert en recrutement professionnel spécialisé dans la rédaction de lettres de motivation convaincantes et percutantes."
            : "You are a professional recruiting expert specializing in writing persuasive, high-impact cover letters.";

    const prompt = `
      ${systemPrompt}
      
      Generate a ${tone} cover letter based on the following data:
      
      PERSONAL INFO:
      - Name: ${personalInfo.fullName}
      - Title: ${personalInfo.profession}
      
      CV SUMMARY:
      ${summary}
      
      KEY EXPERIENCES:
      ${experiences.map(e => `- ${e.position} at ${e.company}: ${e.description}`).join('\n')}
      
      KEY SKILLS:
      ${skills.map(s => s.name).join(', ')}
      
      TARGET JOB DESCRIPTION (Context for tailoring):
      "${targetJob || 'A professional role matching my background'}"
      
      INSTRUCTIONS:
      1. TONE: ${tone}, confident, and tailored.
      2. PERSUASIVE: Connect the candidate's achievements specifically to the needs identified in the job description.
      3. STRUCTURE: Header, Greeting, Intro, Body (2 paragraphs), Conclusion, Sign-off.
      4. LANGUAGE: Generate the letter in ${contentLanguage === 'ar' ? 'Arabic' : contentLanguage === 'fr' ? 'French' : 'English'}.
      5. DO NOT include placeholder bracket text like [Recipient Name] if you can avoid it, but use professional placeholders like "Hiring Manager" if recipient name is missing.
      6. Focus on the VALUE the candidate brings to the company.
    `;

    const result = await streamText({
        model: groq('llama-3.3-70b-versatile'),
        abortSignal,
        prompt,
    });

    return result;
}
