// src/components/Preview.tsx
import React from 'react';
import { useWebContainer } from '../hooks/useWebContainer';

export default function Preview() {
  const { url, ready } = useWebContainer();

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 text-gray-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p>Booting WebContainer...</p>
          <p className="text-sm mt-1">First load ~30s</p>
        </div>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 text-gray-600">
        <p>Waiting for server...</p>
      </div>
    );
  }

  return (
    <iframe
      src={url}
      title="Preview"
      className="w-full h-full border-0"
      sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
      loading="lazy"
    />
  );
}