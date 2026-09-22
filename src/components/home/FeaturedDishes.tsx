import { home } from "@/content/sections";
import { publishedProducts } from "@/content/products";
import { DishBand } from "@/components/bands/DishBand";

/**
 * Three dishes, one per screen, stacked.
 *
 * Never side by side, never a grid, never three cards in a row — the whole
 * argument of this stretch of the homepage is patience, and three photographs
 * next to each other is the opposite argument. At 80dvh each they are slightly
 * shorter than the two bands above them, which is the only thing marking them as
 * a run rather than as three unrelated screens.
 *
 * Which three is an editorial decision and lives in content as `home.featured`,
 * by slug. A slug that no longer resolves is dropped rather than rendering an
 * empty band: a dish taken off the menu should disappear from the homepage, not
 * leave a hole in it.
 */
export function FeaturedDishes() {
  const dishes = home.featured
    .map((slug) => publishedProducts.find((dish) => dish.slug === slug))
    .filter((dish): dish is NonNullable<typeof dish> => dish !== undefined);

  return (
    <>
      {dishes.map((dish) => (
        <DishBand key={dish.id} dish={dish} height={80} />
      ))}
    </>
  );
}
