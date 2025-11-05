import { useEffect, useState } from 'react';
import { WebContainer } from '@webcontainer/api';

// Module-level variables to ensure singleton WebContainer instance
let webContainerInstance: WebContainer | null = null;
let isBooting = false;

export const useWebContainer = () => {
  const [webContainer, setWebContainer] = useState<WebContainer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const initWebContainer = async () => {
      try {
        // If we already have an instance, use it
        if (webContainerInstance) {
          setWebContainer(webContainerInstance);
          setIsLoading(false);
          return;
        }

        // If boot is already in progress, wait for it
        if (isBooting) {
          return;
        }

        isBooting = true;
        setIsLoading(true);
        setError('');
        
        // Boot WebContainer
        const container = await WebContainer.boot();
        webContainerInstance = container;
        setWebContainer(container);
        
        // Define the file structure to mount
        const files = {
          'package.json': {
            file: {
              contents: JSON.stringify({
                name: 'r3alm-dev-project',
                version: '1.0.0',
                type: 'module',
                scripts: {
                  dev: 'vite --port 3000 --host',
                  build: 'vite build',
                  preview: 'vite preview --port 3000 --host'
                },
                dependencies: {
                  'react': '^18.2.0',
                  'react-dom': '^18.2.0'
                },
                devDependencies: {
                  '@types/react': '^18.2.0',
                  '@types/react-dom': '^18.2.0',
                  '@vitejs/plugin-react': '^4.0.0',
                  'vite': '^4.4.0'
                }
              }, null, 2)
            }
          },
          'vite.config.js': {
            file: {
              contents: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000
  }
});`
            }
          },
          'index.html': {
            file: {
              contents: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>R3alm Dev Project</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>`
            }
          },
          'src': {
            directory: {
              'main.jsx': {
                file: {
                  contents: `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));
root.render(<App />);`
                }
              },
              'App.jsx': {
                file: {
                  contents: `import React, { useState } from 'react';

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

export default App;`
                }
              }
            }
          }
        };

        // Mount the file system
        await container.mount(files);
        
        // Install dependencies
        const installProcess = await container.spawn('npm', ['install']);
        const installExitCode = await installProcess.exit;
        
        if (installExitCode !== 0) {
          throw new Error('Failed to install dependencies');
        }

        // Start the development server
        const devProcess = await container.spawn('npm', ['run', 'dev']);
        
        // Listen for server ready event
        container.on('server-ready', (port, url) => {
          setPreviewUrl(url);
          setIsLoading(false);
        });

        // Handle process output for debugging
        devProcess.output.pipeTo(new WritableStream({
          write(data) {
            console.log('Dev server output:', data);
          }
        }));

      } catch (error) {
        console.error('Failed to initialize WebContainer:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
        setIsLoading(false);
      } finally {
        isBooting = false;
      }
    };

    initWebContainer();
  }, []);

  const updateFile = async (path: string, content: string) => {
    if (!webContainer) {
      console.warn('WebContainer not initialized');
      return;
    }

    try {
      // Extract directory path and ensure it exists
      const directoryPath = path.substring(0, path.lastIndexOf('/'));
      if (directoryPath) {
        await webContainer.fs.mkdir(directoryPath, { recursive: true });
      }
      
      await webContainer.fs.writeFile(path, content);
    } catch (error) {
      console.error('Failed to update file:', error);
    }
  };

  const runCommand = async (command: string, args: string[] = []) => {
    if (!webContainer) {
      console.warn('WebContainer not initialized');
      return null;
    }

    try {
      const process = await webContainer.spawn(command, args);
      return process;
    } catch (error) {
      console.error('Failed to run command:', error);
      return null;
    }
  };

  return {
    webContainer,
    isLoading,
    previewUrl,
    error,
    updateFile,
    runCommand
  };
};