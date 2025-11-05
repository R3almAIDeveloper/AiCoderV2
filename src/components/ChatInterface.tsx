// src/components/ChatInterface.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Copy, Trash2, Bot, User } from 'lucide-react';
import { generateCode, AVAILABLE_MODELS } from '../services/aiService';
import { useFileTree } from '../hooks/useFileTree';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/* -------------------------------------------------------------
   NAMED EXPORT – this is what Layout.tsx imports
   ------------------------------------------------------------- */
export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('grok-4');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { addFile, selectFile } = useFileTree();

  // ---- Auto-scroll -------------------------------------------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ---- Focus input on mount ----------------------------------------
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ---- Send prompt -------------------------------------------------
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((p) => [...p, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const code = await generateCode(input.trim(), { model: selectedModel });

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: code,
        timestamp: new Date(),
      };
      setMessages((p) => [...p, assistantMsg]);

      // ---- Auto-create file ---------------------------------------
      const fileName = extractFileName(input.trim()) || 'Component.tsx';
      addFile(fileName, code);
      selectFile(fileName);
    } catch (err: any) {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${err.message}`,
        timestamp: new Date(),
      };
      setMessages((p) => [...p, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  // ---- Keyboard shortcuts -----------------------------------------
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ---- Helpers ----------------------------------------------------
  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);
  const clearChat = () => setMessages([]);

  // ----------------------------------------------------------------
  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot className="w-6 h-6 text-blue-400" />
          <h2 className="text-lg font-semibold">AI Assistant</h2>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={loading}
            className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {AVAILABLE_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <button
            onClick={clearChat}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            <Bot className="w-12 h-12 mx-auto mb-3 text-gray-600" />
            <p className="text-sm">
              Ask me to generate a component, fix code, or explain anything.
            </p>
            <p className="text-xs mt-2">
              Try: "Create a dark mode toggle with Tailwind"
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}

            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-100'
              }`}
            >
              <pre className="whitespace-pre-wrap font-mono text-xs md:text-sm">
                {msg.content.startsWith('Error:') ? (
                  <span className="text-red-400">{msg.content}</span>
                ) : (
                  msg.content
                )}
              </pre>

              {msg.role === 'assistant' && !msg.content.startsWith('Error:') && (
                <button
                  onClick={() => copyToClipboard(msg.content)}
                  className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  Copy code
                </button>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the component you want..."
            disabled={loading}
            rows={1}
            className="flex-1 px-4 py-2 bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
   Helper – guess a sensible filename from the prompt
   ------------------------------------------------------------- */
function extractFileName(prompt: string): string | null {
  const lower = prompt.toLowerCase();
  const patterns = [
    /create a (.+?) component/,
    /build a (.+?) with/,
    /make a (.+?) form/,
    /generate (.+?) component/,
    /a (.+?) with tailwind/,
  ];

  for (const p of patterns) {
    const m = lower.match(p);
    if (m) {
      const name = m[1]
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join('');
      return `${name}.tsx`;
    }
  }

  // fallback
  const words = prompt.split(' ').slice(0, 3);
  if (words.length) {
    return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('') + '.tsx';
  }
  return null;
}