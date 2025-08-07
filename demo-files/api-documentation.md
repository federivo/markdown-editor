# Markdown Editor API Documentation

## Overview

The Markdown Editor API provides programmatic access to editor functionality, file operations, and export capabilities.

## Installation

```bash
npm install markdown-editor-api
```

## Quick Start

```javascript
import { MarkdownEditor } from 'markdown-editor-api';

const editor = new MarkdownEditor({
  container: '#editor',
  theme: 'dark',
  autoSave: true
});
```

## API Reference

### MarkdownEditor Class

#### Constructor

```typescript
constructor(options: EditorOptions)
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `container` | string \| HTMLElement | ✅ | DOM selector or element |
| `theme` | 'light' \| 'dark' | ❌ | Editor theme (default: 'light') |
| `autoSave` | boolean | ❌ | Enable auto-save (default: false) |
| `wordWrap` | boolean | ❌ | Enable word wrapping (default: true) |

#### Methods

##### `setValue(content: string): void`

Sets the editor content.

```javascript
editor.setValue('# Hello World\n\nThis is markdown content.');
```

##### `getValue(): string`

Returns the current editor content.

```javascript
const content = editor.getValue();
console.log(content);
```

##### `openFile(filePath: string): Promise<void>`

Opens a markdown file.

```javascript
await editor.openFile('/path/to/document.md');
```

##### `saveFile(filePath?: string): Promise<void>`

Saves the current content to a file.

```javascript
// Save to current file
await editor.saveFile();

// Save to specific file
await editor.saveFile('/path/to/new-document.md');
```

##### `exportToPDF(options?: PDFOptions): Promise<Blob>`

Exports the rendered markdown as PDF.

```javascript
const pdfBlob = await editor.exportToPDF({
  format: 'A4',
  margin: '1cm'
});
```

##### `exportToHTML(options?: HTMLOptions): Promise<string>`

Exports the rendered markdown as HTML.

```javascript
const html = await editor.exportToHTML({
  includeCSS: true,
  standalone: true
});
```

### Events

The editor emits the following events:

#### `content-changed`

Fired when the editor content changes.

```javascript
editor.on('content-changed', (content) => {
  console.log('Content updated:', content);
});
```

#### `file-opened`

Fired when a file is successfully opened.

```javascript
editor.on('file-opened', (filePath) => {
  console.log('Opened file:', filePath);
});
```

#### `file-saved`

Fired when a file is successfully saved.

```javascript
editor.on('file-saved', (filePath) => {
  console.log('Saved file:', filePath);
});
```

### Configuration Options

#### Theme Configuration

```javascript
const editor = new MarkdownEditor({
  container: '#editor',
  theme: {
    name: 'custom',
    colors: {
      background: '#1e1e1e',
      foreground: '#d4d4d4',
      selection: '#264f78'
    }
  }
});
```

#### Export Options

```typescript
interface PDFOptions {
  format?: 'A4' | 'A3' | 'Letter';
  orientation?: 'portrait' | 'landscape';
  margin?: string;
  headerTemplate?: string;
  footerTemplate?: string;
}

interface HTMLOptions {
  includeCSS?: boolean;
  standalone?: boolean;
  template?: string;
}
```

## Error Handling

All async methods can throw errors. Use try-catch blocks:

```javascript
try {
  await editor.openFile('/nonexistent/file.md');
} catch (error) {
  if (error.code === 'FILE_NOT_FOUND') {
    console.error('File not found:', error.path);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Error Codes

| Code | Description |
|------|-------------|
| `FILE_NOT_FOUND` | The specified file does not exist |
| `PERMISSION_DENIED` | Insufficient permissions to access file |
| `INVALID_FORMAT` | File format is not supported |
| `EXPORT_FAILED` | Export operation failed |

## Examples

### Basic Usage

```javascript
import { MarkdownEditor } from 'markdown-editor-api';

// Initialize editor
const editor = new MarkdownEditor({
  container: '#markdown-editor',
  theme: 'dark',
  autoSave: true
});

// Load content
editor.setValue(`
# My Document

This is a **markdown** document with *formatting*.

- Item 1
- Item 2
- Item 3
`);

// Set up event listeners
editor.on('content-changed', (content) => {
  // Auto-save logic here
  localStorage.setItem('draft', content);
});
```

### File Operations

```javascript
// Open a file
document.getElementById('open-btn').addEventListener('click', async () => {
  try {
    await editor.openFile();
  } catch (error) {
    alert('Failed to open file: ' + error.message);
  }
});

// Save current content
document.getElementById('save-btn').addEventListener('click', async () => {
  try {
    await editor.saveFile();
    showNotification('File saved successfully!');
  } catch (error) {
    showNotification('Save failed: ' + error.message, 'error');
  }
});
```

## Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 80+ | ✅ Supported |
| Firefox | 75+ | ✅ Supported |
| Safari | 13+ | ✅ Supported |
| Edge | 80+ | ✅ Supported |
| Opera | 67+ | ✅ Supported |

---

**Need help?** Check our [GitHub Issues](https://github.com/example/markdown-editor/issues) or contact support.