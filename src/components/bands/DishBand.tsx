import Link from "next/link";
import type { ResolvedDish } from "@/types/content";
import { Reveal } from "@/components/motion/Reveal";
import { Band, type LoadStrategy } from "./Band";

interface DishBandProps {
  dish: ResolvedDish;
  /** Viewport height as a plain number. 80 on the homepage, 70 on the menu. */
  height?: number;
  load?: LoadStrategy;
  /** Document outline, not visual size. Never style a heading into the wrong
   *  level to make it look right. */
  level?: 2 | 3;
}

/**
 * One dish, as one band.
 *
 * The photograph, the name, and the single line — and nothing else. No price, no
 * badge, no course colour, no "order" button, no tile. The course group is the
 * only piece of metadata, set small above the name, and the scrim weight carries
 * it a second time without saying it: starters dim least, desserts most.
 *
 * **One link, not two.** The name is the way through to the dish page and there
 * is no second "see details" link beside it: one destination deserves one tab
 * stop, and on a menu of nine bands a reader tabbing through hears the nine dish
 * names in order rather than the word «جزئیات» nine times.
 *
 * The whole argument of the menu is patience, and a band is what enforces it:
 * one dish occupies most of a screen, so nine dishes cannot be skimmed as a
 * grid. That is the design, not a limitation of it.
 */
export function DishBand({ dish, height = 80, load = "lazy", level = 2 }: DishBandProps) {
  const Heading = level === 2 ? "h2" : "h3";
  const nameId = `dish-${dish.slug}-name`;

  return (
    <Band
      id={`dish-${dish.slug}`}
      media={dish.image}
      height={height}
      scrim={dish.tone}
      load={load}
      aria-labelledby={nameId}
    >
      <Reveal>
        <p className="t-meta text-[var(--color-brass)]">{dish.category}</p>
      </Reveal>

      <Reveal delay={110}>
        <Heading id={nameId} className="t-h2">
          <Link href={`/products/${dish.slug}/`} className="name-link">
            <span className="name-link__text">{dish.name}</span>
          </Link>
        </Heading>
      </Reveal>

      <Reveal delay={200}>
        <p className="t-body max-w-[42ch]">{dish.description}</p>
      </Reveal>
    </Band>
  );
}
