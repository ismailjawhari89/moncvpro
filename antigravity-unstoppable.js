export default {
  async fetch(request, env) {
    const prompt = "Hello from Antigravity Test";
    const ai = new AntigravityUnstoppable(env);

    try {
      const result = await ai.generate(prompt);
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response("Error: " + e.message, { status: 500 });
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
    if (!p.apiKey) throw new Error(`${p.name} API key is missing`);

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

    if (!res.ok) throw new Error("Gemini error: " + res.status);

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

    if (!res.ok) throw new Error("Groq error: " + res.status);

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

    if (!res.ok) throw new Error("OpenAI error: " + res.status);

    const data = await res.json();
    return { content: data.choices?.[0]?.message?.content || "" };
  }
}
