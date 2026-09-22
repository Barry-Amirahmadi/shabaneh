import type { ResolvedDish } from "@/types/content";
import { dishPage } from "@/content/sections";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { DishBand } from "@/components/bands/DishBand";

/**
 * The way onward: two dishes, as two small bands.
 *
 * Shorter than any other band on the site at 56dvh, which is what marks them as
 * a coda rather than as two more courses. Still bands, though — putting two
 * cards here would introduce the one layout this site does not have, at the
 * bottom of the page where it would be least defensible.
 *
 * Titled «ادامهٔ منو» rather than «خوراک‌های مرتبط». With nine dishes in three
 * courses, "related" would claim a relation the menu does not express; "the rest
 * of the menu" is what it actually is.
 */
export function RelatedDishes({ dishes }: { dishes: ResolvedDish[] }) {
  if (dishes.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="pt-[var(--section-y)]">
      <div className="container pb-[var(--section-y-tight)]">
        <Reveal>
          <Eyebrow>{dishPage.relatedEyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={90}>
          <h2 id="related-heading" className="t-h2 mt-4">
            {dishPage.relatedHeading}
          </h2>
        </Reveal>
      </div>

      {dishes.map((dish) => (
        <DishBand key={dish.id} dish={dish} height={56} level={3} />
      ))}
    </section>
  );
}
