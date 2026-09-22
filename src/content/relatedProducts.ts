import type { ResolvedDish } from "@/types/content";

/**
 * What to show at the bottom of a dish page.
 *
 * Two dishes, as two small bands. The heading is «ادامهٔ منو», not
 * «خوراک‌های مرتبط» — with nine dishes in three courses, "related" would be
 * overclaiming a relation the menu does not actually express.
 *
 * The rule, in order:
 *
 * 1. Start reading from the dish *after* this one and wrap around, so every
 *    page shows a different pair. Taking the first two of the list every time
 *    would make seven of the nine pages recommend the same two dishes.
 * 2. Prefer the same course. On this menu that is real rather than aspirational
 *    — three dishes per course means a starter always has two other starters to
 *    point at, so the pair a reader sees is the rest of the course they are
 *    already looking at.
 */
export function relatedProducts(
  dish: ResolvedDish,
  all: readonly ResolvedDish[],
  count = 2,
): ResolvedDish[] {
  const position = all.findIndex((candidate) => candidate.id === dish.id);
  if (position === -1) return all.slice(0, count);

  const following = [...all.slice(position + 1), ...all.slice(0, position)];

  return [
    ...following.filter((candidate) => candidate.category === dish.category),
    ...following.filter((candidate) => candidate.category !== dish.category),
  ].slice(0, count);
}
