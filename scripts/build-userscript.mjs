import { mkdirSync, readFileSync, writeFileSync, copyFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BRANCH = "cursor/iphone-safari-mobile-f9b2";
const RAW_USERSCRIPT_URL = `https://raw.githubusercontent.com/eula01/x-reader/${BRANCH}/userscript/x-list-focus.user.js`;
const EXTENSION_ZIP_URL = `https://github.com/eula01/x-reader/raw/${BRANCH}/dist/x-list-focus-extension.zip`;
const ORION_APP_URL = "https://apps.apple.com/app/orion-browser-by-kagi/id1484498200";
const USERSCRIPTS_APP_URL = "https://apps.apple.com/app/userscripts/id1463298887";

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

const userscriptDir = join(root, "userscript");
mkdirSync(userscriptDir, { recursive: true });
writeFileSync(join(userscriptDir, "x-list-focus.user.js"), userscript);
console.log("Wrote userscript/x-list-focus.user.js");

// Chrome/Orion extension zip (manifest + runtime files only).
const distDir = join(root, "dist");
const stagingDir = join(distDir, "staging");
rmSync(stagingDir, { recursive: true, force: true });
mkdirSync(join(stagingDir, "icons"), { recursive: true });

const extensionFiles = [
  "manifest.json",
  "config.js",
  "url-matcher.js",
  "runtime.js",
  "content.js",
  "page-hook.js",
  "overlay.css",
];
for (const file of extensionFiles) {
  copyFileSync(join(root, file), join(stagingDir, file));
}
for (const icon of ["icon16.png", "icon48.png", "icon128.png"]) {
  copyFileSync(join(root, "icons", icon), join(stagingDir, "icons", icon));
}

const zipPath = join(distDir, "x-list-focus-extension.zip");
rmSync(zipPath, { force: true });
execFileSync("zip", ["-r", zipPath, "."], { cwd: stagingDir });
rmSync(stagingDir, { recursive: true, force: true });
console.log("Wrote dist/x-list-focus-extension.zip");

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
    <h1>Install on iPhone</h1>
    <p class="warn">If Safari’s <strong>aA → Userscripts</strong> does nothing, skip Userscripts. Use <strong>Orion Browser</strong> below instead.</p>

    <h2>Recommended: Orion Browser</h2>
    <p>Orion can run this as a normal Chrome extension on iPhone (no Userscripts popup needed).</p>
    <ol>
      <li>Install <a href="${ORION_APP_URL}">Orion Browser by Kagi</a> (free).</li>
      <li>In Orion: <strong>••• → Settings</strong> → enable <strong>Chrome Extensions</strong>.</li>
      <li>Tap the blue button below to download the extension zip.</li>
      <li>In Orion: <strong>••• → Extensions → +</strong> → install from file → choose <code>x-list-focus-extension.zip</code>.</li>
      <li>Open <a href="https://x.com/home">x.com/home</a> <strong>inside Orion</strong> and reload.</li>
    </ol>

    <a class="btn" href="${EXTENSION_ZIP_URL}">Download Chrome extension (.zip)</a>

    <h2>Optional: Safari + Userscripts</h2>
    <p>Only if <strong>aA → Userscripts</strong> actually opens a popup for you.</p>
    <ol>
      <li>Install <a href="${USERSCRIPTS_APP_URL}">Userscripts</a>.</li>
      <li>Settings → Safari → Extensions → Userscripts → On, allow All Websites.</li>
      <li>Open the <code>.user.js</code> link, then tap <strong>aA → Userscripts → Install</strong>.</li>
    </ol>
    <a class="btn secondary" href="${RAW_USERSCRIPT_URL}">Open .user.js for Userscripts</a>
    <a class="btn secondary" id="download" href="${octetDataUri}" download="x-list-focus.user.js">Download .user.js file</a>
    <p id="status" class="note" aria-live="polite"></p>

    <script id="xlf-source" type="text/plain">${userscript.replace(/<\/script/gi, "<\\/script")}</script>
    <script>
      const status = document.getElementById("status");
      const source = document.getElementById("xlf-source").textContent;
      document.getElementById("download").addEventListener("click", (event) => {
        try {
          const blob = new Blob([source], { type: "application/octet-stream" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "x-list-focus.user.js";
          document.body.appendChild(link);
          link.click();
          link.remove();
          setTimeout(() => URL.revokeObjectURL(url), 2000);
          status.textContent = "Download started. Prefer Orion if Userscripts popup never opens.";
          event.preventDefault();
        } catch (err) {
          status.textContent = "Use the Orion zip download instead.";
        }
      });
    </script>
  </body>
</html>
`;

mkdirSync(join(root, "docs"), { recursive: true });
writeFileSync(join(root, "docs", "install.html"), installHtml);
console.log("Wrote docs/install.html");
