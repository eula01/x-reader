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
        color: #536471;
      }
      code {
        word-break: break-all;
        font-size: 0.92em;
      }
    </style>
  </head>
  <body>
    <h1>Install X List Focus on iPhone</h1>
    <p class="warn">Putting the file in a folder alone does nothing. You must enable the Safari extension, allow it on websites, and open the Userscripts popup once so it loads the script.</p>

    <h2>Recommended: install via popup</h2>
    <ol>
      <li>Install <a href="https://apps.apple.com/app/userscripts/id1463298887">Userscripts</a> (Justin Wasack).</li>
      <li>Open the Userscripts app once.</li>
      <li>Go to <strong>Settings → Safari → Extensions → Userscripts</strong>: turn it <strong>On</strong>, and allow <strong>All Websites</strong>.</li>
      <li>Tap the blue button below to open the <code>.user.js</code> file in Safari.</li>
      <li>Tap <strong>aA</strong> → <strong>Userscripts</strong> → tap <strong>Install</strong>.</li>
      <li>Open <a href="https://x.com/home">x.com/home</a> and reload. You should see the white overlay.</li>
    </ol>

    <a class="btn" href="${RAW_USERSCRIPT_URL}">Open .user.js (then aA → Install)</a>

    <h2>Or download the file</h2>
    <a
      class="btn secondary"
      id="download"
      href="${octetDataUri}"
      download="x-list-focus.user.js"
    >Download x-list-focus.user.js</a>
    <p id="status" class="status" aria-live="polite"></p>
    <ol>
      <li>Move the file into the <strong>exact</strong> scripts folder shown in the Userscripts app (filename must end in <code>.user.js</code>).</li>
      <li>In Safari, tap <strong>aA → Userscripts</strong> once to refresh the script list.</li>
      <li>Confirm <strong>X List Focus</strong> is listed and enabled.</li>
      <li>Open x.com/home and reload.</li>
    </ol>

    <p class="note">If Download only shows code: press and hold the download button → <strong>Download Linked File</strong>. Do not use Share/Shortcuts.</p>

    <script id="xlf-source" type="text/plain">${userscript.replace(/<\/script/gi, "<\\/script")}</script>
    <script>
      const status = document.getElementById("status");
      const source = document.getElementById("xlf-source").textContent;
      const filename = "x-list-focus.user.js";

      function triggerDownload(event) {
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
          status.textContent = "Download started. Check Files → Downloads, then open aA → Userscripts once.";
          if (event) event.preventDefault();
        } catch (err) {
          status.textContent = "Press and hold Download → Download Linked File.";
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
