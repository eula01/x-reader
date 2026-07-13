import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BRANCH = "cursor/iphone-safari-mobile-f9b2";
const RAW_USERSCRIPT_URL = `https://raw.githubusercontent.com/eula01/x-reader/${BRANCH}/userscript/x-list-focus.user.js`;
const GITHUB_DOWNLOAD_URL = `https://github.com/eula01/x-reader/raw/${BRANCH}/userscript/x-list-focus.user.js`;

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

// application/octet-stream makes Safari treat this as a file download, not a webpage.
const octetDataUri = `data:application/octet-stream;charset=utf-8,${encodeURIComponent(userscript)}`;

const installHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>Download X List Focus</title>
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
      .btn {
        display: block;
        width: 100%;
        box-sizing: border-box;
        min-height: 52px;
        margin: 0 0 12px;
        padding: 14px 16px;
        border: 0;
        border-radius: 14px;
        background: #1d9bf0;
        color: #fff !important;
        font-size: 18px;
        font-weight: 700;
        text-align: center;
        text-decoration: none;
        line-height: 1.3;
        -webkit-tap-highlight-color: transparent;
        cursor: pointer;
      }
      .btn.secondary {
        background: #e7e9ea;
        color: #0f1419 !important;
      }
      .status {
        min-height: 1.25em;
        margin: 0 0 16px;
        font-weight: 600;
        color: #0f1419;
      }
      .warn {
        padding: 12px 14px;
        margin: 0 0 20px;
        border-radius: 12px;
        background: #fff4cc;
        color: #733f00;
        font-size: 15px;
      }
      .note {
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <h1>Download X List Focus</h1>
    <p class="warn">Do <strong>not</strong> use Share or Shortcuts. They fail on this file. Use the blue Download button only.</p>

    <a
      class="btn"
      id="download"
      href="${octetDataUri}"
      download="x-list-focus.user.js"
    >Download x-list-focus.user.js</a>

    <a
      class="btn secondary"
      href="${GITHUB_DOWNLOAD_URL}"
      download="x-list-focus.user.js"
    >Backup download link</a>

    <p id="status" class="status" aria-live="polite"></p>

    <h2>After it downloads</h2>
    <ol>
      <li>Install <strong>Userscripts</strong> from the App Store if you have not already.</li>
      <li>Open <strong>Files → Downloads</strong>.</li>
      <li>Long-press <strong>x-list-focus.user.js</strong> → <strong>Move</strong> → <strong>On My iPhone → Userscripts</strong>.</li>
      <li>Enable Userscripts in <strong>Settings → Apps → Safari → Extensions</strong>.</li>
      <li>Open <strong>x.com</strong>, tap <strong>aA → Manage Extensions</strong>, enable Userscripts, reload.</li>
    </ol>

    <p class="note">If tapping Download only shows code: <strong>press and hold</strong> the blue button, then choose <strong>Download Linked File</strong>.</p>

    <script id="xlf-source" type="text/plain">${userscript.replace(/<\/script/gi, "<\\/script")}</script>
    <script>
      const status = document.getElementById("status");
      const source = document.getElementById("xlf-source").textContent;
      const filename = "x-list-focus.user.js";

      function triggerDownload(event) {
        // Prefer a real file download over Share / Shortcuts.
        try {
          const blob = new Blob([source], { type: "application/octet-stream" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = filename;
          link.rel = "noopener";
          document.body.appendChild(link);
          link.click();
          link.remove();
          setTimeout(() => URL.revokeObjectURL(url), 2000);
          status.textContent = "Download started. Check Files → Downloads.";
          if (event) event.preventDefault();
        } catch (err) {
          status.textContent = "Tap-and-hold the blue button → Download Linked File.";
        }
      }

      document.getElementById("download").addEventListener("click", triggerDownload);
    </script>
  </body>
</html>
`;

const installPath = join(root, "docs", "install.html");
mkdirSync(join(root, "docs"), { recursive: true });
writeFileSync(installPath, installHtml);
console.log(`Wrote ${installPath}`);
