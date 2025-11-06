// src/hooks/useWebContainer.ts
import { WebContainer } from '@webcontainer/api';
import { useEffect, useState } from 'react';

let _instance: WebContainer | null = null;
let _bootPromise: Promise<WebContainer> | null = null;

const getWebContainer = async (): Promise<WebContainer> => {
  if (_instance) return _instance;
  if (_bootPromise) return _bootPromise;

  _bootPromise = WebContainer.boot();
  const wc = await _bootPromise;
  _instance = wc;

  console.log('[WebContainer] Booting…');

  /* ---------- MOUNT INITIAL PROJECT ---------- */
  await wc.mount({
    'package.json': { file: { contents: JSON.stringify({ name: 'aicoderv2', private: true, type: 'module', scripts: { dev: 'vite --host 0.0.0.0 --port 3000' }, dependencies: { react: '^18.3.1', 'react-dom': '^18.3.1', '@vitejs/plugin-react': '^4.3.2' }, devDependencies: { vite: '^5.4.8', typescript: '^5.5.4' } }, null, 2) } },
    'vite.config.ts': { file: { contents: `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nexport default defineConfig({ plugins: [react()], server: { host: '0.0.0.0', port: 3000, strictPort: true } });` } },
    'tsconfig.json': { file: { contents: JSON.stringify({ compilerOptions: { target: 'ES2022', module: 'ESNext', moduleResolution: 'bundler', jsx: 'react-jsx', strict: true, esModuleInterop: true, skipLibCheck: true } }, null, 2) } },
    'index.html': { file: { contents: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>AiCoderV2</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>` } },
    src: {
      directory: {
        'main.tsx': { file: { contents: `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\nReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);` } },
        'App.tsx': { file: { contents: `import React from 'react';\nimport Layout from './components/Layout';\nexport default function App() { return <Layout><div className="p-8 text-center">AiCoderV2 Ready!</div></Layout>; }` } },
        components: { directory: { 'Layout.tsx': { file: { contents: `import React, { ReactNode } from 'react';\nexport default function Layout({ children }: { children: ReactNode }) { return <div className="min-h-screen">{children}</div>; }` } } } },
      },
    },
  });

  console.log('[WebContainer] npm install…');
  const install = await wc.spawn('npm', ['install']);
  if ((await install.exit) !== 0) throw new Error('npm install failed');

  console.log('[WebContainer] Starting Vite…');
  const dev = await wc.spawn('npm', ['run', 'dev']);

  // ---- SAFE LOGGING (no double-reader) ----
  const decoder = new TextDecoder();
  let buffer = '';

  const logChunk = (chunk: Uint8Array | ArrayBuffer) => {
    if (chunk instanceof ArrayBuffer) chunk = new Uint8Array(chunk);
    if (!(chunk instanceof Uint8Array)) return;
    buffer += decoder.decode(chunk, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    lines.forEach(l => console.log('[Vite]', l));
  };

  // Use **only one** of the two approaches
  if (typeof WritableStream !== 'undefined') {
    dev.output.pipeTo(
      new WritableStream({ write: logChunk })
    ).catch(() => {});   // ignore if pipe fails
  } else {
    // fallback manual reader
    const reader = dev.output.getReader();
    (async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          logChunk(value);
        }
      } catch {}
    })();
  }

  wc.on('server-ready', (port, url) => {
    console.log(`[WebContainer] Server ready → ${url}`);
    window.postMessage({ type: 'serverReady', url, port }, '*');
  });

  return wc;
};

/* ---------- REACT HOOK ---------- */
export function useWebContainer() {
  const [container, setContainer] = useState<WebContainer | null>(null);
  const [ready, setReady] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getWebContainer()
      .then(wc => {
        if (!mounted) return;
        setContainer(wc);
        setReady(true);
      })
      .catch(e => console.error('[WebContainer] boot error', e));
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data.type === 'serverReady' && e.data.url) setUrl(e.data.url);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return { container, ready, url };
}