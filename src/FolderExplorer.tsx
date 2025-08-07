import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Folder, FileText } from 'lucide-react'

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
  onFileSelect: (file: FolderFile) => void
}

const FolderExplorer: React.FC<FolderExplorerProps> = ({
  currentFolder,
  folderFiles,
  isLoadingFolder,
  currentFilePath,
  onFileSelect
}) => {

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date): string => {
    const now = new Date()
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}d ago`
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">

      {currentFolder && (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Folder className="h-4 w-4" />
              {currentFolder.split(/[/\\]/).pop()}
            </CardTitle>
            <CardDescription className="text-xs break-all">
              {currentFolder}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">
              {folderFiles.length} markdown file{folderFiles.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
      )}

      {folderFiles.length > 0 && (
        <div className="flex-1 min-h-0">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-sm font-medium text-muted-foreground">Files</h5>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {folderFiles.length}
            </span>
          </div>
          <div className="space-y-0.5 overflow-y-auto">
            {folderFiles.map((file, index) => {
              const isActive = currentFilePath === file.path
              
              return (
                <div
                  key={index}
                  className={`group flex items-start gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 border border-transparent ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-sm border-primary/20' 
                      : 'hover:bg-accent/70 hover:border-accent-foreground/10'
                  }`}
                  onClick={() => onFileSelect(file)}
                  title={file.title || file.relativePath}
                >
                  <FileText className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
                    isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-accent-foreground'
                  }`} />
                  <div className="flex-1 min-w-0 space-y-0.5">
                    {file.title && (
                      <div className={`text-sm font-medium truncate leading-tight ${
                        isActive ? 'text-primary-foreground' : 'text-foreground'
                      }`}>
                        {file.title}
                      </div>
                    )}
                    <div className={`text-xs truncate leading-tight ${
                      isActive 
                        ? 'text-primary-foreground/80' 
                        : 'text-muted-foreground group-hover:text-accent-foreground/80'
                    }`}>
                      {file.name}
                    </div>
                    <div className={`text-xs leading-tight ${
                      isActive 
                        ? 'text-primary-foreground/60' 
                        : 'text-muted-foreground/70 group-hover:text-accent-foreground/60'
                    }`}>
                      {formatFileSize(file.size)} • {formatDate(file.modified)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!currentFolder && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground text-center italic">
            Open a folder in the toolbar to browse markdown files.
          </p>
        </div>
      )}

      {currentFolder && folderFiles.length === 0 && !isLoadingFolder && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground text-center italic">
            No markdown files found in this folder.
          </p>
        </div>
      )}
    </div>
  )
}

export default FolderExplorer