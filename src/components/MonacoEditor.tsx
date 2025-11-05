import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Code, Settings } from 'lucide-react';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  filename: string;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  onChange,
  language,
  filename
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Configure TypeScript compiler options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types']
    });

    // Add React types
    const reactTypes = `
      declare module 'react' {
        export = React;
        export as namespace React;
        namespace React {
          interface Component<P = {}, S = {}> {}
          class Component<P, S> {}
          interface FunctionComponent<P = {}> {
            (props: PropsWithChildren<P>, context?: any): ReactElement | null;
          }
          type FC<P = {}> = FunctionComponent<P>;
          interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {}
          interface PropsWithChildren<P> {
            children?: ReactNode;
          }
          type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;
          type ReactChild = ReactElement | ReactText;
          type ReactText = string | number;
          type ReactFragment = {} | ReactNodeArray;
          interface ReactNodeArray extends Array<ReactNode> {}
          type ReactPortal = any;
          type JSXElementConstructor<P> = any;
        }
      }
    `;

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      reactTypes,
      'file:///node_modules/@types/react/index.d.ts'
    );

    // Set up auto-completion
    monaco.languages.registerCompletionItemProvider('typescript', {
      provideCompletionItems: () => ({
        suggestions: [
          {
            label: 'useState',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'useState(${1:initialValue})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'React useState hook'
          },
          {
            label: 'useEffect',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'useEffect(() => {\n\t${1:// effect}\n}, [${2:dependencies}])',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'React useEffect hook'
          },
          {
            label: 'rfc',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              'interface ${1:Component}Props {',
              '\t${2:// props}',
              '}',
              '',
              'export const ${1:Component}: React.FC<${1:Component}Props> = ({ ${3:props} }) => {',
              '\treturn (',
              '\t\t<div>',
              '\t\t\t${4:// component content}',
              '\t\t</div>',
              '\t);',
              '};'
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'React Functional Component'
          }
        ]
      })
    });
  };

  return (
    <div className="h-full bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-gray-400" />
            <h2 className="text-sm font-semibold text-white">Editor</h2>
            {filename && (
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                {filename.split('/').pop()}
              </span>
            )}
          </div>
          <button className="text-gray-400 hover:text-white">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="h-full">
        {filename ? (
          <Editor
            height="calc(100% - 60px)"
            language={language}
            value={value}
            onChange={(val) => onChange(val || '')}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              insertSpaces: true,
              wordWrap: 'on',
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnEnter: 'on',
              tabCompletion: 'on',
              parameterHints: {
                enabled: true
              }
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a file to start editing</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};