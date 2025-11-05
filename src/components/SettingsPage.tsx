import React, { useState } from 'react';
import { ArrowLeft, Settings, Palette, Code, Globe, Bell, Shield, User, Key, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
}

interface APIConfig {
  id: string;
  name: string;
  provider: 'openai' | 'claude' | 'xai' | 'gemini' | 'custom';
  apiKey: string;
  baseUrl?: string;
  model?: string;
  enabled: boolean;
}

interface GrokModel {
  name: string;
  type: string;
  contextWindow: number | null;
  tpm: number | null;
  rpm: number;
  inputPrice: number;
  outputPrice: number | string;
}

const GROK_MODELS: GrokModel[] = [
  { name: 'grok-code-fast-1', type: 'Language', contextWindow: 256000, tpm: 2000000, rpm: 480, inputPrice: 0.20, outputPrice: 1.50 },
  { name: 'grok-4-fast-reasoning', type: 'Language', contextWindow: 2000000, tpm: 4000000, rpm: 480, inputPrice: 0.20, outputPrice: 0.50 },
  { name: 'grok-4-fast-non-reasoning', type: 'Language', contextWindow: 2000000, tpm: 4000000, rpm: 480, inputPrice: 0.20, outputPrice: 0.50 },
  { name: 'grok-4-0709', type: 'Language', contextWindow: 256000, tpm: 2000000, rpm: 480, inputPrice: 3.00, outputPrice: 15.00 },
  { name: 'grok-3-mini', type: 'Language', contextWindow: 131072, tpm: null, rpm: 480, inputPrice: 0.30, outputPrice: 0.50 },
  { name: 'grok-3', type: 'Language', contextWindow: 131072, tpm: null, rpm: 600, inputPrice: 3.00, outputPrice: 15.00 },
  { name: 'grok-2-vision-1212', type: 'Language', contextWindow: 32768, tpm: null, rpm: 600, inputPrice: 2.00, outputPrice: 10.00 },
  { name: 'grok-2-1212', type: 'Language', contextWindow: 131072, tpm: null, rpm: 900, inputPrice: 2.00, outputPrice: 10.00 },
  { name: 'grok-2-image-1212', type: 'Image Generation', contextWindow: null, tpm: null, rpm: 300, inputPrice: 0, outputPrice: '0.07 per image' },
];

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    theme: 'dark',
    fontSize: '14',
    tabSize: '2',
    wordWrap: 'on',
    minimap: false,
    autoSave: true,
    notifications: true,
    aiAssistance: true
  });

  const [apiConfigs, setApiConfigs] = useState<APIConfig[]>([
    {
      id: '1',
      name: 'OpenAI GPT-4',
      provider: 'openai',
      apiKey: '',
      model: 'gpt-4',
      enabled: false
    },
    {
      id: '2',
      name: 'Claude 3.5 Sonnet',
      provider: 'claude',
      apiKey: '',
      model: 'claude-3-5-sonnet-20241022',
      enabled: false
    },
    {
      id: '3',
      name: 'xAI Grok',
      provider: 'xai',
      apiKey: '',
      model: 'grok-beta',
      enabled: false
    }
  ]);

  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleApiConfigChange = (id: string, field: keyof APIConfig, value: any) => {
    setApiConfigs(prev => prev.map(config => 
      config.id === id ? { ...config, [field]: value } : config
    ));
  };

  const addApiConfig = () => {
    const newConfig: APIConfig = {
      id: Date.now().toString(),
      name: 'Custom API',
      provider: 'custom',
      apiKey: '',
      baseUrl: '',
      model: '',
      enabled: false
    };
    setApiConfigs(prev => [...prev, newConfig]);
  };

  const removeApiConfig = (id: string) => {
    setApiConfigs(prev => prev.filter(config => config.id !== id));
  };

  const toggleApiKeyVisibility = (id: string) => {
    setShowApiKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getProviderInfo = (provider: APIConfig['provider']) => {
    switch (provider) {
      case 'openai':
        return { name: 'OpenAI', color: 'bg-green-600', docs: 'https://platform.openai.com/docs' };
      case 'claude':
        return { name: 'Anthropic Claude', color: 'bg-orange-600', docs: 'https://docs.anthropic.com' };
      case 'xai':
        return { name: 'xAI', color: 'bg-slate-600', docs: 'https://docs.x.ai' };
      case 'gemini':
        return { name: 'Google Gemini', color: 'bg-blue-600', docs: 'https://ai.google.dev/docs' };
      default:
        return { name: 'Custom', color: 'bg-gray-600', docs: '' };
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'api', label: 'API Config', icon: Key },
    { id: 'editor', label: 'Editor', icon: Code },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ];

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white p-1 rounded-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Settings className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-bold text-white">Settings</h1>
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
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4">General Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-white">Auto Save</label>
                        <p className="text-xs text-gray-400">Automatically save files as you type</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('autoSave', !settings.autoSave)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.autoSave ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-white">Notifications</label>
                        <p className="text-xs text-gray-400">Show system notifications</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('notifications', !settings.notifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.notifications ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-white">AI Assistance</label>
                        <p className="text-xs text-gray-400">Enable AI-powered code suggestions</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('aiAssistance', !settings.aiAssistance)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.aiAssistance ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.aiAssistance ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">API Configuration</h2>
                    <button
                      onClick={addApiConfig}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add API</span>
                    </button>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-6">
                    Configure multiple AI APIs to enhance your development experience. You can enable multiple APIs and the system will use them based on availability and your preferences.
                  </p>

                  <div className="space-y-4">
                    {apiConfigs.map((config) => {
                      const providerInfo = getProviderInfo(config.provider);
                      return (
                        <div key={config.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${providerInfo.color}`}></div>
                              <h3 className="text-white font-medium">{config.name}</h3>
                              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                                {providerInfo.name}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleApiConfigChange(config.id, 'enabled', !config.enabled)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  config.enabled ? 'bg-blue-600' : 'bg-gray-600'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    config.enabled ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                              <button
                                onClick={() => removeApiConfig(config.id)}
                                className="text-red-400 hover:text-red-300 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-white mb-2">Name</label>
                              <input
                                type="text"
                                value={config.name}
                                onChange={(e) => handleApiConfigChange(config.id, 'name', e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-white mb-2">Provider</label>
                              <select
                                value={config.provider}
                                onChange={(e) => handleApiConfigChange(config.id, 'provider', e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="openai">OpenAI</option>
                                <option value="claude">Anthropic Claude</option>
                                <option value="xai">xAI</option>
                                <option value="gemini">Google Gemini</option>
                                <option value="custom">Custom</option>
                              </select>
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-white mb-2">API Key</label>
                              <div className="relative">
                                <input
                                  type={showApiKeys[config.id] ? 'text' : 'password'}
                                  value={config.apiKey}
                                  onChange={(e) => handleApiConfigChange(config.id, 'apiKey', e.target.value)}
                                  placeholder="Enter your API key..."
                                  className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => toggleApiKeyVisibility(config.id)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                  {showApiKeys[config.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            {config.provider === 'custom' && (
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-white mb-2">Base URL</label>
                                <input
                                  type="text"
                                  value={config.baseUrl || ''}
                                  onChange={(e) => handleApiConfigChange(config.id, 'baseUrl', e.target.value)}
                                  placeholder="https://api.example.com/v1"
                                  className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            )}

                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-white mb-2">Model</label>
                              {config.provider === 'xai' ? (
                                <select
                                  value={config.model || ''}
                                  onChange={(e) => handleApiConfigChange(config.id, 'model', e.target.value)}
                                  className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Select a Grok model...</option>
                                  {GROK_MODELS.map((model) => (
                                    <option key={model.name} value={model.name}>
                                      {model.name} ({model.type})
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type="text"
                                  value={config.model || ''}
                                  onChange={(e) => handleApiConfigChange(config.id, 'model', e.target.value)}
                                  placeholder="e.g., gpt-4, claude-3-5-sonnet-20241022"
                                  className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              )}
                            </div>
                          </div>

                          {providerInfo.docs && (
                            <div className="mt-4 pt-4 border-t border-gray-700">
                              <a
                                href={providerInfo.docs}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
                              >
                                <Globe className="w-3 h-3" />
                                <span>View {providerInfo.name} Documentation</span>
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {apiConfigs.length === 0 && (
                    <div className="text-center py-8">
                      <Key className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                      <p className="text-gray-400">No API configurations yet.</p>
                      <p className="text-gray-500 text-sm">Add an API to get started with AI assistance.</p>
                    </div>
                  )}

                  <div className="bg-blue-900 border border-blue-700 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-white mb-2">💡 Pro Tips</h3>
                    <ul className="text-blue-100 text-sm space-y-1">
                      <li>• Enable multiple APIs for redundancy and different capabilities</li>
                      <li>• Different models excel at different tasks (coding, writing, analysis)</li>
                      <li>• Keep your API keys secure and never share them</li>
                      <li>• Monitor your API usage to avoid unexpected charges</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'editor' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4">Editor Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Font Size</label>
                      <select
                        value={settings.fontSize}
                        onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-md px-3 py-2 w-32"
                      >
                        <option value="12">12px</option>
                        <option value="14">14px</option>
                        <option value="16">16px</option>
                        <option value="18">18px</option>
                        <option value="20">20px</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Tab Size</label>
                      <select
                        value={settings.tabSize}
                        onChange={(e) => handleSettingChange('tabSize', e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-md px-3 py-2 w-32"
                      >
                        <option value="2">2 spaces</option>
                        <option value="4">4 spaces</option>
                        <option value="8">8 spaces</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Word Wrap</label>
                      <select
                        value={settings.wordWrap}
                        onChange={(e) => handleSettingChange('wordWrap', e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-md px-3 py-2 w-32"
                      >
                        <option value="off">Off</option>
                        <option value="on">On</option>
                        <option value="wordWrapColumn">Column</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-white">Show Minimap</label>
                        <p className="text-xs text-gray-400">Display code minimap in editor</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('minimap', !settings.minimap)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.minimap ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.minimap ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4">Appearance Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Theme</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleSettingChange('theme', 'dark')}
                          className={`p-3 rounded-md border-2 transition-colors ${
                            settings.theme === 'dark'
                              ? 'border-blue-500 bg-gray-700'
                              : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                          }`}
                        >
                          <div className="w-full h-16 bg-gray-900 rounded mb-2"></div>
                          <span className="text-sm text-white">Dark Theme</span>
                        </button>
                        <button
                          onClick={() => handleSettingChange('theme', 'light')}
                          className={`p-3 rounded-md border-2 transition-colors ${
                            settings.theme === 'light'
                              ? 'border-blue-500 bg-gray-700'
                              : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                          }`}
                        >
                          <div className="w-full h-16 bg-gray-100 rounded mb-2"></div>
                          <span className="text-sm text-white">Light Theme</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4">Privacy & Security</h2>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-800 p-4 rounded-md">
                      <h3 className="text-sm font-medium text-white mb-2">Data Collection</h3>
                      <p className="text-xs text-gray-400 mb-3">
                        We collect minimal data to improve your experience. Your code and projects remain private.
                      </p>
                      <button className="text-blue-400 hover:text-blue-300 text-xs">
                        Learn more about our privacy policy
                      </button>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-md">
                      <h3 className="text-sm font-medium text-white mb-2">Account Security</h3>
                      <p className="text-xs text-gray-400 mb-3">
                        Keep your account secure with two-factor authentication.
                      </p>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded">
                        Enable 2FA
                      </button>
                    </div>
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