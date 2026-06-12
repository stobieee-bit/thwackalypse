/* Stages the web build into steam/app/ before packaging.
   electron-builder rejects `from: ".."` file mappings (everything must live
   under the project dir), so `npm run dist` runs this first via "predist".
   steam/app/ is generated output — it is gitignored and only used by
   packaged builds (dev `npm start` always loads ../index.html). */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..');
const DEST = path.join(__dirname, 'app');
const FILES = ['index.html', 'three.min.js', 'twemoji.ttf',
               'icon-192.png', 'icon-512.png', 'LICENSE'];

fs.mkdirSync(DEST, { recursive: true });
for (const f of FILES) {
  fs.copyFileSync(path.join(SRC, f), path.join(DEST, f)); // overwrite
  console.log('[copy-app]', f, '-> app/');
}
