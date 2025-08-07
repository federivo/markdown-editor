const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('open-file'),
  saveFile: (filePath, content) => ipcRenderer.invoke('save-file', filePath, content),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  
  onNewFile: (callback) => {
    ipcRenderer.on('new-file', callback)
  },
  onOpenFile: (callback) => {
    ipcRenderer.on('open-file', callback)
  },
  onSaveFile: (callback) => {
    ipcRenderer.on('save-file', callback)
  },
  onSaveFileAs: (callback) => {
    ipcRenderer.on('save-file-as', callback)
  },
  
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel)
  },
  
  exportHtml: (content, filePath) => ipcRenderer.invoke('export-html', content, filePath),
  exportPdf: (content) => ipcRenderer.invoke('export-pdf', content),
  
  openFolder: () => ipcRenderer.invoke('open-folder'),
  readFolderContents: (folderPath) => ipcRenderer.invoke('read-folder-contents', folderPath),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath)
})