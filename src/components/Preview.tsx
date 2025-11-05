import React, { useState } from 'react';
import { Globe, RefreshCw, ExternalLink, Smartphone, Monitor } from 'lucide-react';

interface PreviewProps {
  url: string;
}

export const Preview: React.FC<PreviewProps> = ({ url }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="h-full bg-gray-800">
      {/* Header */}
      <div className="border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-gray-400" />
            <h2 className="text-sm font-semibold text-white">Preview</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMobile(!isMobile)}
              className={`p-1 rounded ${isMobile ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              title="Mobile view"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMobile(false)}
              className={`p-1 rounded ${!isMobile ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              title="Desktop view"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={handleRefresh}
              className="text-gray-400 hover:text-white p-1"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            {url && (
              <button
                onClick={() => window.open(url, '_blank')}
                className="text-gray-400 hover:text-white p-1"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="h-full bg-white">
        {url ? (
          <div className={`h-full ${isMobile ? 'max-w-sm mx-auto' : ''}`}>
            <iframe
              src={url}
              className="w-full h-full border-0"
              title="Preview"
              key={isRefreshing ? Date.now() : 'preview'}
            />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 bg-gray-100">
            <div className="text-center">
              <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Preview will appear here</p>
              <p className="text-sm mt-2">Generate some code to see it live!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};