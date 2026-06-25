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
