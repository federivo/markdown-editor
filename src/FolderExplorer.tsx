import React from 'react'

interface FolderFile {
  name: string
  path: string
  relativePath: string
  size: number
  modified: Date
  title: string | null
}

interface FolderExplorerProps {
  currentFolder: string | null
  folderFiles: FolderFile[]
  isLoadingFolder: boolean
  currentFilePath: string | null
  onOpenFolder: () => void
  onFileSelect: (file: FolderFile) => void
}

const FolderExplorer: React.FC<FolderExplorerProps> = ({
  currentFolder,
  folderFiles,
  isLoadingFolder,
  currentFilePath,
  onOpenFolder,
  onFileSelect
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }


  return (
    <div className="folder-explorer">
      <div className="folder-controls">
        <button 
          className="btn btn-primary"
          onClick={onOpenFolder}
          disabled={isLoadingFolder}
        >
          {isLoadingFolder ? '⏳ Loading...' : '📁 Open Folder'}
        </button>
      </div>

      {currentFolder && (
        <div className="folder-info">
          <h4>📂 {currentFolder.split(/[/\\]/).pop()}</h4>
          <p className="folder-path">{currentFolder}</p>
          <p className="file-count">{folderFiles.length} markdown file{folderFiles.length !== 1 ? 's' : ''}</p>
        </div>
      )}

      {folderFiles.length > 0 && (
        <div className="file-tree">
          <h5>Files:</h5>
          {folderFiles.map((file, index) => {
            const isActive = currentFilePath === file.path
            
            return (
              <div
                key={index}
                className={`file-item ${isActive ? 'active' : ''}`}
                onClick={() => onFileSelect(file)}
                title={file.title || file.relativePath}
              >
                <div className="file-info">
                  {file.title && (
                    <div className="file-title">{file.title}</div>
                  )}
                  <div className="file-name">{file.name}</div>
                </div>
                <span className="file-size">{formatFileSize(file.size)}</span>
              </div>
            )
          })}
        </div>
      )}

      {currentFolder && folderFiles.length === 0 && !isLoadingFolder && (
        <div className="empty-folder">
          <p>No markdown files found in this folder.</p>
        </div>
      )}
    </div>
  )
}

export default FolderExplorer