/* THWACKALYPSE 64 — Electron shell for Steam.
   Loads the exact same index.html as the web build; the game detects the
   `native` bridge (preload.js) and switches saves/achievements over to it.
   Works with or without Steam running — everything degrades gracefully. */
const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

const SMOKE = process.argv.includes('--smoke');
const SAVE_PATH = () => path.join(app.getPath('userData'), 'save.json');

/* ---- Steamworks (optional at runtime) ---- */
let steam = null;
function initSteam() {
  try {
    const sw = require('steamworks.js');
    // steam_appid.txt next to main.js supplies the App ID during development.
    // 480 (Spacewar) is Valve's public test app; replace with the real ID.
    steam = sw.init();
    console.log('[steam] connected as', steam.localplayer.getName());
  } catch (e) {
    steam = null;
    console.log('[steam] not available (running without Steam):', String(e).slice(0, 120));
  }
}

/* ---- IPC: saves (sync read so the game can boot synchronously) ---- */
ipcMain.on('save-read', (e) => {
  try { e.returnValue = fs.readFileSync(SAVE_PATH(), 'utf8'); }
  catch { e.returnValue = null; }
});
ipcMain.on('save-write', (_e, data) => {
  try { fs.writeFileSync(SAVE_PATH(), String(data)); } catch (err) { console.error('[save]', err); }
});

/* ---- IPC: achievements / stats ---- */
ipcMain.on('ach', (_e, id) => {
  if (!steam) return;
  try {
    steam.achievement.activate(String(id).toUpperCase());
  } catch (err) { console.error('[ach]', id, err); }
});

/* ---- IPC: window + environment ---- */
ipcMain.on('is-steam', (e) => { e.returnValue = !!steam; });
ipcMain.on('set-fullscreen', (_e, on) => {
  const w = BrowserWindow.getAllWindows()[0];
  if (w) w.setFullScreen(!!on);
});
ipcMain.on('get-fullscreen', (e) => {
  const w = BrowserWindow.getAllWindows()[0];
  e.returnValue = w ? w.isFullScreen() : false;
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1280, height: 800, minWidth: 800, minHeight: 480,
    backgroundColor: '#0c120c',
    fullscreen: !SMOKE, // launch fullscreen like a game; windowed for smoke test
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false
    }
  });
  // packaged build copies web files into app/; dev runs from the repo root
  const packed = path.join(__dirname, 'app', 'index.html');
  win.loadFile(fs.existsSync(packed) ? packed : path.join(__dirname, '..', 'index.html'));

  win.webContents.on('before-input-event', (e, input) => {
    if (input.key === 'F11' && input.type === 'keyDown') {
      win.setFullScreen(!win.isFullScreen());
      e.preventDefault();
    }
  });

  if (SMOKE) {
    win.webContents.once('did-finish-load', () => {
      setTimeout(async () => {
        try {
          const ok = await win.webContents.executeJavaScript(
            'typeof TH!=="undefined" && typeof THREE!=="undefined" && !!window.native');
          fs.writeFileSync(path.join(__dirname, 'smoke.result'),
            ok ? 'OK' : 'FAIL: bridge or game missing');
        } catch (err) {
          fs.writeFileSync(path.join(__dirname, 'smoke.result'), 'FAIL: ' + err);
        }
        app.quit();
      }, 2500);
    });
  }
}

app.whenReady().then(() => { initSteam(); createWindow(); });
app.on('window-all-closed', () => app.quit());
