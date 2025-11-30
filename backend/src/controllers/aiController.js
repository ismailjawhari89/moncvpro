import OpenAI from 'openai';
import { validationResult } from 'express-validator';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const generateCVContent = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { jobTitle, experience, skills } = req.body;

    try {
        const prompt = `
      Create a professional CV summary and bullet points for a ${jobTitle}.
      Experience: ${experience}
      Skills: ${skills}
      
      Format the response as JSON with fields: "summary" (string) and "bulletPoints" (array of strings).
    `;

        const completion = await openai.chat.completions.create({
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
