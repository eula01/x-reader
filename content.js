const OVERLAY_ID = "x-list-focus-overlay";
const PAGE_HOOK_ID = "x-list-focus-page-hook";
const STYLE_ID = "x-list-focus-styles";
const ALLOWED_LISTS = globalThis.ALLOWED_LISTS;
const ALLOWED_PROFILES = globalThis.ALLOWED_PROFILES ?? [];
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
  overlay.setAttribute("aria-label", "X access limited to your lists and profiles");

  const panel = document.createElement("div");
  panel.className = "xlf-panel";

  const title = document.createElement("p");
  title.className = "xlf-title";
  title.textContent =
    "Only your lists, allowed profiles, and direct tweet links are available.";

  const listHeading = document.createElement("p");
  listHeading.className = "xlf-section";
  listHeading.textContent = "Lists";

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

  const profileHeading = document.createElement("p");
  profileHeading.className = "xlf-section";
  profileHeading.textContent = "Profiles";

  const profiles = document.createElement("div");
  profiles.className = "xlf-buttons";

  for (const profile of ALLOWED_PROFILES) {
    const link = document.createElement("a");
    link.className = "xlf-btn xlf-btn-profile";
    link.href = profile.url;
    link.dataset.profileHandle = profile.handle;
    link.textContent = profile.title || `@${profile.handle}`;
    profiles.appendChild(link);
  }

  panel.appendChild(title);
  panel.appendChild(listHeading);
  panel.appendChild(buttons);
  if (ALLOWED_PROFILES.length) {
    panel.appendChild(profileHeading);
    panel.appendChild(profiles);
  }
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
