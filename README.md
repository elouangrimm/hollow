# Hollow Save Editor

Static save file editor for Hollow Knight and Silksong.

## Features

- Open encrypted PC saves or plain text Switch saves
- Drag and drop support
- Raw JSON editor with format/reset actions
- Guided quick values:
	- `playerData.version` (with `Set latest`)
	- `playerData.geo`
	- `playerData.maxHealth`
	- `playerData.silkMax`
- Common ability checkboxes (`hasDash`, `hasSuperJump`, `hasDoubleJump`, etc.)
- Extracted stats panel above JSON editor (Geo, Rosaries, Health, Silk, Play Time, Version)
- Local history (stored in browser local storage)
- Installable PWA (offline shell cache)
- File handling for `.dat` on supporting Chromium browsers when installed

## Run (No Build)

Open `index.html` directly in a browser, or run a tiny static server:

```bash
srv-it
```

(pssst: check out [srv-it](https://www.npmjs.com/package/srv-it))

Then open `http://localhost:3000` or whatever port you picked.

## PWA Setup (Kubuntu + Dolphin)

To open `.dat` files directly from Dolphin into this app:

1. Deploy the app on HTTPS (already true on `https://hollow.e5g.dev`).
2. Open the site in Chromium/Chrome/Edge and install it as an app.
3. In KDE System Settings, set the `.dat` file association to the installed app entry.
4. Double-clicking a `.dat` now launches the installed app with the file.

Notes:

- File handling is an installed-app feature (not regular browser tabs).
- Best support is Chromium-based browsers.

## Expected Save Locations

These are expected locations only. Depending on launcher, cloud sync, or custom setup, your saves could be somewhere else.

### Silksong

- Windows: `%USERPROFILE%/AppData/LocalLow/Team Cherry/Hollow Knight Silksong/`
- Mac: `~/Library/Application Support/unity.Team-Cherry.Silksong/`
- Linux: `~/.config/unity3d/Team Cherry/Hollow Knight Silksong/`

### Hollow Knight

- Windows: `%USERPROFILE%\AppData\LocalLow\Team Cherry\Hollow Knight\*.dat`
- Windows backup: `%USERPROFILE%\AppData\LocalLow\Team Cherry\Hollow Knight\*.bak`
- macOS: `$HOME/Library/Application Support/unity.Team Cherry.Hollow Knight/`
- Linux: `$XDG_CONFIG_HOME/unity3d/Team Cherry/Hollow Knight/*.dat`

## Usage

1. Make a backup of your save.
2. Select or drag your source file into the app.
3. Edit JSON directly or use the quick values and ability panels.
4. Download via Save As (defaults to the same filename you uploaded).

## Credits

The decryption and encryption process is based on work from [@KayDeeTee](https://github.com/KayDeeTee) in [Hollow Knight Save Manager](https://github.com/KayDeeTee/Hollow-Knight-SaveManager), and the original website from 10 years ago is from [@bloodorca](https://github.com/bloodorca/hollow).
