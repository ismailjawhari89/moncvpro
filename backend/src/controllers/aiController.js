import OpenAI from 'openai';
import { validationResult } from 'express-validator';

// Lazy initialization of OpenAI client
let openai = null;

function getOpenAIClient() {
    if (!openai && process.env.OPENAI_API_KEY) {
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    return openai;
}

export const generateCVContent = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Check if OpenAI is configured
    const client = getOpenAIClient();
    if (!client) {
        return res.status(503).json({ 
            msg: 'AI service is not configured. Please contact support.' 
        });
    }

    const { jobTitle, experience, skills } = req.body;

    try {
        const prompt = `
      Create a professional CV summary and bullet points for a ${jobTitle}.
      Experience: ${experience}
      Skills: ${skills}
      
      Format the response as JSON with fields: "summary" (string) and "bulletPoints" (array of strings).
    `;

        const completion = await client.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'gpt-3.5-turbo',
            response_format: { type: 'json_object' },
        });

        const content = JSON.parse(completion.choices[0].message.content);
        res.json(content);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
