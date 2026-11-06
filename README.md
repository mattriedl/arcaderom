# Arcade Website

A retro game site for **arcadewebsite.com** that runs classic console games in the browser using [EmulatorJS](https://github.com/EmulatorJS/EmulatorJS) (GPL-3.0).

- **Play your own game** — visitors drag in a game file they own. It's stored only in their browser (IndexedDB), never uploaded, and shows up under "Your recent games" next time.
- **Free game library** — games you list in `games.json` (homebrew or your own) appear as cards anyone can play.
- **Save states, gamepads, fullscreen, mobile touch controls** — all built into the EmulatorJS player.

Supported systems: NES, SNES, Game Boy / Color / Advance, N64, DS, Virtual Boy, Master System, Game Gear, Genesis, 32X, Atari 2600 / 7800 / Lynx, TurboGrafx-16, Neo Geo Pocket, WonderSwan, ColecoVision. Edit `js/systems.js` to add or remove systems.

It's a plain static site — no build step, no server code.

## Project layout

```
index.html        Home page: drop zone, recent games, library
play.html         The player page (play.html?game=<id> or ?local=<id>)
games.json        The free library list
roms/             Game files for the library
covers/           Optional cover images for library cards
css/style.css     All styling
js/systems.js     Systems, cores and file extensions
js/store.js       Browser storage for visitors' own games
js/app.js         Home page logic
js/play.js        Player setup
```

## Try it locally

The pages use JavaScript modules, so open them through a local web server rather than double-clicking the file:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Adding games to the library

1. Put the file in `roms/`, e.g. `roms/nes/space-cadet.nes`.
2. Optionally add a cover image in `covers/` (4:3 looks best).
3. Add an entry to `games.json`:

```json
{
  "games": [
    {
      "id": "space-cadet",
      "title": "Space Cadet",
      "system": "nes",
      "rom": "roms/nes/space-cadet.nes",
      "cover": "covers/space-cadet.png",
      "author": "Jane Dev"
    }
  ]
}
```

`system` must be a core name from `js/systems.js` (`nes`, `snes`, `gb`, `gbc`, `gba`, `n64`, `segaMD`, `segaGG`, …).

**Only add games you have the right to redistribute.** Commercial ROMs are copyrighted, and hosting them can get the site taken down. Good sources of freely licensed homebrew include itch.io (check each game's license), the NESdev, GBDev and SMS Power communities, and games released under open licenses by their authors.

## Publishing

### Preview on GitHub Pages

1. On GitHub open **mattriedl/arcaderom → Settings → Pages**.
2. Under "Build and deployment", choose **Deploy from a branch**, branch **main**, folder **/ (root)**, and save.
3. After a minute the site is live at `https://mattriedl.github.io/arcaderom/`.

### Going live on arcadewebsite.com

Upload every file and folder in this repo (including `.nojekyll` is harmless) to your web server's document root for arcadewebsite.com — via FTP/SFTP, your host's file manager, or `git clone` / `git pull` on the server. No database or server-side language is needed.

Server notes:
- Serve over **HTTPS** — browsers restrict some features the emulator uses on plain HTTP.
- Make sure `.json` and `.js` are served with correct MIME types (almost every host does this by default).
- If you later want game files that are large (N64, DS), make sure the host allows them and consider enabling gzip.

Alternatively, point arcadewebsite.com's DNS at GitHub Pages and add the domain under **Settings → Pages → Custom domain**; GitHub provides free HTTPS.

## Updating the emulator

`js/play.js` loads EmulatorJS from its CDN using the `stable` channel. To lock to a specific version, change `EJS_VERSION` to a version number. To self-host instead, download an EmulatorJS release, put its `data/` folder in this repo, and set `EJS_DATA` to `"data/"`.

## Legal

EmulatorJS is GPL-3.0 licensed. This site does not host or distribute commercial game files; visitors are responsible for only loading games they own.
