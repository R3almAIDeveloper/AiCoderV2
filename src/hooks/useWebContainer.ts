// src/hooks/useWebContainer.ts
import { useState, useEffect } from 'react';

export const useWebContainer = () => {
  const [wc, setWc] = useState<any>(null);
  const [files, setFiles] = useState<Record<string, string>>({});
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let process: any = null;

    const boot = async () => {
      if (!window.__bootWebContainer) {
        console.error('WebContainer boot script not loaded');
        return;
      }

      console.log('Booting WebContainer from jsDelivr...');
      const WebContainer = await window.__bootWebContainer();

      const instance = await WebContainer.boot();
      console.log('WebContainer booted!');

      // Mount minimal project
      await instance.mount({
        'package.json': {
          file: { contents: JSON.stringify({
            name: 'hello',
            type: 'module',
            scripts: { dev: 'vite --port 3111' },
            dependencies: { react: '^18.3.1', 'react-dom': '^18.3.1' },
            devDependencies: { vite: '^5.4.1', '@vitejs/plugin-react': '^4.3.1' }
          }, null, 2)}
        },
        'vite.config.js': {
          file: { contents: `import { defineConfig } from 'vite'; import react from '@vitejs/plugin-react'; export default defineConfig({ plugins: [react()], server: { port: 3111 } });` }
        },
        'index.html': {
          file: { contents: `<!DOCTYPE html><html><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>` }
        },
        'src': {
          directory: {
            'main.tsx': {
              file: { contents: `import React from 'react'; import ReactDOM from 'react-dom/client'; ReactDOM.createRoot(document.getElementById('root')!).render(<h1 className="text-4xl text-green-600 p-20">WebContainer is WORKING!</h1>);` }
            }
          }
        }
      });

      // READ FILES
      const readAll = async () => {
        const files: Record<string, string> = {};
        const walk = async (path: string) => {
          const entries = await instance.fs.readdir(path, { withFileTypes: true });
          for (const e of entries) {
            const fullPath = path === '/' ? `/${e.name}` : `${path}/${e.name}`;
            if (e.isDirectory()) await walk(fullPath);
            else files[fullPath] = await instance.fs.readFile(fullPath, 'utf-8');
          }
        };
        await walk('/');
        return files;
      };

      const allFiles = await readAll();
      console.log('FILES:', Object.keys(allFiles));
      if (mounted) setFiles(allFiles);

      // npm install + dev
      const install = await instance.spawn('npm', ['install']);
      await install.exit;

      process = await instance.spawn('npm', ['run', 'dev']);

      instance.on('server-ready', (_: any, url: string) => {
        console.log('PREVIEW URL:', url);
        if (mounted) setUrl(url);
      });

      if (mounted) setWc(instance);
    };

    boot();

    return () => {
      mounted = false;
      process?.kill();
    };
  }, []);

  return { wc, files, url };
};