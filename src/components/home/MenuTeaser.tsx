import Link from "next/link";
import { home } from "@/content/sections";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArrowLead } from "@/components/ui/ArrowLead";
import { Reveal } from "@/components/motion/Reveal";
import { PlainBand } from "@/components/bands/PlainBand";

/**
 * The pause.
 *
 * The one band on the site with no photograph, and the only centred text. After
 * four full-bleed viewports the absence of an image is the only change of pace
 * left — a fifth photograph here would make the whole sequence one texture, and
 * the reader would stop noticing any of them.
 *
 * It is also the way through to the menu. That link is the single most important
 * one on the homepage, and it gets a screen to itself rather than a button in a
 * corner of somebody else's band.
 */
export function MenuTeaser() {
  return (
    <PlainBand aria-labelledby="menu-teaser-heading">
      <Reveal>
        <Eyebrow>{home.menu.eyebrow}</Eyebrow>
      </Reveal>

      <Reveal delay={90}>
        <h2 id="menu-teaser-heading" className="t-h2 mt-4">
          {home.menu.heading}
        </h2>
      </Reveal>

      <Reveal delay={170}>
        <p className="t-body mx-auto mt-2 text-center">{home.menu.line}</p>
      </Reveal>

      <Reveal delay={250} className="mt-6">
        <Link href={home.menu.link.href} className="link-lead">
          <span className="link-lead__text">{home.menu.link.label}</span>
          <ArrowLead />
        </Link>
      </Reveal>
    </PlainBand>
  );
}
