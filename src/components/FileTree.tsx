import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  File, 
  Folder, 
  FolderOpen,
  Plus,
  FileText
} from 'lucide-react';
import { FileNode } from '../types';
import clsx from 'clsx';

interface FileTreeProps {
  files: FileNode[];
  activeFile: string | null;
  onFileSelect: (path: string) => void;
}

interface TreeNodeProps {
  node: FileNode;
  level: number;
  activeFile: string | null;
  onFileSelect: (path: string) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level, activeFile, onFileSelect }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const isActive = activeFile === node.path;
  const isDirectory = node.type === 'directory';

  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'tsx':
      case 'jsx':
        return '⚛️';
      case 'ts':
      case 'js':
        return '📜';
      case 'css':
        return '🎨';
      case 'html':
        return '🌐';
      case 'json':
        return '📋';
      default:
        return '📄';
    }
  };

  return (
    <div>
      <div
        className={clsx(
          'flex items-center px-2 py-1 hover:bg-gray-700 cursor-pointer text-sm',
          isActive && 'bg-blue-600 text-white',
          !isActive && 'text-gray-300'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => {
          if (isDirectory) {
            setIsExpanded(!isExpanded);
          } else {
            onFileSelect(node.path);
          }
        }}
      >
        {isDirectory ? (
          <>
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 mr-1" />
            ) : (
              <ChevronRight className="w-3 h-3 mr-1" />
            )}
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 mr-2 text-blue-400" />
            ) : (
              <Folder className="w-4 h-4 mr-2 text-blue-400" />
            )}
            <span>{node.name}</span>
          </>
        ) : (
          <>
            <span className="w-4 mr-1" />
            <span className="mr-2 text-xs">{getFileIcon(node.name)}</span>
            <span>{node.name}</span>
          </>
        )}
      </div>
      
      {isDirectory && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              level={level + 1}
              activeFile={activeFile}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileTree: React.FC<FileTreeProps> = ({ files, activeFile, onFileSelect }) => {
  return (
    <div className="h-full bg-gray-800">
      {/* Header */}
      <div className="border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-gray-400" />
            <h2 className="text-sm font-semibold text-white">Files</h2>
          </div>
          <button className="text-gray-400 hover:text-white">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* File Tree */}
      <div className="overflow-y-auto">
        {files.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No files yet. Start by asking the AI to generate some code!
          </div>
        ) : (
          files.map((file) => (
            <TreeNode
              key={file.path}
              node={file}
              level={0}
              activeFile={activeFile}
              onFileSelect={onFileSelect}
            />
          ))
        )}
      </div>
    </div>
  );
};