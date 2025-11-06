// src/components/MonacoEditor.tsx
import * as monaco from "monaco-editor";
import { useEffect, useRef } from "react";

interface Props {
  path: string;
  value: string;
  onChange: (value: string) => void;
}

export const MonacoEditor: React.FC<Props> = ({ path, value, onChange }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!divRef.current) return;
    editorRef.current = monaco.editor.create(divRef.current, {
      value,
      language: path.endsWith(".tsx") ? "typescript" : path.endsWith(".ts") ? "typescript" : "javascript",
      theme: "vs-dark",
      automaticLayout: true,
      minimap: { enabled: false },
    });
    editorRef.current.onDidChangeModelContent(() => {
      onChange(editorRef.current?.getValue() ?? "");
    });
    return () => editorRef.current?.dispose();
  }, [path]);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.getValue()) {
      editorRef.current.setValue(value);
    }
  }, [value]);

  return <div ref={divRef} className="h-full w-full" />;
};