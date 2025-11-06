// src/components/MonacoEditor.tsx
import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

// === DISABLE ALL WORKERS (safe in WebContainer) ===
self.MonacoEnvironment = {
  getWorker: () => {
    // Return a dummy worker that does nothing
    const dummy = new Worker(URL.createObjectURL(new Blob([''], { type: 'application/javascript' })));
    return dummy;
  },
};

export default function MonacoEditor() {
  const divRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!divRef.current) return;

    const editor = monaco.editor.create(divRef.current, {
      value: '// WebContainer ready. Type AI prompts below.\n',
      language: 'typescript',
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      wordWrap: 'on',
      // Disable all heavy features that need workers
      folding: false,
      glyphMargin: false,
      lineNumbers: 'on',
      renderLineHighlight: 'none',
      suggestOnTriggerCharacters: false,
      acceptSuggestionOnEnter: 'off',
      quickSuggestions: false,
      parameterHints: { enabled: false },
      formatOnPaste: false,
      formatOnType: false,
    });

    editorRef.current = editor;

    return () => {
      editor.dispose();
    };
  }, []);

  return <div ref={divRef} className="h-full w-full" />;
}