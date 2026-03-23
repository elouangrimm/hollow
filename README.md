# Hollow Save Editor

Static save file editor for Hollow Knight.

## Features

- Open encrypted PC saves or plain text Switch saves
- Drag and drop support
- Raw JSON editor with format/reset actions
- Guided common value editor for:
	- `playerData.version` (with `Set latest`)
	- `playerData.geo`
	- `playerData.silk`
	- `playerData.health`
	- `playerData.maxHealth`
	- `playerData.date`
	- `playerData.respawnScene`
- Local history (stored in browser local storage)

## Run (No Build)

Open `index.html` directly in a browser, or run a tiny static server:

```bash
srv-it
```

(pssst: check out [srv-it](https://www.npmjs.com/package/srv-it))

Then open `http://localhost:8080`.

## Usage

1. Make a backup of your save.
2. Select or drag your source file into the app.
3. Edit JSON directly or use the quick values panel.
4. Download as `plain.dat` for Switch or `user1.dat` for PC.

## Credits

The decryption and encryption process is based on work from [@KayDeeTee](https://github.com/KayDeeTee) in [Hollow Knight Save Manager](https://github.com/KayDeeTee/Hollow-Knight-SaveManager).
