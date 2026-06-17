# THWACKALYPSE 64 — Steam Launch Checklist

The repo ships Steam-ready: web build (`index.html`) + desktop shell (`steam/`).
This file is the runbook from here to "Launch" button.

## 0. App identity (APPROVED ✅)
- **App ID: `4866690`** (Steamworks > App Admin > "Thwackalypse (4866690)").
- Store item ID: `1224518`.
- Packages: Developer Comp `1690160`, Beta Testing `1690161`, retail Thwackalypse `1690162`.
- Public store URL (once Coming Soon is live): `https://store.steampowered.com/app/4866690/Thwackalypse/`.
- Publisher: Tyler Stobie (auto-grant comp package for dev play).

## 1. Steamworks onboarding (human steps)
- [x] Create a Steamworks partner account (partner.steamgames.com), pay the
      $100 app fee (recouped after $1,000 adjusted gross), complete
      identity/tax/banking.
- [x] Create the app — **App ID 4866690**.
- [x] Replace `480` in `steam/steam_appid.txt` with the real App ID — **done, now `4866690`**.
      (480 was Valve's public Spacewar test placeholder.)
      Packaged builds copy `steam_appid.txt` next to the .exe (electron-builder
      `extraFiles`) so local/dev builds can talk to Steam without a launch
      through the client. Builds uploaded through Steam don't need the file —
      the client supplies the App ID itself.

## 2. Desktop builds
```
cd steam
npm install          # electron + steamworks.js (already verified)
npm run smoke        # loads the real game headlessly, writes smoke.result=OK
npm start            # play it
npm run dist         # windows build  -> steam/dist/
npm run dist:all     # windows + linux (AppImage; Deck runs via Proton anyway)
```
Upload with SteamPipe (steamcmd + app_build script) or the Steamworks
web uploader for small depots.

## 3. Achievements (dashboard setup)
Create these 16 achievements in Steamworks > Stats & Achievements, using the
**API Name** column (the shell calls `achievement.activate(ID.toUpperCase())`):

| API Name    | In-game name        | Trigger                                |
|-------------|---------------------|----------------------------------------|
| KILLS100    | Lawn Enforcement    | 100 kills in one run                   |
| KILLS1000   | THWACKALYPSE NOW    | 1,000 kills in one run                 |
| BOSS1       | Impeached           | Defeat Howard                          |
| SWEEP       | Eviction Reversal   | Defeat all 3 staged bosses in one run  |
| SURVIVOR    | Certified Lawn      | Defeat KAREN, FINAL FORM               |
| RICH        | Seed Money          | Bank 1,000 lifetime gold               |
| EVOLVED     | Yard Sale Darwinism | Evolve a weapon                        |
| MAXED       | Fully Torqued       | Max any weapon to Lv5                  |
| FULLHOUSE   | Full Shed           | Fill all 10 slots                      |
| UNTOUCHED   | Can't Touch Grass   | No damage before 5:00                  |
| AUDITOR     | Passed the Audit    | Defeat THE INSPECTOR                   |
| OVERGROWN   | Overgrown           | Win a MOW+ run                         |
| ONESTAR     | One-Star Review     | Defeat KAREN in under 90 seconds       |
| GLASS       | Made of Porcelain   | Win GLASS LAWN (1 HP, no excuses)      |
| SOLO        | This Is My Spatula  | Win ONE WEAPON WONDER                  |
| RUSH        | Gnome Sayin'        | Win GNOME RUSH (6:00, gnomes only)     |

Already-earned achievements re-fire on next unlock attempt only; for parity
on first Steam boot, consider a one-time sync loop over `SAVE.ach` (left out
intentionally — decide whether legacy web progress should grant Steam
achievements).

## 4. Steam Cloud
The shell saves to `%APPDATA%/thwackalypse64/save.json` (Electron `userData`).
In Steamworks > Cloud, enable **Auto-Cloud** with root `WinAppDataRoaming`,
path `thwackalypse64`, pattern `save.json` (and the Linux equivalent root,
`XDG_CONFIG_HOME`). No code changes required.

## 5. Steam Deck
- Gamepad: full support already (left stick move, right stick camera, A/B dash,
  X reroll, Start pause, d-pad card navigation).
- Resolution: verified at 1280×800.
- Emoji glyphs: bundled `twemoji.ttf` covers SteamOS (no system color emoji).
- Submit for Deck review after launch; this profile is "Verified"-shaped
  (no keyboard-required input, no launcher, legible text at 800p).

## 6. Leaderboards (Daily Run) — optional, recommended
steamworks.js does not currently expose Steam leaderboards. Two options:
- Add a small native call via `napi` to the steamworks.js fork, or
- Use the Steam **Web API** (`ISteamLeaderboards` via a trusted server).
Until then the daily keeps its local-best + share-code behavior everywhere.

## 7. Store page
- Copy: `store/description.md` (no comparative naming on the page).
- Screenshots: `store/shot1.jpg` … `shot5.jpg` — **re-staged from the live engine at
  1920×1080**: (1) bullet-heaven horde + COMBO HUD, (2) KAREN, FINAL FORM with phone
  raised, (3) the ULTIMATE gold shockwave, (4) Midnight Mow night atmosphere,
  (5) Gnome-in-One + GENTRIFITRON boss. Upload these as the gallery.
- Capsules: **code-built (original, on-brand) art is in `store/cap_*.png`** — the
  concept from the brief (Karen, phone raised, looming over a terrified gnome on a
  perfect lawn; logo) rendered at every required size:
  `cap_main_616x353`, `cap_vertical_374x448`, `cap_header_460x215`, `cap_920x430`,
  `cap_1232x706`, `cap_hero_3840x1240`, `cap_library_600x900`.
  These are flat-vector key art in the game's palette — fully usable to launch
  Coming Soon. Swap in commissioned/painted art later if you want more polish;
  the sizes and composition are already proven.
- Trailer (required): capture 60–90s with OBS or:
  `ffmpeg -f gdigrab -framerate 60 -i desktop -t 75 -vf scale=1920:1080 trailer.mp4`
  Suggested beat sheet: 0-10s horde chaos → 10-25s evolution montage →
  25-40s dash signatures → 40-60s KAREN intro card + fight → end card.
- Tags: see description.md. Localized store text: reuse in-game zh-CN strings.

## 8. Legal
- `LICENSE` ships third-party notices (three.js MIT, Twemoji CC-BY/Apache).
- Web search shows no existing game/product named "Thwackalypse"
  (nearest: "Thwackalope", a Cassette Beasts monster — unrelated).
  Before spending on marketing, run a formal USPTO TESS / EUIPO search;
  file a trademark only if the launch gets traction.
- Keep comparative jokes out of store assets; in-game humor is fine.

## 9. Go-to-market
- [ ] Put the page up as **Coming Soon** immediately — wishlists gate everything,
      and earliest release is 2 weeks after the page is publicly visible.
- [ ] **The moment the Coming Soon page is public**, uncomment the staged
      `STEAM_URL='https://store.steampowered.com/app/4866690/Thwackalypse/'` in
      index.html (it's blank today so the button stays hidden — no 404). That
      lights up the 💚 WISHLIST ON STEAM CTA on the **menu AND both end screens**
      (peak-emotion placement). Then bump the version + redeploy Pages.
- [ ] Enter **Steam Next Fest** with a demo build (the web build *is* the demo).
- [ ] Clip-first marketing: Karen voice lines, GNOME LEGION, EVIDENCE DELETED.
- [ ] Launch at $2.99–4.99 with a 10–15% launch discount once wishlists are
      in the low thousands.
