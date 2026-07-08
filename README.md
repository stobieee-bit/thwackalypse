# THWACKALYPSE 64 🩴

**A 100% legally distinct low-poly bullet heaven.** Defend your lawn from gnomes, pigeons, flamingos, kamikaze roombas, and the HOA itself.

**▶ Play: https://stobieee-bit.github.io/thwackalypse/**

Runs in any modern browser — desktop, phone, or tablet. No install, no ads, no accounts. Works offline if you save the page.

## Features

**Your weapons fight for you** — you just move, dash, and make build choices.
**Survive to 12:00** and management arrives in person: **KAREN, FINAL FORM**.
**Beat her** and the lawn is yours; keep going and at 15:00 the audit begins.

### Defenders & weapons
- **8 defenders**, each with a **signature dash** — burning grill trail, shoulder check, bass-drop landing, slowing brine wake, extended flutter, mowing charge, mid-dash pickpocketing… and earn every trophy to make **KAREN herself playable** (teleport dash included)
- **10 weapons × 5 levels**, each with a **unique evolution** — BRUNCHNADO, MURDER HORNETS, DROP THE SUN, CATEGORY 5, GNOME LEGION — plus golden gnome turrets and a knockback leaf blower
- **8 passives** and chest-driven evolutions: max a weapon, hold its paired passive, open a chest
- Level-up **rerolls**, a **Second Wind** revive, and per-character best times

### Bosses & modes
- **KAREN, FINAL FORM** at 12:00 — three phases, complaint barrages, HOA summons, manager-voice screams, teleports if you walk away
- **5 bosses** total — three staged evictions, KAREN herself, and **THE INSPECTOR**: an endless-mode audit that returns at 15:00, teleports when outrun, and respawns stronger
- **4 maps**, each with a **MOW+** hard mode unlocked by winning it — including PERPETUAL CARE, a restless cemetery
- **THE GAUNTLET** — three challenge modes: GLASS LAWN (1 HP), ONE WEAPON WONDER, GNOME RUSH
- **📅 Daily Run** — date-seeded so everyone fights the same waves; chase the thwack record and keep your streak
- **19 achievements** (incl. a long-haul CHASE tier), a discovery **Almanac**, a permanent meta **LAWN SHOP**, and a LAWN LEGEND crown at 100%

### Tech & platforms
- **One self-contained `index.html`, no build step** — installable PWA, plays fully offline after first load, no accounts, no ads
- **Full 360° third-person camera** — mouse-look (click to capture), drag, scroll zoom, right-stick, or right-thumb
- Keyboard, mouse, **gamepad**, and **touch** — plus a desktop/Steam shell (`steam/`)
- Fully synthesized soundtrack & SFX (WebAudio — zero audio files), reduced-motion-friendly defaults, zh-CN localization
- Authentic N64-era rendering: 270p internal resolution, bilinear blur, fog, gradient skydome, drifting low-poly clouds, flat-shaded vertex-colored models

## Controls

| | Desktop | Gamepad | Touch |
|---|---|---|---|
| Move (camera-relative) | WASD / arrows | left stick / d-pad | left-half drag |
| Look | mouse (click to capture) or drag | right stick | right-half drag |
| Zoom | scroll wheel | — | — |
| Dash | Space / Shift | A / B | 💨 button |
| ULTIMATE (when charged) | Q / E | Y | ⚡ button |
| Banish / Lock (level-up) | X / C | Y / B | on-card buttons |
| Pause | P / Esc | Start | ⏸ button |
| Mute | M | — | settings |

## Tech

One self-contained `index.html` (~3,600 lines, no build step) plus a vendored copy of [three.js](https://threejs.org) r158 (MIT). All art is code-built low-poly geometry, all audio is synthesized at runtime, all names and characters are original. A thin Electron shell in `steam/` packages the same file for desktop/Steam.

Game mechanics are genre conventions (mechanics aren't copyrightable); every expressive element here — name, cast, art, music, text, code — is original work.

🤖 Built with [Claude Code](https://claude.com/claude-code)
