import { test, expect, type Page } from "@playwright/test";

/**
 * Smoke pass — deliberately small.
 *
 * Scope is the regression baseline: the site renders, it is genuinely RTL, the
 * lightbox opens, a dish route survives a hard load under the base path, and
 * nothing 404s. It is not coverage, and it should not grow into coverage — add
 * cases when a page is added, not speculatively.
 *
 * Every assertion here corresponds to a defect that actually happened, which is
 * the only reason each one is worth a test. Two of them are specific to this
 * site rather than inherited: there must be **no form anywhere**, and the
 * structured data must claim nothing — no price, no rating, no award, and above
 * all no dietary or allergen field.
 */

/**
 * The deployment base path. Spelled out rather than folded into `baseURL`:
 * these tests exist largely to catch base-path regressions, so it should be
 * visible at every call site.
 */
const rawBase = process.env.SMOKE_BASE_PATH ?? "/shabaneh";
const BASE = rawBase === "/" ? "" : rawBase.replace(/\/+$/, "");

/** Every route in the export, for the checks that must hold on all of them. */
const ROUTES = [
  "/",
  "/products/",
  "/products/badenjan-doodi/",
  "/products/mahiche-aram/",
  "/gallery/",
  "/about/",
];

/** Persian digits back to a number, so a rendered count can be compared. */
function fromFa(text: string): number {
  return Number(text.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/\D/g, ""));
}

/**
 * Every control on the page must have a non-empty accessible name.
 *
 * This exists because the interface strings moved out of the components and
 * into `src/content/ui.ts`. A mistyped path there does not throw and does not
 * render visibly wrong — the button still draws, still works, and simply stops
 * announcing itself, or announces the word "undefined". That is invisible to
 * every other check in this file and to anyone looking at the screen.
 *
 * It matters more here than on the other sites in this family: the photo
 * buttons on `/gallery/` and on a dish page have no text at all, so their name
 * is the only thing they have.
 */
async function namelessControls(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    [...document.querySelectorAll("button, a[href]")]
      .filter((el) => (el as HTMLElement).checkVisibility({ visibilityProperty: true }))
      .filter((el) => el.closest('[aria-hidden="true"]') === null)
      .filter((el) => {
        const label = el.getAttribute("aria-label");
        const name = label === null ? (el.textContent ?? "") : label;
        return name.trim() === "" || name.includes("undefined");
      })
      .map((el) => `${el.tagName.toLowerCase()}.${el.className || "(no class)"}`),
  );
}

/** Collects console errors and failed responses for the lifetime of a page. */
function watch(page: Page) {
  const consoleErrors: string[] = [];
  const failed: string[] = [];

  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));
  page.on("response", (r) => {
    if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
  });

  return { consoleErrors, failed };
}

/** Walk the page so every lazy image loads and every reveal fires. */
async function walk(page: Page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.75);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 1600));
  });
}

async function brokenImages(page: Page): Promise<number> {
  return page.evaluate(
    () => [...document.querySelectorAll("img")].filter((i) => i.complete && i.naturalWidth === 0).length,
  );
}

async function overflows(page: Page): Promise<boolean> {
  return page.evaluate(() => document.body.scrollWidth > document.body.clientWidth + 1);
}

test("homepage renders, is RTL, and loads every asset", async ({ page }) => {
  const { consoleErrors, failed } = watch(page);
  await page.goto(`${BASE}/`);

  // The name is the first thing on the site and it is the h1 — the opening band
  // hands the whole screen to it.
  await expect(page.locator("h1")).toHaveText("شبانه");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("html")).toHaveAttribute("lang", "fa");

  const direction = await page.evaluate(() => getComputedStyle(document.body).direction);
  expect(direction).toBe("rtl");

  // Five bands, in order, and the last of them is the one that can be reached
  // from the header — «رزرو میز» points at it.
  await expect(page.locator(".band")).toHaveCount(7);

  await walk(page);
  expect(await brokenImages(page), "images failing to load").toBe(0);
  expect(await overflows(page), "horizontal overflow").toBe(false);
  expect(await namelessControls(page), "controls with no accessible name").toEqual([]);
  expect(failed, "failed requests").toEqual([]);
  expect(consoleErrors, "console errors").toEqual([]);
});

test("a dish's close view opens the lightbox and closes again", async ({ page }) => {
  await page.goto(`${BASE}/products/badenjan-doodi/`);
  await walk(page);

  // Three of the nine dishes carry an extra view. Its image is a real button,
  // not a div with a click handler — and it must compute as a pointer, which is
  // a defect this family has shipped before.
  const opener = page.locator("button.photo-button").first();
  await expect(opener).toBeVisible();
  await expect(opener).toHaveAttribute("aria-label", /\S/);
  const cursor = await opener.evaluate((el) => getComputedStyle(el).cursor);
  expect(cursor, "an image that opens something must look clickable").toBe("pointer");

  await opener.click();
  const dialog = page.locator("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveJSProperty("open", true);
  await expect(dialog).toHaveAttribute("aria-label", /\S/);
  expect(await namelessControls(page), "lightbox controls with no name").toEqual([]);

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveJSProperty("open", false);
});

test("a dish route survives a hard load under the base path", async ({ page }) => {
  const { consoleErrors, failed } = watch(page);
  const response = await page.goto(`${BASE}/products/badenjan-doodi/`);
  expect(response?.status()).toBe(200);

  await expect(page.locator("h1")).toHaveText("بادمجان دودی");

  // The breadcrumb is the classic base-path casualty: it used to escape the
  // site entirely by linking to "/" on a project page.
  const homeLink = page.getByRole("navigation", { name: "مسیر صفحه" }).getByRole("link").first();
  await expect(homeLink).toHaveAttribute("href", `${BASE}/`);

  // The conversion is a reservation, not a purchase. It must carry the dish
  // name and it must be a wa.me link with digits only in the path.
  const reserve = page.locator('a[href^="https://wa.me/"]').first();
  const href = await reserve.getAttribute("href");
  expect(href, "WhatsApp reservation link").toBeTruthy();
  expect(decodeURIComponent(href!), "dish name prefilled").toContain("بادمجان دودی");
  expect(href!, "digits only in the wa.me path").toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
  await expect(reserve).toHaveAttribute("rel", /noopener/);

  // Two related dishes, neither of which is this one.
  const related = await page
    .locator('a[href*="/products/"]')
    .evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""));
  expect(related.length).toBeGreaterThan(0);
  expect(related.some((h) => h.includes("/products/badenjan-doodi"))).toBe(false);

  // No price anywhere on a dish page, in any form.
  const body = (await page.locator("body").textContent()) ?? "";
  expect(body, "a price on a dish page").not.toMatch(/تومان|ریال|﷼/);

  expect(failed, "failed requests").toEqual([]);
  expect(consoleErrors, "console errors").toEqual([]);
});

test("the menu lists nine dishes in three groups and counts them in Persian", async ({ page }) => {
  const { consoleErrors, failed } = watch(page);
  const response = await page.goto(`${BASE}/products/`);
  expect(response?.status()).toBe(200);

  await expect(page.locator("h1")).toHaveText("نه خوراک، در سه دسته");

  const list = page.getByRole("region", { name: "فهرست خوراک‌ها" }).or(
    page.locator('[aria-label="فهرست خوراک‌ها"]'),
  );
  await expect(list.first()).toHaveCount(1);

  // Nine bands, and two group marks — the marks are derived from where the
  // course changes, so a tenth dish in a new course moves them by itself.
  await expect(page.locator(".band")).toHaveCount(9);
  await expect(page.locator(".group-mark")).toHaveCount(2);

  // Every dish has its own section id, which is what makes a deep link possible
  // without a visible index.
  for (const slug of [
    "badenjan-doodi",
    "soup-adas",
    "kookoo-gerdoo",
    "mahiche-aram",
    "polo-zaferan",
    "morgh-anar",
    "tart-morakkabat",
    "bastani-golab",
    "halva-konjed",
  ]) {
    await expect(page.locator(`#dish-${slug}`), `section for ${slug}`).toHaveCount(1);
  }

  // The rendered count is in Persian digits and must equal the real one.
  const printed = (await page.locator("body").textContent()) ?? "";
  const counted = printed.match(/[۰-۹]+\s*خوراک/);
  expect(counted, "a rendered dish count").toBeTruthy();
  expect(fromFa(counted![0])).toBe(9);

  await walk(page);
  expect(await brokenImages(page), "images failing to load").toBe(0);
  expect(await overflows(page), "horizontal overflow").toBe(false);
  expect(failed, "failed requests").toEqual([]);
  expect(consoleErrors, "console errors").toEqual([]);
});

test("the space page stacks full-bleed photographs and opens the right one", async ({ page }) => {
  const { consoleErrors, failed } = watch(page);
  const response = await page.goto(`${BASE}/gallery/`);
  expect(response?.status()).toBe(200);

  await expect(page.locator("h1")).toHaveText("سالن، پیش از مهمان‌ها");

  // Stacked bands, explicitly not a tile grid. If this ever becomes a grid the
  // count stays the same and the layout changes, so the band class is the
  // assertion, not the number of images.
  await expect(page.locator(".band")).toHaveCount(6);
  await expect(page.locator("button.photo-button")).toHaveCount(6);

  await walk(page);
  const second = page.locator("button.photo-button").nth(1);
  const name = await second.getAttribute("aria-label");
  await second.click();

  const dialog = page.locator("dialog");
  await expect(dialog).toHaveJSProperty("open", true);
  // The one that opened must be the one that was clicked — an off-by-one here
  // is invisible until someone notices the caption does not match.
  expect(name).toBeTruthy();
  const shown = (await dialog.textContent()) ?? "";
  expect(shown, "the lightbox opened on the clicked photograph").toContain(
    name!.split("—").pop()!.trim(),
  );

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveJSProperty("open", false);

  expect(await brokenImages(page), "images failing to load").toBe(0);
  expect(await overflows(page), "horizontal overflow").toBe(false);
  expect(failed, "failed requests").toEqual([]);
  expect(consoleErrors, "console errors").toEqual([]);
});

test("the about page owns the reservation anchor and both ways to reach it", async ({ page }) => {
  const { consoleErrors, failed } = watch(page);
  const response = await page.goto(`${BASE}/about/`);
  expect(response?.status()).toBe(200);

  await expect(page.locator("h1")).toHaveText("چرا فقط شب");

  // «رزرو میز» in the header points here, so this anchor has to exist.
  await expect(page.locator("#reserve")).toHaveCount(1);

  const phone = page.locator('a[href^="tel:"]').first();
  await expect(phone).toHaveCount(1);

  const chat = page.locator('a[href^="https://wa.me/"]').first();
  await expect(chat).toHaveCount(1);
  await expect(chat).toHaveAttribute("rel", /noopener/);

  const instagram = page.locator('a[href*="instagram.com"]').first();
  await expect(instagram).toHaveCount(1);
  await expect(instagram).toHaveAttribute("rel", /noopener/);

  // The address must read as a place that does not exist: a district, never a
  // street number, and never a map.
  const body = (await page.locator("body").textContent()) ?? "";
  expect(body, "a street number in the address").not.toMatch(/پلاک|خیابان\s|کوچه\s/);
  await expect(page.locator("iframe"), "a map embed").toHaveCount(0);

  const deadLinks = await page
    .locator('a[href="#"]')
    .evaluateAll((els) => els.map((el) => el.textContent ?? ""));
  expect(deadLinks, "links pointing at #").toEqual([]);

  await walk(page);
  expect(await brokenImages(page), "images failing to load").toBe(0);
  expect(failed, "failed requests").toEqual([]);
  expect(consoleErrors, "console errors").toEqual([]);
});

test("every route carries its own metadata, under the deployed base path", async ({ page }) => {
  const seen = new Set<string>();

  for (const route of ROUTES) {
    await page.goto(`${BASE}${route}`);
    const meta = await page.evaluate(() => {
      const get = (selector: string, attr = "content") =>
        document.querySelector(selector)?.getAttribute(attr) ?? "";
      return {
        title: document.title,
        description: get('meta[name="description"]'),
        ogTitle: get('meta[property="og:title"]'),
        canonical: get('link[rel="canonical"]', "href"),
        ogUrl: get('meta[property="og:url"]'),
        ogImage: get('meta[property="og:image"]'),
        robots: get('meta[name="robots"]'),
      };
    });

    expect(meta.title, `${route} title`).toBeTruthy();
    expect(meta.description, `${route} description`).toBeTruthy();
    expect(meta.ogTitle, `${route} og:title matches the page title`).toBe(meta.title);

    // A duplicated title across two routes means pageMetadata was not called.
    expect(seen.has(meta.title), `${route} has a title of its own`).toBe(false);
    seen.add(meta.title);

    // This is a demo of a restaurant that does not exist. It must not be
    // indexable, on any route.
    expect(meta.robots, `${route} robots`).toContain("noindex");

    for (const [name, value] of Object.entries({
      canonical: meta.canonical,
      ogUrl: meta.ogUrl,
      ogImage: meta.ogImage,
    })) {
      expect(value, `${route} ${name} is absolute`).toMatch(/^https?:\/\//);
      if (BASE) expect(value, `${route} ${name} carries the base path`).toContain(`${BASE}/`);
    }
  }
});

test("the sitemap and robots.txt are exported, absolute, and closed", async ({ page }) => {
  const sitemap = await page.goto(`${BASE}/sitemap.xml`);
  expect(sitemap?.status()).toBe(200);
  const xml = (await sitemap?.text()) ?? "";
  expect(xml).toContain("<urlset");
  for (const route of ["/products/", "/gallery/", "/about/"]) {
    expect(xml, `sitemap lists ${route}`).toContain(`${route}</loc>`);
  }
  expect(xml, "sitemap urls are absolute").toMatch(/<loc>https?:\/\//);

  const robots = await page.goto(`${BASE}/robots.txt`);
  expect(robots?.status()).toBe(200);
  const text = (await robots?.text()) ?? "";
  // Everything is disallowed on purpose, and there is deliberately no sitemap
  // line: advertising a sitemap while disallowing every path in it is a
  // contradictory instruction.
  expect(text).toMatch(/Disallow:\s*\/\s*$/m);
  expect(text.toLowerCase()).not.toContain("sitemap:");
});

test("structured data parses and claims nothing invented", async ({ page }) => {
  await page.goto(`${BASE}/products/badenjan-doodi/`);
  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((els) => els.map((el) => el.textContent ?? ""));
  expect(blocks.length).toBeGreaterThan(0);

  const flat = blocks.join(" ");
  for (const block of blocks) {
    expect(() => JSON.parse(block), "ld+json parses").not.toThrow();
  }

  // The whole red-line list, as a test. A field added here later without a real
  // business behind it is a claim about a restaurant that does not exist — and
  // `suitableForDiet` is the one that could actually hurt somebody.
  for (const forbidden of [
    "price",
    "priceRange",
    "offers",
    "aggregateRating",
    "review",
    "award",
    "starRating",
    "suitableForDiet",
    "nutrition",
    "allergen",
    "address",
    "geo",
    "hasMap",
    "telephone",
    "acceptsReservations",
  ]) {
    expect(flat, `structured data must not claim ${forbidden}`).not.toContain(`"${forbidden}"`);
  }
});

test("every control that leaves the mobile menu closes it", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "the panel only exists on small screens");

  await page.goto(`${BASE}/`);
  const toggle = page.locator("button.menu-toggle").first();
  await expect(toggle).toBeVisible();
  await toggle.click();

  const panel = page.locator(".menu-panel");
  await expect(panel).toBeVisible();
  expect(await namelessControls(page), "panel controls with no name").toEqual([]);

  const link = panel.locator('a[href]').first();
  await link.click();
  await expect(panel).toBeHidden();
});

test("an unknown path serves the styled 404", async ({ page }) => {
  const response = await page.goto(`${BASE}/no-such-page/`);
  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("این نشانی وجود ندارد");
  // Deliberately no photograph here: a full-viewport dining room reads as a
  // page that worked.
  await expect(page.locator(".band__media")).toHaveCount(0);
  await expect(page.locator('a[href]').first()).toBeVisible();
});

test("no route carries a form, a price, or a booking widget", async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(`${BASE}${route}`);

    // There is no form on this site at all — the reservation is a phone call.
    // A form that posts nowhere is the single most likely thing to get added
    // here by accident, which is why this is checked on every route.
    await expect(page.locator("form"), `${route} has a form`).toHaveCount(0);
    await expect(page.locator("input, textarea, select"), `${route} has an input`).toHaveCount(0);
    await expect(page.locator('a[href="#"]'), `${route} has a dead link`).toHaveCount(0);

    const body = (await page.locator("body").textContent()) ?? "";
    expect(body, `${route} shows a price`).not.toMatch(/تومان|ریال|﷼/);
  }
});
