# ⚡ CV Master AI - Groq Integration Guide

This guide explains how to use the ultra-fast Groq integration directly from the Frontend.

## 1. Cloudflare Worker Setup (One-time)

Ensure your worker is deployed with the **Groq API Key**:

```bash
# 1. Login to Cloudflare
npx wrangler login

# 2. Set the Secret (paste your key when prompted)
npx wrangler secret put GROQ_API_KEY

# 3. Deploy
npx wrangler deploy
```

## 2. Frontend Configuration

Update your `.env.local` to point to your new worker:

```env
NEXT_PUBLIC_WORKER_URL=https://moncvpro-worker.YOUR_SUBDOMAIN.workers.dev
```

## 3. Usage in React Components

Use the `aiService.generateWithGroq` method for instant AI generation.

```tsx
import { useState } from 'react';
import { aiService } from '@/services/ai.service';

export function AIWriter() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await aiService.generateWithGroq(
        "Write a professional summary for a Senior React Developer..."
      );
      
      // result = { provider: 'groq', content: '...' }
      setContent(result.content);
    } catch (err) {
      alert("AI Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : '✨ Magic Write'}
      </button>
      <textarea value={content} readOnly />
    </div>
  );
}
```

## ⚠️ Important Notes

*   **Security**: The worker is currently public (`Access-Control-Allow-Origin: *`). For production, consider restricting origin in `worker.js` to your specific domain.
*   **Direct Access**: This bypasses the backend API, reducing latency significantly (~300ms vs 2s+).
