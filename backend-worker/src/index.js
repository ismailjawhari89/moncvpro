import { OpenAI } from "openai";

export default {
    async fetch(request, env) {
        // CORS Headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        };

        // Handle OPTIONS (Preflight)
        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        if (request.method !== "POST") {
            return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
        }

        try {
            if (!env.HF_TOKEN) {
                throw new Error("HF_TOKEN is not defined in Worker secrets");
            }

            const openai = new OpenAI({
                apiKey: env.HF_TOKEN,
                baseURL: "https://router.huggingface.co/v1"
            });

            const { jobTitle, currentData, language = 'fr' } = await request.json();

            if (!jobTitle) {
                return new Response(JSON.stringify({ error: "Job title is required" }), {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" }
                });
            }

            const systemPrompt = `You are an expert CV writer. 
            Generate a professional summary and 3 key achievements/experiences for a "${jobTitle}".
            Language: ${language === 'ar' ? 'Arabic' : 'French'}.
            Return JSON format: { "summary": "...", "experiences": [ { "position": "...", "company": "Example Corp", "description": "..." } ] }`;

            const completion = await openai.chat.completions.create({
                model: "Qwen/Qwen2.5-72B-Instruct",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Generate content for a ${jobTitle}.` }
                ],
                response_format: { type: "json_object" }
            });

            const generatedContent = JSON.parse(completion.choices[0].message.content);

            return new Response(JSON.stringify(generatedContent), {
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });

        } catch (error) {
            console.error("Worker Error:", error);
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }
    },
};
