# X List Focus

Chrome and Safari extension that limits X to four list timelines and direct tweet links.

## Allowed on X

- Your four lists, including subpages like `/members`:
  - https://x.com/i/lists/2062211801987641463
  - https://x.com/i/lists/2047478346116686143
  - https://x.com/i/lists/2059974188396351918
  - https://x.com/i/lists/2063220039365415064
- Direct tweet links, e.g. `https://x.com/user/status/1234567890`
- Sign-in and account flows, e.g. `/login`, `/i/flow/login`, `/account/access`

Everything else on x.com shows a full-page overlay with four buttons to your lists.

## Install on iPhone (recommended: Orion)

Safari’s Userscripts extension often fails to open its popup. The reliable path is **Orion Browser**, which can run this Chrome extension directly.

1. Install **[Orion Browser by Kagi](https://apps.apple.com/app/orion-browser-by-kagi/id1484498200)** (free)
2. In Orion: **••• → Settings** → enable **Chrome Extensions**
3. Download the extension zip:  
   https://github.com/eula01/x-reader/raw/cursor/iphone-safari-mobile-f9b2/dist/x-list-focus-extension.zip
4. In Orion: **••• → Extensions → +** → install from file → choose `x-list-focus-extension.zip`
5. Open **https://x.com/home inside Orion** and reload

You should see the white focus overlay with four list buttons.

Guided page:  
https://htmlpreview.github.io/?https://github.com/eula01/x-reader/blob/cursor/iphone-safari-mobile-f9b2/docs/install.html

### Optional: Safari + Userscripts

Only use this if **aA → Userscripts** actually opens a popup on your phone.

1. Install [Userscripts](https://apps.apple.com/app/userscripts/id1463298887)
2. **Settings → Safari → Extensions → Userscripts** → On, allow **All Websites**
3. Open  
   https://raw.githubusercontent.com/eula01/x-reader/cursor/iphone-safari-mobile-f9b2/userscript/x-list-focus.user.js
4. Tap **aA → Userscripts → Install**
5. Open https://x.com/home and reload

If **aA → Userscripts** does nothing, switch to Orion instead.

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

Rebuild packaged iPhone files after edits:

```bash
node scripts/build-userscript.mjs
```

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
| `dist/x-list-focus-extension.zip` | Chrome extension package for Orion on iPhone |
| `userscript/x-list-focus.user.js` | Optional Safari userscript |
| `docs/install.html` | Mobile install helper |
| `scripts/build-userscript.mjs` | Rebuilds userscript, install page, and zip |
