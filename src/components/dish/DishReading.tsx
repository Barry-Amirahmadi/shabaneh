import type { ResolvedDish } from "@/types/content";
import { site } from "@/content/site";
import { dishPage, inquiry } from "@/content/sections";
import { fillTemplate, whatsappLink } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

/**
 * The reading, on the ground rather than over a photograph.
 *
 * A narrow column for the words, and one full-width row for the four details.
 * That is the only change of width on the page, and it is what stops the
 * details reading as a fifth paragraph: a row of label-and-value pairs across
 * the page is a different kind of information than prose, and it looks like one.
 *
 * It is a row and not a table. A specification table is another site in this
 * family's whole language; here four pairs on one hairline is enough, and a
 * table would invite the columns nobody should fill in — a price column first.
 *
 * Every field rendered is one the kitchen actually wrote. There is deliberately
 * no price, no allergen line, no calorie count and no provenance claim, because
 * none of those exists in the content model and none may be added to it.
 */
export function DishReading({ dish }: { dish: ResolvedDish }) {
  const reserveHref = whatsappLink(
    site.contact.whatsapp,
    fillTemplate(inquiry.message, { dish: dish.name }),
  );

  return (
    <section aria-labelledby="dish-heading" className="pt-[var(--section-y)]">
      <div className="container">
        <Reveal>
          <p className="t-meta text-[var(--color-brass)]">
            {dishPage.groupLabel} — {dish.category}
          </p>
        </Reveal>

        <Reveal delay={90}>
          <h1 id="dish-heading" className="t-h1 mt-4">
            {dish.name}
          </h1>
        </Reveal>

        {dish.statement ? (
          <Reveal delay={180}>
            <p className="t-lead mt-6 max-w-[var(--measure-wide)]">{dish.statement}</p>
          </Reveal>
        ) : null}
      </div>

      {dish.details && dish.details.length > 0 ? (
        <div className="container mt-[var(--section-y-tight)]">
          <Reveal>
            {/* The row is a list of pairs and needs a name, but a visible
                heading above four words of metadata would weigh more than the
                metadata does. */}
            <h2 className="sr-only">{dishPage.detailsHeading}</h2>
            <dl className="details-row">
              {dish.details.map((detail) => (
                <div key={detail.label}>
                  <dt>{detail.label}</dt>
                  <dd>{detail.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      ) : null}

      {dish.body && dish.body.length > 0 ? (
        <div className="container mt-[var(--section-y-tight)]">
          {dish.body.map((paragraph, index) => (
            <Reveal key={index} delay={index * 90}>
              <p className="t-body mt-6 first:mt-0">{paragraph}</p>
            </Reveal>
          ))}
        </div>
      ) : null}

      {/* The dish-specific reservation. The message arrives already naming the
          dish, so the inquiry has context and nobody retypes what the page
          already knew. A link, not a form. */}
      <div className="container mt-[var(--section-y-tight)] pb-[var(--section-y-tight)]">
        <Reveal>
          <Button href={reserveHref} variant="primary" external>
            {inquiry.label}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
