// src/services/aiService.ts
import { webContainer } from '../hooks/useWebContainer';

interface FileOutput {
  path: string;
  content: string;
}

interface AiResponse {
  files?: FileOutput[];
  code?: string;
  error?: string;
}

const SYSTEM_PROMPT = `You are an expert React + TypeScript + Tailwind developer.
Return ONLY valid JSON with a "files" array. Example:
{
  "files": [
    { "path": "src/components/Button.tsx", "content": "export default function Button() { ... }" }
  ]
}
No explanations. No markdown.`;

export async function generateCodeFromPrompt(prompt: string): Promise<AiResponse> {
  const apiKey = import.meta.env.VITE_XAI_API_KEY;
  const baseUrl = import.meta.env.VITE_XAI_BASE_URL || 'https://api.x.ai/v1';
  const model = import.meta.env.VITE_XAI_MODEL || 'grok-beta';

  if (!apiKey) {
    return { error: 'XAI API key not configured. Add VITE_XAI_API_KEY to .env' };
  }

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        max_tokens: 3000,
        temperature: 0.1,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`xAI API error: ${response.status} ${err}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    let parsed: { files?: FileOutput[] };
    try {
      parsed = JSON.parse(content);
    } catch {
      return { error: 'Invalid JSON from AI', code: content };
    }

    return { files: parsed.files };
  } catch (error) {
    console.error('AI generation failed:', error);
    return { error: `Generation failed: ${error.message}` };
  }
}

// Default export for compatibility
export default { generateCodeFromPrompt };