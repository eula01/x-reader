import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BRANCH = "cursor/iphone-safari-mobile-f9b2";
const RAW_USERSCRIPT_URL = `https://raw.githubusercontent.com/eula01/x-reader/${BRANCH}/userscript/x-list-focus.user.js`;

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

const manifest = JSON.parse(read("manifest.json"));
const version = manifest.version;
const pageHook = read("page-hook.js").trim();
const overlayCss = read("overlay.css").trim();

const userscript = `// ==UserScript==
// @name           X List Focus
// @description    Limits X to four list timelines and direct tweet links.
// @version        ${version}
// @match          https://x.com/*
// @match          https://www.x.com/*
// @match          https://twitter.com/*
// @match          https://www.twitter.com/*
// @run-at         document-start
// @grant          none
// ==/UserScript==

${pageHook}

globalThis.XLF_OVERLAY_CSS = ${JSON.stringify(overlayCss)};

${read("config.js")}
${read("url-matcher.js")}
${read("content.js")}
`;

const outputPath = join(root, "userscript", "x-list-focus.user.js");
mkdirSync(join(root, "userscript"), { recursive: true });
writeFileSync(outputPath, userscript);
console.log(`Wrote ${outputPath}`);

const dataUri = `data:text/javascript;charset=utf-8,${encodeURIComponent(userscript)}`;

const installHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>Install X List Focus on iPhone</title>
    <style>
      :root {
        color-scheme: light;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      body {
        margin: 0;
        padding: 24px 20px 48px;
        line-height: 1.5;
        max-width: 520px;
        color: #0f1419;
        background: #fff;
      }
      h1 {
        font-size: 24px;
        line-height: 1.25;
        margin: 0 0 8px;
      }
      h2 {
        font-size: 17px;
        margin: 28px 0 10px;
      }
      p {
        margin: 0 0 16px;
        color: #536471;
      }
      ol {
        margin: 0 0 20px;
        padding-left: 22px;
      }
      li {
        margin-bottom: 12px;
      }
      a.btn,
      button.btn {
        display: block;
        width: 100%;
        box-sizing: border-box;
        min-height: 48px;
        margin: 0 0 12px;
        padding: 12px 16px;
        border: 0;
        border-radius: 14px;
        background: #1d9bf0;
        color: #fff;
        font-size: 17px;
        font-weight: 700;
        text-align: center;
        text-decoration: none;
        line-height: 1.3;
        -webkit-tap-highlight-color: transparent;
      }
      a.btn.secondary,
      button.btn.secondary {
        background: #e7e9ea;
        color: #0f1419;
      }
      .status {
        min-height: 1.25em;
        margin: 0 0 16px;
        font-weight: 600;
        color: #0f1419;
      }
      .note {
        font-size: 14px;
      }
      code {
        font-size: 0.92em;
        word-break: break-all;
      }
    </style>
  </head>
  <body>
    <h1>Install on iPhone Safari</h1>
    <p>X List Focus runs as a userscript in Safari. Chrome “Load unpacked” does not work on iPhone.</p>

    <a class="btn" href="${RAW_USERSCRIPT_URL}">Open userscript file</a>
    <a class="btn secondary" id="download" href="${dataUri}" download="x-list-focus.user.js">Download x-list-focus.user.js</a>
    <p id="status" class="status" aria-live="polite"></p>

    <h2>Setup steps</h2>
    <ol>
      <li>Install <strong>Userscripts</strong> from the App Store (by Justin Wasack).</li>
      <li>Open the Userscripts app once, set the directory to <strong>On My iPhone → Userscripts</strong> (create the folder if needed), then leave the app.</li>
      <li>Go to <strong>Settings → Apps → Safari → Extensions → Userscripts</strong> and turn it <strong>on</strong>. Allow it for all websites (or at least x.com).</li>
      <li>Tap <strong>Open userscript file</strong> above (or Download). In Safari, tap the <strong>Share</strong> button → <strong>Save to Files</strong> → choose <strong>On My iPhone → Userscripts</strong> → Save.</li>
      <li>Open <strong>x.com</strong> in Safari. Tap <strong>aA</strong> in the address bar → <strong>Manage Extensions</strong> → enable <strong>Userscripts</strong>.</li>
      <li>Reload x.com. Non-list pages should show the focus overlay with your four list buttons.</li>
    </ol>

    <p class="note">If Share opens a broken Shortcut instead of Save to Files: Share → Edit Actions → disable any Save File shortcut, then try again.</p>
    <p class="note">Direct file URL:<br /><code>${RAW_USERSCRIPT_URL}</code></p>

    <script>
      const status = document.getElementById("status");
      document.getElementById("download").addEventListener("click", () => {
        status.textContent = "If nothing downloads, use Open userscript file → Share → Save to Files.";
      });
    </script>
  </body>
</html>
`;

const installPath = join(root, "docs", "install.html");
mkdirSync(join(root, "docs"), { recursive: true });
writeFileSync(installPath, installHtml);
console.log(`Wrote ${installPath}`);
