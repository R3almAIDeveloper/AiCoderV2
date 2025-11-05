import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { FileNode } from './types';
import { fileService } from './services/fileService';
import { useWebContainer } from './hooks/useWebContainer';

function App() {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  
  const { previewUrl, updateFile, isLoading, error } = useWebContainer();

  useEffect(() => {
    // Initialize with default files
    const initFiles = async () => {
      const defaultFiles = {
        'src/App.jsx': `import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '30px',
        borderRadius: '15px',
        color: 'white',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem' }}>
          🚀 Welcome to R3alm Dev
        </h1>
        <p style={{ margin: '0', opacity: '0.9' }}>
          Your AI-powered development environment is ready!
        </p>
      </div>
      
      <div style={{
        background: '#f8f9fa',
        padding: '25px',
        borderRadius: '10px',
        marginBottom: '25px'
      }}>
        <h2 style={{ color: '#333', marginBottom: '15px' }}>Interactive Counter</h2>
        <div style={{ fontSize: '2rem', marginBottom: '15px' }}>
          Count: <strong style={{ color: '#667eea' }}>{count}</strong>
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            onClick={() => setCount(count - 1)}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              border: 'none',
              borderRadius: '5px',
              background: '#dc3545',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Decrease
          </button>
          <button 
            onClick={() => setCount(0)}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              border: 'none',
              borderRadius: '5px',
              background: '#6c757d',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
          <button 
            onClick={() => setCount(count + 1)}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              border: 'none',
              borderRadius: '5px',
              background: '#28a745',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Increase
          </button>
        </div>
      </div>

      <div style={{
        background: '#e3f2fd',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'left'
      }}>
        <h3 style={{ color: '#1976d2', marginBottom: '15px' }}>🎯 Try These AI Commands:</h3>
        <ul style={{ color: '#333', lineHeight: '1.6' }}>
          <li>Create a Hello World component</li>
          <li>Build a todo list with useState</li>
          <li>Design a contact form with validation</li>
          <li>Create a responsive navigation bar</li>
          <li>Build a weather app component</li>
        </ul>
      </div>
    </div>
  );
}

export default App;`,
        'src/main.jsx': `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));
root.render(<App />);`,
        'package.json': JSON.stringify({
          name: 'r3alm-dev-project',
          version: '1.0.0',
          type: 'module',
          scripts: {
            dev: 'vite --port 3000 --host',
            build: 'vite build',
            preview: 'vite preview --port 3000 --host'
          },
          dependencies: {
            react: '^18.2.0',
            'react-dom': '^18.2.0'
          },
          devDependencies: {
            '@types/react': '^18.2.0',
            '@types/react-dom': '^18.2.0',
            '@vitejs/plugin-react': '^4.0.0',
            vite: '^4.4.0'
          }
        }, null, 2),
        'vite.config.js': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000
  }
});`
      };

      for (const [path, content] of Object.entries(defaultFiles)) {
        await fileService.createFile(path, content);
      }

      updateFileTree();
    };

    initFiles();
  }, []);

  const updateFileTree = () => {
    setFiles(fileService.getFileTree());
  };

  const handleFileSelect = async (path: string) => {
    setActiveFile(path);
    const content = await fileService.readFile(path);
    setFileContent(content);
  };

  const handleContentChange = async (content: string) => {
    setFileContent(content);
    if (activeFile) {
      await fileService.writeFile(activeFile, content);
      await updateFile(activeFile, content);
    }
  };

  const handleFileCreate = async (path: string, content: string) => {
    await fileService.createFile(path, content);
    await updateFile(path, content);
    updateFileTree();
    
    // Auto-select the new file
    setActiveFile(path);
    setFileContent(content);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <span className="text-white font-bold text-xl">R3</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">R3alm Dev</h1>
          <p className="text-gray-400">
            {error ? `Error: ${error}` : 'Initializing development environment...'}
          </p>
          <div className="mt-4 w-64 bg-gray-700 rounded-full h-2 mx-auto">
            <div 
              className={`h-2 rounded-full ${error ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse'}`} 
              style={{ width: error ? '100%' : '70%' }}
            ></div>
          </div>
          {error && (
            <p className="text-red-400 text-sm mt-2">
              Please refresh the page to try again
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <Layout
      files={files}
      activeFile={activeFile}
      onFileSelect={handleFileSelect}
      onFileCreate={handleFileCreate}
      fileContent={fileContent}
      onContentChange={handleContentChange}
      previewUrl={previewUrl}
    />
  );
}

export default App;