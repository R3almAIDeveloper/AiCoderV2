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
      if (!window.__bootWebContainer) return;

      const WebContainer = await window.__bootWebContainer();
      const instance = await WebContainer.boot();

      // FULL SAMPLE APP
      await instance.mount({
        'package.json': { file: { contents: JSON.stringify({
          name: 'aicoder-v2',
          type: 'module',
          dependencies: { react: '^18.3.1', 'react-dom': '^18.3.1', 'lucide-react': '^0.263.1' },
          devDependencies: {
            '@types/react': '^18.3.3',
            '@types/react-dom': '^18.3.0',
            '@vitejs/plugin-react': '^4.3.1',
            typescript: '^5.5.3',
            vite: '^5.4.1',
            tailwindcss: '^3.4.0',
            autoprefixer: '^10.4.20',
            postcss: '^8.4.41'
          },
          scripts: { dev: 'vite --port 3111' }
        }, null, 2) }},
        'vite.config.ts': { file: { contents: `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], server: { port: 3111 } });
        `.trim() }},
        'tailwind.config.js': { file: { contents: `
/** @type {import('tailwindcss').Config} */
export default { content: ['./index.html', './src/**/*.{ts,tsx}'], theme: { extend: {} }, plugins: [] }
        `.trim() }},
        'postcss.config.js': { file: { contents: `export default { plugins: { tailwindcss: {}, autoprefixer: {} } }` } },
        'index.html': { file: { contents: `
<!DOCTYPE html><html><head>
<link rel="stylesheet" href="/src/index.css">
</head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>
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
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
export default () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <Header /><Hero /><Features /><Footer />
  </div>
);
          `.trim() }},
          'components': { directory: {
            'Header.tsx': { file: { contents: `
import { Menu, Sparkles } from 'lucide-react';
export default () => (
  <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Sparkles className="w-8 h-8 text-purple-600" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          AiCoder V2
        </h1>
      </div>
      <button className="p-2 hover:bg-gray-100 rounded-lg"><Menu /></button>
    </div>
  </header>
);
            `.trim() }},
            'Hero.tsx': { file: { contents: `
export default () => (
  <section className="py-32 px-6 text-center">
    <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
      Code with AI, Ship Instantly
    </h2>
    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
      Full React + TypeScript + Tailwind IDE in your browser. Powered by xAI Grok.
    </p>
    <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:scale-105 transition">
      Start Coding Now
    </button>
  </section>
);
            `.trim() }},
            'Features.tsx': { file: { contents: `
import { Zap, Brain, Rocket } from 'lucide-react';
const feats = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Vite + WebContainer' },
  { icon: Brain, title: 'AI Powered', desc: 'xAI Grok edits code live' },
  { icon: Rocket, title: 'Production Ready', desc: 'Tailwind + TypeScript' }
];
export default () => (
  <section className="py-24 px-6 bg-white">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-16">Why Developers Love It</h2>
      <div className="grid md:grid-cols-3 gap-10">
        {feats.map(f => (
          <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
            <f.icon className="w-16 h-16 mx-auto mb-4 text-purple-600" />
            <h3 className="text-2xl font-bold mb-2">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
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
    <p className="text-lg">Built with <span className="text-pink-500">♥</span> by R3almAIDeveloper</p>
    <p className="text-sm text-gray-400 mt-2">WebContainer + xAI + React = Future</p>
  </footer>
);
            `.trim() }}
          }}
        }}
      });

      const readAll = async () => {
        const result: Record<string, string> = {};
        const walk = async (path: string) => {
          const entries = await instance.fs.readdir(path, { withFileTypes: true });
          for (const e of entries) {
            const full = path === '/' ? `/${e.name}` : `${path}/${e.name}`;
            if (e.isDirectory()) await walk(full);
            else result[full] = await instance.fs.readFile(full, 'utf-8');
          }
        };
        await walk('/');
        return result;
      };

      const allFiles = await readAll();
      if (mounted) setFiles(allFiles);

      await instance.spawn('npm', ['install']).exit;
      process = await instance.spawn('npm', ['run', 'dev']);
      instance.on('server-ready', (_: any, url: string) => {
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