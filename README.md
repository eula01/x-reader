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

## Install on Chrome (desktop)

1. Clone this repo
2. Open `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select this repo folder (the one containing `manifest.json`)

After pulling updates, click **Reload** on the extension in `chrome://extensions`.

## Install on iPhone Safari

iPhone Safari cannot load unpacked extensions the way Chrome does. Use the **Userscripts** app instead:

1. Install [Userscripts](https://apps.apple.com/app/userscripts/id1609744600) from the App Store
2. Open **Settings → Safari → Extensions** and enable **Userscripts**
3. In the Userscripts app, add `userscript/x-list-focus.user.js` from this repo
   - Easiest: host the file in iCloud Drive and open it in Userscripts, or paste the file contents into a new script
4. Make sure the script is enabled, then open x.com in Safari

After pulling updates, rebuild the userscript with `node scripts/build-userscript.mjs` (or copy the updated file from the repo) and refresh it in Userscripts.

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

On iPhone, set titles in `config.js` before building the userscript so buttons show the right names without visiting each list first.

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
| `scripts/build-userscript.mjs` | Rebuilds the userscript from source files |
