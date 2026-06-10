# THWACKALYPSE 64 — Steam Launch Checklist

The repo ships Steam-ready: web build (`index.html`) + desktop shell (`steam/`).
This file is the runbook from here to "Launch" button.

## 1. Steamworks onboarding (human steps)
- [ ] Create a Steamworks partner account (partner.steamgames.com), pay the
      $100 app fee (recouped after $1,000 adjusted gross), complete
      identity/tax/banking. Allow a few business days.
- [ ] Create the app, note the **App ID**.
- [ ] Replace `480` in `steam/steam_appid.txt` with the real App ID
      (480 is Valve's public Spacewar test app — achievements/cloud calls
      no-op against it but the shell boots fine).

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
Create these 13 achievements in Steamworks > Stats & Achievements, using the
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
- Screenshots: `store/shot1.jpg` … `shot5.jpg` (1920×1080, staged from the engine).
- Capsules: commission or generate — concept: Karen, phone raised, looming over
  a terrified gnome on a perfect lawn; logo top-left. Required sizes:
  616×353, 374×448, 460×215, 920×430, 1232×706, plus 3840×1240 hero if featured.
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
- [ ] Put the page up as **Coming Soon** immediately — wishlists gate everything.
- [ ] Set `STEAM_URL` in index.html → the web version (your funnel, the
      "demo") shows a 💚 WISHLIST ON STEAM button on the menu.
- [ ] Enter **Steam Next Fest** with a demo build (the web build *is* the demo).
- [ ] Clip-first marketing: Karen voice lines, GNOME LEGION, EVIDENCE DELETED.
- [ ] Launch at $2.99–4.99 with a 10–15% launch discount once wishlists are
      in the low thousands.
