// src/components/ChatInterface.tsx
import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface ChatInterfaceProps {
  onSubmit: (prompt: string) => void;
  disabled?: boolean;
}

export default function ChatInterface({ onSubmit, disabled }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled || isLoading) return;

    const prompt = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      onSubmit(prompt);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
        <Sparkles size={16} className="text-purple-400" />
        <span className="text-sm font-semibold text-gray-200">AI Assistant</span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="text-xs text-gray-400 italic">
          Ask me to build components, fix bugs, or explain code.
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-gray-700 bg-gray-850"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={disabled ? "Starting WebContainer..." : "Describe what you want to build..."}
            disabled={disabled || isLoading}
            className="flex-1 px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || disabled || isLoading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center gap-1.5 text-sm font-medium"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send size={14} />
                Send
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}