// src/components/MonacoEditor.tsx
import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { useWebContainer } from '../hooks/useWebContainer';

// ---- MONACO WORKER SETUP (must be global) ----
declare global {
  interface Window {
    MonacoEnvironment?: {
      getWorkerUrl?: (moduleId: string, label: string) => string;
    };
  }
}

// Run once at module load
if (typeof window !== 'undefined' && !window.MonacoEnvironment) {
  window.MonacoEnvironment = {
    getWorkerUrl: (moduleId, label) => {
      // These blobs are created by Vite – they are served from /node_modules/monaco-editor/esm/…
      if (label === 'json') return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
        import * as worker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
        self.MonacoEnvironment = { globalAPI: true };
        export default worker;
      `)}`;
      if (label === 'css') return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
        import * as worker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
        export default worker;
      `)}`;
      if (label === 'html') return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
        import * as worker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
        export default worker;
      `)}`;
      if (label === 'typescript' || label === 'javascript')
        return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
          import * as worker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
          export default worker;
        `)}`;
      return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
        import * as worker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
        export default worker;
      `)}`;
    },
  };
}

// ---- EDITOR COMPONENT ----
export default function MonacoEditor() {
  const divRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const { container: wc } = useWebContainer();

  useEffect(() => {
    if (!divRef.current || !wc) return;

    const editor = monaco.editor.create(divRef.current, {
      value: '// Select a file in the tree\n',
      language: 'typescript',
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: false },
    });
    editorRef.current = editor;

    return () => editor.dispose();
  }, [wc]);

  return <div ref={divRef} className="h-full w-full" />;
}