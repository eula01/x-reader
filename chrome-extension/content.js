const OVERLAY_ID = "x-list-focus-overlay";

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
    link.textContent = list.label;
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
}

function hideOverlay() {
  document.getElementById(OVERLAY_ID)?.remove();
  document.documentElement.classList.remove("xlf-blocked");
}

function applyFocusMode() {
  if (isAllowedXUrl(location.href)) {
    hideOverlay();
    return;
  }
  showOverlay();
}

function hookHistory() {
  const wrap = (method) => {
    const original = history[method];
    return function (...args) {
      const result = original.apply(this, args);
      applyFocusMode();
      return result;
    };
  };

  history.pushState = wrap("pushState");
  history.replaceState = wrap("replaceState");
  window.addEventListener("popstate", applyFocusMode);
}

function watchSpaNavigation() {
  let lastHref = location.href;
  const observer = new MutationObserver(() => {
    if (location.href === lastHref) return;
    lastHref = location.href;
    applyFocusMode();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
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
  applyFocusMode();
  hookHistory();
  watchSpaNavigation();
  watchOverlayPersistence();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyFocusMode);
  }
}

if (typeof globalThis !== "undefined") {
  globalThis.xlfApply = applyFocusMode;
  globalThis.xlfShow = showOverlay;
  globalThis.xlfHide = hideOverlay;
  globalThis.xlfIsAllowed = isAllowedXUrl;
}

boot();
