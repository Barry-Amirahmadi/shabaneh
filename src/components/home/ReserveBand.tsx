import { site } from "@/content/site";
import { home, inquiry } from "@/content/sections";
import { toFa } from "@/lib/digits";
import { whatsappLink } from "@/lib/whatsapp";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Band, type LoadStrategy } from "@/components/bands/Band";

const reserve = home.reserve;

/**
 * How to actually get a table — the site's only conversion point.
 *
 * A phone number and a WhatsApp message, and **no form.** Not a date picker, not
 * a party-size select, not a "we'll call you back" field. On a static host a form
 * with nowhere to post falls back to a GET at the current URL: the page reloads,
 * the scroll position is lost, and whatever was typed is written into the URL and
 * from there into browser history and any outgoing referrer. A reservation form
 * is the single most tempting thing to build on a restaurant site and it is the
 * one thing this site must not have; the smoke suite asserts none exists.
 *
 * Two facts sit under the actions, and only two: the hours and the district. The
 * hours make the site read as real and cost nothing to state. **The address is
 * deliberately fictional and deliberately has no number** — no street, no plaque,
 * no map embed, no coordinates, and none in the structured data either. A demo
 * that sends a stranger to somebody's actual building is a real-world harm, not
 * a styling bug.
 *
 * Every numeral goes through `toFa()`, the hours included.
 *
 * Rendered on the homepage as its closing band and on the about page as its
 * closing block, which is why the heading level and the load strategy are props.
 */
export function ReserveBand({
  level = 2,
  load = "lazy",
}: {
  level?: 2 | 3;
  load?: LoadStrategy;
}) {
  const Heading = level === 2 ? "h2" : "h3";

  return (
    <Band
      id="reserve"
      media={reserve.image}
      height={100}
      /* The one band carrying a whole block rather than a line, so its scrim
         plateau has to reach much further up the frame. */
      scrim="full"
      load={load}
      aria-labelledby="reserve-heading"
    >
      <Reveal>
        <Eyebrow>{reserve.eyebrow}</Eyebrow>
      </Reveal>

      <Reveal delay={90}>
        <Heading id="reserve-heading" className="t-h2 mt-2">
          {reserve.heading}
        </Heading>
      </Reveal>

      <Reveal delay={170}>
        <p className="t-lead max-w-[34ch]">{reserve.line}</p>
      </Reveal>

      <Reveal delay={250} className="flex flex-wrap items-center gap-4 pt-4">
        {/* A plain anchor, not the Button component: `tel:` must not open in a
            new tab, and Button's external variant exists to do exactly that. */}
        <a href={`tel:${site.contact.phoneHref}`} className="btn btn--primary">
          {reserve.phoneLabel}
        </a>

        <Button
          href={whatsappLink(site.contact.whatsapp, inquiry.generalMessage)}
          variant="secondary"
          external
        >
          {reserve.whatsappLabel}
        </Button>
      </Reveal>

      <Reveal delay={330} className="pt-6">
        <dl className="detail-list">
          <div className="detail-list__row">
            <dt className="detail-list__label">{reserve.labels.hours}</dt>
            <dd>{toFa(site.contact.hours)}</dd>
          </div>
          <div className="detail-list__row">
            <dt className="detail-list__label">{reserve.labels.address}</dt>
            <dd>{site.contact.address}</dd>
          </div>
          <div className="detail-list__row">
            <dt className="detail-list__label">{reserve.labels.phone}</dt>
            {/* No `dir` override. Persian digits are bidi-neutral numerals and
                lay out correctly inside an RTL paragraph; forcing LTR here is
                what moves the dash to the wrong end of the number. */}
            <dd>{toFa(site.contact.phone)}</dd>
          </div>
        </dl>
      </Reveal>
    </Band>
  );
}
