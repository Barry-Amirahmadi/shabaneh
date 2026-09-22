# شبانه · SHABANEH

A Persian fine-dining restaurant site. Dark, cinematic, RTL, dinner service only.
Static export, deployed to GitHub Pages at `/shabaneh/`.

**This is a demonstration site for a restaurant that does not exist.** The address
is district-level and invented, the phone number is a placeholder, and the whole
site is `noindex`. Nothing here carries a price, a rating, an award, or any claim
about allergens, nutrition or sourcing — see §00 and §16 of the handoff for why
that is a rule and not an omission.

## Run it

```bash
npm ci
npm run media        # 23 placeholder JPEGs into public/media/
npm run dev          # http://localhost:3210
```

`npm run dev` is for writing code. **It is not what you verify against** — it has
no base path, no static export and no real asset resolution. Verify against the
exported output:

```bash
npm run build:pages  # export under a /shabaneh base path
npm run preview:pages
```

The build fetches Mirza and Lateef from Google Fonts, so it needs network access.
On Git Bash, `export MSYS_NO_PATHCONV=1` first or leading-slash arguments get
rewritten into Windows paths.

## Checks

| Command | What it proves |
|---|---|
| `npm run typecheck` | every content export matches its interface |
| `npm run lint` | including `jsx-a11y` as errors |
| `npm run test:smoke` | Playwright, against the served export |
| `npm run check:contrast` | the palette table in `tokens.css`, recomputed |
| `npm run check:bands` | over-image contrast, reduced motion, short viewports, focus rings, per-route image weight |
| `npm run check:viewports` | horizontal overflow at 390 and 1440 |

`check:bands` is the one that matters most here. Text sits on photographs, so it
measures each text node against the **brightest** pixel under it with the scrim
composited — an average would pass a caption that has actually disappeared into a
highlight.

## Layout

Three runtime dependencies: `next`, `react`, `react-dom`. Ask before a fourth.

```
src/app/         routes · tokens.css · globals.css · components.css
src/components/  bands/ home/ dish/ space/ navigation/ layout/ motion/ ui/
src/content/     all copy, typed against src/types/content.ts
src/lib/         basePath · seo · digits · cn
scripts/         build, export, media, and the verification harnesses
docs/            MASTER-HANDOFF.md (start at §00) · CMS-INTEGRATION-PLAN.md
```

Every page is a stack of **bands**: full-bleed image, directional scrim, a small
block of text set low. `min-height`, never `height`. No grid, no card, no
two-column row.

Images are generated placeholders at the exact paths, pixel sizes and ratios the
photographs will use, so replacing them is a file swap and nothing else.
