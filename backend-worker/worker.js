// ==============================================
// Antigravity - Groq Only
// ==============================================

class AntigravityGroqOnly {
    constructor(env) {
        this.apiKey = env.GROQ_API_KEY;
        if (!this.apiKey) {
            throw new Error("Groq API key is missing! Please set it in Cloudflare Secrets using 'wrangler secret put GROQ_API_KEY'.");
        }
    }

    async generate(prompt) {
        // ✅ Groq Only Strategy
        console.log("🔹 AI Request: Using Groq (Exclusive)");
        return await this.callGroqAPI(prompt);
    }

    async callGroqAPI(prompt) {
        // Using the standard OpenAI-compatible endpoint for Groq
        const url = 'https://api.groq.com/openai/v1/chat/completions';

        const body = {
            model: "llama3-8b-8192", // Fast and efficient model
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 1024
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const text = await response.text();
            // Try to parse error JSON if possible
            try {
                const errorJson = JSON.parse(text);
                throw new Error(`Groq API error: ${errorJson.error?.message || text}`);
            } catch (e) {
                throw new Error(`Groq API error: ${response.status} - ${text}`);
            }
        }

        const data = await response.json();
        return {
            provider: "groq",
            content: data.choices[0].message.content
        };
    }
}

// ==============================================
// Worker Handler (ES Module Format)
// ==============================================

export default {
    async fetch(request, env) {
        // CORS Headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        };

        // Handle CORS preflight
        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        if (request.method !== "POST") {
            return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
                status: 405,
                headers: { "Content-Type": "application/json", ...corsHeaders }
            });
        }

        try {
            const { prompt } = await request.json();

            if (!prompt) {
                return new Response(JSON.stringify({ error: "Prompt required" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json", ...corsHeaders }
                });
            }

            const antigravity = new AntigravityGroqOnly(env);
            const result = await antigravity.generate(prompt);

            return new Response(JSON.stringify(result), {
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders
                }
            });
        } catch (err) {
            console.error("Worker Error:", err);
            return new Response(JSON.stringify({ error: err.message }), {
                status: 500,
                headers: { "Content-Type": "application/json", ...corsHeaders }
            });
        }
    }
};
