// src/services/aiService.ts
interface Message {
  role: "user" | "system" | "assistant";
  content: string;
}

export interface AIResponse {
  code: string;
  explanation: string;
  filename?: string;
}

/* -------------------------------------------------
   1. Robust JSON extraction & safe parsing
   ------------------------------------------------- */
const extractJSON = (text: string): string => {
  // 1. ```json { ... } ```
  const fenced = text.match(/```(?:json)?\s*({[\s\S]*?})\s*```/);
  if (fenced) return fenced[1].trim();

  // 2. First complete top-level object { ... }
  let braceCount = 0;
  let start = -1;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '{') {
      if (braceCount === 0) start = i;
      braceCount++;
    } else if (char === '}') {
      braceCount--;
      if (braceCount === 0 && start !== -1) {
        return text.slice(start, i + 1);
      }
    }
  }

  // 3. Fallback: return whole string (will fail parse → handled)
  return text.trim();
};

const safeParseJSON = (raw: string): AIResponse => {
  const jsonStr = extractJSON(raw);

  try {
    const obj = JSON.parse(jsonStr);

    if (typeof obj.code !== "string") {
      throw new Error("Missing or invalid 'code' field");
    }

    return {
      code: obj.code,
      explanation: typeof obj.explanation === "string" ? obj.explanation : "No explanation.",
      filename: typeof obj.filename === "string" ? obj.filename : undefined,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Parse error";
    console.warn("[AI] JSON parse failed:", msg, "\nRaw chunk:", jsonStr);

    return {
      code: `// AI response was not valid JSON\n// ${msg}\n\n// Raw output:\n${jsonStr}`,
      explanation: "Failed to parse AI output as JSON.",
      filename: "Error.tsx",
    };
  }
};

/* -------------------------------------------------
   2. AI Service (Streaming + Fallback)
   ------------------------------------------------- */
export class AIService {
  private apiKey = import.meta.env.VITE_XAI_API_KEY?.trim();
  private base = "https://api.x.ai/v1/chat/completions";
  private model = import.meta.env.VITE_XAI_MODEL ?? "grok-code-fast-1";

  constructor() {
    if (!this.apiKey) {
      throw new Error("VITE_XAI_API_KEY is missing in .env");
    }
  }

  private getSystemPrompt(): string {
    return `
You are a JSON-only code generator. Respond with **exactly** this structure and **nothing else**:

{"code":"FULL FILE CONTENT HERE","explanation":"One short sentence.","filename":"Component.tsx"}

Rules:
- NO markdown, NO \`\`\`json blocks, NO extra text.
- Use \\n for line breaks inside the code string.
- Never wrap code in backticks.
- Always valid JSON.
`.trim();
  }

  /** Stream complete AIResponse objects as they become valid */
  async *generateCodeStream(
    prompt: string,
    context = "",
    signal?: AbortSignal
  ): AsyncGenerator<Partial<AIResponse>, AIResponse> {
    const messages: Message[] = [
      { role: "system", content: this.getSystemPrompt() },
      { role: "user", content: `Prompt: ${prompt}\nContext: ${context}` },
    ];

    const res = await fetch(this.base, {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        max_tokens: 2000,
        temperature: 0.0,
        stream: true,
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`xAI API error ${res.status}: ${txt}`);
    }

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let accumulated = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (!payload || payload === "[DONE]") continue;

          let chunk;
          try {
            chunk = JSON.parse(payload);
          } catch {
            continue; // Skip malformed SSE
          }

          const delta = chunk.choices?.[0]?.delta?.content ?? "";
          if (delta) accumulated += delta;

          // Try to parse full object from accumulated content
          const parsed = safeParseJSON(accumulated);
          if (parsed.code && parsed.explanation) {
            yield parsed;
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    // Final parse
    return safeParseJSON(accumulated);
  }

  /** Simple non-streaming version */
  async generateCode(prompt: string, context = ""): Promise<AIResponse> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    try {
      const stream = this.generateCodeStream(prompt, context, controller.signal);
      let result: AIResponse = { code: "", explanation: "" };
      for await (const part of stream) {
        result = part as AIResponse;
      }
      return result;
    } finally {
      clearTimeout(timeout);
    }
  }
}

export const aiService = new AIService();