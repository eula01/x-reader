/** @typedef {{ id: string; label: string; url: string }} AllowedList */

/** @type {AllowedList[]} */
const ALLOWED_LISTS = [
  {
    id: "2062211801987641463",
    label: "List 1",
    url: "https://x.com/i/lists/2062211801987641463",
  },
  {
    id: "2047478346116686143",
    label: "List 2",
    url: "https://x.com/i/lists/2047478346116686143",
  },
  {
    id: "2059974188396351918",
    label: "List 3",
    url: "https://x.com/i/lists/2059974188396351918",
  },
  {
    id: "2063220039365415064",
    label: "List 4",
    url: "https://x.com/i/lists/2063220039365415064",
  },
];

const ALLOWED_LIST_IDS = new Set(ALLOWED_LISTS.map((list) => list.id));

const X_HOSTS = new Set(["x.com", "www.x.com", "twitter.com", "www.twitter.com"]);

if (typeof globalThis !== "undefined") {
  globalThis.ALLOWED_LISTS = ALLOWED_LISTS;
  globalThis.ALLOWED_LIST_IDS = ALLOWED_LIST_IDS;
  globalThis.X_HOSTS = X_HOSTS;
}
