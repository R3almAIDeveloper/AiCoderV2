// src/services/aiService.ts
import { v4 as uuidv4 } from "uuid";

interface Message { role: "user" | "assistant"; content: string; }
interface AIResponse { code: string; explanation: string; filename?: string; }

export class AIService {
  private apiKey = import.meta.env.VITE_XAI_API_KEY;
  private base = "https://api.x.ai/v1/chat/completions";
  private model = "grok-code-fast-1";

  constructor() {
    if (!this.apiKey) throw new Error("VITE_XAI_API_KEY missing");
  }

  async generateCode(prompt: string, context = ""): Promise<AIResponse> {
    const messages: Message[] = [
      { role: "system", content: `You are an expert React/TypeScript dev. Return ONLY JSON: {"code":"...", "explanation":"...", "filename":"..."}` },
      { role: "user", content: `Prompt: ${prompt}\nContext: ${context}` }
    ];

    const res = await fetch(this.base, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify({ model: this.model, messages, max_tokens: 2000, temperature: 0.1 })
    });

    if (!res.ok) throw new Error(`Grok error: ${await res.text()}`);
    const json = await res.json();
    return JSON.parse(json.choices[0].message.content);
  }
}

export const aiService = new AIService();