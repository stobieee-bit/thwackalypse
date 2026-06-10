const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('native', {
  platform: 'electron',
  loadSave: () => ipcRenderer.sendSync('save-read'),
  saveSave: (data) => ipcRenderer.send('save-write', data),
  ach: (id) => ipcRenderer.send('ach', id),
  isSteam: () => ipcRenderer.sendSync('is-steam'),
  setFullscreen: (on) => ipcRenderer.send('set-fullscreen', on),
  getFullscreen: () => ipcRenderer.sendSync('get-fullscreen')
});
