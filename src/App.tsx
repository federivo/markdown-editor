import React, { useState, useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import FolderExplorer from './FolderExplorer'
import ResizableLayout from './ResizableLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, FileText, Save, FolderOpen, Download, Eye, Edit, Split, Moon, Sun, Loader2, Plus, Minus, Folder, ChevronDown } from 'lucide-react'
import { ToastProvider, useToast } from '@/hooks/useToast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import AppLogo from '@/components/AppLogo'
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

const MarkdownApp: React.FC = () => {
  const [currentFile, setCurrentFile] = useState<FileInfo | null>(null)
  const [content, setContent] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('preview')
  const [renderedHtml, setRenderedHtml] = useState('')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [folderFiles, setFolderFiles] = useState<FolderFile[]>([])
  const [isLoadingFolder, setIsLoadingFolder] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState<'html' | 'pdf' | null>(null)
  const [previewFontSize, setPreviewFontSize] = useState(16)
  const [splitViewEditorWidth, setSplitViewEditorWidth] = useState(50) // percentage
  const [isSplitResizing, setIsSplitResizing] = useState(false)
  const editorRef = useRef<any>(null)
  
  const { showToast } = useToast()

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
    if (!currentFile) return
    
    try {
      setIsSaving(true)
      const result = await (window as any).electronAPI?.saveFile(currentFile.path, content)
      if (result?.success) {
        setHasUnsavedChanges(false)
        showToast('File saved successfully', 'success')
      } else {
        showToast('Failed to save file', 'error')
      }
    } catch (error) {
      console.error('Error saving file:', error)
      showToast('Error saving file', 'error')
    } finally {
      setIsSaving(false)
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
      setIsExporting('html')
      const result = await (window as any).electronAPI?.exportHtml(renderedHtml)
      if (result?.success) {
        showToast(`HTML exported to ${result.path}`, 'success')
      } else {
        showToast('Failed to export HTML', 'error')
      }
    } catch (error) {
      console.error('Error exporting HTML:', error)
      showToast('Error exporting HTML', 'error')
    } finally {
      setIsExporting(null)
    }
  }

  const handleExportPdf = async () => {
    try {
      setIsExporting('pdf')
      const result = await (window as any).electronAPI?.exportPdf(renderedHtml)
      if (result?.success) {
        showToast(`PDF exported to ${result.path}`, 'success')
      } else {
        showToast('Failed to export PDF', 'error')
      }
    } catch (error) {
      console.error('Error exporting PDF:', error)
      showToast('Error exporting PDF', 'error')
    } finally {
      setIsExporting(null)
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

  const handleFontSizeIncrease = () => {
    setPreviewFontSize(prev => Math.min(prev + 2, 32))
  }

  const handleFontSizeDecrease = () => {
    setPreviewFontSize(prev => Math.max(prev - 2, 10))
  }

  const resetFontSize = () => {
    setPreviewFontSize(16)
  }

  const handleSplitViewMouseDown = (e: React.MouseEvent) => {
    if (viewMode !== 'split') return
    e.preventDefault()
    e.stopPropagation()
    setIsSplitResizing(true)
  }

  useEffect(() => {
    const handleSplitViewMouseMove = (e: MouseEvent) => {
      if (!isSplitResizing || viewMode !== 'split') return
      
      const container = document.querySelector('.split-container') as HTMLElement
      if (!container) return
      
      const containerRect = container.getBoundingClientRect()
      const newWidthPercent = ((e.clientX - containerRect.left) / containerRect.width) * 100
      
      // Clamp between 20% and 80%
      const clampedWidth = Math.min(Math.max(newWidthPercent, 20), 80)
      setSplitViewEditorWidth(clampedWidth)
    }

    const handleSplitViewMouseUp = () => {
      setIsSplitResizing(false)
    }

    if (isSplitResizing) {
      document.addEventListener('mousemove', handleSplitViewMouseMove)
      document.addEventListener('mouseup', handleSplitViewMouseUp)
      document.body.style.cursor = 'ew-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleSplitViewMouseMove)
      document.removeEventListener('mouseup', handleSplitViewMouseUp)
      if (isSplitResizing) {
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }
  }, [isSplitResizing, viewMode])

  // Search functionality
  useEffect(() => {
    if (!searchTerm) {
      // Clear search highlights when search term is empty
      if (editorRef.current) {
        const editor = editorRef.current
        const model = editor.getModel()
        if (model) {
          editor.deltaDecorations(editor._searchDecorations || [], [])
          editor._searchDecorations = []
        }
      }
      return
    }

    // Search in Monaco Editor
    if (editorRef.current && (viewMode === 'editor' || viewMode === 'split')) {
      const editor = editorRef.current
      const model = editor.getModel()
      
      if (model) {
        const matches = model.findMatches(searchTerm, false, false, true, null, true)
        const decorations = matches.map((match: any) => ({
          range: match.range,
          options: {
            className: 'search-highlight',
            inlineClassName: 'search-highlight-inline'
          }
        }))
        
        // Clear previous decorations and add new ones
        const oldDecorations = editor._searchDecorations || []
        editor._searchDecorations = editor.deltaDecorations(oldDecorations, decorations)
        
        // Jump to first match
        if (matches.length > 0) {
          editor.setPosition(matches[0].range.getStartPosition())
          editor.revealPositionInCenter(matches[0].range.getStartPosition())
        }
      }
    }

  }, [searchTerm, viewMode, content])

  // Search in preview content
  useEffect(() => {
    if (viewMode === 'preview' || viewMode === 'split') {
      const previewElements = document.querySelectorAll('.markdown-content')
      
      previewElements.forEach(element => {
        if (!searchTerm) {
          // Remove existing highlights
          const highlighted = element.querySelectorAll('.preview-search-highlight')
          highlighted.forEach(span => {
            const parent = span.parentNode
            if (parent) {
              parent.replaceChild(document.createTextNode(span.textContent || ''), span)
              parent.normalize()
            }
          })
          return
        }

        // Create a tree walker to traverse text nodes
        const walker = document.createTreeWalker(
          element,
          NodeFilter.SHOW_TEXT,
          null
        )

        const textNodes: Text[] = []
        let node: Text | null
        
        while (node = walker.nextNode() as Text) {
          textNodes.push(node)
        }

        // Process each text node
        textNodes.forEach(textNode => {
          const text = textNode.textContent || ''
          const searchRegex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
          
          if (searchRegex.test(text)) {
            const highlightedHTML = text.replace(searchRegex, '<span class="preview-search-highlight">$1</span>')
            const wrapper = document.createElement('span')
            wrapper.innerHTML = highlightedHTML
            
            textNode.parentNode?.replaceChild(wrapper, textNode)
          }
        })
      })
    }
  }, [searchTerm, viewMode, renderedHtml])

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
      if ((e.metaKey || e.ctrlKey) && e.key === '=') {
        e.preventDefault()
        handleFontSizeIncrease()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '-') {
        e.preventDefault()
        handleFontSizeDecrease()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '0') {
        e.preventDefault()
        resetFontSize()
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
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32" ref={(el) => {
        if (el) {
          setRenderedHtml(el.innerHTML)
        }
      }}>
        <div 
          className="markdown-content bg-card rounded-lg shadow-sm border border-border/50 px-8 py-8 mb-16"
          style={{ fontSize: `${previewFontSize}px` }}
        >
          <PreviewComponent />
        </div>
      </div>
    )
  }

  const renderEditor = () => (
    <div className="flex-1 min-h-0 p-2">
      <div className="h-full bg-card rounded-lg border border-border/50 shadow-sm overflow-hidden">
        <Editor
          height="100%"
          language="markdown"
          theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
          value={content}
          onChange={handleContentChange}
          onMount={(editor) => {
            editorRef.current = editor
          }}
          options={{
            minimap: { enabled: false },
            wordWrap: 'on',
            lineNumbers: 'on',
            folding: true,
            fontSize: 14,
            fontFamily: 'Monaco, Menlo, monospace',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 20, bottom: 20 },
            lineHeight: 1.6,
            roundedSelection: false,
            cursorBlinking: 'smooth',
            find: {
              addExtraSpaceOnTop: false,
              autoFindInSelection: 'never',
              seedSearchStringFromSelection: 'selection'
            }
          }}
        />
      </div>
    </div>
  )


  const renderSidebar = () => (
    <div className="flex flex-col h-full p-4 bg-card">
      <div className="flex items-center gap-3 mb-4">
        <AppLogo size={28} className="flex-shrink-0" />
        <h3 className="font-semibold text-card-foreground">Markdown Reader</h3>
      </div>
      
      <FolderExplorer
        currentFolder={currentFolder}
        folderFiles={folderFiles}
        isLoadingFolder={isLoadingFolder}
        currentFilePath={currentFile?.path || null}
        onFileSelect={handleFileSelect}
      />
    </div>
  )

  const renderMainContent = () => (
    <div className="flex flex-col h-full">
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border px-4 py-3 flex items-center gap-3 flex-wrap min-h-[60px]">
          {/* Left section - File operations */}
          <div className="flex items-center gap-2">
            <Button onClick={handleNewFile} size="sm" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">New</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5" disabled={isLoadingFolder}>
                  {isLoadingFolder ? <Loader2 className="h-4 w-4 animate-spin" /> : <FolderOpen className="h-4 w-4" />}
                  <span className="hidden sm:inline">{isLoadingFolder ? 'Loading...' : 'Open'}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={handleOpenFile}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Open File</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleOpenFolder} disabled={isLoadingFolder}>
                  <Folder className="mr-2 h-4 w-4" />
                  <span>Open Folder</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              variant="outline" 
              onClick={handleSaveFile}
              disabled={!currentFile || (!hasUnsavedChanges && !isSaving) || isSaving}
              size="sm"
              className="gap-2 relative"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
              {hasUnsavedChanges && !isSaving && <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />}
            </Button>
          </div>

          {/* Center section - View modes */}
          <div className="flex items-center gap-0.5 bg-muted p-1 rounded-lg">
            <Button
              variant={viewMode === 'editor' ? 'default' : 'ghost'}
              onClick={() => setViewMode('editor')}
              size="sm"
              className={`gap-1.5 h-8 transition-all ${
                viewMode === 'editor' 
                  ? 'bg-background text-foreground shadow-sm border border-border/50' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
            >
              <Edit className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Editor</span>
            </Button>
            <Button
              variant={viewMode === 'split' ? 'default' : 'ghost'}
              onClick={() => setViewMode('split')}
              size="sm"
              className={`gap-1.5 h-8 transition-all ${
                viewMode === 'split' 
                  ? 'bg-background text-foreground shadow-sm border border-border/50' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
            >
              <Split className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Split</span>
            </Button>
            <Button
              variant={viewMode === 'preview' ? 'default' : 'ghost'}
              onClick={() => setViewMode('preview')}
              size="sm"
              className={`gap-1.5 h-8 transition-all ${
                viewMode === 'preview' 
                  ? 'bg-background text-foreground shadow-sm border border-border/50' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Preview</span>
            </Button>
          </div>

          {/* Right section - Actions */}
          <div className="flex items-center gap-1.5 ml-auto">
            <Button
              variant="outline"
              onClick={() => setShowSearch(!showSearch)}
              size="sm"
              className="gap-2"
              title="Search in document"
            >
              <Search className="h-4 w-4" />
              <span className="hidden xl:inline">Search</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleExportHtml}
              disabled={!currentFile || !content || isExporting === 'html'}
              size="sm"
              className="gap-1.5"
              title="Export as HTML"
            >
              {isExporting === 'html' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              <span className="hidden 2xl:inline">{isExporting === 'html' ? 'Exporting...' : 'HTML'}</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleExportPdf}
              disabled={!currentFile || !content || isExporting === 'pdf'}
              size="sm"
              className="gap-1.5"
              title="Export as PDF"
            >
              {isExporting === 'pdf' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              <span className="hidden 2xl:inline">{isExporting === 'pdf' ? 'Exporting...' : 'PDF'}</span>
            </Button>
            <Button 
              variant="outline"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              size="sm"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {showSearch && (
          <div className="bg-muted/30 border-b border-border flex items-center px-4 py-3 gap-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search in document... (Cmd+F)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
            <Button
              variant="ghost"
              onClick={() => setShowSearch(false)}
              size="sm"
              className="h-6 w-6 p-0"
            >
              ✕
            </Button>
          </div>
        )}

        <div className={`flex-1 flex min-h-0 overflow-hidden ${viewMode === 'split' ? 'split-container' : ''}`}>
          {!currentFile ? (
            <div className="flex-1 flex items-center justify-center">
              <Card className="w-96 mx-4">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-3">
                    <AppLogo size={32} />
                    Welcome to Markdown Reader
                  </CardTitle>
                  <CardDescription>
                    Create a new file or open an existing markdown file to get started.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button onClick={handleOpenFile} className="gap-2">
                    <FolderOpen className="h-4 w-4" />
                    Open File
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              {(viewMode === 'editor' || viewMode === 'split') && (
                <div 
                  className="flex flex-col min-h-0 overflow-hidden bg-muted/20"
                  style={{
                    width: viewMode === 'split' ? `${splitViewEditorWidth}%` : '100%'
                  }}
                >
                  <div className="bg-muted/50 border-b border-border px-4 py-3 text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Editor
                    {hasUnsavedChanges && <div className="w-2 h-2 bg-orange-500 rounded-full" title="Unsaved changes" />}
                  </div>
                  {renderEditor()}
                </div>
              )}
              {viewMode === 'split' && (
                <div 
                  className={`w-1 bg-border hover:bg-primary cursor-ew-resize transition-colors duration-200 flex-shrink-0 relative group ${
                    isSplitResizing ? 'bg-primary' : ''
                  }`}
                  onMouseDown={handleSplitViewMouseDown}
                  style={{ 
                    zIndex: 50,
                    minWidth: '4px',
                  }}
                >
                  <div 
                    className="absolute inset-y-0 -left-2 -right-2 cursor-ew-resize"
                    onMouseDown={handleSplitViewMouseDown}
                    style={{ zIndex: 51 }}
                  />
                  <div className="absolute inset-y-0 left-1/2 w-0.5 bg-primary/80 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              )}
              {(viewMode === 'preview' || viewMode === 'split') && (
                <div 
                  className="flex flex-col bg-secondary/20 min-h-0"
                  style={{
                    width: viewMode === 'split' ? `${100 - splitViewEditorWidth}%` : '100%'
                  }}
                >
                  <div className="bg-muted/50 border-b border-border px-4 py-3 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Eye className="h-4 w-4 shrink-0" />
                        <span className="shrink-0">Preview</span>
                        {currentFile && (
                          <span className="text-xs opacity-60 truncate max-w-32 hidden sm:block">
                            {currentFile.name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <Button
                          variant="ghost"
                          onClick={handleFontSizeDecrease}
                          disabled={previewFontSize <= 10}
                          size="sm"
                          title="Decrease font size (-)"
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-xs text-muted-foreground w-6 text-center shrink-0">{previewFontSize}</span>
                        <Button
                          variant="ghost"
                          onClick={handleFontSizeIncrease}
                          disabled={previewFontSize >= 32}
                          size="sm"
                          title="Increase font size (+)"
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {renderPreview()}
                </div>
              )}
            </>
          )}
        </div>
    </div>
  )

  return (
    <div className={`app h-screen w-screen bg-background text-foreground ${theme === 'dark' ? 'dark' : ''}`}>
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

const App: React.FC = () => {
  return (
    <ToastProvider>
      <MarkdownApp />
    </ToastProvider>
  )
}

export default App