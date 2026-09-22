import Link from "next/link";
import { site } from "@/content/site";
import { ui } from "@/content/ui";
import { toFa } from "@/lib/digits";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Footer — a colophon, and a convenience copy of the reservation details.
 *
 * Flex rather than a grid, and that is not laziness: there is no visible grid
 * anywhere on this site, and a twelve-column footer would be the only place one
 * showed through. Three blocks that wrap is what the content is.
 *
 * The oversized name at the bottom is the one purely graphic element on the
 * site: it closes the document the way a colophon closes a book.
 *
 * **There is deliberately no newsletter signup and no reservation form here, and
 * re-adding either needs a backend first.** A form with nowhere to post falls
 * back to a GET at the current URL on a static host — the page reloads, the
 * scroll position is lost, and whatever was typed lands in the URL, in history
 * and in any outgoing referrer. The reservation is a phone number and a WhatsApp
 * link, both of which work with nothing behind them.
 */
export function Footer() {
  return (
    <footer className="border-t border-[var(--color-line)]">
      <div className="container py-[var(--section-y-tight)]">
        <div className="flex flex-wrap justify-between gap-x-[var(--space-9)] gap-y-[var(--space-8)]">
          {/* Brand line */}
          <div className="max-w-[26ch]">
            <Reveal>
              <p className="t-h3">{site.brand.name}</p>
              <p className="t-body mt-3">{site.brand.line}</p>
            </Reveal>
          </div>

          {/* Navigation */}
          <nav aria-label={ui.nav.footer}>
            <Reveal delay={60}>
              <h2 className="t-label mb-4">{site.footer.navHeading}</h2>
              <ul className="flex flex-col">
                {site.nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="t-meta footer-link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </nav>

          {/* Reservation */}
          <div>
            <Reveal delay={120}>
              <h2 className="t-label mb-4">{site.footer.contactHeading}</h2>
              <ul className="flex flex-col">
                <li className="t-meta flex min-h-11 items-center">
                  {toFa(site.contact.hours)}
                </li>
                <li>
                  <a href={`tel:${site.contact.phoneHref}`} className="t-meta footer-link">
                    {toFa(site.contact.phone)}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="t-meta footer-link"
                    dir="ltr"
                  >
                    {site.contact.email}
                  </a>
                </li>
                <li className="t-meta flex min-h-11 items-center">{site.contact.address}</li>
              </ul>
            </Reveal>
          </div>
        </div>

        {/* Social + legal */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-[var(--color-line)] pt-6">
          <ul className="flex flex-wrap items-center gap-x-6">
            {site.social.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="t-meta footer-link"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          {/* Rendered only when there is something to render — an empty list
              would otherwise leave a bare flex child holding the row open. */}
          {site.legal.length > 0 ? (
            <ul className="flex flex-wrap items-center gap-x-6">
              {site.legal.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="t-meta footer-link">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* Colophon */}
        <div className="mt-12 flex flex-wrap items-end justify-between gap-6">
          <p className="t-display leading-none opacity-10" aria-hidden="true">
            {site.brand.name}
          </p>
          <p className="t-meta">{toFa(site.copyright)}</p>
        </div>
      </div>
    </footer>
  );
}
