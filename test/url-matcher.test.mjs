import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
require("../config.js");
const { isAllowedXUrl } = require("../url-matcher.js");
import assert from "node:assert/strict";

const allowedLists = [
  "https://x.com/i/lists/2062211801987641463",
  "https://x.com/i/lists/2047478346116686143",
  "https://x.com/i/lists/2059974188396351918",
  "https://x.com/i/lists/2063220039365415064",
];

for (const url of allowedLists) {
  assert.equal(isAllowedXUrl(url), true, `should allow ${url}`);
  assert.equal(isAllowedXUrl(`${url}/`), true, `should allow ${url}/`);
  assert.equal(isAllowedXUrl(`${url}/members`), true, `should allow ${url}/members`);
}

const allowedTweets = [
  "https://x.com/KobeissiLetter/status/2070144551960928521",
  "https://x.com/KobeissiLetter/status/2070144551960928521/photo/1",
  "https://x.com/i/status/2070144551960928521",
  "https://twitter.com/KobeissiLetter/status/2070144551960928521",
];

for (const url of allowedTweets) {
  assert.equal(isAllowedXUrl(url), true, `should allow ${url}`);
}

const allowedAuth = [
  "https://x.com/login",
  "https://x.com/logout",
  "https://x.com/signup",
  "https://x.com/i/flow/login",
  "https://x.com/i/flow/signup",
  "https://x.com/i/flow/password_reset",
  "https://x.com/i/flow/single_sign_on",
  "https://x.com/account/access",
  "https://x.com/oauth/authenticate",
  "https://x.com/i/oauth2/authorize",
  "https://twitter.com/i/flow/login",
];

for (const url of allowedAuth) {
  assert.equal(isAllowedXUrl(url), true, `should allow ${url}`);
}

const allowedProfiles = [
  "https://x.com/asklivermore",
  "https://x.com/asklivermore/",
  "https://x.com/asklivermore/with_replies",
  "https://x.com/mat78704",
  "https://x.com/labubu_trader",
  "https://x.com/Franktradinglog",
  "https://x.com/FRANKTRADINGLOG",
  "https://twitter.com/mat78704",
];

for (const url of allowedProfiles) {
  assert.equal(isAllowedXUrl(url), true, `should allow ${url}`);
}

const blocked = [
  "https://x.com/home",
  "https://x.com/",
  "https://x.com/explore",
  "https://x.com/notifications",
  "https://x.com/messages",
  "https://x.com/KobeissiLetter",
  "https://x.com/KobeissiLetter/with_replies",
  "https://x.com/i/lists/9999999999999999999",
  "https://x.com/i/lists/9999999999999999999/members",
  "https://x.com/search?q=test",
  "https://x.com/settings",
  "https://x.com/compose/post",
];

for (const url of blocked) {
  assert.equal(isAllowedXUrl(url), false, `should block ${url}`);
}

assert.equal(isAllowedXUrl("https://example.com"), true, "non-x urls are ignored");

console.log("All URL matcher tests passed.");
