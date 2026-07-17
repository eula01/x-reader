import { mkdirSync, readFileSync, writeFileSync, copyFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BRANCH = "cursor/iphone-safari-mobile-f9b2";
const RAW_USERSCRIPT_URL = `https://raw.githubusercontent.com/eula01/x-reader/${BRANCH}/userscript/x-list-focus.user.js`;
const EXTENSION_ZIP_URL = `https://github.com/eula01/x-reader/raw/${BRANCH}/dist/x-list-focus-extension.zip`;
const TAMPERMONKEY_APP_URL = "https://apps.apple.com/app/tampermonkey/id6738342400";
const STAY_APP_URL = "https://apps.apple.com/app/stay-for-safari/id1591620171";
const USERSCRIPTS_APP_URL = "https://apps.apple.com/app/userscripts/id1463298887";

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

const manifest = JSON.parse(read("manifest.json"));
const version = manifest.version;
const overlayCss = read("overlay.css").trim();

// Safari managers inject into an isolated content-script world. X.com's CSP
// blocks page-world script tags, so we rely on href polling (already in content.js)
// instead of History.prototype hooks.
const userscript = `// ==UserScript==
// @name           X List Focus
// @namespace      https://github.com/eula01/x-reader
// @description    Limits X to four list timelines, direct tweets, and login flows.
// @version        ${version}
// @author         eula01
// @match          https://x.com/*
// @match          https://www.x.com/*
// @match          https://twitter.com/*
// @match          https://www.twitter.com/*
// @run-at         document-start
// @inject-into    content
// @grant          none
// ==/UserScript==

globalThis.XLF_OVERLAY_CSS = ${JSON.stringify(overlayCss)};

${read("config.js")}
${read("url-matcher.js")}
${read("content.js")}
`;

const userscriptDir = join(root, "userscript");
mkdirSync(userscriptDir, { recursive: true });
writeFileSync(join(userscriptDir, "x-list-focus.user.js"), userscript);
console.log("Wrote userscript/x-list-focus.user.js");

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
    <title>Install X List Focus on Safari iPhone</title>
    <style>
      :root {
        color-scheme: light;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      body {
        margin: 0;
        padding: 24px 20px 48px;
        line-height: 1.5;
        max-width: 560px;
        color: #0f1419;
        background: #fff;
      }
      h1 { font-size: 24px; line-height: 1.25; margin: 0 0 8px; }
      h2 { font-size: 17px; margin: 28px 0 10px; }
      p { margin: 0 0 16px; color: #536471; }
      ol { margin: 0 0 20px; padding-left: 22px; }
      li { margin-bottom: 12px; }
      .btn {
        display: block; width: 100%; box-sizing: border-box; min-height: 52px;
        margin: 0 0 12px; padding: 14px 16px; border: 0; border-radius: 14px;
        background: #1d9bf0; color: #fff !important; font-size: 17px; font-weight: 700;
        text-align: center; text-decoration: none; line-height: 1.3;
      }
      .btn.secondary { background: #e7e9ea; color: #0f1419 !important; }
      .warn {
        padding: 12px 14px; margin: 0 0 20px; border-radius: 12px;
        background: #fff4cc; color: #733f00; font-size: 15px;
      }
      .ok {
        padding: 12px 14px; margin: 0 0 20px; border-radius: 12px;
        background: #e7f6ec; color: #0e6245; font-size: 15px;
      }
      code { word-break: break-all; font-size: 0.92em; }
      .note { font-size: 14px; color: #536471; }
    </style>
  </head>
  <body>
    <h1>Safari on iPhone</h1>
    <p class="ok">iOS only allows custom scripts in Safari through a <strong>Safari extension</strong>. Orion/DDG cannot replace Safari when links open there.</p>
    <p class="warn"><strong>Do this first (most common failure):</strong> iPhone <strong>Settings → Safari → Extensions</strong> → turn your chosen manager <strong>On</strong> → allow <strong>All Websites</strong>. If you skip this, <strong>aA</strong> will look empty / do nothing.</p>

    <h2>Option A — Tampermonkey (recommended)</h2>
    <ol>
      <li>Install <a href="${TAMPERMONKEY_APP_URL}">Tampermonkey</a> from the App Store.</li>
      <li><strong>Settings → Safari → Extensions → Tampermonkey → On</strong>, allow All Websites.</li>
      <li>Open the Tampermonkey app / dashboard → create a new script (or Utilities → Install from URL).</li>
      <li>Paste the script from the raw URL below, or use Install from URL with that link.</li>
      <li>Save / enable the script.</li>
      <li>Open <a href="https://x.com/home">x.com/home</a> in Safari and reload.</li>
    </ol>
    <a class="btn" href="${RAW_USERSCRIPT_URL}">Open script URL</a>

    <h2>Option B — Stay for Safari</h2>
    <ol>
      <li>Install <a href="${STAY_APP_URL}">Stay for Safari</a>.</li>
      <li><strong>Settings → Safari → Extensions → Stay → On</strong>, allow All Websites.</li>
      <li>In the Stay app: <strong>+</strong> → import from <strong>Link</strong> → paste the script URL above.</li>
      <li>Activate the script in Stay’s <strong>Library</strong>.</li>
      <li>Reload x.com in Safari.</li>
    </ol>

    <h2>Option C — Userscripts (free)</h2>
    <ol>
      <li>Install <a href="${USERSCRIPTS_APP_URL}">Userscripts</a>.</li>
      <li><strong>Settings → Safari → Extensions → Userscripts → On</strong>, allow All Websites.</li>
      <li>Open the script URL, then tap <strong>aA → Userscripts → Install</strong> (only works after step 2).</li>
    </ol>
    <a class="btn secondary" id="download" href="${octetDataUri}" download="x-list-focus.user.js">Download .user.js</a>
    <p id="status" class="note" aria-live="polite"></p>

    <h2>Still nothing?</h2>
    <ol>
      <li>Confirm the extension is On under <strong>Settings → Safari → Extensions</strong> (not only inside Safari).</li>
      <li>On x.com, tap <strong>aA → Manage Extensions</strong> and enable the manager for this site.</li>
      <li>Reload twice.</li>
      <li>If Userscripts’ aA entry never appears, use Tampermonkey or Stay instead.</li>
    </ol>

    <p class="note">Chrome extension zip (desktop / Orion only): <a href="${EXTENSION_ZIP_URL}">x-list-focus-extension.zip</a></p>

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
          status.textContent = "Downloaded. Prefer Tampermonkey/Stay import from URL on Safari.";
          event.preventDefault();
        } catch (err) {
          status.textContent = "Use Open script URL instead.";
        }
      });
    </script>
  </body>
</html>
`;

mkdirSync(join(root, "docs"), { recursive: true });
writeFileSync(join(root, "docs", "install.html"), installHtml);
console.log("Wrote docs/install.html");
