import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface PlainBandProps {
  children: ReactNode;
  height?: number;
  id?: string;
  className?: string;
  "aria-labelledby"?: string;
}

/**
 * A band with no photograph.
 *
 * Used once, on the homepage, between four full-bleed images and a fifth. The
 * absence of a picture is what makes it read as a pause rather than as a gap —
 * after four viewports of photography, a quiet plane is the only thing left that
 * counts as a change of pace. Adding a fifth image here would make the sequence
 * one long texture; adding a heading at display size would make it a statement
 * band, which belongs to a different design language in this family.
 *
 * Not a server-client boundary worth crossing: there is no image to settle and
 * no observer to run, so this stays a server component and the text inside it
 * brings its own `Reveal` if it wants one.
 */
export function PlainBand({
  children,
  height = 62,
  id,
  className,
  ...rest
}: PlainBandProps) {
  return (
    <section
      id={id}
      className={cn("band band--plain", className)}
      style={{ "--band-h": height } as CSSProperties}
      {...rest}
    >
      <div className="container band__body items-center text-center">{children}</div>
    </section>
  );
}
