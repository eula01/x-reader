# X List Focus

Chrome extension that limits X to four list timelines and direct tweet links.

## Allowed on X

- Your four lists, including subpages like `/members`:
  - https://x.com/i/lists/2062211801987641463
  - https://x.com/i/lists/2047478346116686143
  - https://x.com/i/lists/2059974188396351918
  - https://x.com/i/lists/2063220039365415064
- Direct tweet links, e.g. `https://x.com/user/status/1234567890`

Everything else on x.com shows a full-page overlay with four buttons to your lists.

## Install

1. Clone this repo
2. Open `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select this repo folder (the one containing `manifest.json`)

After pulling updates, click **Reload** on the extension in `chrome://extensions`.

Edit the `title` field in `config.js` to set fixed button labels. If left blank, the extension learns each list name while you visit that list in the same browser session.

## Test

```bash
node test/url-matcher.test.mjs
```

Open `test/harness.html` in a browser to preview allow/block behavior for a pasted URL.

## Files

| File | Purpose |
|------|---------|
| `config.js` | Allowed list IDs and optional `title` per list |
| `url-matcher.js` | URL allow/block logic |
| `page-hook.js` | Page-context SPA navigation hooks |
| `content.js` | Overlay injection |
| `overlay.css` | Full-page blocker UI |
