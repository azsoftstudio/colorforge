const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    openDocumentation: () => ipcRenderer.send('open-docs')
});
