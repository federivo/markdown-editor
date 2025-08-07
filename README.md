# Markdown Reader

A modern, cross-platform Markdown editor with real-time preview, file management, and export capabilities.

## Download

**Ready to use? Download the latest release for your platform:**

[![Download Latest Release](https://img.shields.io/github/v/release/federivo/markdown-editor?style=for-the-badge&logo=github)](https://github.com/federivo/markdown-editor/releases/latest)

### 📥 Quick Download Guide

| Platform | File to Download | Size | Installation |
|----------|------------------|------|--------------|
| **🍎 macOS** | `Markdown-Reader-X.X.X.dmg` | ~150MB | Double-click to install |
| **🖥️ Windows** | `Markdown Reader Setup X.X.X.exe` | ~120MB | Run installer |
| **🐧 Linux** | `Markdown-Reader-X.X.X.AppImage` | ~130MB | Make executable & run |

### ⚡ Installation Steps

**macOS**: Download `.dmg` → Open → Drag to Applications  
**Windows**: Download `.exe` → Run → Follow installer  
**Linux**: Download `.AppImage` → `chmod +x filename` → `./filename`

## Features

- **Real-time Markdown Preview**: See your changes instantly with GitHub-flavored Markdown support
- **Monaco Editor Integration**: Professional code editing experience with syntax highlighting
- **Multiple View Modes**: Switch between editor-only, preview-only, or split-view layouts
- **File Management**: Browse and organize Markdown files with an integrated folder explorer
- **Export Options**: Export documents to HTML and PDF formats
- **Keyboard Shortcuts**: Quick access to common actions (Cmd/Ctrl+O, S, N, F)
- **Syntax Highlighting**: Code blocks with proper syntax highlighting
- **Responsive Design**: Resizable panes for optimal workflow

## Development

Want to contribute or run from source? See the development setup below.

### Requirements

- Node.js 16.0 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/federivo/markdown-editor.git
cd markdown-editor
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run electron-dev
```

### Building

```bash
# Build for development
npm run build

# Create distribution files
npm run dist
```

## Usage

### Basic Operations

1. **Open File**: Use Cmd/Ctrl+O or click the Open button to select a Markdown file
2. **Save File**: Use Cmd/Ctrl+S to save your current document
3. **New File**: Use Cmd/Ctrl+N to create a new document
4. **Open Folder**: Use Cmd/Ctrl+F to browse a folder containing Markdown files

### View Modes

- **Editor Only**: Focus on writing with the full editor view
- **Preview Only**: Review your rendered Markdown
- **Split View**: Edit and preview simultaneously

### Folder Explorer

- Browse Markdown files in the selected folder
- View file metadata (size, relative paths)
- Support for nested folder structures (up to 3 levels deep)

### Export Features

- **HTML Export**: Generate standalone HTML files
- **PDF Export**: Create PDF documents from your Markdown content

## File Structure

```
markdown-app/
├── src/                    # React frontend source
│   ├── App.tsx            # Main application component
│   ├── FolderExplorer.tsx # Sidebar file browser
│   ├── ResizableLayout.tsx # Layout management
│   ├── index.css          # Global styles
│   └── main.tsx           # React entry point
├── assets/                 # Application assets
│   └── icons/             # Application icons
├── electron.cjs           # Electron main process
├── preload.cjs           # Secure IPC bridge
├── index.html            # HTML entry point
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.js        # Vite build configuration
└── dist/                 # Built frontend assets
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT License