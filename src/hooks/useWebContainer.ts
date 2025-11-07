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

      console.log('Booting WebContainer...');
      const WebContainer = await window.__bootWebContainer();
      const instance = await WebContainer.boot();

      // Full sample app (same as before)
      await instance.mount({
        'package.json': { file: { contents: JSON.stringify({
          name: 'sample-react-app',
          type: 'module',
          dependencies: { react: '^18.3.1', 'react-dom': '^18.3.1' },
          devDependencies: {
            '@types/react': '^18.3.3',
            '@types/react-dom': '^18.3.0',
            '@vitejs/plugin-react': '^4.3.1',
            typescript: '^5.5.3',
            vite: '^5.4.1',
          },
          scripts: { dev: 'vite --port 3111' },
        }, null, 2) }},
        'vite.config.ts': { file: { contents: `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], server: { port: 3111 } });
        `.trim() }},
        'index.html': { file: { contents: `
<!DOCTYPE html>
<html><head><link rel="stylesheet" href="/src/index.css"></head>
<body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body>
</html>
        `.trim() }},
        'src': { directory: {
          'index.css': { file: { contents: `@tailwind base; @tailwind components; @tailwind utilities;` } },
          'main.tsx': { file: { contents: `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
          `.trim() }},
          'App.tsx': { file: { contents: `
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
export default () => (
  <div className="min-h-screen bg-gray-50">
    <Header /><Hero /><Features /><Footer />
  </div>
);
          `.trim() }},
          'components': { directory: {
            'Header.tsx': { file: { contents: `
import { Menu } from 'lucide-react';
export default () => (
  <header className="bg-white shadow">
    <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
      <h1 className="text-2xl font-bold text-blue-600">MyApp</h1>
      <button><Menu size={24} /></button>
    </div>
  </header>
);
            `.trim() }},
            'Hero.tsx': { file: { contents: `
export default () => (
  <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <h2 className="text-5xl font-bold mb-6">Build Amazing Apps</h2>
      <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold">
        Get Started
      </button>
    </div>
  </section>
);
            `.trim() }},
            'Features.tsx': { file: { contents: `
import { Zap, Shield, Rocket } from 'lucide-react';
export default () => (
  <section className="py-20">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <h2 className="text-4xl font-bold mb-12">Powerful Features</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {[{icon: Zap, title: 'Fast'}, {icon: Shield, title: 'Safe'}, {icon: Rocket, title: 'Ready'}].map(f => (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <f.icon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold">{f.title}</h3>
          </div>
        ))}
      </div>
    </div>
  </section>
);
            `.trim() }},
            'Footer.tsx': { file: { contents: `
export default () => (
  <footer className="bg-gray-900 text-white py-12 text-center">
    <p>&copy; 2025 MyApp. All rights reserved.</p>
  </footer>
);
            `.trim() }},
          }}
        }}
      });

      // READ FILES
      const walk = async (path: string): Promise<Record<string, string>> => {
        const files: Record<string, string> = {};
        const entries = await instance.fs.readdir(path, { withFileTypes: true });
        for (const e of entries) {
          const full = path === '/' ? `/${e.name}` : `${path}/${e.name}`;
          if (e.isDirectory()) Object.assign(files, await walk(full));
          else files[full] = await instance.fs.readFile(full, 'utf-8');
        }
        return files;
      };

      const allFiles = await walk('/');
      console.log('FILES LOADED:', Object.keys(allFiles));
      if (mounted) setFiles(allFiles);

      // Install & run
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