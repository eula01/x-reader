# X List Focus (Chrome extension)

Limits X usage to four list timelines and direct tweet links.

## Allowed on X

- The four list URLs above, including subpages like `/members` for managing them
- Direct tweet links, e.g. `https://x.com/user/status/1234567890`

Everything else on `x.com` / `twitter.com` shows a full-page overlay with four buttons to your lists.

## Install (unpacked)

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `chrome-extension` folder in this repo

## Test locally

```bash
node chrome-extension/test/url-matcher.test.mjs
```

Open `chrome-extension/test/harness.html` in a browser to manually verify overlay behavior.

## Files

| File | Purpose |
|------|---------|
| `config.js` | Allowed list IDs and button labels |
| `url-matcher.js` | URL allow/block logic |
| `content.js` | Overlay injection + SPA navigation hooks |
| `overlay.css` | Full-page blocker UI |
