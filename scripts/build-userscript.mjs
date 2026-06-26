import { readFileSync, writeFileSync } from "node:fs";
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
