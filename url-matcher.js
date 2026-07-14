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

  // Sign-in / account recovery / OAuth flows.
  if (
    path === "/login" ||
    path === "/logout" ||
    path === "/signup" ||
    path.startsWith("/i/flow/") ||
    path.startsWith("/account/") ||
    path.startsWith("/oauth") ||
    path.startsWith("/i/oauth") ||
    path.startsWith("/i/sessions")
  ) {
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
