"use client";

import { useState } from "react";
import type { GalleryItem } from "@/types/content";
import { spacePage } from "@/content/sections";
import { toFa } from "@/lib/digits";
import { Reveal } from "@/components/motion/Reveal";
import { Band, type LoadStrategy } from "@/components/bands/Band";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";

/**
 * The space, as a stack of full-bleed photographs.
 *
 * **Not a tile grid, and that is the deliberate part.** Every other site built
 * on this engine tiles its gallery, three or two across, each picture in a
 * frame with a caption under it. That is the right answer when the gallery is a
 * supporting section. Here the photograph *is* the design, and a tile is a
 * demotion: six pictures at 380px wide are six thumbnails of a room, not the
 * room.
 *
 * The whole band is the control. It is a real `<button>` — so it is keyboard
 * reachable and announces what pressing it does — it carries `cursor: pointer`
 * explicitly, and it sits above the scrim and below the caption so the text in
 * the band stays selectable. The engine's own tiled galleries compute
 * `cursor: default` on exactly this control, a known open defect there; the
 * band harness asserts the computed value here so it cannot come back.
 */
export function SpaceBands({ items }: { items: GalleryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      {items.map((item, index) => {
        const load: LoadStrategy = index === 0 ? "priority" : "lazy";
        const captionId = `space-${item.id}-caption`;

        return (
          <Band
            key={item.id}
            media={item.image}
            height={88}
            scrim="mid"
            load={load}
            aria-labelledby={captionId}
            overlay={
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                className="photo-button band__hit"
                aria-label={`${spacePage.viewLabel} — ${item.title}`}
              />
            }
          >
            <Reveal>
              {/* A figure with no `img` of its own: the picture is the band's
                  background layer, and this is its caption. The number is
                  decorative — the title beside it already names the picture — so
                  it stays out of the accessibility tree rather than being read
                  aloud before every photograph. */}
              <figure>
                <figcaption id={captionId} className="flex flex-wrap items-baseline gap-4">
                  <span className="t-meta text-[var(--color-brass)]" aria-hidden="true">
                    {toFa(String(index + 1).padStart(2, "0"))}
                  </span>
                  <span className="t-h3">{item.title}</span>
                  <span className="t-meta">{item.caption ?? item.category}</span>
                </figcaption>
              </figure>
            </Reveal>
          </Band>
        );
      })}

      <GalleryLightbox
        items={items}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </>
  );
}
