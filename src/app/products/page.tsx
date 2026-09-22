import { Fragment } from "react";
import { groupBoundaries, publishedProducts } from "@/content/products";
import { menuPage } from "@/content/sections";
import { pageMetadata } from "@/lib/seo";
import { toFa } from "@/lib/digits";
import { Masthead } from "@/components/bands/Masthead";
import { GroupMark } from "@/components/bands/GroupMark";
import { DishBand } from "@/components/bands/DishBand";
import { Reveal } from "@/components/motion/Reveal";

/**
 * The menu — nine bands, one per dish, at 70dvh each.
 *
 * Scrolling this page should feel like the opening sequence continuing, which is
 * why it is the same component as the homepage's three featured dishes at a
 * slightly shorter height rather than a different presentation of the same data.
 * The homepage is an editorial cut of three; this is all nine, in order.
 *
 * **No grid of cards. No table. No price column.** A menu is the single most
 * tempting page on a restaurant site to lay out as a list with a price on the
 * right, and this one is the opposite of that: a reader cannot skim it, and that
 * is the design rather than a limitation of it. High-end restaurants routinely
 * publish a menu with no prices, so the constraint costs nothing and the page
 * reads as correct rather than as unfinished.
 *
 * The two course marks are derived from the dishes themselves — see
 * `groupBoundaries()`. Nobody counted to three and six.
 *
 * Order is the editor's order and is never re-sorted. The sequence is what
 * carries the pacing, and the course marks follow it.
 */
export const metadata = pageMetadata({
  title: menuPage.seo.title,
  description: menuPage.seo.description,
  path: "/products/",
});

export default function MenuPage() {
  const dishes = publishedProducts;
  const marks = groupBoundaries(dishes);

  return (
    <>
      <Masthead
        id="menu-heading"
        eyebrow={menuPage.eyebrow}
        heading={menuPage.heading}
        lead={menuPage.lead}
      />

      <div className="container pb-[var(--section-y-tight)]">
        <Reveal>
          {/* Derived from what actually rendered, so it can never disagree with
              the page. The smoke suite reads it back and compares. */}
          <p className="t-meta">
            {toFa(dishes.length)} {menuPage.countLabel}
          </p>
        </Reveal>
      </div>

      <section aria-label={menuPage.listLabel}>
        {dishes.map((dish, index) => (
          <Fragment key={dish.id}>
            {marks.has(index) ? <GroupMark label={marks.get(index)!} /> : null}
            <DishBand
              dish={dish}
              height={70}
              load={index === 0 ? "priority" : "lazy"}
            />
          </Fragment>
        ))}
      </section>
    </>
  );
}
