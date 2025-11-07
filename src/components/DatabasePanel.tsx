import React, { CSSProperties, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

interface DatabasePanelProps {
  className?: string;
  style?: CSSProperties;
}

const DatabasePanel: React.FC<DatabasePanelProps> = ({ className, style }) => {
  const [status, setStatus] = useState('Connecting to Supabase...');

  useEffect(() => {
    (async () => {
      try {
        // Test connection with a head query (assumes a table exists; adjust as needed)
        const { error } = await supabase.from('your_table_name').select('*', { head: true, count: 'exact' });
        if (error) throw error;
        setStatus('Connected to Supabase successfully');
      } catch (err: any) {
        setStatus(`Connection failed: ${err.message || 'Unknown error'}`);
      }
    })();
  }, []);

  return (
    <div className={`p-4 ${className}`} style={style}>
      <h2 className="text-xl font-bold mb-4">Database Management Panel</h2>
      <p className="mb-4">Status: {status}</p>
      {/* Future expansions: Add auth forms, table viewers, query runners, etc. */}
      <p className="text-gray-400">Stub - Integrate full Supabase management tools here (e.g., auth, queries, storage).</p>
    </div>
  );
};

export default DatabasePanel;