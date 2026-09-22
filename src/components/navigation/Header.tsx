"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { ui } from "@/content/ui";
import { routePath } from "@/lib/nav";
import { Wordmark } from "@/components/ui/Wordmark";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";

/**
 * RTL navigation.
 *
 * Reading order is wordmark → sections → action, which in an RTL document places
 * the wordmark at the right edge and the reservation at the left. That is the
 * natural arrangement here, not a mirrored LTR header: the name sits where a
 * Persian reader starts.
 *
 * At rest the header is a gradient scrim rather than a bar — see `.site-header`
 * in components.css for why that is a contrast requirement and not a style
 * choice. It sits over the opening band's photograph, and a translucent bar
 * would put its nav links on whatever pixel happened to be behind them.
 *
 * There is no in-page section observer here, unlike the editorial sites this
 * engine came from. Every nav item is a route, the reserve action deep-links to
 * the about page's own block, and nothing in this site's navigation points at a
 * scroll position — so there is no "you are reading this section" state to track.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const here = routePath(usePathname() ?? "/");

  /**
   * Two kinds of current, and the distinction is not pedantry: `page` means this
   * nav item *is* the document being viewed, `true` means the document is inside
   * it. A dish page is inside «منو» without being it, and telling a screen-reader
   * user they are on the menu when they are on a dish is a small lie the markup
   * does not need to tell.
   */
  const currentState = (href: string) => {
    const route = routePath(href);
    if (route === here) return "page" as const;
    if (route !== "/" && here.startsWith(`${route}/`)) return "true" as const;
    return undefined;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="site-header" data-scrolled={scrolled}>
        <div className="container flex items-center justify-between gap-6 py-4">
          <Wordmark />

          <nav aria-label={ui.nav.primary} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="nav-link"
                    aria-current={currentState(item.href)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              href={site.headerCta.href}
              variant="secondary"
              className="hidden md:inline-flex"
            >
              {site.headerCta.label}
            </Button>

            <button
              type="button"
              className="menu-toggle lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label={ui.nav.openMenu}
              aria-expanded={menuOpen}
            >
              <span className="flex w-6 flex-col gap-[6px]">
                <span className="menu-toggle__bar w-full" />
                <span className="menu-toggle__bar w-2/3 self-start" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
