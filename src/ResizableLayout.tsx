import React, { useState, useRef, useCallback, useEffect } from 'react'

interface ResizableLayoutProps {
  sidebar: React.ReactNode
  children: React.ReactNode
  initialSidebarWidth?: number
  minSidebarWidth?: number
  maxSidebarWidth?: number
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

const ResizableLayout: React.FC<ResizableLayoutProps> = ({
  sidebar,
  children,
  initialSidebarWidth = 300,
  minSidebarWidth = 200,
  maxSidebarWidth = 600,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [sidebarWidth, setSidebarWidth] = useState(initialSidebarWidth)
  const [isResizing, setIsResizing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const resizerRef = useRef<HTMLDivElement>(null)

  const startResizing = useCallback((e: React.MouseEvent) => {
    if (isCollapsed) return
    e.preventDefault()
    setIsResizing(true)
  }, [isCollapsed])

  const stopResizing = useCallback(() => {
    setIsResizing(false)
  }, [])

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const newWidth = e.clientX - containerRect.left
        
        const clampedWidth = Math.min(
          Math.max(newWidth, minSidebarWidth),
          maxSidebarWidth
        )
        
        setSidebarWidth(clampedWidth)
      }
    },
    [isResizing, minSidebarWidth, maxSidebarWidth]
  )

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', resize)
      document.addEventListener('mouseup', stopResizing)
      document.body.style.cursor = 'ew-resize'
      document.body.style.userSelect = 'none'
    } else {
      document.removeEventListener('mousemove', resize)
      document.removeEventListener('mouseup', stopResizing)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    return () => {
      document.removeEventListener('mousemove', resize)
      document.removeEventListener('mouseup', stopResizing)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, resize, stopResizing])

  const collapsedWidth = 40
  const actualSidebarWidth = isCollapsed ? collapsedWidth : sidebarWidth

  return (
    <div ref={containerRef} className="resizable-layout">
      <div 
        className={`resizable-sidebar ${isCollapsed ? 'collapsed' : ''}`}
        style={{ width: actualSidebarWidth }}
      >
        {isCollapsed ? (
          <div className="collapsed-sidebar">
            <button 
              className="collapse-toggle"
              onClick={onToggleCollapse}
              title="Expand sidebar"
            >
              →
            </button>
          </div>
        ) : (
          <>
            <div className="sidebar-header">
              <button 
                className="collapse-toggle"
                onClick={onToggleCollapse}
                title="Collapse sidebar"
              >
                ←
              </button>
            </div>
            {sidebar}
          </>
        )}
      </div>
      <div 
        ref={resizerRef}
        className={`resizer ${isResizing ? 'resizing' : ''} ${isCollapsed ? 'collapsed' : ''}`}
        onMouseDown={startResizing}
        style={{ display: isCollapsed ? 'none' : 'block' }}
      />
      <div 
        className="resizable-content"
        style={{ width: `calc(100% - ${actualSidebarWidth + (isCollapsed ? 0 : 4)}px)` }}
      >
        {children}
      </div>
    </div>
  )
}

export default ResizableLayout