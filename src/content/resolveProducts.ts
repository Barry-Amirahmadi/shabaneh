import type { Dish, ResolvedDish, ScrimWeight } from "@/types/content";

/**
 * Fills in the presentation field a CMS editor can leave empty.
 *
 * A dish is the product here. The file and the function keep the engine's
 * names so every repo in this family stays structurally identical — only the
 * Persian words on screen change between them.
 *
 * ── WHAT `tone` NOW MEANS ──────────────────────────────────────────────────
 *
 * On the editorial sites this engine came from, `tone` was a CSS colour: each
 * product's own shade, bleeding into an ambient wash behind the showcase as you
 * scrolled past it. There is no showcase here and no ambient wash — there is a
 * photograph filling the viewport and a few words on it — so that field had
 * nothing left to drive.
 *
 * It was **repurposed rather than removed.** `tone` is now the weight of the
 * scrim between a photograph and the words over it:
 *
 *     light  starters    dims least  — the plate stays brightest
 *     mid    mains       the default
 *     deep   desserts    dims most   — the frame closes down
 *
 * That is how the three course groups read as different from each other while
 * scrolling the menu, without a coloured label, a filter bar or a badge. The
 * type changed with the meaning: it was `string`, an untyped CSS colour that
 * could be anything; it is now a four-member union, so a mistyped weight is a
 * build failure rather than a band that silently renders with no scrim at all.
 *
 * **Every weight holds the same legibility floor.** The plateau the text
 * actually sits on never drops below 90% of the ground colour, and the measured
 * worst case — that plateau composited over a blown white highlight, the
 * brightest pixel a candlelit frame can contain — is 5.70:1 for secondary text
 * at the lightest weight. The variation between weights is in how far up the
 * frame the dimming reaches, i.e. in how much photograph survives. It is never
 * in whether the words can be read. See the table at the top of `tokens.css`.
 *
 * `full` is the fourth weight and is not a course: it is for a band carrying a
 * whole block rather than a line — the reserve band — where the plateau has to
 * reach much further up the frame. No dish uses it.
 */

/**
 * Scrim weight for a dish with no `tone`.
 *
 * Keyed off the course group, because that is what the field expresses: a dish
 * an editor saved without choosing a weight should look like the rest of its
 * course, not like a default. An unrecognised group falls to `mid`, which is
 * the middle of the range and the one weight that is safe on any photograph.
 */
const BY_COURSE: Record<string, ScrimWeight> = {
  "پیش‌غذا": "light",
  "خوراک اصلی": "mid",
  دسر: "deep",
};

export const FALLBACK_TONE: ScrimWeight = "mid";

export function resolveProduct(product: Dish): ResolvedDish {
  return {
    ...product,
    tone: product.tone ?? BY_COURSE[product.category] ?? FALLBACK_TONE,
  };
}

/**
 * Resolve the list that actually renders, in render order.
 *
 * The fallback is no longer positional — it reads the dish's own course — so a
 * filtered list can no longer be assigned different weights than an unfiltered
 * one. Filtering before resolving is still the right order: `groupBoundaries()`
 * reads neighbours, and a draft left in the list would put a group mark in the
 * wrong place.
 */
export function resolveProducts(list: readonly Dish[]): ResolvedDish[] {
  return list.map(resolveProduct);
}
