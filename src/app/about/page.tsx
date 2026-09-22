import { aboutPage } from "@/content/sections";
import { pageMetadata } from "@/lib/seo";
import { Masthead } from "@/components/bands/Masthead";
import { Band } from "@/components/bands/Band";
import { Reveal } from "@/components/motion/Reveal";
import { ReserveBand } from "@/components/home/ReserveBand";

/**
 * About — the most text on the site, on purpose.
 *
 * Everywhere else the words get out of the photograph's way. Here the reader has
 * clicked a link that says «دربارهٔ ما» and has agreed to read, so this is the one
 * page that gives them running prose: one narrow column on the ground, broken
 * twice by a full-bleed photograph.
 *
 * The breaks are at fixed points rather than computed, and the last group takes
 * whatever is left — add a sixth paragraph and it lands after the second
 * photograph rather than silently moving the images.
 *
 * It closes on the reservation band, the same component the homepage ends with.
 * That is not a duplicate section: «رزرو میز» in the header points here, so this
 * is the page that has to be able to answer it from anywhere on the site.
 */
export const metadata = pageMetadata({
  title: aboutPage.seo.title,
  description: aboutPage.seo.description,
  path: "/about/",
});

/** One run of paragraphs in the reading column. */
function Prose({ paragraphs }: { paragraphs: string[] }) {
  if (paragraphs.length === 0) return null;

  return (
    <div className="container py-[var(--section-y-tight)]">
      {paragraphs.map((paragraph, index) => (
        <Reveal key={paragraph.slice(0, 24)} delay={index * 90}>
          <p className="t-body mt-6 first:mt-0">{paragraph}</p>
        </Reveal>
      ))}
    </div>
  );
}

export default function AboutPage() {
  const [first, second] = aboutPage.images;

  return (
    <>
      <Masthead
        id="about-heading"
        eyebrow={aboutPage.eyebrow}
        heading={aboutPage.heading}
        lead={aboutPage.lead}
      />

      <Prose paragraphs={aboutPage.body.slice(0, 2)} />

      {/* The first image on this route, and it is not at the top of the page —
          so it loads eagerly without being preloaded. Preloading an image the
          reader has to scroll to would compete with the type they are reading. */}
      <Band media={first} height={80} scrim="mid" load="eager" aria-label={first.alt}>
        <Reveal>
          <figure>
            <figcaption className="t-meta">{first.caption}</figcaption>
          </figure>
        </Reveal>
      </Band>

      <Prose paragraphs={aboutPage.body.slice(2, 4)} />

      <Band media={second} height={80} scrim="mid" aria-label={second.alt}>
        <Reveal>
          <figure>
            <figcaption className="t-meta">{second.caption}</figcaption>
          </figure>
        </Reveal>
      </Band>

      <Prose paragraphs={aboutPage.body.slice(4)} />

      <ReserveBand />
    </>
  );
}
