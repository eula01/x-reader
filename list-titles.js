const TITLE_STORAGE_KEY = "listTitles";

function parseListTitleFromDocument() {
  const heading =
    document.querySelector('[data-testid="primaryColumn"] h2[role="heading"]') ||
    document.querySelector('[data-testid="primaryColumn"] h2');
  if (heading?.textContent?.trim()) {
    return heading.textContent.trim();
  }

  const titleMatch = document.title.match(
    /(?:\([^)]+\)\s*)?(?:@[^/]+\/)?(.+?)\s+\/\s+X/i
  );
  return titleMatch?.[1]?.trim() || null;
}

function getCurrentListId() {
  const match = location.pathname.match(/^\/i\/lists\/(\d+)/);
  return match?.[1] ?? null;
}

async function loadStoredTitles() {
  const data = await chrome.storage.local.get(TITLE_STORAGE_KEY);
  return data[TITLE_STORAGE_KEY] || {};
}

async function saveListTitle(listId, title) {
  if (!title) return false;

  const titles = await loadStoredTitles();
  if (titles[listId] === title) return false;

  titles[listId] = title;
  await chrome.storage.local.set({ [TITLE_STORAGE_KEY]: titles });
  return true;
}

async function fetchListTitleFromApi(listId) {
  try {
    const response = await fetch(
      `https://x.com/i/api/1.1/lists/show.json?list_id=${listId}`,
      { credentials: "include" }
    );
    if (!response.ok) return null;

    const data = await response.json();
    return data.name?.trim() || null;
  } catch {
    return null;
  }
}

async function resolveListTitle(list) {
  if (list.title) return list.title;

  const stored = await loadStoredTitles();
  if (stored[list.id]) return stored[list.id];

  const fetched = await fetchListTitleFromApi(list.id);
  if (fetched) {
    await saveListTitle(list.id, fetched);
    return fetched;
  }

  return `List …${list.id.slice(-4)}`;
}

async function cacheTitleForCurrentListPage() {
  const listId = getCurrentListId();
  if (!listId || !ALLOWED_LIST_IDS.has(listId)) return;

  const list = ALLOWED_LISTS.find((item) => item.id === listId);
  if (list?.title) return;

  const scraped = parseListTitleFromDocument();
  if (scraped) {
    const changed = await saveListTitle(listId, scraped);
    if (changed) updateOverlayButtons();
    return;
  }

  const fetched = await fetchListTitleFromApi(listId);
  if (fetched) {
    const changed = await saveListTitle(listId, fetched);
    if (changed) updateOverlayButtons();
  }
}

async function prefetchAllListTitles() {
  await Promise.all(
    ALLOWED_LISTS.map(async (list) => {
      if (list.title) return;
      const stored = await loadStoredTitles();
      if (stored[list.id]) return;

      const fetched = await fetchListTitleFromApi(list.id);
      if (fetched) await saveListTitle(list.id, fetched);
    })
  );
}

function watchCurrentListTitle() {
  let attempts = 0;
  const timer = setInterval(() => {
    if (!isAllowedXUrl(location.href) || !getCurrentListId()) {
      clearInterval(timer);
      return;
    }

    attempts += 1;
    cacheTitleForCurrentListPage();

    if (attempts >= 20) {
      clearInterval(timer);
    }
  }, 500);
}

async function updateOverlayButtons() {
  const overlay = document.getElementById("x-list-focus-overlay");
  if (!overlay) return;

  const links = overlay.querySelectorAll(".xlf-btn");
  for (const link of links) {
    const list = ALLOWED_LISTS.find((item) => item.id === link.dataset.listId);
    if (!list) continue;
    link.textContent = await resolveListTitle(list);
  }
}
