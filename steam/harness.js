/* Headless test harness: drives the real game in a hidden Electron window.
   Usage:  npx electron harness.js <test.js> <out.json>
   The test file must be an async-IIFE expression that RESOLVES to a
   JSON-serializable value, e.g.  (async()=>{ TH.start('gerald'); ... return {ok:true}; })()
   Runs WITHOUT preload.js so window.native is absent -> the game behaves
   exactly like the web build (localStorage saves), which is what we test. */
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

const testFile = process.argv[2];
const outFile = process.argv[3] || path.join(__dirname, 'harness.result.json');
const TIMEOUT_MS = 240000;

function finish(payload, code) {
  try { fs.writeFileSync(outFile, JSON.stringify(payload, null, 1)); } catch (e) { console.error(e); }
  app.exit(code);
}

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 1280, height: 800, show: false,
    webPreferences: { backgroundThrottling: false, contextIsolation: true },
  });
  const errors = [];
  win.webContents.on('console-message', (_e, level, message) => {
    if (level >= 3) errors.push(String(message).slice(0, 300));
  });
  const killer = setTimeout(() => finish({ ok: false, error: 'HARNESS TIMEOUT', consoleErrors: errors }, 1), TIMEOUT_MS);
  win.loadFile(path.join(__dirname, '..', 'index.html'));
  win.webContents.once('did-finish-load', async () => {
    try {
      await new Promise(r => setTimeout(r, 1200)); // let the game boot
      const src = fs.readFileSync(testFile, 'utf8');
      const result = await win.webContents.executeJavaScript(src, true);
      clearTimeout(killer);
      finish({ ok: true, result, consoleErrors: errors }, 0);
    } catch (err) {
      clearTimeout(killer);
      finish({ ok: false, error: String(err && err.message || err), consoleErrors: errors }, 1);
    }
  });
});
app.on('window-all-closed', () => app.quit());
