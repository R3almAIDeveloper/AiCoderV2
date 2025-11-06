// src/components/FileTree.tsx
import React, { useEffect, useState } from 'react';
import { useWebContainer } from '../hooks/useWebContainer';

export default function FileTree() {
  const { container: wc } = useWebContainer();
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    if (!wc) return;

    const loadFiles = async () => {
      try {
        const entries = await wc.fs.readdir('src/components', { withFileTypes: true });
        const fileNames = entries
          .filter(e => e.isFile())
          .map(e => `src/components/${e.name}`);
        setFiles(fileNames);
      } catch (e) {
        console.warn('FileTree: could not read components', e);
      }
    };

    loadFiles();

    // Watch for new files
    const watcher = wc.fs.watch('src/components', { recursive: false });
    const handleChange = () => loadFiles();

    watcher.addEventListener('change', handleChange);

    return () => {
      watcher.removeEventListener('change', handleChange);
      watcher.close();
    };
  }, [wc]);

  return (
    <div className="p-3 text-sm font-mono">
      <div className="font-semibold text-gray-700 mb-2">src/components/</div>
      {files.length === 0 ? (
        <div className="text-gray-400 italic">No components yet</div>
      ) : (
        <div className="space-y-1">
          {files.map(path => {
            const name = path.split('/').pop()!;
            return (
              <div
                key={path}
                className="pl-3 hover:bg-gray-200 cursor-pointer rounded px-2 py-1 text-blue-600"
              >
                {name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}