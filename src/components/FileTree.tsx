import React, { CSSProperties, useMemo } from 'react';
import { useWebContainerContext } from '../context/WebContainerContext';
import { Folder, FileText, ChevronDown, ChevronRight } from 'lucide-react';

interface FileTreeProps {
  className?: string;
  style?: CSSProperties;
}

interface TreeNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: TreeNode[];
}

const FileTree: React.FC<FileTreeProps> = ({ className, style }) => {
  const { files, setCurrentFile } = useWebContainerContext();

  const tree = useMemo(() => buildTree(Object.keys(files)), [files]);

  return (
    <div className={`overflow-auto ${className}`} style={style}>
      <div className="p-2">
        <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          <Folder size={14} className="mr-1" />
          Explorer
        </div>
        <ul className="space-y-0.5">
          {tree.map((node) => (
            <TreeNodeComponent key={node.path} node={node} setCurrentFile={setCurrentFile} />
          ))}
        </ul>
      </div>
    </div>
  );
};

const TreeNodeComponent: React.FC<{
  node: TreeNode;
  setCurrentFile: (file: string | null) => void;
  depth?: number;
}> = ({ node, setCurrentFile, depth = 0 }) => {
  const [open, setOpen] = React.useState(depth < 2);

  if (!node.isDirectory) {
    return (
      <li
        className="flex items-center cursor-pointer hover:bg-gray-700 px-2 py-1 rounded text-sm"
        style={{ paddingLeft: `${depth * 12 + 20}px` }}
        onClick={() => setCurrentFile(node.path)}
      >
        <FileText size={14} className="mr-2 text-gray-400" />
        <span className="text-gray-300">{node.name}</span>
      </li>
    );
  }

  return (
    <li>
      <div
        className="flex items-center cursor-pointer hover:bg-gray-700 px-2 py-1 rounded text-sm"
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <ChevronDown size={14} className="mr-1 text-gray-500" />
        ) : (
          <ChevronRight size={14} className="mr-1 text-gray-500" />
        )}
        <Folder size={14} className="mr-2 text-yellow-500" />
        <span className="text-gray-300 font-medium">{node.name}</span>
      </div>
      {open && node.children && (
        <ul className="space-y-0.5">
          {node.children.map((child) => (
            <TreeNodeComponent
              key={child.path}
              node={child}
              setCurrentFile={setCurrentFile}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

// Helper to build tree from file paths
function buildTree(filePaths: string[]): TreeNode[] {
  const root: TreeNode[] = [];
  const sortedPaths = [...filePaths].sort();

  for (const path of sortedPaths) {
    const parts = path.split('/').filter((p) => p);
    let currentLevel = root;
    let currentPath = '';

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      currentPath += `/${part}`;
      let node = currentLevel.find((n) => n.name === part);

      const isDirectory = i < parts.length - 1;

      if (!node) {
        node = {
          name: part,
          path: currentPath,
          isDirectory,
          children: isDirectory ? [] : undefined,
        };
        currentLevel.push(node);
      }

      if (isDirectory && node.children) {
        currentLevel = node.children;
      }
    }
  }

  return root;
}

export default FileTree;