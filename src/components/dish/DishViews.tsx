"use client";

import { useState } from "react";
import type { GalleryItem, ResolvedDish } from "@/types/content";
import { dishPage, spacePage } from "@/content/sections";
import { Reveal } from "@/components/motion/Reveal";
import { Band } from "@/components/bands/Band";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";

/**
 * The extra close views, as full-bleed bands.
 *
 * Three of the nine dishes have one. The other six render nothing at all here —
 * no empty section, no placeholder frame, no "more photos coming" — because a
 * dish with one photograph is a complete dish page and the field is optional for
 * exactly that reason.
 *
 * The enlarged view is opened from the band itself, which is a real `<button>`
 * with an accessible name from content and an explicit `cursor: pointer`. Its
 * image set starts with the dish's own photograph, so the two are steppable as a
 * pair rather than the viewer opening on a single image with a prev and a next
 * that both lead back to it.
 */
export function DishViews({ dish }: { dish: ResolvedDish }) {
  const views = dish.views ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (views.length === 0) return null;

  /** The dish's photographs as the viewer's item shape. Index 0 is the plate. */
  const items: GalleryItem[] = [dish.image, ...views].map((image, index) => ({
    id: `${dish.slug}-${index}`,
    title: dish.name,
    category: dish.category,
    caption: image.caption,
    image,
    order: index,
  }));

  return (
    <>
      <div className="container pt-[var(--section-y-tight)]">
        <Reveal>
          <h2 id="views-heading" className="t-h3 text-[var(--color-ink-2)]">
            {dishPage.viewsHeading}
          </h2>
        </Reveal>
      </div>

      {views.map((view, index) => (
        <Band
          key={view.src}
          media={view}
          height={80}
          scrim="mid"
          aria-label={view.caption ?? dish.name}
          overlay={
            <button
              type="button"
              onClick={() => setOpenIndex(index + 1)}
              className="photo-button band__hit"
              aria-label={`${spacePage.viewLabel} — ${view.caption ?? dish.name}`}
            />
          }
        >
          {view.caption ? (
            <Reveal>
              <figure>
                <figcaption className="t-meta">{view.caption}</figcaption>
              </figure>
            </Reveal>
          ) : (
            <span className="sr-only">{dish.name}</span>
          )}
        </Band>
      ))}

      <GalleryLightbox
        items={items}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </>
  );
}
