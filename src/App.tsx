import React, { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import FolderExplorer from './FolderExplorer'
import ResizableLayout from './ResizableLayout'
import 'highlight.js/styles/github.css'

interface FileInfo {
  path: string
  content: string
  name: string
}

interface FolderFile {
  name: string
  path: string
  relativePath: string
  size: number
  modified: Date
  title: string | null
}

const App: React.FC = () => {
  const [currentFile, setCurrentFile] = useState<FileInfo | null>(null)
  const [content, setContent] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split')
  const [renderedHtml, setRenderedHtml] = useState('')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [folderFiles, setFolderFiles] = useState<FolderFile[]>([])
  const [isLoadingFolder, setIsLoadingFolder] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const handleOpenFile = async () => {
    try {
      const result = await (window as any).electronAPI?.openFile()
      if (result) {
        setCurrentFile({
          path: result.path,
          content: result.content,
          name: result.path.split('/').pop() || 'Untitled'
        })
        setContent(result.content)
        setHasUnsavedChanges(false)
      }
    } catch (error) {
      console.error('Error opening file:', error)
    }
  }

  const handleSaveFile = async () => {
    try {
      if (currentFile) {
        const result = await (window as any).electronAPI?.saveFile(currentFile.path, content)
        if (result?.success) {
          setHasUnsavedChanges(false)
        }
      }
    } catch (error) {
      console.error('Error saving file:', error)
    }
  }

  const handleNewFile = () => {
    setCurrentFile({
      path: '',
      content: '',
      name: 'Untitled.md'
    })
    setContent('')
    setHasUnsavedChanges(false)
  }

  const handleContentChange = (value: string | undefined) => {
    if (value !== undefined) {
      setContent(value)
      setHasUnsavedChanges(true)
    }
  }

  const handleExportHtml = async () => {
    try {
      const result = await (window as any).electronAPI?.exportHtml(renderedHtml)
      if (result?.success) {
        console.log('HTML exported successfully to:', result.path)
      }
    } catch (error) {
      console.error('Error exporting HTML:', error)
    }
  }

  const handleExportPdf = async () => {
    try {
      const result = await (window as any).electronAPI?.exportPdf(renderedHtml)
      if (result?.success) {
        console.log('PDF exported successfully to:', result.path)
      }
    } catch (error) {
      console.error('Error exporting PDF:', error)
    }
  }

  const handleOpenFolder = async () => {
    try {
      setIsLoadingFolder(true)
      const result = await (window as any).electronAPI?.openFolder()
      if (result?.path) {
        setCurrentFolder(result.path)
        const folderContents = await (window as any).electronAPI?.readFolderContents(result.path)
        if (folderContents?.files) {
          setFolderFiles(folderContents.files)
        }
      }
    } catch (error) {
      console.error('Error opening folder:', error)
    } finally {
      setIsLoadingFolder(false)
    }
  }

  const handleFileSelect = async (file: FolderFile) => {
    try {
      const fileContent = await (window as any).electronAPI?.readFile(file.path)
      if (fileContent !== null) {
        setCurrentFile({
          path: file.path,
          content: fileContent,
          name: file.name
        })
        setContent(fileContent)
        setHasUnsavedChanges(false)
      }
    } catch (error) {
      console.error('Error reading file:', error)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'o') {
        e.preventDefault()
        handleOpenFile()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        handleSaveFile()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault()
        handleNewFile()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault()
        setShowSearch(!showSearch)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentFile, content])

  const renderPreview = () => {
    const PreviewComponent = () => (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          a: ({ node, ...props }) => (
            <a
              {...props}
              onClick={(e) => {
                if (props.href?.startsWith('http')) {
                  e.preventDefault()
                  ;(window as any).electronAPI?.openExternal(props.href)
                }
              }}
            />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    )

    return (
      <div className="preview-container" ref={(el) => {
        if (el) {
          setRenderedHtml(el.innerHTML)
        }
      }}>
        <PreviewComponent />
      </div>
    )
  }

  const renderEditor = () => (
    <div className="editor-container">
      <Editor
        height="100%"
        language="markdown"
        theme="vs-light"
        value={content}
        onChange={handleContentChange}
        options={{
          minimap: { enabled: false },
          wordWrap: 'on',
          lineNumbers: 'on',
          folding: true,
          fontSize: 14,
          fontFamily: 'Monaco, Menlo, monospace',
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  )


  const renderSidebar = () => (
    <div className="sidebar">
      <h3>Markdown Reader</h3>
      
      <FolderExplorer
        currentFolder={currentFolder}
        folderFiles={folderFiles}
        isLoadingFolder={isLoadingFolder}
        currentFilePath={currentFile?.path || null}
        onOpenFolder={handleOpenFolder}
        onFileSelect={handleFileSelect}
      />
      
      <div className="theme-toggle">
        <button 
          className="btn btn-secondary"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
{theme === 'light' ? 'Dark' : 'Light'}
        </button>
      </div>
    </div>
  )

  const renderMainContent = () => (
    <div className="main-content">
        <div className="toolbar">
          <div className="toolbar-left">
            <button className="btn btn-primary" onClick={handleNewFile}>
              New
            </button>
            <button className="btn btn-secondary" onClick={handleOpenFile}>
              Open
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={handleSaveFile}
              disabled={!currentFile || !hasUnsavedChanges}
            >
              Save
            </button>
          </div>
          <div className="toolbar-right">
            <button
              className={`btn ${viewMode === 'editor' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('editor')}
            >
              Editor
            </button>
            <button
              className={`btn ${viewMode === 'split' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('split')}
            >
              Split
            </button>
            <button
              className={`btn ${viewMode === 'preview' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('preview')}
            >
              Preview
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleExportHtml}
              disabled={!currentFile || !content}
            >
              Export HTML
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleExportPdf}
              disabled={!currentFile || !content}
            >
              Export PDF
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowSearch(!showSearch)}
            >
              🔍 Search
            </button>
          </div>
        </div>

        {showSearch && (
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search in document... (Cmd+F)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              autoFocus
            />
            <button
              className="btn btn-secondary"
              onClick={() => setShowSearch(false)}
            >
              ✕
            </button>
          </div>
        )}

        <div className="content-area">
          {!currentFile ? (
            <div className="welcome-message">
              <h2>Welcome to Markdown Reader</h2>
              <p>Create a new file or open an existing markdown file to get started.</p>
              <button className="btn btn-primary" onClick={handleOpenFile}>
                Open File
              </button>
            </div>
          ) : (
            <>
              {(viewMode === 'editor' || viewMode === 'split') && (
                <div className="editor-pane">
                  <div className="pane-header">Editor</div>
                  {renderEditor()}
                </div>
              )}
              {(viewMode === 'preview' || viewMode === 'split') && (
                <div className="preview-pane">
                  <div className="pane-header">Preview</div>
                  {renderPreview()}
                </div>
              )}
            </>
          )}
        </div>
    </div>
  )

  return (
    <div className={`app ${theme}`}>
      <ResizableLayout
        sidebar={renderSidebar()}
        initialSidebarWidth={320}
        minSidebarWidth={250}
        maxSidebarWidth={600}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      >
        {renderMainContent()}
      </ResizableLayout>
    </div>
  )
}

export default App