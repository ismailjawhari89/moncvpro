import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getAuthenticatedUser } from '@/lib/server-auth';

// Initialize OpenAI client - make API key optional for build process
const openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey && process.env.NODE_ENV === 'production') {
    console.warn('⚠️ WARNING: OpenAI API key is missing! AI features will be disabled.');
}

const openai = openaiApiKey ? new OpenAI({
    apiKey: openaiApiKey,
}) : null;

export async function POST(req: NextRequest) {
    try {
        // Authenticate user
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { jobTitle, experience, skills } = await req.json();

        // Validate input
        if (!jobTitle || !skills) {
            return NextResponse.json(
                { success: false, message: "Job title and skills are required" },
                { status: 400 }
            );
        }

        // Create prompt for AI
        const prompt = `
      Create a professional CV summary and bullet points for a ${jobTitle}.
      Experience: ${experience || 'Not specified'}
      Skills: ${skills}
      
      Format the response as JSON with fields: "summary" (string) and "bulletPoints" (array of strings).
    `;

        // Generate CV content using OpenAI
        if (!openai) {
            return NextResponse.json(
                { success: false, message: "AI service is not configured" },
                { status: 503 }
            );
        }

        const completion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'gpt-3.5-turbo',
            response_format: { type: 'json_object' },
        });

        // Parse and return the AI-generated content
        const content = JSON.parse(completion.choices[0].message.content);

        return NextResponse.json({
            success: true,
            data: content,
            message: "CV content generated successfully"
        });

    } catch (err) {
        console.error('AI generation error:', err);
        return NextResponse.json(
            { success: false, message: "Server Error" },
            { status: 500 }
        );
    }
}