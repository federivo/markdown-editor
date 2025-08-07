# Markdown Reader

A modern, cross-platform Markdown editor with real-time preview, advanced file management, and comprehensive export capabilities. Built with Electron, React, and shadcn/ui for a professional writing experience.

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

### ✨ Core Features
- **Real-time Markdown Preview**: See your changes instantly with GitHub-flavored Markdown support
- **Monaco Editor Integration**: Professional code editing with syntax highlighting and IntelliSense
- **Multiple View Modes**: Switch between editor-only, preview-only, or split-view layouts
- **Advanced File Management**: Integrated folder explorer with file metadata and nested folder support
- **Export Options**: Export to HTML and PDF with high-fidelity rendering

### 🎨 User Interface
- **Modern Design**: Clean, professional interface built with shadcn/ui components
- **Dark Mode Support**: Complete light/dark theme switching with system preference detection
- **Resizable Layouts**: Drag-to-resize split view and sidebar for optimal workspace organization
- **Custom App Logo**: Distinctive branding with theme-aware logo design
- **Responsive Design**: Adapts beautifully to different window sizes

### 🔍 Enhanced Functionality  
- **Powerful Search**: Real-time search with highlighting in both editor and preview
- **Font Size Control**: Adjustable preview font size (10px-32px) with dedicated controls
- **Smart Dropdown Menus**: Unified file/folder opening with improved UX
- **Comprehensive Keyboard Shortcuts**: Full keyboard navigation and control
- **File Metadata Display**: View file size, modification dates, and document titles

### 🎯 Writing Experience
- **Distraction-free Writing**: Clean, focused editor environment with proper content spacing
- **Enhanced Markdown Styling**: Improved typography, code blocks, tables, and blockquotes
- **Document-style Preview**: Paper-like preview container for natural reading experience
- **Smooth Scrolling**: Generous bottom padding for comfortable document navigation

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

### 📂 File Operations

| Action | Keyboard Shortcut | Description |
|--------|------------------|-------------|
| **Open File** | `Cmd/Ctrl + O` | Open a single Markdown file |
| **Open Folder** | Use dropdown menu | Browse and select a folder containing Markdown files |
| **Save File** | `Cmd/Ctrl + S` | Save current document |
| **New File** | `Cmd/Ctrl + N` | Create a new untitled document |

### 🔍 Search & Navigation

| Action | Keyboard Shortcut | Description |
|--------|------------------|-------------|
| **Search Document** | `Cmd/Ctrl + F` | Search with real-time highlighting in editor and preview |
| **Font Size Up** | `Cmd/Ctrl + =` | Increase preview font size |
| **Font Size Down** | `Cmd/Ctrl + -` | Decrease preview font size |
| **Reset Font Size** | `Cmd/Ctrl + 0` | Reset preview font size to default (16px) |

### 📖 View Modes

- **Editor Only**: Full-width writing environment with syntax highlighting
- **Preview Only**: Clean reading view with document-style formatting
- **Split View**: Edit and preview simultaneously with resizable divider

### 🎨 Interface Features

- **Theme Toggle**: Switch between light and dark modes
- **Resizable Panels**: Drag dividers to adjust sidebar and split view proportions
- **Font Size Controls**: Dedicated +/- buttons in preview header (10px-32px range)
- **Dropdown Navigation**: Unified file and folder opening interface

### 📁 Folder Explorer

- **File Browser**: Navigate Markdown files with sidebar explorer
- **Metadata Display**: View file size, modification dates, and extracted titles
- **Nested Support**: Browse folders up to 3 levels deep
- **Quick Access**: Click any file to open instantly

### 📤 Export Options

- **HTML Export**: Generate standalone HTML files with embedded styling
- **PDF Export**: Create high-quality PDF documents from your Markdown content
- **One-click Export**: Dedicated export buttons with progress indicators

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