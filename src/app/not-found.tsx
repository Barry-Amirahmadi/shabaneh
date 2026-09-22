import { notFound } from "@/content/sections";
import { toFa } from "@/lib/digits";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * 404.
 *
 * No photograph. Every other surface on this site hands the screen to an image,
 * and a full-viewport photograph of a dining room is the wrong thing to show
 * someone who has just hit a dead end — it reads as a page that worked. A plain
 * dark screen with a way out reads as what happened.
 */
export default function NotFound() {
  return (
    <section className="container flex min-h-[70vh] flex-col justify-center gap-6 py-[var(--section-y)]">
      <Eyebrow>{toFa(notFound.eyebrow)}</Eyebrow>
      <h1 className="t-h1">{notFound.heading}</h1>
      <p className="t-lead">{notFound.lead}</p>
      <div>
        <Button href={notFound.action.href}>{notFound.action.label}</Button>
      </div>
    </section>
  );
}
