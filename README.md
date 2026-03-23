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

## Run (No Build)

Open `index.html` directly in a browser, or run a tiny static server:

```bash
srv-it
```

(pssst: check out [srv-it](https://www.npmjs.com/package/srv-it))

Then open `http://localhost:3000` or whatever port you picked.

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
