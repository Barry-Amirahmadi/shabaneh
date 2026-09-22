import Link from "next/link";
import type { ResolvedDish } from "@/types/content";
import { dishPage } from "@/content/sections";
import { Reveal } from "@/components/motion/Reveal";
import { Band } from "@/components/bands/Band";

/**
 * The dish page opens on the photograph, full viewport, and says almost nothing.
 *
 * The name is not here. It arrives immediately below, as the page's `h1`, on the
 * ground — and that order is the point: a reader who clicked a dish name to get
 * here already knows what this is, so the first screen can be the plate and
 * nothing else.
 *
 * What the band does carry is the trail back. A reader arriving from search has
 * no history to go back through, and a full-viewport photograph with no way out
 * of it is a dead end. It sits low with the rest of the band's text, inside the
 * scrim plateau, rather than at the top of the frame where the gradient is at
 * its weakest.
 */
export function DishHero({ dish }: { dish: ResolvedDish }) {
  return (
    <Band
      media={dish.image}
      height={100}
      scrim={dish.tone}
      load="priority"
      aria-label={dish.name}
    >
      <Reveal>
        <nav aria-label={dishPage.breadcrumbLabel}>
          <ol className="t-meta flex flex-wrap items-center gap-x-3">
            <li>
              {/* next/link, not a raw anchor: a bare href="/" skips the
                  deployment base path and leaves the site entirely. */}
              <Link href="/" className="crumb">
                {dishPage.breadcrumbHome}
              </Link>
            </li>
            <li aria-hidden="true">·</li>
            <li>
              <Link href="/products/" className="crumb">
                {dishPage.breadcrumbMenu}
              </Link>
            </li>
            <li aria-hidden="true">·</li>
            {/* The current page is not a link. `aria-current` says which one it
                is without making it pressable. */}
            <li aria-current="page" className="text-[var(--color-ink)]">
              {dish.name}
            </li>
          </ol>
        </nav>
      </Reveal>
    </Band>
  );
}
