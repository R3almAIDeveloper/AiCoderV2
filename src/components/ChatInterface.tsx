import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { generateCode } from '../services/xaiService';

interface ChatInterfaceProps {
  className?: string;
  style?: CSSProperties;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ className, style }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'How can Bolt help you today?', sender: 'ai' },
    { id: 2, text: 'Create a Todo App with Supabase Integration', sender: 'user' },
    { id: 3, text: 'Generating...', sender: 'ai', steps: ['Create initial files', 'Install dependencies', 'npm install'] },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { id: messages.length + 1, text: input, sender: 'user' };
      setMessages([...messages, userMessage]);
      setInput('');
      setIsLoading(true);

      try {
        const code = await generateCode(input);
        const aiMessage = { id: messages.length + 2, text: code, sender: 'ai' };
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        const errorMessage = { id: messages.length + 2, text: `Error: ${error.message}`, sender: 'ai' };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`} style={style}>
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg ${
              msg.sender === 'user' ? 'bg-blue-600 ml-auto max-w-[80%]' : 'bg-gray-700 mr-auto max-w-[80%]'
            }`}
          >
            <p className="text-sm">{msg.text}</p>
            {msg.steps && (
              <ul className="mt-2 space-y-1">
                {msg.steps.map((step, idx) => (
                  <li key={idx} className="flex items-center text-xs text-gray-300">
                    <Sparkles size={12} className="mr-1" /> {step}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="p-3 rounded-lg bg-gray-700 mr-auto max-w-[80%]">
            <p className="text-sm">Generating code with xAI...</p>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center border-t border-gray-700 pt-4 px-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          placeholder="Ask AI to generate code..."
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading || !input.trim()} className="ml-2 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;