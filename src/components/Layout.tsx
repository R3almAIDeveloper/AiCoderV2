// src/components/Layout.tsx
import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { ChatInterface } from './ChatInterface';
import FileTree from './FileTree';
import MonacoEditor from './MonacoEditor';
import Preview from './Preview';

const Layout: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-950 text-gray-100">
      {/* Optional top bar (you can remove if you don’t need it) */}
      <header className="border-b border-gray-800 px-4 py-2 flex items-center justify-between">
        <h1 className="text-xl font-bold">AiCoderV2</h1>
        <span className="text-xs text-gray-500">xAI powered</span>
      </header>

      {/* Main split-pane layout */}
      <PanelGroup direction="horizontal" className="flex-1">
        {/* ---- Left: Chat ---- */}
        <Panel defaultSize={25} minSize={20}>
          <ChatInterface />
        </Panel>

        <PanelResizeHandle className="w-1 bg-gray-800 hover:bg-blue-600 transition-colors" />

        {/* ---- Center-Left: File Tree ---- */}
        <Panel defaultSize={20} minSize={15}>
          <FileTree />
        </Panel>

        <PanelResizeHandle className="w-1 bg-gray-800 hover:bg-blue-600 transition-colors" />

        {/* ---- Center-Right: Editor ---- */}
        <Panel defaultSize={35} minSize={25}>
          <MonacoEditor />
        </Panel>

        <PanelResizeHandle className="w-1 bg-gray-800 hover:bg-blue-600 transition-colors" />

        {/* ---- Right: Preview ---- */}
        <Panel defaultSize={20} minSize={15}>
          <Preview />
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default Layout;