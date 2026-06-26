import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

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
// @match          https://twitter.com/*
// @run-at         document-start
// @grant          none
// ==/UserScript==

globalThis.XLF_PAGE_HOOK_INLINE = ${JSON.stringify(pageHook)};
globalThis.XLF_OVERLAY_CSS = ${JSON.stringify(overlayCss)};

${read("config.js")}
${read("url-matcher.js")}
${read("content.js")}
`;

const outputPath = join(root, "userscript", "x-list-focus.user.js");
writeFileSync(outputPath, userscript);
console.log(`Wrote ${outputPath}`);

const installHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Install X List Focus on iPhone</title>
    <style>
      :root {
        color-scheme: light dark;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      body {
        margin: 0;
        padding: 24px 20px 40px;
        line-height: 1.5;
        max-width: 520px;
      }
      h1 {
        font-size: 22px;
        margin: 0 0 8px;
      }
      p {
        margin: 0 0 16px;
        color: #536471;
      }
      ol {
        margin: 0 0 20px;
        padding-left: 20px;
      }
      li {
        margin-bottom: 10px;
      }
      button {
        display: block;
        width: 100%;
        min-height: 48px;
        margin-bottom: 12px;
        border: 0;
        border-radius: 14px;
        background: #1d9bf0;
        color: #fff;
        font-size: 17px;
        font-weight: 700;
      }
      .status {
        min-height: 1.25em;
        font-weight: 600;
      }
      .note {
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <h1>Install on iPhone Safari</h1>
    <p>Do not use Share or Shortcuts. Tap download below.</p>

    <button id="download" type="button">Download x-list-focus.user.js</button>
    <p id="status" class="status" aria-live="polite"></p>

    <ol>
      <li>Install the <strong>Userscripts</strong> app from the App Store.</li>
      <li>Enable it in <strong>Settings → Safari → Extensions</strong>.</li>
      <li>Tap the blue download button above. Safari saves the file to <strong>Files → Downloads</strong>.</li>
      <li>Open <strong>Files</strong>, long-press <strong>x-list-focus.user.js</strong>, tap <strong>Move</strong>, and put it in <strong>On My iPhone → Userscripts</strong>.</li>
      <li>Open <strong>x.com</strong> in Safari.</li>
    </ol>

    <p class="note">If download does not start, long-press the button and choose <strong>Download Linked File</strong>.</p>

    <script id="xlf-userscript" type="application/json">${JSON.stringify(userscript)}</script>
    <script>
      const status = document.getElementById("status");
      const source = document.getElementById("xlf-userscript").textContent;

      document.getElementById("download").addEventListener("click", () => {
        const blob = new Blob([source], { type: "application/javascript" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "x-list-focus.user.js";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        status.textContent = "Download started. Check Files → Downloads.";
      });
    </script>
  </body>
</html>
`;

const installPath = join(root, "docs", "install.html");
mkdirSync(join(root, "docs"), { recursive: true });
writeFileSync(installPath, installHtml);
console.log(`Wrote ${installPath}`);
