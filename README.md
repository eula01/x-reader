# X List Focus

Limits X to four list timelines, direct tweet links, and sign-in flows.

## Allowed on X

- Your four lists, including subpages like `/members`
- Allowed profiles: `@asklivermore`, `@mat78704`, `@labubu_trader`, `@Franktradinglog`
- Direct tweet links, e.g. `https://x.com/user/status/1234567890`
- Sign-in / recovery / OAuth: `/login`, `/i/flow/*`, `/account/*`, etc.

Everything else on x.com shows a full-page overlay with list and profile buttons.

## Install on iPhone Safari (required path)

Safari is unavoidable on iPhone for many X links. Custom code can only run in Safari through a **Safari extension**.

### 0. Enable the extension in iPhone Settings first

This is the step that usually fails:

1. **Settings → Safari → Extensions**
2. Turn your manager **On**
3. Allow **All Websites**

If you skip this, **aA** in Safari will do nothing.

### 1. Pick a Safari script manager

**Recommended: [Tampermonkey](https://apps.apple.com/app/tampermonkey/id6738342400)**

1. Enable it in Settings (step 0)
2. Install/open script:  
   https://raw.githubusercontent.com/eula01/x-reader/cursor/iphone-safari-mobile-f9b2/userscript/x-list-focus.user.js
3. In Tampermonkey: Utilities → Install from URL, or New script → paste contents → save
4. Open https://x.com/home in Safari → reload

**Alternative: [Stay for Safari](https://apps.apple.com/app/stay-for-safari/id1591620171)**

1. Enable Stay in Settings (step 0)
2. In Stay app: **+ → Link** → paste the raw script URL
3. Activate in Library → reload x.com in Safari

**Alternative: [Userscripts](https://apps.apple.com/app/userscripts/id1463298887)** (free)

1. Enable Userscripts in Settings (step 0)
2. Open the raw script URL
3. Tap **aA → Userscripts → Install**

Full Safari guide: [docs/SAFARI-IPHONE.md](docs/SAFARI-IPHONE.md)  
Install helper page:  
https://htmlpreview.github.io/?https://github.com/eula01/x-reader/blob/cursor/iphone-safari-mobile-f9b2/docs/install.html

### Own Safari extension via TestFlight (optional)

If you have an Apple Developer account, upload `dist/x-list-focus-extension.zip` through App Store Connect’s **Safari Web Extension Packager**, then install with TestFlight. Details in [docs/SAFARI-IPHONE.md](docs/SAFARI-IPHONE.md).

## Install on Chrome (desktop)

1. Clone this repo
2. Open `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select this repo folder (the one containing `manifest.json`)

## Install on Mac Safari

1. Install Xcode
2. Run:
   ```bash
   xcrun safari-web-extension-converter . --project-location safari --app-name "X List Focus"
   ```
3. Build/run once, then enable in Safari → Settings → Extensions

## Configure list button labels

Edit `title` in `config.js`, then rebuild:

```bash
node scripts/build-userscript.mjs
```

## Test

```bash
node test/url-matcher.test.mjs
node scripts/build-userscript.mjs
```

## Files

| File | Purpose |
|------|---------|
| `config.js` | Allowed list IDs / titles |
| `url-matcher.js` | Allow/block logic |
| `content.js` | Overlay injection |
| `overlay.css` | Overlay UI |
| `userscript/x-list-focus.user.js` | Safari userscript |
| `dist/x-list-focus-extension.zip` | Chrome / Safari packager zip |
| `docs/SAFARI-IPHONE.md` | Deep Safari iPhone guide |
| `docs/install.html` | Mobile install helper |
