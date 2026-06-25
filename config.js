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
