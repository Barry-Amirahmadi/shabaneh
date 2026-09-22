import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { OpeningBand } from "@/components/home/OpeningBand";
import { RoomBand } from "@/components/home/RoomBand";
import { FeaturedDishes } from "@/components/home/FeaturedDishes";
import { MenuTeaser } from "@/components/home/MenuTeaser";
import { ReserveBand } from "@/components/home/ReserveBand";

/**
 * Homepage — five bands, paced like a film. One image, one thought, scroll.
 *
 *   1  OPENING   100dvh  the room at night, the name, one line of seven words
 *   2  THE ROOM  100dvh  an interior, a heading and nineteen words set low
 *   3  DISHES    80dvh   three bands, stacked, one dish each
 *   4  THE MENU  62dvh   no photograph — the pause, and the way into the menu
 *   5  RESERVE   100dvh  the phone, the hours, the district
 *
 * `FeaturedDishes` renders three sibling bands rather than wrapping them, so the
 * page really is a flat sequence of eight sections with nothing composing them.
 *
 * What is not here is as deliberate as what is. No alternating image-and-text
 * row, no card wall, no statement set at 13vw, no visible column grid, no
 * gallery preview strip, no values ledger, no closing CTA band separate from the
 * reserve band. Each of those belongs to one of the other design languages built
 * on this engine, and this is the fifth one.
 */
/** No `title`: the homepage *is* the site title, not a page within it. */
export const metadata = pageMetadata({
  description: site.seo.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <OpeningBand />
      <RoomBand />
      <FeaturedDishes />
      <MenuTeaser />
      <ReserveBand />
    </>
  );
}
