// src/hooks/useWebContainer.ts
import { useEffect, useRef, useState } from 'react';
import { WebContainer } from '@webcontainer/api';
import { useFileTree } from './useFileTree';

let webContainerInstance: WebContainer | null = null;

export function useWebContainer() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isReady, setIsReady] = useState(false);
  const { root } = useFileTree();

  const startContainer = async () => {
    if (webContainerInstance) {
      webContainerInstance.teardown();
    }

    try {
      webContainerInstance = await WebContainer.boot();
      setIsReady(true);

      // Mount files
      const mountFiles = (node: any, path = '') => {
        if (node.type === 'file') {
          webContainerInstance?.fs.writeFile(path + node.name, node.content || '');
        } else if (node.type === 'directory' && node.children) {
          node.children.forEach((child: any) => {
            mountFiles(child, path + node.name + '/');
          });
        }
      };
      mountFiles(root, '/');

      // Start dev server
      await webContainerInstance.spawn('npm', ['install']);
      await webContainerInstance.spawn('npm', ['run', 'dev', '--', '--port', '3000']);

      webContainerInstance.on('server-ready', (port, url) => {
        if (iframeRef.current) {
          iframeRef.current.src = url;
        }
      });
    } catch (err) {
      console.error('WebContainer failed:', err);
      setIsReady(false);
    }
  };

  useEffect(() => {
    if (isReady && iframeRef.current) {
      iframeRef.current.src = '/__webcontainer__/index.html';
    }
  }, [isReady]);

  return { iframeRef, startContainer, isReady };
}