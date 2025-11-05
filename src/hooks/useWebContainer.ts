// src/hooks/useWebContainer.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import { WebContainer } from '@webcontainer/api';
import { useFileTree } from './useFileTree';

let webContainerInstance: WebContainer | null = null;

export function useWebContainer() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isReady, setIsReady] = useState(false);
  const { root, getFileContent } = useFileTree();

  // === 1. Boot WebContainer (once) ===
  const bootContainer = useCallback(async () => {
    if (webContainerInstance) return;

    try {
      webContainerInstance = await WebContainer.boot();
      setIsReady(true);

      // Install deps
      const installProcess = await webContainerInstance.spawn('npm', ['install']);
      await installProcess.output;

      // Start dev server
      const devProcess = await webContainerInstance.spawn('npm', ['run', 'dev', '--', '--port', '3000']);
      devProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            console.log('[WebContainer]', data);
          },
        })
      );

      // Wait for server to be ready
      webContainerInstance.on('server-ready', (port, url) => {
        if (iframeRef.current) {
          iframeRef.current.src = url;
        }
      });
    } catch (err) {
      console.error('WebContainer boot failed:', err);
      setIsReady(false);
    }
  }, []);

  // === 2. Sync file tree → WebContainer FS ===
  const syncFileTree = useCallback(async () => {
    if (!webContainerInstance || !isReady) return;

    const syncNode = async (node: any, path: string) => {
      const fullPath = path + node.name;

      if (node.type === 'file') {
        const content = getFileContent(fullPath) || '';
        try {
          await webContainerInstance.fs.writeFile(fullPath, content);
        } catch {
          // File may not exist yet — ignore
        }
      } else if (node.type === 'directory' && node.children) {
        try {
          await webContainerInstance.fs.mkdir(fullPath, { recursive: true });
        } catch {
          // Already exists
        }
        for (const child of node.children) {
          await syncNode(child, fullPath + '/');
        }
      }
    };

    await syncNode(root, '/');
  }, [root, getFileContent, isReady]);

  // === 3. Auto-sync on file changes ===
  useEffect(() => {
    if (!isReady) return;
    syncFileTree();
  }, [root, isReady, syncFileTree]);

  // === 4. Initial boot ===
  useEffect(() => {
    bootContainer();
  }, [bootContainer]);

  // === 5. Restart button handler ===
  const restart = async () => {
    if (webContainerInstance) {
      webContainerInstance.teardown();
      webContainerInstance = null;
    }
    setIsReady(false);
    await bootContainer();
  };

  return { iframeRef, isReady, restart };
}