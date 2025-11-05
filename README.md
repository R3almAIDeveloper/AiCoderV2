# R3alm Dev - AI-Powered Development Framework

R3alm Dev is a comprehensive full-stack AI development framework inspired by bolt.new and Claude. It provides an integrated development environment with AI assistance, real-time code generation, and in-browser runtime capabilities.

## 🚀 Features

- **AI-Powered Code Generation**: Natural language prompts that generate production-ready React components
- **Monaco Editor Integration**: Full-featured code editor with TypeScript support and AI autocomplete
- **WebContainer Runtime**: In-browser Node.js runtime for instant previews
- **Split-Pane Layout**: Organized workspace with chat, file tree, editor, and preview panels
- **Real-time Updates**: Live preview updates as you type
- **Modern UI**: Beautiful, professional interface built with Tailwind CSS
- **TypeScript Support**: Full TypeScript integration with intelligent code completion

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Monaco Editor** for code editing
- **Lucide React** for icons
- **WebContainer API** for in-browser runtime

### Backend (Ready for Extension)
- **Node.js** with Express
- **CORS** enabled for cross-origin requests
- **Extensible API** for AI integration

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd r3alm-dev
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎯 Usage

### Basic Usage
1. **Chat Interface**: Use the left panel to chat with the AI assistant
2. **File Management**: View and navigate your project files in the file tree
3. **Code Editing**: Select files to edit in the Monaco Editor
4. **Live Preview**: See your changes instantly in the preview panel

### AI Commands
Try these example prompts:
- "Create a Hello World React component"
- "Build a todo list with useState"
- "Create a contact form with validation"
- "Design a responsive navigation bar"

### File Operations
- Click on files in the tree to open them in the editor
- Changes are automatically saved and reflected in the preview
- Generated files appear immediately in the file tree

## 📦 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Vercel will automatically detect the Vite configuration
3. Deploy with zero configuration needed

### Manual Build
```bash
npm run build
npm run preview
```

## 🔧 Configuration

### AI Integration
To integrate with actual AI services (OpenAI, Claude, etc.):

1. Update `src/services/aiService.ts`
2. Add your API keys to environment variables
3. Implement the actual API calls in the service methods

### WebContainer Configuration
The WebContainer is automatically configured for:
- React development server
- TypeScript compilation
- Hot module replacement
- Package installation

## 🎨 Customization

### Themes
The application uses a dark theme by default. Customize colors in:
- `tailwind.config.js` for Tailwind classes
- Monaco Editor theme in `src/components/MonacoEditor.tsx`

### Layout
Adjust panel sizes and layout in `src/components/Layout.tsx`

### AI Prompts
Extend AI capabilities by modifying `src/services/aiService.ts`

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ChatInterface.tsx    # AI chat interface
│   ├── FileTree.tsx         # File explorer
│   ├── Layout.tsx           # Main layout
│   ├── MonacoEditor.tsx     # Code editor
│   └── Preview.tsx          # Live preview
├── hooks/               # Custom React hooks
│   └── useWebContainer.ts   # WebContainer integration
├── services/            # Business logic
│   ├── aiService.ts         # AI integration
│   └── fileService.ts       # File management
├── types/               # TypeScript definitions
│   └── index.ts
├── App.tsx              # Main application
└── main.tsx            # Entry point
```

## 🔮 Roadmap

- [ ] Real AI API integration (OpenAI/Claude)
- [ ] Git integration for version control
- [ ] Multi-language support (Python, Node.js backends)
- [ ] Plugin system for extensions
- [ ] Collaborative editing features
- [ ] Advanced debugging tools
- [ ] Template marketplace

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by [bolt.new](https://bolt.new) and Claude
- Built with [WebContainer](https://webcontainers.io/) technology
- UI components inspired by modern development tools

---

**R3alm Dev** - Where AI meets development. Built for developers, by developers.