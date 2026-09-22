import { sortedGallery } from "@/content/gallery";
import { spacePage } from "@/content/sections";
import { pageMetadata } from "@/lib/seo";
import { Masthead } from "@/components/bands/Masthead";
import { SpaceBands } from "@/components/space/SpaceBands";

/**
 * The space.
 *
 * Six photographs, each one full-bleed at 88dvh, stacked. **Not a tile grid** —
 * every other site built on this engine tiles this page, and this one does not.
 * On a site whose entire design is the photograph, a 380px tile is a demotion of
 * the only thing the page is about.
 *
 * The masthead is the same one the menu uses, for the same reason: this page
 * opens with words and then hands the screen over, which is the reverse of the
 * homepage's order and is what stops the site reading as five copies of one page.
 */
export const metadata = pageMetadata({
  title: spacePage.seo.title,
  description: spacePage.seo.description,
  path: "/gallery/",
});

export default function SpacePage() {
  return (
    <>
      <Masthead
        id="space-heading"
        eyebrow={spacePage.eyebrow}
        heading={spacePage.heading}
        lead={spacePage.lead}
      />

      <SpaceBands items={sortedGallery} />
    </>
  );
}
