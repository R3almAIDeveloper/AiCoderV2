// src/components/ChatInterface.tsx
import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { aiService } from "../services/aiService";

interface Message { role: "user" | "assistant"; content: string; }
interface AIResponse { code: string; explanation: string; filename?: string; }

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const scroll = () => endRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scroll, [messages]);

  const dispatchAddFile = (filename: string, code: string) => {
    window.dispatchEvent(new CustomEvent("addFile", { detail: { filename, code } }));
  };
  const addMsg = (m: Message) => setMessages(p => [...p, m]);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    const user: Message = { role: "user", content: input.trim() };
    addMsg(user); setInput(""); setIsLoading(true);

    try {
      const context = (window as any).getProjectContext?.() ?? "";
      const res: AIResponse = await aiService.generateCode(user.content, context);
      const name = res.filename ?? "Generated.tsx";
      dispatchAddFile(name, res.code);
      addMsg({ role: "assistant", content: res.explanation });
    } catch (err) {
      addMsg({ role: "assistant", content: `Error: ${(err as Error).message}` });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <div className="border-b border-gray-200 dark:border-gray-700 p-3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">AI Assistant (xAI Grok)</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400">Ask me to generate code…</p>}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${m.role === "user" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"}`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Thinking…</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <form onSubmit={submit} className="border-t border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800">
        <div className="flex space-x-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
            placeholder="Describe what you want…"
            className="flex-1 resize-none rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()} className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  );
};