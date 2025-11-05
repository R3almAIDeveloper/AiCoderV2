// src/components/FileTree.tsx
import React from 'react';
import { ChevronDown, ChevronRight, File, Folder } from 'lucide-react';
import { useFileTree } from '../hooks/useFileTree';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  open?: boolean;
}

const FileTreeNode: React.FC<{ node: FileNode; level: number }> = ({ node, level }) => {
  const { toggleFolder, selectFile, selectedFilePath } = useFileTree();

  const isSelected = selectedFilePath === node.path;
  const isOpen = node.open;

  if (node.type === 'directory') {
    return (
      <div>
        <div
          onClick={() => toggleFolder(node.path)}
          className="flex items-center gap-1 px-2 py-1 hover:bg-gray-800 cursor-pointer select-none"
          style={{ paddingLeft: `${level * 16}px` }}
        >
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <Folder className="w-4 h-4 text-yellow-500" />
          <span className="text-sm">{node.name}</span>
        </div>
        {isOpen &&
          node.children?.map((child) => (
            <FileTreeNode key={child.path} node={child} level={level + 1} />
          ))}
      </div>
    );
  }

  return (
    <div
      onClick={() => selectFile(node.path)}
      className={`flex items-center gap-1 px-2 py-1 hover:bg-gray-800 cursor-pointer select-none ${
        isSelected ? 'bg-blue-900' : ''
      }`}
      style={{ paddingLeft: `${level * 16}px` }}
    >
      <File className="w-4 h-4 text-gray-400" />
      <span className="text-sm">{node.name}</span>
    </div>
  );
};

const FileTree: React.FC = () => {
  const { root } = useFileTree();

  return (
    <div className="h-full bg-gray-900 text-gray-100 overflow-y-auto">
      <div className="p-2 font-semibold text-xs uppercase text-gray-500 border-b border-gray-800">
        Explorer
      </div>
      <FileTreeNode node={root} level={0} />
    </div>
  );
};

export default FileTree;