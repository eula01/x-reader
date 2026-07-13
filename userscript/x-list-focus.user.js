// ==UserScript==
// @name           X List Focus
// @description    Limits X to four list timelines and direct tweet links.
// @version        1.0.6
// @match          https://x.com/*
// @match          https://www.x.com/*
// @match          https://twitter.com/*
// @match          https://www.twitter.com/*
// @run-at         document-start
// @grant          none
// ==/UserScript==

(function () {
  if (window.__xlfPageHook) return;
  window.__xlfPageHook = true;

  function notify() {
    window.dispatchEvent(
      new CustomEvent("xlf-location-change", { detail: location.href })
    );
  }

  function installHistoryHook() {
    for (const type of ["pushState", "replaceState"]) {
      const original = History.prototype[type];
      if (original.__xlfWrapped) continue;

      const wrapped = function (...args) {
        const result = original.apply(this, args);
        notify();
        return result;
      };
      wrapped.__xlfWrapped = true;
      History.prototype[type] = wrapped;
    }
  }

  installHistoryHook();
  window.addEventListener("popstate", notify);
  window.addEventListener("hashchange", notify);

  // X or other libs may replace history methods after load.
  setInterval(installHistoryHook, 1000);
})();

globalThis.XLF_OVERLAY_CSS = "html.xlf-blocked {\n  overflow: hidden !important;\n  height: 100% !important;\n  height: -webkit-fill-available !important;\n}\n\nhtml.xlf-blocked body {\n  overflow: hidden !important;\n  position: fixed !important;\n  inset: 0 !important;\n  width: 100% !important;\n  height: 100% !important;\n  height: -webkit-fill-available !important;\n  overscroll-behavior: none !important;\n  touch-action: none !important;\n}\n\n#x-list-focus-overlay {\n  all: initial;\n  position: fixed;\n  inset: 0;\n  z-index: 2147483647;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  width: 100%;\n  min-height: 100vh;\n  min-height: -webkit-fill-available;\n  min-height: 100dvh;\n  padding: max(16px, env(safe-area-inset-top, 0px))\n    max(16px, env(safe-area-inset-right, 0px))\n    max(16px, env(safe-area-inset-bottom, 0px))\n    max(16px, env(safe-area-inset-left, 0px));\n  background: #ffffff;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica,\n    Arial, sans-serif;\n  -webkit-text-size-adjust: 100%;\n  overscroll-behavior: none;\n}\n\n#x-list-focus-overlay * {\n  box-sizing: border-box;\n}\n\n#x-list-focus-overlay .xlf-panel {\n  width: min(420px, calc(100vw - 32px));\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n\n#x-list-focus-overlay .xlf-title {\n  margin: 0;\n  color: #0f1419;\n  font-size: 15px;\n  line-height: 1.5;\n  text-align: center;\n}\n\n#x-list-focus-overlay .xlf-buttons {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n\n#x-list-focus-overlay .xlf-btn {\n  display: block;\n  width: 100%;\n  min-height: 44px;\n  padding: 14px 16px;\n  border: 1px solid #cfd9de;\n  border-radius: 16px;\n  background: #ffffff;\n  color: #0f1419;\n  font-size: 15px;\n  font-weight: 600;\n  line-height: 1.35;\n  text-align: center;\n  text-decoration: none;\n  cursor: pointer;\n  white-space: normal;\n  touch-action: manipulation;\n  -webkit-tap-highlight-color: transparent;\n  transition: background 120ms ease, border-color 120ms ease;\n}\n\n#x-list-focus-overlay .xlf-btn:hover {\n  background: #f7f9f9;\n  border-color: #536471;\n}\n\n#x-list-focus-overlay .xlf-btn:focus-visible {\n  outline: 2px solid #1d9bf0;\n  outline-offset: 2px;\n}";

/** @typedef {{ id: string; title: string; url: string }} AllowedList */

/** @type {AllowedList[]} */
globalThis.ALLOWED_LISTS = [
  {
    id: "2062211801987641463",
    title: "",
    url: "https://x.com/i/lists/2062211801987641463",
  },
  {
    id: "2047478346116686143",
    title: "",
    url: "https://x.com/i/lists/2047478346116686143",
  },
  {
    id: "2059974188396351918",
    title: "",
    url: "https://x.com/i/lists/2059974188396351918",
  },
  {
    id: "2063220039365415064",
    title: "",
    url: "https://x.com/i/lists/2063220039365415064",
  },
];

globalThis.ALLOWED_LIST_IDS = new Set(
  globalThis.ALLOWED_LISTS.map((list) => list.id)
);

globalThis.X_HOSTS = new Set([
  "x.com",
  "www.x.com",
  "twitter.com",
  "www.twitter.com",
]);

/**
 * Returns true when the URL should be shown without the focus overlay.
 * @param {string} href
 * @returns {boolean}
 */
function isAllowedXUrl(href) {
  const X_HOSTS = globalThis.X_HOSTS;
  const ALLOWED_LIST_IDS = globalThis.ALLOWED_LIST_IDS;

  let url;
  try {
    url = new URL(href);
  } catch {
    return true;
  }

  if (!X_HOSTS.has(url.hostname)) {
    return true;
  }

  const path = url.pathname.replace(/\/+$/, "") || "/";

  const listMatch = path.match(/^\/i\/lists\/(\d+)(?:\/.*)?$/);
  if (listMatch && ALLOWED_LIST_IDS.has(listMatch[1])) {
    return true;
  }

  if (/^\/[^/]+\/status\/\d+/.test(path)) {
    return true;
  }

  if (/^\/i\/status\/\d+/.test(path)) {
    return true;
  }

  return false;
}

globalThis.isAllowedXUrl = isAllowedXUrl;

if (typeof module !== "undefined") {
  module.exports = {
    isAllowedXUrl,
    ALLOWED_LISTS: globalThis.ALLOWED_LISTS,
    ALLOWED_LIST_IDS: globalThis.ALLOWED_LIST_IDS,
    X_HOSTS: globalThis.X_HOSTS,
  };
}

const OVERLAY_ID = "x-list-focus-overlay";
const PAGE_HOOK_ID = "x-list-focus-page-hook";
const STYLE_ID = "x-list-focus-styles";
const ALLOWED_LISTS = globalThis.ALLOWED_LISTS;
const sessionTitles = Object.create(null);
let titleWatchTimer = null;

function getPageHookSource() {
  return globalThis.XLF_PAGE_HOOK_INLINE ?? null;
}

function appendPageHookScript(source) {
  const script = document.createElement("script");
  script.id = PAGE_HOOK_ID;
  script.textContent = source;
  (document.documentElement || document.head).appendChild(script);
  script.remove();
}

async function injectPageHook() {
  if (document.getElementById(PAGE_HOOK_ID)) return;
  // Userscript builds run page-hook.js in-page already.
  if (globalThis.__xlfPageHook) return;

  const inlineSource = getPageHookSource();
  if (inlineSource) {
    appendPageHookScript(inlineSource);
    return;
  }

  const hookUrl = globalThis.xlfRuntime?.getURL("page-hook.js");
  if (!hookUrl) return;

  try {
    const response = await fetch(hookUrl);
    if (response.ok) {
      appendPageHookScript(await response.text());
      return;
    }
  } catch {
    // Safari iOS can block extension:// script src in page context; inline works.
  }

  const script = document.createElement("script");
  script.id = PAGE_HOOK_ID;
  script.src = hookUrl;
  script.onload = () => script.remove();
  (document.documentElement || document.head).appendChild(script);
}

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;

  const css = globalThis.XLF_OVERLAY_CSS;
  if (!css) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = css;
  (document.documentElement || document.head).appendChild(style);
}

function parseListTitleFromDocument() {
  const heading =
    document.querySelector('[data-testid="primaryColumn"] h2[role="heading"]') ||
    document.querySelector('[data-testid="primaryColumn"] h2');
  if (heading?.textContent?.trim()) {
    return heading.textContent.trim();
  }

  const titleMatch = document.title.match(
    /(?:\([^)]+\)\s*)?(?:@[^/]+\/)?(.+?)\s+\/\s+X/i
  );
  return titleMatch?.[1]?.trim() || null;
}

function getCurrentListId() {
  const match = location.pathname.match(/^\/i\/lists\/(\d+)/);
  return match?.[1] ?? null;
}

function getListButtonLabel(list) {
  if (list.title) return list.title;
  if (sessionTitles[list.id]) return sessionTitles[list.id];
  return `List …${list.id.slice(-4)}`;
}

function refreshOverlayButtons() {
  const overlay = document.getElementById(OVERLAY_ID);
  if (!overlay) return;

  for (const link of overlay.querySelectorAll(".xlf-btn")) {
    const list = ALLOWED_LISTS.find((item) => item.id === link.dataset.listId);
    if (list) link.textContent = getListButtonLabel(list);
  }
}

function cacheTitleForCurrentListPage() {
  const listId = getCurrentListId();
  if (!listId || !globalThis.ALLOWED_LIST_IDS.has(listId)) return;

  const list = ALLOWED_LISTS.find((item) => item.id === listId);
  if (list?.title) return;

  const scraped = parseListTitleFromDocument();
  if (!scraped || sessionTitles[listId] === scraped) return;

  sessionTitles[listId] = scraped;
  refreshOverlayButtons();
}

function watchCurrentListTitle() {
  if (titleWatchTimer) {
    clearInterval(titleWatchTimer);
    titleWatchTimer = null;
  }

  if (!isAllowedXUrl(location.href) || !getCurrentListId()) return;

  let attempts = 0;
  titleWatchTimer = setInterval(() => {
    if (!isAllowedXUrl(location.href) || !getCurrentListId()) {
      clearInterval(titleWatchTimer);
      titleWatchTimer = null;
      return;
    }

    cacheTitleForCurrentListPage();
    attempts += 1;
    if (attempts >= 20) {
      clearInterval(titleWatchTimer);
      titleWatchTimer = null;
    }
  }, 500);
}

function ensureOverlay() {
  let overlay = document.getElementById(OVERLAY_ID);
  if (overlay) return overlay;

  overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "X access limited to your lists");

  const panel = document.createElement("div");
  panel.className = "xlf-panel";

  const title = document.createElement("p");
  title.className = "xlf-title";
  title.textContent = "Only your lists and direct tweet links are allowed.";

  const buttons = document.createElement("div");
  buttons.className = "xlf-buttons";

  for (const list of ALLOWED_LISTS) {
    const link = document.createElement("a");
    link.className = "xlf-btn";
    link.href = list.url;
    link.dataset.listId = list.id;
    link.textContent = getListButtonLabel(list);
    buttons.appendChild(link);
  }

  panel.appendChild(title);
  panel.appendChild(buttons);
  overlay.appendChild(panel);

  return overlay;
}

function showOverlay() {
  const overlay = ensureOverlay();
  if (!overlay.isConnected) {
    (document.documentElement || document.body).appendChild(overlay);
  }
  document.documentElement.classList.add("xlf-blocked");
  refreshOverlayButtons();
}

function hideOverlay() {
  document.getElementById(OVERLAY_ID)?.remove();
  document.documentElement.classList.remove("xlf-blocked");
}

function applyFocusMode() {
  if (isAllowedXUrl(location.href)) {
    hideOverlay();
    cacheTitleForCurrentListPage();
    watchCurrentListTitle();
    return;
  }

  showOverlay();
}

let lastHref = location.href;

function onLocationChange() {
  if (location.href === lastHref) return;
  lastHref = location.href;
  applyFocusMode();
}

function watchLocationChanges() {
  window.addEventListener("xlf-location-change", onLocationChange);
  setInterval(onLocationChange, 200);
}

function watchOverlayPersistence() {
  const observer = new MutationObserver(() => {
    if (isAllowedXUrl(location.href)) return;
    if (!document.getElementById(OVERLAY_ID)) {
      showOverlay();
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
}

function boot() {
  injectStyles();
  injectPageHook();
  applyFocusMode();
  watchLocationChanges();
  watchOverlayPersistence();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyFocusMode);
  }
}

globalThis.xlfApply = applyFocusMode;
globalThis.xlfShow = showOverlay;
globalThis.xlfHide = hideOverlay;
globalThis.xlfIsAllowed = isAllowedXUrl;

boot();

