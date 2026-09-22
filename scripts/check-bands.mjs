/**
 * The band harness — the verification pass this site actually needs.
 *
 * `check-viewports.mjs` answers the questions any site has: does it overflow,
 * did the images load, are the targets big enough. This one answers the
 * questions that only exist because every screen here is a photograph with
 * words on it, and it runs against the **served static export**, never
 * `next dev`.
 *
 *   npm run build:pages
 *   node scripts/check-bands.mjs
 *
 * It starts and stops its own static server unless one is already listening.
 *
 * ── THE CHECK THAT MATTERS: CONTRAST OVER AN IMAGE ─────────────────────────
 *
 * A token-based contrast check passes on this site while a caption is
 * completely invisible, because the background under a glyph is not a token —
 * it is whatever pixel happens to be there. So this pass:
 *
 *   1. finds every run of text, by Range, so the box is the text and not the
 *      element that contains it;
 *   2. makes all text transparent and screenshots the page, which leaves the
 *      photograph **with the scrim composited over it** exactly as the browser
 *      rasterised it — no gradient maths is re-implemented here, which is the
 *      only way this check stays true when the scrim changes;
 *   3. for each run, finds the pixel under it that gives the WORST ratio
 *      against the text colour;
 *   4. requires 4.5:1 for body text and 3:1 for large text.
 *
 * For light text on a dark ground the worst pixel is always the brightest one —
 * a blown highlight, a candle, a reflection off a glass. The search is written
 * as worst-ratio rather than brightest-pixel so it stays correct if a
 * dark-on-light band is ever introduced.
 *
 * Averaging is worthless here: average a caption sitting half on a black
 * tablecloth and half on a lit glass and it passes comfortably while half the
 * word has gone.
 *
 * **Against placeholder images this check is easy and close to meaningless.**
 * It runs anyway, to prove the harness works. The number that counts is the one
 * it prints after the real photographs are dropped in.
 *
 * ── AND THE REST ───────────────────────────────────────────────────────────
 *
 *   route walk     every route at 390 and 1440, console errors, failed requests
 *   overflow       body scrollWidth vs clientWidth, reported as numbers
 *   reduced motion revealed-element counts with and without must match
 *   short viewport 390x640 — no band may clip its own content
 *   focus rings    measured over a photograph: the ring against its halo, the
 *                  halo against the brightest pixel it sits on
 *   weight         per-route image bytes against a budget, and the lazy rule
 *   type           Persian glyph coverage and the rendered ink height of body
 */
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "out");

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};
const BASE = (flag("base", "/shabaneh") || "").replace(/\/+$/, "");
/**
 * A starting point, not a decision. Every site in this family previews on 4321,
 * and a preview server left running by one of them holds the port for days —
 * which surfaces as this harness timing out and blaming the build. So the port
 * is negotiated at startup and both of these are reassigned once.
 */
let PORT = Number(flag("port", process.env.PORT ?? "4321"));
let ORIGIN = `http://localhost:${PORT}`;

/** Image bytes a route may pull. The menu is the documented exception: nine
 *  dishes on one screen is the page, not an accident of it. */
const BUDGETS = [
  [/^\/$/, 2.0, "home"],
  [/^\/products\/$/, 2.5, "menu — documented exception"],
  [/^\/products\/[^/]+\/$/, 1.2, "dish"],
  [/^\/gallery\/$/, 2.5, "gallery"],
  [/^\/about\/$/, 2.0, "about"],
  [/404/, 0.3, "404 — carries no photograph by design"],
];
const budgetFor = (route) => BUDGETS.find(([re]) => re.test(route)) ?? [null, 2.0, "default"];

const VIEWPORTS = [
  { name: "390", width: 390, height: 844 },
  { name: "1440", width: 1440, height: 900 },
];

const problems = [];
const fail = (route, viewport, message) => problems.push(`${route} @${viewport} — ${message}`);
const head = (title) => console.log(`\n${"─".repeat(78)}\n${title}\n${"─".repeat(78)}`);
const urlFor = (route) => `${ORIGIN}${BASE}${route === "/404" ? "/404.html" : route}`;

/* ── plumbing ─────────────────────────────────────────────────────────────── */

/** Routes are read off the export, so a page cannot escape this harness because
 *  somebody forgot to add it to a list. */
function discoverRoutes(dir = outDir, prefix = "/") {
  const found = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("_") || entry.name === "media") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...discoverRoutes(full, `${prefix}${entry.name}/`));
    else if (entry.name === "index.html") found.push(prefix);
  }
  return found.sort((a, b) => a.length - b.length || a.localeCompare(b));
}

async function alive() {
  try {
    const res = await fetch(`${ORIGIN}${BASE}/`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

/** The first port from `from` upward that this process can actually bind. */
async function freePort(from) {
  for (let port = from; port < from + 60; port += 1) {
    const free = await new Promise((resolve) => {
      const probe = createServer();
      probe.once("error", () => resolve(false));
      probe.once("listening", () => probe.close(() => resolve(true)));
      // Wildcard, exactly as serve-static binds: a loopback-only probe
      // succeeds on Windows while another process holds 0.0.0.0, which reports a
      // taken port as free and just moves the failure one step later.
      probe.listen(port);
    });
    if (free) return port;
  }
  throw new Error(`no free port in ${from}..${from + 60}`);
}

async function startServer() {
  if (await alive()) {
    console.log(`using the server already listening on ${ORIGIN}`);
    return null;
  }
  const port = await freePort(PORT);
  if (port !== PORT) console.log(`port ${PORT} is taken by something else — using ${port}`);
  PORT = port;
  ORIGIN = `http://localhost:${PORT}`;
  const child = spawn(
    process.execPath,
    [join(here, "serve-static.mjs"), "--port", String(PORT), "--base", BASE.replace(/^\//, "")],
    { stdio: ["ignore", "ignore", "pipe"] },
  );
  // A server that dies on startup otherwise shows up as forty silent retries
  // and a timeout that blames the build.
  let stderr = "";
  child.stderr?.on("data", (chunk) => (stderr += chunk.toString()));
  child.on("error", (err) => (stderr += `spawn failed: ${err.message}\n`));
  child.on("exit", (code) => code !== null && code !== 0 && (stderr += `server exited ${code}\n`));
  for (let i = 0; i < 40; i += 1) {
    await new Promise((r) => setTimeout(r, 250));
    if (await alive()) return child;
  }
  child.kill();
  throw new Error(
    `the static server never came up on ${ORIGIN} — did you run npm run build:pages?` +
      (stderr ? `\n${stderr.trim()}` : ""),
  );
}

/** Walk the whole page so lazy images load and every reveal has fired. */
async function settle(page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.75);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 70));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    // A reveal takes --dur-band (1400ms). Measuring the instant the walk ends
    // reports the last screen as never revealed, which is a property of the
    // harness and not of the page.
    await new Promise((r) => setTimeout(r, 1700));
  });
  await page.evaluate(() =>
    Promise.all([...document.images].filter((i) => !i.complete).map((i) => i.decode().catch(() => {}))),
  );
}

/* ── in-page functions, serialised into the browser ───────────────────────── */

/**
 * Every run of text on the page, in document coordinates, as its **ink box**.
 *
 * `Range.getClientRects()` returns line boxes, and a line box is much taller
 * than the letters in it — it runs from the font's ascent to its descent and
 * then gets centred inside whatever the line-height is. Sampling a line box
 * finds pixels the glyphs never touch: a 1px rule sitting 8px under the
 * baseline is inside the line box and outside the text, and reporting it as the
 * background of the text is a false failure that sends you off to fix a scrim
 * that was never the problem.
 *
 * So each rect is narrowed to the actual rasterised extent of its glyphs, using
 * the same canvas metrics the browser rasterises with. For a run that wraps, the
 * ink extent of the whole string stands in for each line — same font, same
 * script, and the error is a fraction of a pixel.
 */
const collectTextRuns = () => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const ctx = document.createElement("canvas").getContext("2d");
  const runs = [];
  let node;
  while ((node = walker.nextNode())) {
    if (!node.nodeValue || !node.nodeValue.trim()) continue;
    const parent = node.parentElement;
    if (!parent || parent.closest("script,style,noscript")) continue;
    if (parent.closest(".sr-only")) continue;
    if (!parent.checkVisibility({ visibilityProperty: true, contentVisibilityAuto: true })) continue;
    const style = getComputedStyle(parent);
    if (Number(style.opacity) < 0.99) continue;

    const range = document.createRange();
    range.selectNodeContents(node);
    const size = parseFloat(style.fontSize);
    const weight = Number(style.fontWeight) || 400;
    const band = parent.closest(".band");
    const text = node.nodeValue.trim();

    ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const m = ctx.measureText(text);
    const inlineHeight = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent;

    for (const rect of range.getClientRects()) {
      if (rect.width < 3 || rect.height < 3) continue;
      // The inline box is centred in the line box; the baseline sits one font
      // ascent below its top. Everything below is measured off that.
      const baseline = rect.top + (rect.height - inlineHeight) / 2 + m.fontBoundingBoxAscent;
      const inkTop = Math.max(rect.top, baseline - m.actualBoundingBoxAscent);
      const inkBottom = Math.min(rect.bottom, baseline + m.actualBoundingBoxDescent);
      const height = inkBottom - inkTop;
      if (height < 2) continue;
      runs.push({
        text: text.slice(0, 30),
        tag: parent.tagName.toLowerCase(),
        cls: (parent.className || "").toString().split(" ")[0] || "",
        color: style.color,
        size,
        large: size >= 24 || (size >= 18.66 && weight >= 700),
        overImage: !!(band && band.querySelector(".band__media img")),
        x: rect.x + window.scrollX,
        y: inkTop + window.scrollY,
        w: rect.width,
        h: height,
        lineHeight: rect.height,
        // The skip link and anything else parked outside the document is
        // collected so it can be reported, and never measured — there is no
        // screenshot position at which it is on screen.
        offscreen: inkBottom + window.scrollY <= 0 || rect.right + window.scrollX <= 0,
      });
    }
  }
  return runs;
};

/** Sample one viewport screenshot for every run that falls inside it. */
const sampleViewport = async ({ shot, runs, indices }) => {
  const parse = (css) => css.match(/[\d.]+/g).slice(0, 3).map(Number);
  const lum = ([r, g, b]) =>
    [r, g, b]
      .map((v) => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      })
      .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
    return (x + 0.05) / (y + 0.05);
  };

  const bitmap = await createImageBitmap(await (await fetch(shot)).blob());
  const scale = bitmap.width / window.innerWidth;
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(bitmap, 0, 0);
  const frame = ctx.getImageData(0, 0, bitmap.width, bitmap.height).data;

  const results = [];
  for (const i of indices) {
    const run = runs[i];
    const fg = parse(run.color);
    // Padded by a pixel: an antialiased glyph edge sits just outside the Range
    // box, and the pixel that kills a letter is often the one it is drawn
    // against rather than the one under its middle.
    const x0 = Math.max(0, Math.floor((run.x - window.scrollX - 1) * scale));
    const y0 = Math.max(0, Math.floor((run.y - window.scrollY - 1) * scale));
    const x1 = Math.min(bitmap.width, Math.ceil((run.x - window.scrollX + run.w + 1) * scale));
    const y1 = Math.min(bitmap.height, Math.ceil((run.y - window.scrollY + run.h + 1) * scale));
    if (x1 <= x0 || y1 <= y0) continue;

    let worst = Infinity;
    let worstPixel = null;
    let brightest = -1;
    let brightestPixel = null;
    for (let y = y0; y < y1; y += 1) {
      for (let x = x0; x < x1; x += 1) {
        const p = (y * bitmap.width + x) * 4;
        const px = [frame[p], frame[p + 1], frame[p + 2]];
        const r = ratio(fg, px);
        if (r < worst) {
          worst = r;
          worstPixel = px;
        }
        const l = lum(px);
        if (l > brightest) {
          brightest = l;
          brightestPixel = px;
        }
      }
    }
    results.push({ index: i, ratio: worst, pixel: worstPixel, brightest: brightestPixel });
  }
  return results;
};

/** Diff two crops of the same region, unfocused and focused. */
const compareCrops = async ({ before, after }) => {
  const lum = ([r, g, b]) =>
    [r, g, b]
      .map((v) => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      })
      .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
    return (x + 0.05) / (y + 0.05);
  };
  const load = async (url) => {
    const bmp = await createImageBitmap(await (await fetch(url)).blob());
    const c = new OffscreenCanvas(bmp.width, bmp.height);
    const x = c.getContext("2d", { willReadFrequently: true });
    x.drawImage(bmp, 0, 0);
    return { w: bmp.width, h: bmp.height, d: x.getImageData(0, 0, bmp.width, bmp.height).data };
  };
  const at = (img, x, y) => {
    const p = (y * img.w + x) * 4;
    return [img.d[p], img.d[p + 1], img.d[p + 2]];
  };

  const a = await load(before);
  const b = await load(after);
  if (a.w !== b.w || a.h !== b.h) return { error: "crop sizes differ" };

  // The indicator is every pixel that focus changed — a mask, not a rectangle.
  //
  // Using the mask's bounding box instead was wrong in a way worth recording:
  // several controls here are `inset: 0` overlays the size of a whole band, and
  // their ring is drawn inset, so the changed pixels form a frame around the
  // entire crop. The bounding box of that frame is the crop, its "edge" is the
  // brass itself, and every measurement came back 1.00:1 — a harness artefact
  // that looked exactly like a missing focus ring.
  const mask = new Uint8Array(a.w * a.h);
  let changed = 0;
  let ring = null;
  let ringLum = -1;
  let halo = null;
  let haloLum = Infinity;
  let beneath = null;
  let beneathLum = -1;
  for (let y = 0; y < a.h; y += 1) {
    for (let x = 0; x < a.w; x += 1) {
      const p = at(a, x, y);
      const q = at(b, x, y);
      if (Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) + Math.abs(p[2] - q[2]) < 24) continue;
      mask[y * a.w + x] = 1;
      changed += 1;
      // The brass ring is the brightest thing focus draws; the opaque halo is
      // the darkest.
      const l = lum(q);
      if (l > ringLum) {
        ringLum = l;
        ring = q;
      }
      if (l < haloLum) {
        haloLum = l;
        halo = q;
      }
      // What was there before the indicator covered it — the photograph.
      const pl = lum(p);
      if (pl > beneathLum) {
        beneathLum = pl;
        beneath = p;
      }
    }
  }
  if (changed === 0) return { changed: 0 };

  // The real adjacency: unchanged pixels touching a changed one. Those are what
  // the indicator has to stand out against, and the brightest of them is the
  // one that would swallow it.
  let outside = null;
  let outsideLum = -1;
  let boundary = 0;
  for (let y = 0; y < a.h; y += 1) {
    for (let x = 0; x < a.w; x += 1) {
      if (mask[y * a.w + x]) continue;
      const touches =
        (x > 0 && mask[y * a.w + x - 1]) ||
        (x < a.w - 1 && mask[y * a.w + x + 1]) ||
        (y > 0 && mask[(y - 1) * a.w + x]) ||
        (y < a.h - 1 && mask[(y + 1) * a.w + x]);
      if (!touches) continue;
      boundary += 1;
      const p = at(b, x, y);
      const l = lum(p);
      if (l > outsideLum) {
        outsideLum = l;
        outside = p;
      }
    }
  }
  if (!outside) return { changed, error: "the indicator fills the crop — nothing to measure it against" };

  return {
    changed,
    boundary,
    ring,
    halo,
    outside,
    beneath,
    // The indicator's own structure, and the indicator against its neighbour.
    ringVsHalo: ratio(ring, halo),
    haloVsOutside: ratio(halo, outside),
    ringVsOutside: ratio(ring, outside),
    // The literal reading of "the ring against the brightest pixel beneath it".
    // It is the number the halo exists to make irrelevant, and it is reported
    // rather than hidden.
    ringVsBeneath: ratio(ring, beneath),
  };
};

/* ── pass 1 — the route walk ──────────────────────────────────────────────── */

async function walkRoute(browser, route, viewport) {
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
    // Settled state, so what is measured is what is seen. Whether the unsettled
    // state ever settles is the reduced-motion pass's job, not this one's.
    reducedMotion: "reduce",
  });
  const consoleErrors = [];
  const badRequests = [];
  const imageBodies = [];
  const fontFiles = new Set();

  page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
  page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));
  page.on("response", (res) => {
    if (res.status() >= 400) badRequests.push(`${res.status()} ${res.url()}`);
    const type = res.request().resourceType();
    if (type === "image") imageBodies.push(res.body().then((b) => b.length).catch(() => 0));
    if (type === "font") fontFiles.add(new URL(res.url()).pathname);
  });

  await page.goto(urlFor(route), { waitUntil: "networkidle" });

  // The lazy rule is measured in DOM order, before anything scrolls: the first
  // image must not be lazy, anything past the second must be.
  const images = await page.evaluate(() =>
    [...document.querySelectorAll("img")].map((img, i) => ({
      i,
      src: (img.getAttribute("src") || "").split("/").pop(),
      top: Math.round(img.getBoundingClientRect().top),
      loading: img.getAttribute("loading") || "eager",
      fetchpriority: img.getAttribute("fetchpriority") || "",
    })),
  );

  await settle(page);

  const layout = await page.evaluate(() => ({
    bodyScrollWidth: document.body.scrollWidth,
    bodyClientWidth: document.body.clientWidth,
    docScrollWidth: document.documentElement.scrollWidth,
    docClientWidth: document.documentElement.clientWidth,
    images: document.querySelectorAll("img").length,
    broken: [...document.querySelectorAll("img")]
      .filter((i) => i.complete && i.naturalWidth === 0)
      .map((i) => i.getAttribute("src")),
  }));

  /* over-image contrast */
  const runs = await page.evaluate(collectTextRuns);
  await page.addStyleTag({ content: "*{color:transparent !important;text-shadow:none !important;}" });
  const measured = new Array(runs.length).fill(null);
  const step = Math.round(viewport.height * 0.7);
  const docHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let top = 0; top < docHeight + step; top += step) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), top);
    await page.waitForTimeout(110);
    const scrollY = await page.evaluate(() => window.scrollY);
    const indices = runs
      .map((_, i) => i)
      .filter(
        (i) =>
          measured[i] === null &&
          !runs[i].offscreen &&
          runs[i].y - scrollY >= 0 &&
          runs[i].y + runs[i].h - scrollY <= viewport.height,
      );
    if (indices.length === 0) continue;
    const shot = `data:image/png;base64,${(await page.screenshot({ type: "png" })).toString("base64")}`;
    const sampled = await page.evaluate(sampleViewport, { shot, runs, indices });
    for (const s of sampled) measured[s.index] = s;
  }

  const contrast = runs
    .map((run, i) => ({ run, result: measured[i] }))
    .filter(({ result }) => result !== null);
  // Parked off the canvas on purpose — the skip link, and anything like it.
  // There is no scroll position at which it has a background, so it is named
  // rather than counted as a miss.
  const parked = runs.filter((run) => run.offscreen).map((run) => `${run.tag}.${run.cls}`);
  const unmeasured = runs
    .map((run, i) => ({ run, result: measured[i] }))
    .filter(({ run, result }) => result === null && !run.offscreen)
    .map(({ run }) => `${run.tag}.${run.cls} «${run.text}»`);
  const imageBytes = (await Promise.all(imageBodies)).reduce((a, b) => a + b, 0);

  await page.close();
  return {
    consoleErrors,
    badRequests,
    imageBytes,
    fontFiles,
    images,
    layout,
    contrast,
    unmeasured,
    parked,
  };
}

/* ── pass 2 — reduced motion parity ───────────────────────────────────────── */

async function motionParity(browser, route) {
  const counts = {};
  for (const mode of ["no-preference", "reduce"]) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: mode });
    await page.goto(urlFor(route), { waitUntil: "networkidle" });
    await settle(page);
    counts[mode] = await page.evaluate(() => {
      const revealed = [...document.querySelectorAll(".reveal, .band__media")].filter((el) => {
        const s = getComputedStyle(el);
        return Number(s.opacity) > 0.99;
      });
      const moved = [...document.querySelectorAll(".reveal")].filter((el) => {
        const t = getComputedStyle(el).transform;
        return t !== "none" && t !== "matrix(1, 0, 0, 1, 0, 0)";
      });
      const bandText = [...document.querySelectorAll(".band__body")].filter(
        (el) => (el.textContent || "").trim().length > 0 && Number(getComputedStyle(el).opacity) > 0.99,
      );
      return {
        candidates: document.querySelectorAll(".reveal, .band__media").length,
        revealed: revealed.length,
        transformed: moved.length,
        bandText: bandText.length,
      };
    });
    await page.close();
  }
  return counts;
}

/* ── pass 3 — the short viewport ──────────────────────────────────────────── */

async function shortViewport(browser, route) {
  const page = await browser.newPage({ viewport: { width: 390, height: 640 }, reducedMotion: "reduce" });
  await page.goto(urlFor(route), { waitUntil: "networkidle" });
  await settle(page);
  const result = await page.evaluate(() => {
    const clipped = [];
    let bandTotal = 0;
    for (const band of document.querySelectorAll(".band")) {
      bandTotal += band.getBoundingClientRect().height;
      // `overflow: clip` means anything past the box is simply gone, so the box
      // has to be at least as tall as its own content. This is the check that
      // `min-height` exists to pass.
      if (band.scrollHeight > band.clientHeight + 1) {
        clipped.push(`${band.id || band.className}: content ${band.scrollHeight} > box ${band.clientHeight}`);
      }
      const body = band.querySelector(".band__body");
      if (body) {
        const b = body.getBoundingClientRect();
        const s = band.getBoundingClientRect();
        if (b.bottom > s.bottom + 1 || b.top < s.top - 1) {
          clipped.push(`${band.id || "band"}: text escapes its band by ${Math.round(b.bottom - s.bottom)}px`);
        }
      }
    }
    return {
      clipped,
      bands: document.querySelectorAll(".band").length,
      bandTotal: Math.round(bandTotal),
      scrollHeight: document.documentElement.scrollHeight,
      scrollWidth: document.body.scrollWidth,
      clientWidth: document.body.clientWidth,
    };
  });
  await page.close();
  return result;
}

/* ── pass 4 — focus rings over a photograph ───────────────────────────────── */

async function focusRings(browser, route, limit = 6) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await page.goto(urlFor(route), { waitUntil: "networkidle" });
  await settle(page);

  const describe = () =>
    page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const band = el.closest(".band");
      const box = el.getBoundingClientRect();
      return {
        label: `${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 20)}"`,
        overImage: !!(band && band.querySelector(".band__media img")),
        box: { x: box.x, y: box.y, width: box.width, height: box.height },
      };
    });

  /**
   * One forward walk, measuring whatever it lands on.
   *
   * The first version of this walked the page twice — once to list the stops,
   * then once per stop to reach it again by pressing Tab n times from the top.
   * That does not reproduce: in Chromium the *sequential focus navigation
   * starting point* moves with a programmatic scroll and does not reset on
   * `blur()`, so the second walk lands on a different control every time and the
   * harness reports rings for elements it never focused. Every measurement here
   * therefore comes from the element that is focused at that moment, and the
   * walk is resumed by restoring focus rather than by counting key presses.
   */
  const results = [];
  let stops = 0;
  let overImage = 0;
  await page.keyboard.press("Tab");
  for (let i = 0; i < 28 && results.length < limit; i += 1) {
    const now = await describe();
    if (!now) break;
    stops += 1;
    if (!now.overImage) {
      await page.keyboard.press("Tab");
      continue;
    }
    overImage += 1;

    const pad = 14;
    const clip = {
      x: Math.max(0, Math.round(now.box.x - pad)),
      y: Math.max(0, Math.round(now.box.y - pad)),
      width: Math.round(Math.min(1440 - Math.max(0, now.box.x - pad), now.box.width + pad * 2)),
      height: Math.round(Math.min(900 - Math.max(0, now.box.y - pad), now.box.height + pad * 2)),
    };
    if (clip.width < 8 || clip.height < 8) {
      results.push({ label: now.label, changed: 0, error: `crop too small: ${JSON.stringify(clip)}` });
      await page.keyboard.press("Tab");
      continue;
    }

    const after = `data:image/png;base64,${(await page.screenshot({ clip })).toString("base64")}`;
    // Park the element, shoot the same crop unfocused, then put focus back so
    // the walk resumes where it was. `:focus-visible` is already satisfied for
    // the shot that matters — it was reached by a real key press.
    await page.evaluate(() => {
      window.__focusProbe = document.activeElement;
      document.activeElement?.blur();
    });
    await page.waitForTimeout(100);
    const before = `data:image/png;base64,${(await page.screenshot({ clip })).toString("base64")}`;

    results.push({
      label: now.label,
      clip,
      ...(await page.evaluate(compareCrops, { before, after })),
    });

    await page.evaluate(() => window.__focusProbe?.focus());
    await page.keyboard.press("Tab");
  }

  await page.close();
  return { stops, overImage, results };
}

/* ── pass 5 — the type ────────────────────────────────────────────────────── */

async function typeCheck(browser, route) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const fonts = new Set();
  page.on("response", (res) => {
    if (res.request().resourceType() === "font" && res.status() === 200) {
      fonts.add(new URL(res.url()).pathname);
    }
  });
  await page.goto(urlFor(route), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  const result = await page.evaluate(() => {
    const SAMPLE = "گچپژ شبانه ۱۲۳۴";
    const body = document.querySelector(".t-body") || document.querySelector("p");
    const display = document.querySelector("h1");
    const read = (el) => {
      if (!el) return null;
      const s = getComputedStyle(el);
      return {
        family: s.fontFamily.split(",")[0].replace(/["']/g, ""),
        size: parseFloat(s.fontSize),
        weight: s.fontWeight,
        lineHeight: s.lineHeight,
        color: s.color,
      };
    };

    // The rendered ink height is the number that matters for a face that sets a
    // small glyph on a large em: measureText reports the real rasterised extent,
    // not the em box the font-size names.
    const ctx = document.createElement("canvas").getContext("2d");
    const ink = (el) => {
      const s = getComputedStyle(el);
      ctx.font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
      const m = ctx.measureText(SAMPLE);
      const round = (n) => Math.round(n * 10) / 10;
      return {
        font: ctx.font,
        width: round(m.width),
        ascent: round(m.actualBoundingBoxAscent),
        descent: round(m.actualBoundingBoxDescent),
        height: round(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent),
      };
    };

    // Coverage: every character has to advance, and a loaded face has to claim
    // it. A missing glyph either collapses to zero width or falls back silently.
    const bodyFamily = getComputedStyle(body || document.body).fontFamily;
    ctx.font = `400 40px ${bodyFamily}`;
    const perChar = [...SAMPLE].filter((c) => c.trim()).map((c) => ({ c, w: ctx.measureText(c).width }));

    return {
      loaded: [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.status}`),
      body: read(body),
      display: read(display),
      bodyInk: body ? ink(body) : null,
      displayInk: display ? ink(display) : null,
      zeroWidth: perChar.filter((p) => p.w === 0).map((p) => p.c),
      checks: {
        mirza: document.fonts.check('500 40px "Mirza"', SAMPLE),
        lateef: document.fonts.check('400 22px "Lateef"', SAMPLE),
      },
    };
  });
  await page.close();
  return { ...result, files: [...fonts] };
}

/* ── run ──────────────────────────────────────────────────────────────────── */

if (!statSync(outDir, { throwIfNoEntry: false })) {
  console.error("no out/ directory — run `npm run build:pages` first.");
  process.exit(1);
}

const routes = [...discoverRoutes(), "/404"];
const server = await startServer();
const browser = await chromium.launch();

try {
  head("ROUTES");
  console.log(`  ${routes.length} routes, discovered in ${relative(process.cwd(), outDir)}/`);
  console.log(`  ${routes.join("   ")}`);

  head("ROUTE WALK — the served export at 390 and 1440");
  const worstByRoute = new Map();
  for (const route of routes) {
    for (const viewport of VIEWPORTS) {
      const r = await walkRoute(browser, route, viewport);
      const overflow = r.layout.bodyScrollWidth > r.layout.bodyClientWidth + 1;
      const mb = r.imageBytes / 1024 / 1024;
      const [, budget, note] = budgetFor(route);
      const overImage = r.contrast.filter(({ run }) => run.overImage);
      const worst = r.contrast.reduce(
        (acc, c) => (acc === null || c.result.ratio < acc.result.ratio ? c : acc),
        null,
      );
      const failures = r.contrast.filter(
        ({ run, result }) => result.ratio < (run.large ? 3 : 4.5) - 0.001,
      );

      if (worst) {
        const prev = worstByRoute.get(route);
        if (!prev || worst.result.ratio < prev.ratio) {
          worstByRoute.set(route, {
            ratio: worst.result.ratio,
            where: `${worst.run.tag}${worst.run.cls ? "." + worst.run.cls : ""} «${worst.run.text}»`,
            over: worst.run.overImage ? "over image" : "on the ground",
            viewport: viewport.name,
          });
        }
      }

      if (overflow) {
        fail(route, viewport.name, `horizontal overflow: body scrollWidth ${r.layout.bodyScrollWidth} > clientWidth ${r.layout.bodyClientWidth}`);
      }
      if (r.consoleErrors.length) fail(route, viewport.name, `console: ${r.consoleErrors.join(" | ")}`);
      if (r.badRequests.length) fail(route, viewport.name, `requests: ${r.badRequests.join(" | ")}`);
      if (r.layout.broken.length) fail(route, viewport.name, `broken images: ${r.layout.broken.join(", ")}`);
      if (mb > budget) fail(route, viewport.name, `image weight ${mb.toFixed(2)}MB over the ${budget}MB budget (${note})`);
      if (r.unmeasured.length) {
        fail(route, viewport.name, `never measured: ${r.unmeasured.join("; ")}`);
      }
      for (const f of failures) {
        fail(
          route,
          viewport.name,
          `contrast ${f.result.ratio.toFixed(2)}:1 needs ${f.run.large ? 3 : 4.5} — ${f.run.tag}.${f.run.cls} «${f.run.text}» against rgb(${f.result.pixel})`,
        );
      }
      for (const img of r.images) {
        if (img.i === 0 && img.loading === "lazy") {
          fail(route, viewport.name, `lazy rule: the first image ${img.src} is loading="lazy"`);
        }
        if (img.i >= 2 && img.loading !== "lazy") {
          fail(route, viewport.name, `lazy rule: image ${img.i + 1} ${img.src} is loading="${img.loading}"`);
        }
      }

      const clean =
        failures.length === 0 &&
        !overflow &&
        r.consoleErrors.length === 0 &&
        r.badRequests.length === 0 &&
        r.layout.broken.length === 0;
      console.log(
        `  ${clean ? "ok  " : "FAIL"} ${route.padEnd(28)} @${viewport.name.padEnd(5)} ` +
          `body ${String(r.layout.bodyScrollWidth).padStart(4)}/${String(r.layout.bodyClientWidth).padStart(4)}  ` +
          `img ${r.layout.images - r.layout.broken.length}/${r.layout.images} ${mb.toFixed(2)}/${budget}MB  ` +
          `text ${String(r.contrast.length).padStart(3)} (${overImage.length} over image)  ` +
          `worst ${worst ? worst.result.ratio.toFixed(2).padStart(6) : "     —"}:1` +
          (r.parked.length ? `  [${r.parked.length} parked off-canvas]` : ""),
      );
    }
  }

  head("WORST CONTRAST PER ROUTE — and the element that produced it");
  for (const [route, w] of worstByRoute) {
    console.log(
      `  ${route.padEnd(28)} ${w.ratio.toFixed(2).padStart(6)} : 1  @${w.viewport.padEnd(5)} ${w.over.padEnd(14)} ${w.where}`,
    );
  }

  head("REDUCED MOTION — the same page, or a different one?");
  for (const route of routes) {
    const c = await motionParity(browser, route);
    const a = c["no-preference"];
    const b = c.reduce;
    const same = a.revealed === b.revealed && a.bandText === b.bandText && b.transformed === 0;
    if (!same) fail(route, "reduced-motion", `revealed ${a.revealed}/${b.revealed}, band text ${a.bandText}/${b.bandText}, transformed under reduce ${b.transformed}`);
    console.log(
      `  ${same ? "ok  " : "FAIL"} ${route.padEnd(28)} ` +
        `revealed ${a.revealed}/${a.candidates} vs ${b.revealed}/${b.candidates}  ` +
        `band text ${a.bandText}/${b.bandText}  transformed under reduce ${b.transformed}`,
    );
  }

  head("SHORT VIEWPORT — 390 × 640");
  for (const route of routes) {
    const s = await shortViewport(browser, route);
    if (s.clipped.length) fail(route, "390x640", `clipped: ${s.clipped.join("; ")}`);
    if (s.scrollWidth > s.clientWidth + 1) {
      fail(route, "390x640", `horizontal overflow ${s.scrollWidth} > ${s.clientWidth}`);
    }
    console.log(
      `  ${s.clipped.length === 0 ? "ok  " : "FAIL"} ${route.padEnd(28)} ` +
        `${String(s.bands).padStart(2)} bands  ${String(s.bandTotal).padStart(5)}px of band inside ${String(s.scrollHeight).padStart(5)}px of page  ` +
        `body ${s.scrollWidth}/${s.clientWidth}` +
        (s.clipped.length ? `  ${s.clipped.join("; ")}` : ""),
    );
  }

  head("FOCUS RINGS OVER A PHOTOGRAPH");
  for (const route of routes) {
    const { stops, overImage, results } = await focusRings(browser, route, 6);
    if (results.length === 0) {
      console.log(`  —    ${route.padEnd(28)} ${stops} tab stops, ${overImage} over an image`);
      continue;
    }
    for (const r of results) {
      const where = "";
      if (r.error) {
        fail(route, "focus", `${r.label} — ${r.error}${where}`);
        console.log(`  FAIL ${route.padEnd(28)} ${r.label} — ${r.error}${where}`);
        continue;
      }
      if (!r.changed) {
        fail(route, "focus", `${r.label} — focus draws nothing${where}`);
        console.log(`  FAIL ${route.padEnd(28)} ${r.label} — no visible ring${where}`);
        continue;
      }
      // The requirement is the indicator against what it is adjacent to. Ring
      // and halo together ARE the indicator, so either one clearing 3:1 against
      // its neighbour passes.
      //
      // ring/halo is reported but not required, and 1.00:1 is the expected
      // reading rather than a fault: the halo is the ground colour, so wherever
      // the band is already dark — which is wherever text sits, by design — the
      // halo paints ground onto ground and the only pixels focus changes are the
      // brass. The halo earns its keep on a blown highlight, and nowhere else.
      const ok = Math.max(r.haloVsOutside, r.ringVsOutside) >= 3;
      if (!ok) {
        fail(route, "focus", `${r.label} — halo/neighbour ${r.haloVsOutside.toFixed(2)}:1, ring/neighbour ${r.ringVsOutside.toFixed(2)}:1`);
      }
      console.log(
        `  ${ok ? "ok  " : "FAIL"} ${route.padEnd(28)} ${r.label.padEnd(26)} ` +
          `${String(r.changed).padStart(5)}px changed  ring/neighbour ${r.ringVsOutside.toFixed(2).padStart(5)}:1  ` +
          `halo/neighbour ${r.haloVsOutside.toFixed(2).padStart(5)}:1  ring/halo ${r.ringVsHalo.toFixed(2).padStart(5)}:1  ` +
          `[ring vs the pixel it covers ${r.ringVsBeneath.toFixed(2)}:1]${where}`,
      );
    }
  }

  head("TYPE — Persian coverage and rendered size");
  for (const route of ["/", "/products/badenjan-doodi/"]) {
    const t = await typeCheck(browser, route);
    console.log(`\n  ${route}`);
    console.log(`    font files served (${t.files.length}):`);
    for (const f of t.files) console.log(`      ${f}`);
    console.log(`    faces loaded: ${t.loaded.join(", ")}`);
    console.log(`    document.fonts.check «گچپژ شبانه ۱۲۳۴»   Mirza ${t.checks.mirza}   Lateef ${t.checks.lateef}`);
    if (t.body) {
      console.log(`    body     ${t.body.family}  ${t.body.size}px / ${t.body.lineHeight}  ${t.body.color}`);
      console.log(`             rendered ink ${t.bodyInk.height}px  (ascent ${t.bodyInk.ascent}, descent ${t.bodyInk.descent}, advance ${t.bodyInk.width}px)`);
    }
    if (t.display) {
      console.log(`    display  ${t.display.family}  ${t.display.size}px`);
      console.log(`             rendered ink ${t.displayInk.height}px  (advance ${t.displayInk.width}px)`);
    }
    if (t.zeroWidth.length) fail(route, "type", `zero-advance characters: ${t.zeroWidth.join(" ")}`);
    if (!t.checks.mirza || !t.checks.lateef) fail(route, "type", "a loaded face does not claim the Persian sample");
    if (t.bodyInk && t.bodyInk.height < 11) {
      fail(route, "type", `body ink height ${t.bodyInk.height}px is too small on a dark ground`);
    }
    if (t.files.length === 0) fail(route, "type", "no font file was served — the page is on a fallback");
  }

  head(problems.length === 0 ? "CLEAN — every check passed" : `${problems.length} PROBLEM(S)`);
  for (const p of problems) console.log("  - " + p);
} finally {
  await browser.close();
  if (server) server.kill();
}

process.exit(problems.length === 0 ? 0 : 1);
