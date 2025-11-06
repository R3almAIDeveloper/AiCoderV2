// src/services/fileService.ts
import { WebContainer } from '@webcontainer/api';

export class FileService {
  private wc: WebContainer;
  constructor(wc: WebContainer) { this.wc = wc; }

  async write(path: string, content: string) {
    const parts = path.split('/').slice(0, -1);
    let cur = '';
    for (const p of parts) {
      cur += (cur ? '/' : '') + p;
      await this.wc.fs.mkdir(cur, { recursive: true }).catch(() => {});
    }
    await this.wc.fs.writeFile(path, content);
  }

  async applyAIResponse(resp: { code: string; filename: string }) {
    const path = `src/components/${resp.filename}`;
    await this.write(path, resp.code);

    const name = resp.filename.replace(/\.tsx$/, '');
    const appPath = 'src/App.tsx';
    let code = await this.wc.fs.readFile(appPath, 'utf-8');

    const importLine = `import ${name} from './components/${name}';\n`;
    if (!code.includes(importLine)) {
      const last = code.match(/import .*?;\n/g)?.pop() ?? '';
      code = code.replace(last, last + importLine);
    }

    const tag = `<${name} />`;
    if (!code.includes(tag)) {
      code = code.replace(
        /(return\s*\()<>/,
        `$1<>\n    ${tag}\n    <>`
      );
      code = code.replace(/<\/>\s*<\/>\)/, `  </>\n</>\n)`);
    }

    await this.write(appPath, code);
  }
}

let inst: FileService | null = null;
export const getFileService = (wc: WebContainer) => {
  if (!inst) inst = new FileService(wc);
  return inst;
};