// src/services/fileService.ts
import { WebContainer } from '@webcontainer/api';
import { aiService } from './aiService';

export class FileService {
  private wc: WebContainer | null = null;
  private files = new Map<string, string>(); // path → content

  constructor(wc: WebContainer) {
    this.wc = wc;
  }

  /** Write a file and keep it in memory */
  async write(path: string, content: string) {
    this.files.set(path, content);

    // Create parent dirs if needed
    const dirs = path.split('/').slice(0, -1);
    let current = '';
    for (const dir of dirs) {
      current += (current ? '/' : '') + dir;
      await this.wc?.fs.mkdir(current, { recursive: true });
    }

    await this.wc?.fs.writeFile(path, content);
  }

  /** Apply AI-generated component */
  async applyAIResponse(resp: { code: string; filename: string }) {
    const path = `src/components/${resp.filename}`;
    await this.write(path, resp.code);

    // Auto-import into App.tsx
    await this.updateAppImport(resp.filename.replace(/\.tsx$/, ''));
  }

  /** Add import + render the new component in App */
  private async updateAppImport(componentName: string) {
    const appPath = 'src/App.tsx';
    let appCode = this.files.get(appPath) ?? (await this.wc?.fs.readFile(appPath, 'utf-8')) ?? '';

    const importLine = `import ${componentName} from './components/${componentName}';\n`;
    if (!appCode.includes(importLine.trim())) {
      const lastImport = appCode.match(/import .*?;\n?/g)?.pop() ?? '';
      appCode = appCode.replace(lastImport, lastCode + importLine);
    }

    const renderTag = `<${componentName} />`;
    if (!appCode.includes(renderTag)) {
      appCode = appCode.replace(
        /return\s*\(/,
        `return (\n  <>\n    ${renderTag}\n    `
      ).replace(/<\s*\/>\s*\)/, `</>\n  </>\n)`);
    }

    await this.write(appPath, appCode);
  }
}

let _instance: FileService | null = null;
export const getFileService = (wc: WebContainer) => {
  if (!_instance) _instance = new FileService(wc);
  return _instance;
};