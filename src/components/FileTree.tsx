// src/components/FileTree.tsx
import React, { useEffect, useState } from 'react';
import { useWebContainer } from '../hooks/useWebContainer';

export default function FileTree() {
  const { container: wc } = useWebContainer();
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    if (!wc) return;

    const load = async () => {
      try {
        const entries = await wc.fs.readdir('src/components', { withFileTypes: true });
        setFiles(entries.filter(e => e.isFile()).map(e => e.name));
      } catch {}
    };

    load();
    const watcher = wc.fs.watch('src/components');
    watcher.addEventListener('change', load);
    return () => {
      watcher.removeEventListener('change', load);
      watcher.close();
    };
  }, [wc]);

  return (
    <div className="p-3 text-sm font-mono">
      <div className="font-semibold mb-2 text-gray-700">src/components/</div>
      {files.length === 0 ? (
        <div className="text-gray-400 italic">No files</div>
      ) : (
        <div className="space-y-1">
          {files.map(f => (
            <div key={f} className="pl-3 hover:bg-gray-200 rounded px-2 py-1 cursor-pointer text-blue-600">
              {f}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}