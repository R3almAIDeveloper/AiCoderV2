// src/components/DatabasePanel.tsx
import React, { CSSProperties } from 'react';

interface DatabasePanelProps {
  className?: string;
  style?: CSSProperties;
}

const DatabasePanel: React.FC<DatabasePanelProps> = ({ className, style }) => {
  return (
    <div className={`p-4 ${className}`} style={style}>
      Database Management Panel (Stub - Integrate Supabase management tools here)
    </div>
  );
};

export default DatabasePanel;