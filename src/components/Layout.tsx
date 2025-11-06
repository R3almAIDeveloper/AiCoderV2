// src/components/Layout.tsx
import React from 'react';
import ChatInterface from './ChatInterface';
import FileTree from './FileTree';
import MonacoEditor from './MonacoEditor';
import Preview from './Preview';

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 border-r bg-gray-50">
          <FileTree />
        </div>
        <div className="flex-1 flex">
          <div className="w-1/2 border-r">
            <MonacoEditor />
          </div>
          <div className="w-1/2 bg-white">
            <Preview />
          </div>
        </div>
      </div>
      <div className="h-64 border-t bg-gray-100">
        <ChatInterface />
      </div>
    </div>
  );
}