export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileNode[];
  content?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Project {
  id: string;
  name: string;
  files: FileNode[];
  activeFile?: string;
}

export interface AIPrompt {
  prompt: string;
  context?: {
    currentFile?: string;
    selectedCode?: string;
    projectStructure?: FileNode[];
  };
}

export interface GeneratedCode {
  files: Record<string, string>;
  instructions?: string;
}