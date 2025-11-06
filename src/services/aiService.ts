// src/services/aiService.ts
interface Message {
  role: "user" | "system" | "assistant";
  content: string;
}

interface AIResponse {
  code: string;
  explanation: string;
  filename?: string;
}

/* -------------------------------------------------
   1. JSON extraction helpers
   ------------------------------------------------- */
const extractJSON = (text: string): string => {
  // 1. ```json
  const fenced = text.match(/```(?:json)?\s*({[\s\S]*?})\s*```/);
  if (fenced) return fenced[1];

  // 2. First top-level { … }
  const brace = text.match(/({[\s\S]*})/);
  return brace ? brace[1] : text;
};

const safeParseJSON = (raw: string): AIResponse => {
  try {
    const jsonStr = extractJSON(raw);
    const obj = JSON.parse(jsonStr);
    if (typeof obj.code !== "string") throw new Error("Missing code field");
    return {
      code: obj.code ?? "",
      explanation: obj.explanation ?? "No explanation.",
      filename: obj.filename,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Parse error";
    console.warn("[AI] JSON parse failed:", msg, "\nRaw:", raw);
    return {
      code: `// AI response was not valid JSON\n// ${msg}\n${raw}`,
      explanation: "Failed to parse AI output.",
      filename: "Error.tsx",
    };
  }
};

/* -------------------------------------------------
   2. AI Service
   ------------------------------------------------- */
export class AIService {
  private apiKey = import.meta.env.VITE_XAI_API_KEY?.trim();
  private base = "https://api.x.ai/v1/chat/completions";
  private model = import.meta.env.VITE_XAI_MODEL ?? "grok-code-fast-1";

  constructor() {
    if (!this.apiKey) throw new Error("VITE_XAI_API_KEY is required");
  }

  /** Stream tokens → yield *complete* AIResponse objects */
  async *generateCodeStream(
    prompt: string,
    context = "",
    signal?: AbortSignal
  ): AsyncGenerator<Partial<AIResponse>, AIResponse> {
    const messages: Message[] = [
      {
        role: "system",
        content:
          "You are a JSON-only code generator. " +
          "NEVER add explanations, markdown, or extra text. " +
          "Return EXACTLY this JSON (no ```json blocks):\n" +
          '{"code":"/* full file content */","explanation":"One short sentence.","filename":"FileName.tsx"}',
      },
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
        temperature: 0.0, // deterministic
        stream: true,
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`xAI error ${res.status}: ${txt}`);
    }

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let contentAcc = ""; // everything the model has sent so far

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6);
          if (payload === "[DONE]") continue;

          try {
            const chunk = JSON.parse(payload);
            const delta = chunk.choices[0]?.delta?.content ?? "";
            if (delta) contentAcc += delta;

            // Emit a *complete* object as soon as we can parse one
            const parsed = safeParseJSON(contentAcc);
            if (parsed.code && parsed.explanation) {
              yield parsed;
            }
          } catch {
            // ignore malformed SSE chunk
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    // Final fallback
    return safeParseJSON(contentAcc);
  }

  /** Legacy non-stream call */
  async generateCode(prompt: string, context = ""): Promise<AIResponse> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    try {
      const gen = this.generateCodeStream(prompt, context, controller.signal);
      let final: AIResponse = { code: "", explanation: "" };
      for await (const part of gen) final = part as AIResponse;
      return final;
    } finally {
      clearTimeout(timeout);
    }
  }
}

export const aiService = new AIService();