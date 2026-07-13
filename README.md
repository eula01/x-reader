# X List Focus

Chrome and Safari extension that limits X to four list timelines and direct tweet links.

## Allowed on X

- Your four lists, including subpages like `/members`:
  - https://x.com/i/lists/2062211801987641463
  - https://x.com/i/lists/2047478346116686143
  - https://x.com/i/lists/2059974188396351918
  - https://x.com/i/lists/2063220039365415064
- Direct tweet links, e.g. `https://x.com/user/status/1234567890`

Everything else on x.com shows a full-page overlay with four buttons to your lists.

## Install on iPhone Safari

iPhone Safari cannot load unpacked Chrome extensions. Use the free **Userscripts** app.

### 1. Install Userscripts

1. Install [Userscripts](https://apps.apple.com/app/userscripts/id1609744600) from the App Store
2. Open the Userscripts app once and set its folder to **On My iPhone → Userscripts**
3. Enable it in **Settings → Apps → Safari → Extensions → Userscripts** (allow for all websites, or at least x.com)

### 2. Download the script (no Share / Shortcuts)

On your iPhone in **Safari**, open the download page:

https://htmlpreview.github.io/?https://github.com/eula01/x-reader/blob/cursor/iphone-safari-mobile-f9b2/docs/install.html

1. Tap the blue **Download x-list-focus.user.js** button  
   (if Safari only shows code, **press and hold** the button → **Download Linked File**)
2. Open **Files → Downloads**
3. Long-press the file → **Move** → **On My iPhone → Userscripts**
4. Open **x.com** in Safari
5. Tap **aA → Manage Extensions** → enable **Userscripts** → reload

Do **not** use Share or Shortcuts — they fail with conversion errors on this file.

Backup file link (then press-and-hold → Download Linked File):  
https://github.com/eula01/x-reader/raw/cursor/iphone-safari-mobile-f9b2/userscript/x-list-focus.user.js

## Install on Chrome (desktop)

1. Clone this repo
2. Open `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select this repo folder (the one containing `manifest.json`)

After pulling updates, click **Reload** on the extension in `chrome://extensions`.

## Install on Mac Safari

1. Install Xcode from the Mac App Store
2. Run Apple's converter on this folder:
   ```bash
   xcrun safari-web-extension-converter . --project-location safari --app-name "X List Focus"
   ```
3. Open the generated Xcode project, build, and run once to enable the extension
4. In Safari, open **Settings → Extensions** and enable **X List Focus**

## Configure list button labels

Edit the `title` field in `config.js` to set fixed button labels. If left blank, the extension learns each list name while you visit that list in the same browser session.

On iPhone, set titles in `config.js`, then rebuild the userscript:

```bash
node scripts/build-userscript.mjs
```

Copy the updated `userscript/x-list-focus.user.js` into the Userscripts folder on your iPhone (replace the old file).

## Test

```bash
node test/url-matcher.test.mjs
node scripts/build-userscript.mjs
```

Open `test/harness.html` in a browser to preview allow/block behavior for a pasted URL.

## Files

| File | Purpose |
|------|---------|
| `config.js` | Allowed list IDs and optional `title` per list |
| `url-matcher.js` | URL allow/block logic |
| `runtime.js` | Cross-browser extension API helper |
| `page-hook.js` | Page-context SPA navigation hooks |
| `content.js` | Overlay injection |
| `overlay.css` | Full-page blocker UI |
| `userscript/x-list-focus.user.js` | iPhone Safari userscript (built file) |
| `docs/install.html` | Mobile-friendly install helper page |
| `scripts/build-userscript.mjs` | Rebuilds the userscript + install page |
