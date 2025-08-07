const { app, BrowserWindow, Menu, dialog, ipcMain, shell } = require('electron')
const path = require('path')
const fs = require('fs')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
    titleBarStyle: 'default',
    show: false,
  })

  const isDev = process.env.NODE_ENV === 'development'
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
    // mainWindow.webContents.openDevTools() // Commented out to hide dev tools by default
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('open-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Markdown Files', extensions: ['md', 'markdown'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0]
    const content = fs.readFileSync(filePath, 'utf-8')
    return { path: filePath, content }
  }
  return null
})

ipcMain.handle('save-file', async (event, filePath, content) => {
  try {
    if (filePath) {
      fs.writeFileSync(filePath, content, 'utf-8')
      return { success: true, path: filePath }
    } else {
      const result = await dialog.showSaveDialog(mainWindow, {
        filters: [
          { name: 'Markdown Files', extensions: ['md'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      })
      
      if (!result.canceled && result.filePath) {
        fs.writeFileSync(result.filePath, content, 'utf-8')
        return { success: true, path: result.filePath }
      }
    }
    return { success: false }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('open-external', async (event, url) => {
  shell.openExternal(url)
})

ipcMain.handle('open-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })

  if (!result.canceled && result.filePaths.length > 0) {
    return { path: result.filePaths[0] }
  }
  return null
})

function extractMarkdownTitle(content) {
  const lines = content.split('\n')
  
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('# ')) {
      return trimmed.substring(2).trim()
    }
  }
  
  return null
}

ipcMain.handle('read-folder-contents', async (event, folderPath) => {
  try {
    const markdownFiles = []
    
    function scanDirectory(dirPath, depth = 0) {
      if (depth > 3) return // Limit recursion depth
      
      const items = fs.readdirSync(dirPath)
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item)
        const stat = fs.statSync(fullPath)
        
        if (stat.isDirectory() && !item.startsWith('.')) {
          scanDirectory(fullPath, depth + 1)
        } else if (stat.isFile()) {
          const ext = path.extname(item).toLowerCase()
          if (ext === '.md' || ext === '.markdown') {
            const relativePath = path.relative(folderPath, fullPath)
            
            let title = null
            try {
              const content = fs.readFileSync(fullPath, 'utf-8')
              title = extractMarkdownTitle(content)
            } catch (error) {
              console.warn(`Could not read file for title extraction: ${fullPath}`)
            }
            
            markdownFiles.push({
              name: item,
              path: fullPath,
              relativePath: relativePath,
              size: stat.size,
              modified: stat.mtime,
              title: title
            })
          }
        }
      }
    }
    
    scanDirectory(folderPath)
    
    // Sort files by name
    markdownFiles.sort((a, b) => a.name.localeCompare(b.name))
    
    return { files: markdownFiles, folderPath }
  } catch (error) {
    console.error('Error reading folder contents:', error)
    return { files: [], error: error.message }
  }
})

ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return content
  } catch (error) {
    console.error('Error reading file:', error)
    return null
  }
})

ipcMain.handle('export-html', async (event, content, filePath) => {
  try {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Exported Markdown</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; line-height: 1.6; }
    h1, h2, h3, h4, h5, h6 { color: #2d3748; margin-top: 24px; margin-bottom: 16px; }
    p { margin-bottom: 16px; }
    code { background-color: #f7fafc; padding: 2px 6px; border-radius: 4px; font-family: 'Monaco', 'Menlo', monospace; }
    pre { background-color: #f7fafc; padding: 16px; border-radius: 8px; overflow-x: auto; border-left: 4px solid #3182ce; }
    blockquote { border-left: 4px solid #cbd5e0; padding-left: 20px; margin: 16px 0; color: #718096; font-style: italic; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
    th { background-color: #f7fafc; font-weight: 600; }
  </style>
</head>
<body>
${content}
</body>
</html>`
    
    if (filePath) {
      fs.writeFileSync(filePath, htmlContent, 'utf-8')
      return { success: true, path: filePath }
    } else {
      const result = await dialog.showSaveDialog(mainWindow, {
        filters: [
          { name: 'HTML Files', extensions: ['html'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      })
      
      if (!result.canceled && result.filePath) {
        fs.writeFileSync(result.filePath, htmlContent, 'utf-8')
        return { success: true, path: result.filePath }
      }
    }
    return { success: false }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('export-pdf', async (event, content) => {
  try {
    const htmlPdf = require('html-pdf-node')
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Exported Markdown</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; line-height: 1.6; }
    h1, h2, h3, h4, h5, h6 { color: #2d3748; margin-top: 24px; margin-bottom: 16px; }
    p { margin-bottom: 16px; }
    code { background-color: #f7fafc; padding: 2px 6px; border-radius: 4px; font-family: 'Monaco', 'Menlo', monospace; }
    pre { background-color: #f7fafc; padding: 16px; border-radius: 8px; overflow-x: auto; border-left: 4px solid #3182ce; }
    blockquote { border-left: 4px solid #cbd5e0; padding-left: 20px; margin: 16px 0; color: #718096; font-style: italic; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
    th { background-color: #f7fafc; font-weight: 600; }
  </style>
</head>
<body>
${content}
</body>
</html>`

    const options = { format: 'A4', printBackground: true }
    const file = { content: htmlContent }
    
    const result = await dialog.showSaveDialog(mainWindow, {
      filters: [
        { name: 'PDF Files', extensions: ['pdf'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })
    
    if (!result.canceled && result.filePath) {
      const pdfBuffer = await htmlPdf.generatePdf(file, options)
      fs.writeFileSync(result.filePath, pdfBuffer)
      return { success: true, path: result.filePath }
    }
    
    return { success: false }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
          mainWindow.webContents.send('new-file')
        }
      },
      {
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        click: () => {
          mainWindow.webContents.send('open-file')
        }
      },
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: () => {
          mainWindow.webContents.send('save-file')
        }
      },
      {
        label: 'Save As',
        accelerator: 'CmdOrCtrl+Shift+S',
        click: () => {
          mainWindow.webContents.send('save-file-as')
        }
      },
      { type: 'separator' },
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
        click: () => {
          app.quit()
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'selectall' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  }
]

Menu.setApplicationMenu(Menu.buildFromTemplate(template))