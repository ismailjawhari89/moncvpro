export default {
  async fetch(request, env) {
    // CORS Headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset",
      "Access-Control-Expose-Headers": "X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    const ai = new AntigravityUnstoppable(env);

    try {
      // Health Check
      if (path === "/" || path === "/api/health") {
        return new Response(JSON.stringify({
          status: "ok",
          message: "MonCVPro Backend Worker is active",
          version: "2.1.0",
          timestamp: new Date().toISOString()
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // AI Endpoints
      if (path === "/ai" || path === "/api/ai") {
        if (request.method !== "POST") {
          return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        let body;
        try {
          body = await request.json();
        } catch (e) {
          return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const { prompt, action, language = 'en' } = body;

        if (!prompt) {
          return new Response(JSON.stringify({ error: "Prompt is required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        // Add context based on action
        let enhancedPrompt = prompt;
        if (action === 'analyze') {
          enhancedPrompt = `Industry: ${body.industry || 'General'}\nRole: ${body.role || 'Professional'}\nLanguage: ${language}\n\nAnalyze the following CV for ATS compatibility and suggest improvements:\n${prompt}\n\nReturn the response as a JSON object matching the ATSAnalysisResult schema.`;
        } else if (action === 'improve') {
          enhancedPrompt = `Improve the following content to be more ${body.type || 'professional'}:\n${prompt}\n\nLanguage: ${language}\n\nReturn the response as a JSON object with a "content" field and a "suggestions" array.`;
        } else if (action === 'grammar') {
          enhancedPrompt = `Check the following text for grammar and style issues:\n${prompt}\n\nLanguage: ${language}\n\nReturn a JSON object with "correctedText" and "issues" list.`;
        } else if (action === 'keywords') {
          enhancedPrompt = `Extract relevant industry keywords and their match percentage for this text:\n${prompt}\n\nLanguage: ${language}\n\nReturn a JSON object with "keywords" (array of objects with name and score).`;
        }

        const result = await ai.generate(enhancedPrompt);

        // Add mock rate limit headers for the frontend service to pick up
        const headers = {
          ...corsHeaders,
          "Content-Type": "application/json",
          "X-RateLimit-Limit": "100",
          "X-RateLimit-Remaining": "95",
          "X-RateLimit-Reset": Math.floor(Date.now() / 1000 + 3600).toString()
        };

        return new Response(JSON.stringify({
          success: true,
          provider: result.provider,
          response: result.content,
          data: result.content
        }), { headers });
      }

      // PDF Generation Endpoint (Stub)
      if (path === "/api/pdf/generate") {
        return new Response(JSON.stringify({
          success: false,
          error: "PDF generation is currently handled client-side for performance.",
          message: "Please use the client-side export utility."
        }), {
          status: 501,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // Default 404
      return new Response(JSON.stringify({ error: "Endpoint not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });

    } catch (e) {
      console.error("Worker Error:", e);
      return new Response(JSON.stringify({
        success: false,
        error: e.message || "An unexpected error occurred"
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};

class AntigravityUnstoppable {
  constructor(env) {
    this.providers = [
      {
        name: "gemini",
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
        priority: 1,
        apiKey: env.GEMINI_API_KEY
      },
      {
        name: "groq",
        url: "https://api.groq.com/openai/v1/chat/completions",
        priority: 2,
        apiKey: env.GROQ_API_KEY
      },
      {
        name: "openai",
        url: "https://api.openai.com/v1/chat/completions",
        priority: 3,
        apiKey: env.OPENAI_API_KEY
      }
    ];
  }

  async generate(prompt) {
    // Sort by priority and filter out those without API keys
    const availableProviders = this.providers
      .filter(p => !!p.apiKey && p.apiKey !== "…" && p.apiKey !== "")
      .sort((a, b) => a.priority - b.priority);

    if (availableProviders.length === 0) {
      throw new Error("No AI providers configured. Please set API keys in environment variables.");
    }

    for (const p of availableProviders) {
      try {
        console.log(`🔹 Attempting with ${p.name}...`);
        const result = await this.callProvider(p, prompt);
        if (result && result.content) {
          console.log(`✅ Success with ${p.name}`);
          return { provider: p.name, content: result.content };
        }
      } catch (e) {
        console.error(`❌ ${p.name} failed: ${e.message}`);
      }
    }
    throw new Error("All configured AI providers failed to respond. Please try again later.");
  }

  async callProvider(p, prompt) {
    if (p.name === "gemini") return this.callGemini(p, prompt);
    if (p.name === "groq") return this.callGroq(p, prompt);
    return this.callOpenAI(p, prompt);
  }

  async callGemini(p, prompt) {
    const res = await fetch(`${p.url}?key=${p.apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
      })
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Gemini API error: ${res.status} ${error}`);
    }

    const data = await res.json();
    return { content: data.candidates?.[0]?.content?.parts?.[0]?.text || "" };
  }

  async callGroq(p, prompt) {
    const res = await fetch(p.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${p.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a professional CV assistant. Return JSON only if requested." },
          { role: "user", content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 2048
      })
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Groq API error: ${res.status} ${error}`);
    }

    const data = await res.json();
    return { content: data.choices?.[0]?.message?.content || "" };
  }

  async callOpenAI(p, prompt) {
    const res = await fetch(p.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${p.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a professional CV assistant. Return JSON only if requested." },
          { role: "user", content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 2048
      })
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`OpenAI API error: ${res.status} ${error}`);
    }

    const data = await res.json();
    return { content: data.choices?.[0]?.message?.content || "" };
  }
}
