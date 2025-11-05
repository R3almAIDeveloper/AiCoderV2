import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Book, MessageCircle, Zap, Code, Lightbulb, ExternalLink, Search } from 'lucide-react';

interface HelpPageProps {
  onBack: () => void;
}

export const HelpPage: React.FC<HelpPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'getting-started', label: 'Getting Started', icon: Zap },
    { id: 'ai-commands', label: 'AI Commands', icon: MessageCircle },
    { id: 'editor', label: 'Editor Guide', icon: Code },
    { id: 'faq', label: 'FAQ', icon: HelpCircle }
  ];

  const aiCommands = [
    {
      category: 'Components',
      commands: [
        { prompt: 'Create a Hello World React component', description: 'Generates a basic React component with TypeScript' },
        { prompt: 'Build a todo list with useState', description: 'Creates a functional todo list with state management' },
        { prompt: 'Create a contact form with validation', description: 'Builds a form with input validation and error handling' },
        { prompt: 'Design a responsive navigation bar', description: 'Creates a mobile-friendly navigation component' }
      ]
    },
    {
      category: 'UI Elements',
      commands: [
        { prompt: 'Create a modal dialog component', description: 'Builds a reusable modal with backdrop and animations' },
        { prompt: 'Build a card component with hover effects', description: 'Creates an interactive card with CSS transitions' },
        { prompt: 'Design a loading spinner component', description: 'Generates animated loading indicators' },
        { prompt: 'Create a dropdown menu component', description: 'Builds a customizable dropdown with keyboard navigation' }
      ]
    },
    {
      category: 'Advanced',
      commands: [
        { prompt: 'Create a weather app with API integration', description: 'Builds a complete weather app with external API calls' },
        { prompt: 'Build a data table with sorting and filtering', description: 'Creates an interactive data table component' },
        { prompt: 'Design a dashboard with charts', description: 'Generates a dashboard layout with data visualization' },
        { prompt: 'Create a file upload component', description: 'Builds a drag-and-drop file upload interface' }
      ]
    }
  ];

  const faqs = [
    {
      question: 'How do I start a new project?',
      answer: 'Simply start chatting with the AI assistant in the left panel. Describe what you want to build, and the AI will generate the necessary files and code for you.'
    },
    {
      question: 'Can I edit the generated code?',
      answer: 'Absolutely! Click on any file in the file tree to open it in the Monaco Editor. You can modify the code, and changes will be reflected in the preview immediately.'
    },
    {
      question: 'How do I preview my application?',
      answer: 'The preview panel on the right shows your application running in real-time. It automatically updates when you make changes to your code.'
    },
    {
      question: 'What technologies are supported?',
      answer: 'R3alm Dev currently supports React with TypeScript, JavaScript, HTML, CSS, and modern web development tools like Vite and Tailwind CSS.'
    },
    {
      question: 'How do I deploy my project?',
      answer: 'Click the "Deploy" button in the header to publish your project to the web. You\'ll get a shareable URL that you can send to others.'
    },
    {
      question: 'Can I work with multiple files?',
      answer: 'Yes! The AI can generate multiple files at once, and you can navigate between them using the file tree. The editor supports full project structures.'
    }
  ];

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-white p-1 rounded-md"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <HelpCircle className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl font-bold text-white">Help & Documentation</h1>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-md pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 border-r border-gray-700">
          <div className="p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {activeTab === 'getting-started' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Welcome to R3alm Dev</h2>
                  <p className="text-gray-300 mb-6">
                    R3alm Dev is your AI-powered development environment. Get started by following these simple steps:
                  </p>
                </div>

                <div className="grid gap-6">
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                      <h3 className="text-lg font-semibold text-white">Start with AI Chat</h3>
                    </div>
                    <p className="text-gray-300 mb-3">
                      Use the chat interface on the left to describe what you want to build. Be specific about your requirements.
                    </p>
                    <div className="bg-gray-900 p-3 rounded border-l-4 border-blue-500">
                      <p className="text-sm text-gray-300 italic">
                        Example: "Create a todo list component with add, delete, and mark complete functionality"
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                      <h3 className="text-lg font-semibold text-white">Review Generated Code</h3>
                    </div>
                    <p className="text-gray-300 mb-3">
                      The AI will generate files and code for you. Use the file tree to navigate and the editor to review or modify the code.
                    </p>
                  </div>

                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                      <h3 className="text-lg font-semibold text-white">Preview & Iterate</h3>
                    </div>
                    <p className="text-gray-300 mb-3">
                      See your application running in real-time in the preview panel. Make changes and iterate with the AI to perfect your project.
                    </p>
                  </div>

                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
                      <h3 className="text-lg font-semibold text-white">Deploy & Share</h3>
                    </div>
                    <p className="text-gray-300 mb-3">
                      When you're happy with your project, click the "Deploy" button to publish it to the web and get a shareable URL.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai-commands' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">AI Command Examples</h2>
                  <p className="text-gray-300 mb-6">
                    Here are some example prompts to help you get started with the AI assistant:
                  </p>
                </div>

                {aiCommands.map((category) => (
                  <div key={category.category} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">{category.category}</h3>
                    <div className="space-y-3">
                      {category.commands.map((command, index) => (
                        <div key={index} className="bg-gray-900 p-4 rounded border border-gray-600">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-blue-400 font-medium mb-1">"{command.prompt}"</p>
                              <p className="text-gray-300 text-sm">{command.description}</p>
                            </div>
                            <button className="ml-4 text-gray-400 hover:text-white">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'editor' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Editor Guide</h2>
                  <p className="text-gray-300 mb-6">
                    Learn how to use the Monaco Editor effectively in R3alm Dev:
                  </p>
                </div>

                <div className="grid gap-6">
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Keyboard Shortcuts</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Save File</span>
                          <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">Ctrl+S</kbd>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Find</span>
                          <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">Ctrl+F</kbd>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Replace</span>
                          <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">Ctrl+H</kbd>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Format Document</span>
                          <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">Shift+Alt+F</kbd>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Command Palette</span>
                          <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">Ctrl+Shift+P</kbd>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Go to Line</span>
                          <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">Ctrl+G</kbd>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center space-x-2">
                        <Lightbulb className="w-4 h-4 text-yellow-400" />
                        <span>IntelliSense code completion</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Lightbulb className="w-4 h-4 text-yellow-400" />
                        <span>TypeScript error checking</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Lightbulb className="w-4 h-4 text-yellow-400" />
                        <span>Syntax highlighting</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Lightbulb className="w-4 h-4 text-yellow-400" />
                        <span>Code folding and minimap</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                      <p className="text-gray-300">{faq.answer}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-900 border border-blue-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">Need More Help?</h3>
                  <p className="text-blue-100 mb-4">
                    Can't find what you're looking for? We're here to help!
                  </p>
                  <div className="flex space-x-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
                      Contact Support
                    </button>
                    <button className="border border-blue-500 text-blue-300 hover:bg-blue-800 px-4 py-2 rounded-md text-sm">
                      Join Community
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};