// src/components/Preview.tsx
import React, { useEffect, useState } from "react";

export const Preview: React.FC = () => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data.type === "serverReady") setUrl(e.data.url);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  if (!url) return <div className="h-full flex items-center justify-center text-gray-500">Starting server…</div>;

  return (
    <iframe
      src={url}
      className="w-full h-full border-0"
      title="Preview"
      sandbox="allow-scripts allow-same-origin allow-modals allow-forms"
    />
  );
};