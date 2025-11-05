import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Settings, ChevronDown, Check } from 'lucide-react';
import { ChatMessage } from '../types';
import { aiService } from '../services/aiService';

interface ChatInterfaceProps {
  onCodeGenerated: (path: string, content: string) => void;
}

interface APIConfig {
  id: string;
  name: string;
  provider: 'openai' | 'claude' | 'xai' | 'gemini' | 'custom';
  enabled: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onCodeGenerated }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Welcome to R3alm Dev! I\'m your AI development assistant. Try asking me to create a "Hello World" component or any other React component you need.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showApiDropdown, setShowApiDropdown] = useState(false);
  const [activeApiId, setActiveApiId] = useState<string>('demo');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock API configurations - in production, this would come from settings
  const [apiConfigs] = useState<APIConfig[]>([
    { id: 'demo', name: 'Demo AI (Built-in)', provider: 'custom', enabled: true },
    { id: 'openai', name: 'OpenAI GPT-4', provider: 'openai', enabled: false },
    { id: 'claude', name: 'Claude 3.5 Sonnet', provider: 'claude', enabled: false },
    { id: 'xai', name: 'xAI Grok', provider: 'xai', enabled: false },
    { id: 'gemini', name: 'Google Gemini', provider: 'gemini', enabled: false }
  ]);

  const activeApi = apiConfigs.find(api => api.id === activeApiId);
  const enabledApis = apiConfigs.filter(api => api.enabled);

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'openai': return 'bg-green-500';
      case 'claude': return 'bg-orange-500';
      case 'xai': return 'bg-purple-500';
      case 'gemini': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiService.generateCode(input);
      
      // Add generated files
      {showApiDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowApiDropdown(false)}
        />
      )}
      Object.entries(response.files).forEach(([path, content]) => {
        onCodeGenerated(path, content);
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.instructions,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error while generating code. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-800">
      {/* Header */}
      <div className="border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          
          {/* Settings Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowApiDropdown(!showApiDropdown)}
              className="flex items-center space-x-1 text-gray-400 hover:text-white p-1 rounded-md transition-colors"
              title="AI API Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            
            {showApiDropdown && (
              <div className="absolute right-0 top-8 w-64 bg-gray-700 rounded-md shadow-lg border border-gray-600 z-50">
                <div className="p-3 border-b border-gray-600">
                  <h3 className="text-sm font-semibold text-white mb-1">Active AI API</h3>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getProviderColor(activeApi?.provider || 'custom')}`}></div>
                    <span className="text-sm text-gray-300">{activeApi?.name || 'No API Selected'}</span>
                  </div>
                </div>
                
                <div className="py-1 max-h-48 overflow-y-auto">
                  {enabledApis.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-400">
                      No APIs configured. Go to Settings to add APIs.
                    </div>
                  ) : (
                    enabledApis.map((api) => (
                      <button
                        key={api.id}
                        onClick={() => {
                          setActiveApiId(api.id);
                          setShowApiDropdown(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getProviderColor(api.provider)}`}></div>
                          <span>{api.name}</span>
                        </div>
                        {activeApiId === api.id && (
                          <Check className="w-3 h-3 text-blue-400" />
                        )}
                      </button>
                    ))
                  )}
                </div>
                
                {enabledApis.length > 0 && (
                  <div className="border-t border-gray-600 p-2">
                    <div className="text-xs text-gray-400">
                      {enabledApis.length} API{enabledApis.length !== 1 ? 's' : ''} available
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' 
                  ? 'bg-blue-500 ml-2' 
                  : 'bg-purple-500 mr-2'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div className={`px-4 py-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-purple-500 mr-2 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-700 px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  <span className="text-sm text-gray-300">Generating code...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe what you want to build..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white p-2 rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-2 flex space-x-2">
          <button 
            onClick={() => setInput('Create a Hello World React component')}
            className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded"
          >
            Hello World
          </button>
          <button 
            onClick={() => setInput('Create a todo list component with useState')}
            className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded"
          >
            Todo List
          </button>
          <button 
            onClick={() => setInput('Create a contact form with validation')}
            className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded"
          >
            Contact Form
          </button>
        </div>
      </div>
    </div>
  );
};