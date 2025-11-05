// src/components/MonacoEditor.tsx
import React, { useEffect, useRef } from 'react';
import { useFileTree } from '../hooks/useFileTree';
import * as monaco from 'monaco-editor';

const MonacoEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const { selectedFilePath, getFileContent, updateFile } = useFileTree();

  useEffect(() => {
    if (!editorRef.current || !selectedFilePath) return;

    const content = getFileContent(selectedFilePath) || '';
    const language = selectedFilePath.endsWith('.tsx') ? 'typescript' : 'javascript';

    if (!monacoRef.current) {
      // Create editor
      monacoRef.current = monaco.editor.create(editorRef.current, {
        value: content,
        language,
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
      });

      monacoRef.current.onDidChangeModelContent(() => {
        const value = monacoRef.current?.getValue();
        if (value !== undefined && selectedFilePath) {
          updateFile(selectedFilePath, value);
        }
      });
    } else {
      // Update existing editor
      const model = monacoRef.current.getModel();
      if (model) {
        if (model.getValue() !== content) {
          model.setValue(content);
        }
        const currentLang = monaco.editor.getModelLanguage(model);
        if (currentLang !== language) {
          monaco.editor.setModelLanguage(model, language);
        }
      }
    }
  }, [selectedFilePath, getFileContent, updateFile]);

  useEffect(() => {
    return () => {
      monacoRef.current?.dispose();
    };
  }, []);

  return (
    <div className="h-full bg-gray-950">
      {selectedFilePath ? (
        <div ref={editorRef} className="h-full" />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          Select a file to edit
        </div>
      )}
    </div>
  );
};

export default MonacoEditor;