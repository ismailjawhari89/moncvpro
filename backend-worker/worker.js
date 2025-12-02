export default {
  async fetch(request, env) {
    const prompt = "Hello from Antigravity Test";

    const ai = new AntigravityUnstoppable(env);

    try {
      const result = await ai.generate(prompt);
      return new Response(JSON.stringify({
        message: "Worker OK",
        provider: result.provider,
        content: result.content
      }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      console.error("Worker Error:", e);
      return new Response(JSON.stringify({
        error: e.message
      }), { status: 500, headers: { "Content-Type": "application/json" } });
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
    console.log("🔹 Checking API keys...");
    for (const p of this.providers) {
      console.log(`${p.name} key: ${p.apiKey ? "موجود ✅" : "غير موجود ❌"}`);
    }

    for (const p of this.providers.sort((a, b) => a.priority - b.priority)) {
      try {
        console.log(`🔹 Trying provider: ${p.name}`);
        const result = await this.callProvider(p, prompt);
        if (result && result.content) {
          return { provider: p.name, content: result.content };
        }
      } catch (e) {
        console.error(`❌ Failed provider: ${p.name} => ${e.message}`);
      }
    }
    throw new Error("All providers failed.");
  }

  async callProvider(p, prompt) {
    if (!p.apiKey) throw new Error(`${p.name} API key is missing`);

    if (p.name === "gemini") return this.callGemini(p, prompt);
    if (p.name === "groq") return this.callGroq(p, prompt);
    return this.callOpenAI(p, prompt);
  }

  async callGemini(p, prompt) {
    const body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2000 }
    });

    const res = await fetch(`${p.url}?key=${p.apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Gemini error: ${res.status} - ${text}`);
    }

    const data = await res.json();
    return { content: data.candidates?.[0]?.content?.parts?.[0]?.text || "" };
  }

  async callGroq(p, prompt) {
    const body = JSON.stringify({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000
    });

    const res = await fetch(p.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${p.apiKey}`,
        "Content-Type": "application/json"
      },
      body
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Groq error: ${res.status} - ${text}`);
    }

    const data = await res.json();
    return { content: data.choices?.[0]?.message?.content || "" };
  }

  async callOpenAI(p, prompt) {
    const body = JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000
    });

    const res = await fetch(p.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${p.apiKey}`,
        "Content-Type": "application/json"
      },
      body
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OpenAI error: ${res.status} - ${text}`);
    }

    const data = await res.json();
    return { content: data.choices?.[0]?.message?.content || "" };
  }
}
