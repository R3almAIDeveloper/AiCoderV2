import React, { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { ChevronDown, Settings, User, LogOut, HelpCircle, Eye, Code, Database, Home } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { FileTree } from './FileTree';
import { MonacoEditor } from './MonacoEditor';
import { Preview } from './Preview';
import { SettingsPage } from './SettingsPage';
import { HelpPage } from './HelpPage';
import { DatabasePanel } from './DatabasePanel';
import { FileNode } from '../types';

interface LayoutProps {
  files: FileNode[];
  activeFile: string | null;
  onFileSelect: (path: string) => void;
  onFileCreate: (path: string, content: string) => void;
  fileContent: string;
  onContentChange: (content: string) => void;
  previewUrl: string;
}

export const Layout: React.FC<LayoutProps> = ({
  files,
  activeFile,
  onFileSelect,
  onFileCreate,
  fileContent,
  onContentChange,
  previewUrl
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentView, setCurrentView] = useState<'editor' | 'settings' | 'help'>('editor');
  const [viewMode, setViewMode] = useState<'home' | 'preview' | 'code' | 'database'>('home');

  const handleSettingsClick = () => {
    setCurrentView('settings');
    setShowDropdown(false);
  };

  const handleHelpClick = () => {
    setCurrentView('help');
    setShowDropdown(false);
  };

  const handleBackToEditor = () => {
    setCurrentView('editor');
  };

  const handleViewModeChange = (mode: 'home' | 'preview' | 'code' | 'database') => {
    setViewMode(mode);
    setCurrentView('editor');
  };
  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R3</span>
            </div>
            <h1 className="text-xl font-bold text-white">R3alm Dev</h1>
            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">Beta</span>
          </div>
          
          {/* Icon Menu */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleViewModeChange('home')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'home'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
              title="Home - All Panels"
            >
              <Home className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleViewModeChange('preview')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'preview'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
              title="Preview Mode"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleViewModeChange('code')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'code'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
              title="Code Mode"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleViewModeChange('database')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'database'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
              title="Database View"
            >
              <Database className="w-4 h-4" />
            </button>
            <button
              onClick={handleSettingsClick}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="text-gray-400 hover:text-white px-3 py-1 rounded-md text-sm">
              Deploy
            </button>
            <button className="text-gray-400 hover:text-white px-3 py-1 rounded-md text-sm">
              Share
            </button>
            
            {/* Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-1 text-gray-400 hover:text-white px-3 py-1 rounded-md text-sm"
              >
                <User className="w-4 h-4" />
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg border border-gray-600 z-50">
                  <div className="py-1">
                    <button
                      onClick={handleHelpClick}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Help</span>
                    </button>
                    <hr className="border-gray-600 my-1" />
                    <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white">
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {currentView === 'settings' ? (
        <SettingsPage onBack={handleBackToEditor} />
      ) : currentView === 'help' ? (
        <HelpPage onBack={handleBackToEditor} />
      ) : (
        viewMode === 'database' ? (
          <DatabasePanel />
        ) : (
          <div className="flex-1 flex">
            <PanelGroup direction="horizontal" key={viewMode}>
              {viewMode === 'home' ? (
                /* Home Mode: All Four Panels */
                <>
                  {/* Chat Panel */}
                  <Panel defaultSize={25} minSize={20}>
                    <ChatInterface onCodeGenerated={onFileCreate} />
                  </Panel>
                  
                  <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-gray-600" />
                  
                  {/* Files Panel */}
                  <Panel defaultSize={20} minSize={15}>
                    <FileTree 
                      files={files} 
                      activeFile={activeFile}
                      onFileSelect={onFileSelect}
                    />
                  </Panel>
                  
                  <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-gray-600" />
                  
                  {/* Editor Panel */}
                  <Panel defaultSize={35} minSize={30}>
                    <MonacoEditor
                      value={fileContent}
                      language="typescript"
                      onChange={onContentChange}
                      filename={activeFile || ''}
                    />
                  </Panel>
                  
                  <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-gray-600" />
                  
                  {/* Preview Panel */}
                  <Panel defaultSize={20} minSize={15}>
                    <Preview url={previewUrl} />
                  </Panel>
                </>
              ) : viewMode === 'code' ? (
                <>
                  {/* Files Panel */}
                  <Panel defaultSize={30} minSize={20}>
                    <FileTree 
                      files={files} 
                      activeFile={activeFile}
                      onFileSelect={onFileSelect}
                    />
                  </Panel>
                  
                  <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-gray-600" />
                  
                  {/* Editor Panel */}
                  <Panel defaultSize={70} minSize={50}>
                    <MonacoEditor
                      value={fileContent}
                      language="typescript"
                      onChange={onContentChange}
                      filename={activeFile || ''}
                    />
                  </Panel>
                </>
              ) : (
                /* Preview Mode: Only Chat and Preview */
                <>
                  {/* Chat Panel */}
                  <Panel defaultSize={50} minSize={30}>
                    <ChatInterface onCodeGenerated={onFileCreate} />
                  </Panel>
                  
                  <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-gray-600" />
                  
                  {/* Preview Panel */}
                  <Panel defaultSize={50} minSize={30}>
                    <Preview url={previewUrl} />
                  </Panel>
                </>
              )}
            </PanelGroup>
          </div>
        )
      )}
      
      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};