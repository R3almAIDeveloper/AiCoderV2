// src/components/FileTree.tsx
import React from "react";
import { FileNode } from "../types";
import { ChevronRight, ChevronDown, File, Folder } from "lucide-react";

interface Props {
  node: FileNode;
  onFileClick: (path: string) => void;
  depth: number;
}

export const FileTree: React.FC<Props> = ({ node, onFileClick, depth }) => {
  const [open, setOpen] = React.useState(true);
  const isDir = node.type === "directory";
  const Icon = isDir ? (open ? ChevronDown : ChevronRight) : File;

  return (
    <div style={{ paddingLeft: `${depth * 12}px` }}>
      {isDir ? (
        <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 rounded px-1 py-0.5" onClick={() => setOpen(!open)}>
          <Icon className="w-4 h-4" />
          <Folder className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          <span className="text-sm">{node.name}</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 rounded px-1 py-0.5" onClick={() => onFileClick(node.path)}>
          <File className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm">{node.name}</span>
        </div>
      )}
      {isDir && open && node.children?.map((c, i) => <FileTree key={i} node={c} onFileClick={onFileClick} depth={depth + 1} />)}
    </div>
  );
};