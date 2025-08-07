# Markdown Editor

A modern, cross-platform Markdown editor built with Electron, React, and TypeScript. Features real-time preview, file management, and export capabilities.

## Features

- **Real-time Markdown Preview**: See your changes instantly with GitHub-flavored Markdown support
- **Monaco Editor Integration**: Professional code editing experience with syntax highlighting
- **Multiple View Modes**: Switch between editor-only, preview-only, or split-view layouts
- **File Management**: Browse and organize Markdown files with an integrated folder explorer
- **Export Options**: Export documents to HTML and PDF formats
- **Keyboard Shortcuts**: Quick access to common actions (Cmd/Ctrl+O, S, N, F)
- **Syntax Highlighting**: Code blocks with proper syntax highlighting
- **Responsive Design**: Resizable panes for optimal workflow

## Requirements

- Node.js 16.0 or higher
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd markdown-app
```

2. Install dependencies:
```bash
npm install
```

## Development

Start the development server with hot reload:

```bash
npm run electron-dev
```

This command will:
- Start the Vite development server on `http://localhost:3000`
- Launch Electron in development mode
- Enable hot reload for both the React frontend and Electron main process

For frontend-only development:
```bash
npm run dev
```

## Building

### Build for Development
```bash
npm run build
```

### Run Production Electron App
```bash
npm run electron
```

### Package the Application
```bash
npm run electron-pack
```

### Create Distribution Files
```bash
npm run dist
```

The built application will be available in the `build/` directory.

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

## Architecture

The application follows Electron's security best practices:

- **Main Process** (`electron.cjs`): Handles file system operations, window management, and native integrations
- **Renderer Process** (`src/`): React-based UI with Monaco Editor and Markdown rendering
- **Preload Script** (`preload.cjs`): Secure bridge for IPC communication

## Technologies Used

- **Electron**: Cross-platform desktop application framework
- **React**: User interface library
- **TypeScript**: Type-safe JavaScript development
- **Monaco Editor**: VS Code's editor for Markdown editing
- **Vite**: Fast build tool and development server
- **react-markdown**: Markdown rendering with GitHub-flavored support
- **html-pdf-node**: PDF generation capabilities

## License

ISC License