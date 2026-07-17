/** @typedef {{ id: string; title: string; url: string }} AllowedList */
/** @typedef {{ handle: string; title: string; url: string }} AllowedProfile */

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

/** @type {AllowedProfile[]} */
globalThis.ALLOWED_PROFILES = [
  {
    handle: "asklivermore",
    title: "@asklivermore",
    url: "https://x.com/asklivermore",
  },
  {
    handle: "mat78704",
    title: "@mat78704",
    url: "https://x.com/mat78704",
  },
  {
    handle: "labubu_trader",
    title: "@labubu_trader",
    url: "https://x.com/labubu_trader",
  },
  {
    handle: "Franktradinglog",
    title: "@Franktradinglog",
    url: "https://x.com/Franktradinglog",
  },
];

globalThis.ALLOWED_LIST_IDS = new Set(
  globalThis.ALLOWED_LISTS.map((list) => list.id)
);

globalThis.ALLOWED_PROFILE_HANDLES = new Set(
  globalThis.ALLOWED_PROFILES.map((profile) => profile.handle.toLowerCase())
);

globalThis.X_HOSTS = new Set([
  "x.com",
  "www.x.com",
  "twitter.com",
  "www.twitter.com",
]);
