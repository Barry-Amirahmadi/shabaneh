"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { MediaAsset, ScrimWeight } from "@/types/content";
import { cn } from "@/lib/cn";
import { withBasePath } from "@/lib/basePath";
import { useInView } from "@/components/motion/useInView";

/**
 * How eagerly the photograph loads.
 *
 * `priority` preloads and is for the one image a route opens with. `eager`
 * loads without preloading — for the first image on a route where that image
 * is not at the top of the page. Everything else is `lazy`.
 *
 * The rule this encodes: the first image on any route must not be lazy, and
 * everything below the first two must be. A page of nine full-bleed
 * photographs where the top one lazy-loads shows an empty screen on arrival;
 * one where all nine load eagerly downloads the whole set before the reader
 * has scrolled past the first.
 */
export type LoadStrategy = "priority" | "eager" | "lazy";

interface BandProps {
  media: MediaAsset;
  /** Viewport height as a plain number, applied as dvh with a vh fallback. */
  height?: number;
  scrim?: ScrimWeight;
  load?: LoadStrategy;
  /** An absolutely-positioned control covering the photograph, e.g. the button
   *  that opens the enlarged view. Sits above the scrim and below the text. */
  overlay?: ReactNode;
  id?: string;
  className?: string;
  children: ReactNode;
  "aria-labelledby"?: string;
  "aria-label"?: string;
}

/**
 * THE BAND — the only way an image enters this site.
 *
 * One full-bleed photograph, one scrim, and a small amount of text set low.
 * This is the whole layout vocabulary: there is no alternating image-and-text
 * row, no card, no visible grid and no table anywhere in this project, and this
 * component is why. A new section is a new band, not a new arrangement.
 *
 * Three things it guarantees, and each one is a defect it prevents:
 *
 * 1. **The scrim is not optional.** It is rendered here, by the same component
 *    that renders the photograph, so text cannot reach a page over an
 *    unscrimmed image. On a site where light type sits on candlelit
 *    photography, that is the single most likely accessibility failure, and
 *    making it structurally impossible is cheaper than catching it in review.
 * 2. **`min-height`, never `height`.** A band whose text is taller than the
 *    viewport grows. Locking the height traps content off-screen, and a 390x640
 *    phone with the browser chrome showing is where that happens first.
 * 3. **No parallax and no scroll hijacking.** The photograph settles once, on
 *    entry, and then holds still. Anything that moves the image at a different
 *    rate to the page breaks keyboard scrolling, breaks Home and End, and is
 *    the first thing to look broken under a fast scroll.
 */
export function Band({
  media,
  height = 100,
  scrim = "mid",
  load = "lazy",
  overlay,
  id,
  className,
  children,
  ...rest
}: BandProps) {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.1 });
  const priority = load === "priority";

  return (
    <section
      ref={ref}
      id={id}
      data-in={inView}
      data-priority={priority}
      data-scrim={scrim}
      className={cn("band", className)}
      style={{ "--band-h": height } as CSSProperties}
      {...rest}
    >
      <div className="band__media">
        <Image
          src={withBasePath(media.src)}
          alt={media.alt}
          fill
          /* Every band is full-bleed, so there is one honest answer here. */
          sizes="100vw"
          priority={priority}
          loading={load === "lazy" ? "lazy" : undefined}
        />
      </div>

      {/* Empty by design: it is a gradient, and it carries no content for the
          accessibility tree to reach. */}
      <div className="band__scrim" />

      {overlay}

      <div className="container band__body">{children}</div>
    </section>
  );
}
