import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
  const startXRef = useRef<number>(0)
  const startWidthRef = useRef<number>(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isCollapsed) return
    
    e.preventDefault()
    e.stopPropagation()
    
    startXRef.current = e.clientX
    startWidthRef.current = sidebarWidth
    setIsResizing(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      
      const deltaX = e.clientX - startXRef.current
      const newWidth = startWidthRef.current + deltaX
      
      const clampedWidth = Math.min(
        Math.max(newWidth, minSidebarWidth),
        maxSidebarWidth
      )
      
      setSidebarWidth(clampedWidth)
    }

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false)
      }
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'ew-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      if (isResizing) {
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }
  }, [isResizing, minSidebarWidth, maxSidebarWidth, sidebarWidth])

  const collapsedWidth = 48
  const actualSidebarWidth = isCollapsed ? collapsedWidth : sidebarWidth

  return (
    <div className="flex h-screen w-screen">
      <div 
        className={`flex flex-col bg-card border-r border-border flex-shrink-0 h-full ${
          isCollapsed ? 'items-center' : ''
        }`}
        style={{ width: actualSidebarWidth }}
      >
        {isCollapsed ? (
          <div className="flex flex-col items-center p-2 h-full">
            <Button 
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              title="Expand sidebar"
              className="mb-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-end p-2 border-b border-border">
              <Button 
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
                title="Collapse sidebar"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            {sidebar}
          </>
        )}
      </div>
      {!isCollapsed && (
        <div 
          className={`w-1 bg-border hover:bg-primary cursor-ew-resize transition-colors duration-200 flex-shrink-0 relative group ${
            isResizing ? 'bg-primary' : ''
          }`}
          onMouseDown={handleMouseDown}
          style={{ 
            zIndex: 50,
            minWidth: '4px', // Ensure minimum width for dragging
          }}
        >
          {/* Invisible hit area for easier grabbing */}
          <div 
            className="absolute inset-y-0 -left-2 -right-2 cursor-ew-resize"
            onMouseDown={handleMouseDown}
            style={{ zIndex: 51 }}
          />
          {/* Visual indicator when hovering */}
          <div className="absolute inset-y-0 left-1/2 w-0.5 bg-primary/80 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
      )}
      <div 
        className="flex-1 min-w-0 overflow-hidden"
      >
        {children}
      </div>
    </div>
  )
}

export default ResizableLayout