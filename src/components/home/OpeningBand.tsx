import { site } from "@/content/site";
import { home } from "@/content/sections";
import { Reveal } from "@/components/motion/Reveal";
import { Band } from "@/components/bands/Band";

/**
 * The first screen.
 *
 * The name, one line of seven words, one scroll cue — and nothing else. No
 * buttons, no eyebrow, no second image, no inset, no statistics row. A visitor
 * arriving here should be looking at a photograph of a room at night and reading
 * six or nine words about it, and every element that competes for that moment
 * has been left out on purpose.
 *
 * The name is the `h1`. The header's wordmark says the same word, correctly and
 * without duplication in the accessibility tree: that one is a link with its own
 * accessible name, this one is the document's title.
 *
 * This is the only band on the site that preloads its photograph — it is the
 * largest paint on arrival, and the only image a reader is guaranteed to see.
 */
export function OpeningBand() {
  return (
    <Band
      media={home.opening.image}
      height={100}
      scrim="mid"
      load="priority"
      aria-labelledby="opening-heading"
    >
      <Reveal>
        <h1 id="opening-heading" className="t-display">
          {site.brand.name}
        </h1>
      </Reveal>

      <Reveal delay={160}>
        <p className="t-lead max-w-[28ch]">{home.opening.line}</p>
      </Reveal>

      {/* The cue is decorative reassurance that there is more page. It is not a
          control — there is nothing to press and nothing to skip to that the
          skip link does not already offer — so it is a paragraph, not a button
          and not an anchor to the next band. */}
      <Reveal delay={320} className="pt-6">
        <p className="scroll-cue">{home.opening.scrollCue}</p>
      </Reveal>
    </Band>
  );
}
