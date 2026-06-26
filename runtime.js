/** @type {typeof chrome | undefined} */
const extensionApi = globalThis.browser ?? globalThis.chrome;

globalThis.xlfRuntime = {
  getURL(path) {
    return extensionApi?.runtime?.getURL(path) ?? "";
  },
};
