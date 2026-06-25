/**
 * Returns true when the URL should be shown without the focus overlay.
 * @param {string} href
 * @returns {boolean}
 */
function isAllowedXUrl(href) {
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

if (typeof module !== "undefined") {
  module.exports = { isAllowedXUrl, ALLOWED_LISTS, ALLOWED_LIST_IDS, X_HOSTS };
}
