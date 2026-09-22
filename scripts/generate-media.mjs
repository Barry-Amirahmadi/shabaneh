/**
 * Placeholder art direction generator.
 *
 * There is no photography yet. Rather than pulling unrelated stock images, every
 * image slot is filled with a generated "material study": a warm low-key field
 * with one practical light source, a defocused mass, a vignette and fine grain —
 * the same art direction the real photographs are being shot to.
 *
 * ── WHY THESE ARE REAL JPEGs AND NOT SVG ───────────────────────────────────
 *
 * The other sites in this family write SVG placeholders. That works there
 * because the real images will be a separate decision later. Here the whole
 * point is that **Phase B is a file swap and nothing else**: every placeholder
 * sits at exactly the path, the pixel size and the ratio the photograph will
 * use, so dropping twenty-three files into `public/media/` finishes the site
 * without touching a line of content. A placeholder at `dish-01.svg` would mean
 * editing twenty-three `src` strings later, which is twenty-three chances to get
 * one wrong.
 *
 * Node has no image codec, and this project has exactly three runtime
 * dependencies and is not gaining a fourth for a build script. So the drawing
 * happens on a canvas in the Chromium that Playwright already installs for the
 * smoke suite, and `toDataURL("image/jpeg")` does the encoding. Playwright is a
 * devDependency that is already here; nothing ships to the browser because of
 * this file.
 *
 * ── CONSISTENCY IS THE POINT ───────────────────────────────────────────────
 *
 * Twenty-three images that do not look like the same room on the same night is
 * the failure mode of this whole site, not one bad image. So every study is
 * drawn by one function with one palette and one light direction; a slot varies
 * only its seed, the position of its mass, and how far the light is from it.
 *
 *   node scripts/generate-media.mjs
 */
import { mkdirSync, writeFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "public", "media");
mkdirSync(outDir, { recursive: true });

/** The two shapes the real set is shot at. Landscape for the room, square and
 *  overhead for the plates. */
const LANDSCAPE = { w: 1536, h: 1024 };
const SQUARE = { w: 1024, h: 1024 };

/** Kept in sync with src/app/tokens.css. */
const GROUND = "#0C0A08";
const BRASS = "#C89B5A";
const WARM = "#7A5233"; /* the mid tone of the falloff, between ground and brass */

/**
 * A slot is one image on the page.
 *
 * `light` is where the practical sits, `mass` is the defocused subject, both in
 * 0-1 of the frame. `warmth` scales how much brass reaches the mid-tones, which
 * is the only thing that separates a kitchen at service from an empty room.
 */
const slots = [
  /* — the room, homepage bands — */
  { name: "room-01", ...LANDSCAPE, light: [0.72, 0.26], mass: [0.46, 0.62, 0.52], warmth: 1.0, seed: 3 },
  { name: "room-02", ...LANDSCAPE, light: [0.34, 0.34], mass: [0.38, 0.58, 0.44], warmth: 0.86, seed: 11 },
  { name: "room-03", ...LANDSCAPE, light: [0.62, 0.3], mass: [0.58, 0.55, 0.6], warmth: 1.12, seed: 17 },

  /* — the space — */
  { name: "space-01", ...LANDSCAPE, light: [0.68, 0.32], mass: [0.52, 0.56, 0.5], warmth: 1.04, seed: 23 },
  { name: "space-02", ...LANDSCAPE, light: [0.4, 0.22], mass: [0.42, 0.6, 0.42], warmth: 0.8, seed: 29 },
  { name: "space-03", ...LANDSCAPE, light: [0.56, 0.36], mass: [0.5, 0.52, 0.56], warmth: 1.08, seed: 31 },
  { name: "space-04", ...LANDSCAPE, light: [0.64, 0.28], mass: [0.54, 0.5, 0.62], warmth: 1.18, seed: 37 },
  { name: "space-05", ...LANDSCAPE, light: [0.3, 0.38], mass: [0.34, 0.54, 0.46], warmth: 0.74, seed: 41 },
  { name: "space-06", ...LANDSCAPE, light: [0.6, 0.24], mass: [0.5, 0.58, 0.48], warmth: 0.96, seed: 43 },

  /* — about — */
  { name: "about-01", ...LANDSCAPE, light: [0.38, 0.3], mass: [0.46, 0.6, 0.5], warmth: 0.78, seed: 47 },
  { name: "about-02", ...LANDSCAPE, light: [0.7, 0.34], mass: [0.6, 0.56, 0.44], warmth: 0.92, seed: 53 },

  /* — the close views. Landscape, and tighter on the mass than a room is. — */
  { name: "view-01", ...LANDSCAPE, light: [0.6, 0.3], mass: [0.5, 0.54, 0.78], warmth: 1.14, seed: 59 },
  { name: "view-02", ...LANDSCAPE, light: [0.66, 0.28], mass: [0.48, 0.52, 0.82], warmth: 1.06, seed: 61 },
  { name: "view-03", ...LANDSCAPE, light: [0.44, 0.3], mass: [0.52, 0.56, 0.8], warmth: 0.9, seed: 67 },

  /* — the plates, square and overhead. The mass is centred and round, which is
       what an overhead plate under one lamp actually looks like. — */
  { name: "dish-01", ...SQUARE, light: [0.66, 0.28], mass: [0.5, 0.5, 0.62], warmth: 0.88, seed: 71 },
  { name: "dish-02", ...SQUARE, light: [0.62, 0.3], mass: [0.5, 0.5, 0.58], warmth: 1.0, seed: 73 },
  { name: "dish-03", ...SQUARE, light: [0.68, 0.26], mass: [0.5, 0.5, 0.6], warmth: 0.94, seed: 79 },
  { name: "dish-04", ...SQUARE, light: [0.64, 0.3], mass: [0.5, 0.5, 0.66], warmth: 1.16, seed: 83 },
  { name: "dish-05", ...SQUARE, light: [0.6, 0.28], mass: [0.5, 0.5, 0.64], warmth: 1.22, seed: 89 },
  { name: "dish-06", ...SQUARE, light: [0.66, 0.32], mass: [0.5, 0.5, 0.6], warmth: 1.08, seed: 97 },
  { name: "dish-07", ...SQUARE, light: [0.62, 0.26], mass: [0.5, 0.5, 0.58], warmth: 0.98, seed: 101 },
  { name: "dish-08", ...SQUARE, light: [0.68, 0.3], mass: [0.5, 0.5, 0.56], warmth: 0.82, seed: 103 },
  { name: "dish-09", ...SQUARE, light: [0.6, 0.3], mass: [0.5, 0.5, 0.62], warmth: 0.9, seed: 107 },
];

/**
 * Drawn in the page, because that is where the JPEG encoder is.
 *
 * Everything here is smooth except the grain, and the grain is deliberately
 * faint: per-pixel noise is exactly what a JPEG cannot compress, and these files
 * have to stay small enough that a menu of nine of them fits inside the route's
 * image budget. Measured after generation — see the summary this script prints.
 */
async function draw(page, slot) {
  return page.evaluate(
    ({ slot, GROUND, BRASS, WARM }) => {
      const canvas = document.createElement("canvas");
      canvas.width = slot.w;
      canvas.height = slot.h;
      const ctx = canvas.getContext("2d");

      const [lx, ly] = slot.light;
      const [mx, my, msize] = slot.mass;
      const short = Math.min(slot.w, slot.h);

      /* 1 — the ground. */
      ctx.fillStyle = GROUND;
      ctx.fillRect(0, 0, slot.w, slot.h);

      /* 2 — the defocused mass: the subject, out of focus, warmer than the room. */
      const massR = short * msize * 0.62;
      const mass = ctx.createRadialGradient(
        slot.w * mx,
        slot.h * my,
        0,
        slot.w * mx,
        slot.h * my,
        massR,
      );
      mass.addColorStop(0, WARM);
      mass.addColorStop(0.55, WARM);
      mass.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalAlpha = 0.5 * slot.warmth;
      ctx.fillStyle = mass;
      ctx.fillRect(0, 0, slot.w, slot.h);
      ctx.globalAlpha = 1;

      /* 3 — the practical: one warm light source with a long soft falloff. */
      const lightR = short * 1.05;
      const light = ctx.createRadialGradient(
        slot.w * lx,
        slot.h * ly,
        0,
        slot.w * lx,
        slot.h * ly,
        lightR,
      );
      light.addColorStop(0, BRASS);
      light.addColorStop(0.28, "rgba(200,155,90,0.42)");
      light.addColorStop(0.62, "rgba(160,110,60,0.14)");
      light.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalAlpha = 0.62 * slot.warmth;
      ctx.fillStyle = light;
      ctx.fillRect(0, 0, slot.w, slot.h);
      ctx.globalAlpha = 1;

      /* 4 — the fall into near-black, away from the light. */
      const fall = ctx.createLinearGradient(slot.w * lx, slot.h * ly, slot.w * (1 - lx), slot.h);
      fall.addColorStop(0, "rgba(12,10,8,0)");
      fall.addColorStop(1, "rgba(12,10,8,0.86)");
      ctx.fillStyle = fall;
      ctx.fillRect(0, 0, slot.w, slot.h);

      /* 5 — the vignette. Every frame in the set closes the same way. */
      const vig = ctx.createRadialGradient(
        slot.w * 0.5,
        slot.h * 0.5,
        short * 0.24,
        slot.w * 0.5,
        slot.h * 0.5,
        short * 0.92,
      );
      vig.addColorStop(0, "rgba(12,10,8,0)");
      vig.addColorStop(1, "rgba(12,10,8,0.7)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, slot.w, slot.h);

      /* 6 — grain. A deterministic LCG so a rebuild produces identical bytes,
             and faint enough that the JPEG stays small. */
      const image = ctx.getImageData(0, 0, slot.w, slot.h);
      const data = image.data;
      let state = slot.seed * 2654435761 % 4294967296;
      for (let i = 0; i < data.length; i += 4) {
        state = (state * 1664525 + 1013904223) % 4294967296;
        const n = ((state >>> 16) & 0xff) / 255 - 0.5;
        const g = n * 9;
        data[i] = Math.max(0, Math.min(255, data[i] + g));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + g));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + g));
      }
      ctx.putImageData(image, 0, 0);

      return canvas.toDataURL("image/jpeg", 0.78);
    },
    { slot, GROUND, BRASS, WARM },
  );
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("about:blank");

let total = 0;
const report = [];

for (const slot of slots) {
  const dataUrl = await draw(page, slot);
  const bytes = Buffer.from(dataUrl.split(",")[1], "base64");
  const file = join(outDir, `${slot.name}.jpg`);
  writeFileSync(file, bytes);
  total += bytes.length;
  report.push(`  ${slot.name}.jpg  ${slot.w}x${slot.h}  ${(bytes.length / 1024).toFixed(0)} KB`);
}

await browser.close();

console.log(report.join("\n"));
console.log(
  `\ngenerated ${slots.length} placeholder studies → public/media/  ` +
    `(${(total / 1024 / 1024).toFixed(2)} MB total, ` +
    `${(total / slots.length / 1024).toFixed(0)} KB average)`,
);

/* A sanity check that matters: the menu route carries nine of these at once and
   has a 2.5 MB budget. If the average ever drifts past ~280 KB that route fails
   its budget before a single real photograph has been dropped in. */
const dishTotal = slots
  .filter((s) => s.name.startsWith("dish-"))
  .reduce((sum, s) => sum + statSync(join(outDir, `${s.name}.jpg`)).size, 0);
console.log(`menu route image weight (9 dishes): ${(dishTotal / 1024 / 1024).toFixed(2)} MB`);
