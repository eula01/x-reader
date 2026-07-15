# Safari on iPhone — how X List Focus can run

## Reality check (2026)

Apple only allows automatic JavaScript injection in **Safari** through a **Safari Web Extension**.

That means:

- DuckDuckGo iOS → **no** (no third-party extensions)
- Chrome iOS → **no**
- Orion → can run Chrome extensions, but **links still open Safari**, so it does not solve “I always end up in Safari”
- Safari → **yes**, via Tampermonkey, Stay, Userscripts, or a custom Safari Web Extension

There is no way to delete Safari or stop iOS from opening some links there. The fix is to make the script run **inside Safari**.

## Why `aA → Userscripts` did nothing

Almost always this:

1. The manager app is installed, but
2. The Safari extension is still **Off** in **iPhone Settings → Safari → Extensions**

Until that switch is On (and allowed for websites), Safari’s **aA** menu will not show a working Userscripts/Tampermonkey/Stay popup.

Do this first for whichever manager you pick:

1. Open **Settings** (system app)
2. Tap **Safari → Extensions**
3. Tap the manager → turn **On**
4. Under permissions, allow **All Websites** (or at least x.com)

Then open Safari → x.com → **aA → Manage Extensions** and confirm it is enabled for the site.

## Recommended: Tampermonkey for Safari

Tampermonkey is on the App Store for iOS and is the most mainstream userscript manager.

1. Install: https://apps.apple.com/app/tampermonkey/id6738342400
2. Enable it in **Settings → Safari → Extensions** (see above)
3. Install the script from:  
   https://raw.githubusercontent.com/eula01/x-reader/cursor/iphone-safari-mobile-f9b2/userscript/x-list-focus.user.js  
   - Prefer Tampermonkey dashboard → **Utilities → Install from URL**, or create a new script and paste the file contents
4. Open https://x.com/home in Safari and reload

You should see the white overlay with four list buttons (login pages stay allowed).

## Alternative: Stay for Safari

Stay imports scripts **inside its own app** (no reliance on the Userscripts popup).

1. Install: https://apps.apple.com/app/stay-for-safari/id1591620171
2. Enable Stay in **Settings → Safari → Extensions**
3. In Stay: **+ → Link** → paste the raw `.user.js` URL above
4. Activate it in Stay’s **Library**
5. Reload x.com in Safari

## Alternative: Userscripts (free)

1. Install: https://apps.apple.com/app/userscripts/id1463298887
2. Enable in **Settings → Safari → Extensions** first
3. Open the raw `.user.js` URL in Safari
4. Tap **aA → Userscripts → Install**
5. Reload x.com

If step 4 still does nothing after step 2, switch to Tampermonkey or Stay.

## Durable option: ship our own Safari extension

Apple’s Safari Web Extension Packager (App Store Connect) can turn this repo’s Chrome extension files into an iOS Safari extension **without Xcode**, then distribute via **TestFlight**.

Requirements:

- Apple Developer Program membership
- App Store Connect access

Steps (owner of the Apple account):

1. Create a new iOS app record in App Store Connect
2. Open **Xcode Cloud → Safari Web Extension Packager → Upload**
3. Upload the contents of `dist/x-list-focus-extension.zip` (manifest + JS/CSS/icons)
4. Wait for packaging
5. Install the build with **TestFlight** on your iPhone
6. Enable **X List Focus** under **Settings → Safari → Extensions**

Docs: https://developer.apple.com/documentation/safariservices/packaging-and-distributing-safari-web-extensions-with-app-store-connect

## Guided page

https://htmlpreview.github.io/?https://github.com/eula01/x-reader/blob/cursor/iphone-safari-mobile-f9b2/docs/install.html
