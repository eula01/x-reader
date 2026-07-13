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

## Install on iPhone Safari (current steps)

iPhone Safari cannot load Chrome extensions. Use the free **Userscripts** app by Justin Wasack (App Store id `1463298887`, requires iOS 15.1+).

### 1. Install and enable Userscripts

1. Install: https://apps.apple.com/app/userscripts/id1463298887
2. Open the **Userscripts** app once (it sets a default scripts folder automatically on recent versions)
3. Open **Settings → Safari → Extensions → Userscripts**
4. Turn **Userscripts** **ON**
5. Under **Allow Userscripts On…**, choose **All Websites** → **Allow**  
   (or at least allow **x.com**)

### 2. Install the script (recommended)

1. In **Safari**, open this URL (must end in `.user.js`):  
   https://raw.githubusercontent.com/eula01/x-reader/cursor/iphone-safari-mobile-f9b2/userscript/x-list-focus.user.js
2. Tap **aA** (left of the address bar) → **Userscripts**
3. You should see an **Install** prompt — tap it and confirm
4. Stay in that popup and confirm **X List Focus** is listed and toggled **on**
5. Go to https://x.com/home and reload

You should see a white overlay with four list buttons.

### 3. If you already downloaded the file manually

Just putting a file in a folder is not enough. Do all of this:

1. Open the **Userscripts** app and note/check the scripts directory it is using
2. Put `x-list-focus.user.js` in **that exact directory** (filename must end in `.user.js`, not `.txt`)
3. In Safari on **any** page, tap **aA → Userscripts** once  
   (the extension only reloads new/changed files after you open the popup)
4. Confirm **X List Focus** appears in the popup list and is enabled
5. Open https://x.com/home, tap **aA → Userscripts** again, and check that the script is matched for this page
6. Reload

### Troubleshooting (“nothing happened”)

| Check | What to do |
| --- | --- |
| Wrong app | Must be **Userscripts** by Justin Wasack (`id1463298887`), not another userscript manager |
| Extension off | Settings → Safari → Extensions → Userscripts → On |
| No website permission | Allow **All Websites** (or allow x.com) |
| Script not loaded | Open **aA → Userscripts** once after adding/moving the file |
| Wrong folder | File must be in the directory shown in the Userscripts app |
| Wrong filename | Must be `something.user.js` |
| Injection off | In the Userscripts popup, ensure **Enable Injection** is on |
| Still nothing | On x.com, open the popup and confirm **X List Focus** is listed as matched |

Download helper page (optional):  
https://htmlpreview.github.io/?https://github.com/eula01/x-reader/blob/cursor/iphone-safari-mobile-f9b2/docs/install.html

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

Reinstall / replace `userscript/x-list-focus.user.js` in your Userscripts folder, then open the Userscripts popup once to refresh.

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
