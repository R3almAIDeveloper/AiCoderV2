import { FileNode } from '../types';

export class FileService {
  private files: Map<string, string> = new Map();

  async readFile(path: string): Promise<string> {
    return this.files.get(path) || '';
  }

  async writeFile(path: string, content: string): Promise<void> {
    this.files.set(path, content);
    // In production, sync with WebContainer
  }

  async createFile(path: string, content: string = ''): Promise<void> {
    this.files.set(path, content);
  }

  async deleteFile(path: string): Promise<void> {
    this.files.delete(path);
  }

  async createDirectory(path: string): Promise<void> {
    // Directory creation logic
  }

  getFileTree(): FileNode[] {
    const tree: FileNode[] = [];
    const paths = Array.from(this.files.keys()).sort();

    for (const path of paths) {
      const parts = path.split('/');
      let current = tree;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isFile = i === parts.length - 1;
        
        let node = current.find(n => n.name === part);
        
        if (!node) {
          node = {
            name: part,
            type: isFile ? 'file' : 'directory',
            path: parts.slice(0, i + 1).join('/'),
            children: isFile ? undefined : []
          };
          current.push(node);
        }

        if (!isFile && node.children) {
          current = node.children;
        }
      }
    }

    return tree;
  }
}

export const fileService = new FileService();