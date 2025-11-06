// src/components/ChatInterface.tsx
import React, { useState, useRef } from 'react';
import { aiService } from '../services/aiService';
import { getFileService } from '../services/fileService';
import { useWebContainer } from '../hooks/useWebContainer';

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const { container: wc } = useWebContainer();
  const fileService = wc ? getFileService(wc) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !wc || !fileService) return;

    const userMsg = input.trim();
    setMessages(m => [...m, { role: 'user', content: userMsg }]);
    setInput('');

    setMessages(m => [...m, { role: 'assistant', content: 'Generating...' }]);

    try {
      const resp = await aiService.generateCode(userMsg);
      await fileService.applyAIResponse(resp);

      setMessages(m => [...m.slice(0, -1), {
        role: 'assistant',
        content: `Created \`${resp.filename}\` and added to preview.`
      }]);
    } catch (err) {
      setMessages(m => [...m.slice(0, -1), {
        role: 'assistant',
        content: `Error: ${(err as Error).message}`
      }]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <span className={`inline-block p-2 rounded-lg max-w-xs ${
              m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}>
              {m.content}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask AI to build a component..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring"
          autoFocus
        />
      </form>
    </div>
  );
}