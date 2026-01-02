export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const ai = new AntigravityUnstoppable(env);

    try {
      if (url.pathname === "/ai" || url.pathname === "/api/ai") {
        const body = await request.json();
        const { prompt, action } = body;
        
        const result = await ai.generate(prompt || "Hello");
        return new Response(JSON.stringify({
          success: true,
          provider: result.provider,
          response: result.content
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify({ status: "running" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { 
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
    for (const p of this.providers.sort((a, b) => a.priority - b.priority)) {
      try {
        if (!p.apiKey || p.apiKey === "…") continue;
        const result = await this.callProvider(p, prompt);
        if (result && result.content) {
          return { provider: p.name, content: result.content };
        }
      } catch (e) {
        console.log(`❌ Failed: ${p.name} => ${e.message}`);
      }
    }
    throw new Error("All providers failed.");
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
        generationConfig: { temperature: 0.7, maxOutputTokens: 2000 }
      })
    });
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
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      })
    });
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
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    const data = await res.json();
    return { content: data.choices?.[0]?.message?.content || "" };
  }
}
