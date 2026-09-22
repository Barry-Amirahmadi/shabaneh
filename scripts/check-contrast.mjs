/**
 * The palette, recomputed.
 *
 * Every ratio quoted in a comment in `src/app/tokens.css` is produced here, so
 * a colour cannot be nudged without the number that justified it being re-run.
 * WCAG 2.1 relative luminance, sRGB, no rounding until the print.
 *
 * ── WHY THE WORST-CASE TABLE LOOKS PARANOID ────────────────────────────────
 *
 * On this site most text sits on a photograph. The background under a glyph is
 * not a token, it is whatever pixel happens to be there, so the only number
 * that means anything is the one measured against the *brightest* pixel the
 * frame can contain. That is a blown white highlight — a candle flame, a
 * reflection off a glass — dimmed by whatever the scrim puts over it.
 *
 * So the table below composites each scrim's strongest stop over pure white and
 * measures against that. Text that passes here passes on any photograph. The
 * per-element version of the same check, run against the real exported pages,
 * is `npm run check:bands`.
 *
 *   node scripts/check-contrast.mjs
 */

const GROUND = "#0C0A08";
const RAISED = "#151210";
const INK = "#F2EBE3";
const INK_2 = "#A39A91";
const BRASS = "#C89B5A";
const BRASS_DEEP = "#8F6A39";
const WHITE = "#FFFFFF";

/** The `--scrim-strong` stop of each weight, from globals.css. This is the
 *  plateau the text actually sits on, never the lighter part of the gradient. */
const SCRIMS = [
  ["light", 0.9],
  ["mid", 0.94],
  ["deep", 0.97],
  ["full", 0.97],
];

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

function luminance(hex) {
  const [r, g, b] = rgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

/** `color-mix(in srgb, ground X%, transparent)` over a backdrop — which is what
 *  the scrim gradient does, and sRGB compositing is what the browser does too. */
function composite(over, under, alpha) {
  const [a, b] = [rgb(over), rgb(under)];
  const out = a.map((v, i) => Math.round(v * alpha + b[i] * (1 - alpha)));
  return "#" + out.map((v) => v.toString(16).padStart(2, "0")).join("");
}

const fmt = (n) => n.toFixed(2).padStart(6);
const failures = [];

function row(label, fg, bg, need, note = "") {
  const r = ratio(fg, bg);
  const ok = r >= need;
  if (!ok) failures.push(`${label} — ${r.toFixed(2)}:1, needs ${need}`);
  console.log(`  ${ok ? "ok  " : "FAIL"} ${label.padEnd(34)} ${fmt(r)} : 1   needs ${String(need).padEnd(5)} ${note}`);
  return r;
}

console.log("\nON THE TWO GROUNDS");
console.log(`  ground ${GROUND}   raised ${RAISED}`);
row("ink on ground", INK, GROUND, 12);
row("ink on raised", INK, RAISED, 12);
row("ink-2 on ground", INK_2, GROUND, 4.5);
row("ink-2 on raised", INK_2, RAISED, 4.5);
row("brass on ground (small text)", BRASS, GROUND, 4.5);
row("brass on raised (small text)", BRASS, RAISED, 4.5);
row("brass-deep on ground (non-text)", BRASS_DEEP, GROUND, 3);
row("brass-deep on raised (non-text)", BRASS_DEEP, RAISED, 3);

console.log("\n  note  ground vs raised = " + ratio(GROUND, RAISED).toFixed(2) + ":1 —");
console.log("        below anything useful, deliberately. The two grounds are");
console.log("        separated by a hairline, not by fill.");

console.log("\nOVER A PHOTOGRAPH, WORST CASE");
console.log("  the scrim's strongest stop composited over a blown white highlight");
for (const [name, alpha] of SCRIMS) {
  const backdrop = composite(GROUND, WHITE, alpha);
  console.log(`\n  scrim ${name} (${alpha}) → ${backdrop}`);
  row(`  ink over ${name}`, INK, backdrop, 4.5);
  row(`  ink-2 over ${name}`, INK_2, backdrop, 4.5, "body");
  row(`  brass over ${name}`, BRASS, backdrop, 4.5);
}

console.log("\nTHE FOCUS RING OVER UNKNOWN PHOTOGRAPHY");
const bare = ratio(BRASS, WHITE);
console.log(`  brass against a bare blown highlight    ${fmt(bare)} : 1   — under 3, which is`);
console.log("        why the ring is not allowed to touch the photograph.");
row("halo (ground) vs blown highlight", GROUND, WHITE, 3, "the halo's own edge");
row("ring (brass) vs halo", BRASS, GROUND, 3, "the ring inside it");

console.log("\nHEADER, AT REST OVER A PHOTOGRAPH");
const headerBackdrop = composite(GROUND, WHITE, 0.9);
row("nav link (ink-2) under header scrim", INK_2, headerBackdrop, 4.5);
row("wordmark (ink) under header scrim", INK, headerBackdrop, 4.5);

if (failures.length) {
  console.error(`\n${failures.length} contrast failure(s):`);
  for (const f of failures) console.error("  - " + f);
  process.exit(1);
}
console.log("\nall pairs pass.\n");
