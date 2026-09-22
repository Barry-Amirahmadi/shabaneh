import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";

interface MastheadProps {
  id: string;
  eyebrow: string;
  heading: string;
  lead?: string;
}

/**
 * The opener on a page that is not the homepage.
 *
 * Deliberately *not* a band: no photograph, no viewport height, no scrim. The
 * menu, the space and the about page all open with the words and then hand the
 * screen over to the photography, which is the opposite of the homepage's order
 * and is what stops the site reading as five copies of one page.
 *
 * It is also a single narrow column rather than the two-column spread this
 * engine's editorial sites use for a section opener. A heading on the right with
 * a standfirst across the gutter is a magazine gesture; here there is no grid
 * for it to sit on, and the reader is about to be given a photograph anyway.
 */
export function Masthead({ id, eyebrow, heading, lead }: MastheadProps) {
  return (
    <section className="container pb-[var(--section-y-tight)] pt-[var(--section-y)]">
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>

      <Reveal delay={90}>
        <h1 id={id} className="t-h1 mt-6 max-w-[22ch]">
          {heading}
        </h1>
      </Reveal>

      {lead ? (
        <Reveal delay={180}>
          <p className="t-lead mt-6">{lead}</p>
        </Reveal>
      ) : null}
    </section>
  );
}
