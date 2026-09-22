import type { Dish } from "@/types/content";
import { site } from "@/content/site";
import { absoluteUrl } from "@/lib/seo";

/**
 * Schema.org mappings.
 *
 * Every field below reads straight off the content model. Nothing is invented to
 * satisfy a schema, and on a restaurant that discipline matters more than
 * anywhere else this engine has been used: structured data is the easiest place
 * on a site to assert something false, because no reader ever sees it, the
 * vocabulary actively invites you to fill in a shape, and for a restaurant the
 * consumers of that shape are maps and local search.
 *
 * What is deliberately left out, and why:
 *
 * - **No `address`, `geo`, `hasMap` or `telephone`.** The address on this site is
 *   fictional by design — district level, no number, no coordinates. Showing a
 *   visibly invented address on a page is one thing; publishing it as
 *   machine-readable local business data is another order of claim entirely,
 *   because that is the field a map product would read and act on. This is the
 *   one piece of data on the site that could send a real person to a real
 *   building, so it does not go into a graph.
 * - **No `priceRange` and no `offers`.** No price exists anywhere on this site.
 *   Google will not render a restaurant or a menu-item rich result without one;
 *   inventing «$$» to earn that snippet would be a lie told to a search engine
 *   about a business.
 * - **No `aggregateRating`, `review`, `award` or `starRating`.** There are no
 *   reviews, no awards and no stars.
 * - **No `suitableForDiet`, `nutrition` or any allergen field on a menu item.**
 *   This is the allergen trap wearing a vocabulary: `suitableForDiet:
 *   GlutenFreeDiet` is a dietary-safety claim in machine-readable form, and a
 *   false one has a medical consequence. It must never appear here.
 * - **No `servesCuisine`, `openingHoursSpecification` or `acceptsReservations`.**
 *   The first two are stated in the page's own copy; restating them here would
 *   mean parsing Persian prose into structured values, and a mis-parse is a
 *   silent false claim. The third would advertise a booking capability this site
 *   does not have.
 * - **No `sameAs`.** The social handles are deliberate `.example` placeholders;
 *   `sameAs` asserts "this restaurant *is* that account", about URLs that do not
 *   resolve.
 * - **No `logo`.** No logo asset exists — the mark lives in the favicon and on
 *   the share card, neither of which is a logo file a real business would
 *   supply. `image` carries the share card, which is what it is.
 */
export function organizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: site.brand.name,
    alternateName: site.brand.latin,
    url: absoluteUrl("/"),
    description: site.seo.description,
    image: absoluteUrl(site.seo.ogImage.src),
    /** A URL, not a claim: it is where the menu is published. */
    hasMenu: absoluteUrl("/products/"),
  };
}

export function productSchema(dish: Dish): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.seo?.description ?? dish.description,
    url: absoluteUrl(`/products/${dish.slug}/`),
    image: absoluteUrl(dish.image.src),
    /** The course group, which is what `category` holds on a dish. */
    isPartOf: {
      "@type": "MenuSection",
      name: dish.category,
      url: absoluteUrl("/products/"),
    },
  };
}
