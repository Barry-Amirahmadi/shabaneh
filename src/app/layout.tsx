import type { Metadata, Viewport } from "next";
import { Lateef, Mirza } from "next/font/google";
import { site } from "@/content/site";
import { ui } from "@/content/ui";
import { organizationSchema } from "@/content/schema";
import { siteRoot } from "@/lib/seo";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

/**
 * Both faces are fetched at build time and served from this origin — next/font
 * self-hosts rather than linking to Google. That matters for a site aimed at
 * Iranian users: no third-party font request to be slow or blocked, and no
 * layout shift while a webfont negotiates. It also means **the build needs
 * network access**, and these two faces are ones this repository has never
 * downloaded before, so no cache can stand in for it.
 *
 * Mirza  — Persian Naskh, generous and calligraphic. Display only.
 * Lateef — Persian Naskh, quiet and open. Body and everything small.
 *
 * Neither is used anywhere else in this family of sites, and both are
 * Persian-native. Latin text barely appears here at all — one wordmark label and
 * an email address — so a face that handles Persian beautifully and Latin
 * adequately is the right trade rather than a compromise.
 *
 * **Both subsets on both faces. Do not "optimise" either down to `arabic`.**
 * Nothing on this site sets Latin in the display face, which makes dropping the
 * Latin subset look free. It is not: Google splits these faces by unicode range
 * and the `arabic` subset covers `U+0600-06FF` and friends — **it does not
 * contain `U+0020`**. The space character and general punctuation live in the
 * `latin` subset, and every Persian heading on the site has spaces in it, so the
 * browser downloads that file either way. Dropping the subset only removes its
 * `<link rel="preload">`, turning an early parallel fetch into one discovered
 * after layout — the same bytes, arriving in time to cause a visible swap on the
 * largest type on the page.
 *
 * Two weights each, and no more. Neither face ships a variable version, so every
 * weight is a separate file; 400 and 500 is what the design uses.
 */
const mirza = Mirza({
  subsets: ["arabic", "latin"],
  weight: ["400", "500"],
  variable: "--font-mirza",
  display: "swap",
});

const lateef = Lateef({
  subsets: ["arabic", "latin"],
  weight: ["400", "500"],
  variable: "--font-lateef",
  display: "swap",
});

/**
 * Site-wide defaults only. Every route composes its own title, description,
 * canonical and social card through `pageMetadata` — see `src/lib/seo.ts` for
 * why that is centralised rather than written per page.
 *
 * `metadataBase` carries the base path, unlike the bare origin the deploy
 * workflow supplies, so any relative URL Next resolves for itself lands inside
 * the deployed site rather than at the root of the host.
 *
 * **`robots: { index: false }` is the line that actually keeps this out of
 * search.** `robots.ts` also disallows everything, but a crawler only ever reads
 * `/robots.txt` from the *origin root*, and a GitHub Pages project site owns a
 * subpath — so the generated file is served somewhere no crawler looks. Both are
 * set; the meta tag is what does the work. This is a demo of a restaurant that
 * does not exist, and it should not turn up when someone searches for one.
 */
export const metadata: Metadata = {
  metadataBase: new URL(`${siteRoot}/`),
  title: {
    default: site.seo.title,
    template: site.seo.titleTemplate,
  },
  description: site.seo.description,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0c0a08",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${lateef.variable} ${mirza.variable}`}
      /* The inline script below stamps data-js before React hydrates; that is
         the point of it, so the resulting attribute difference is expected. */
      suppressHydrationWarning
    >
      <body>
        {/* Marks the document as scripted before first paint. Band reveals are
            hidden only under [data-js="on"], so a failed or blocked bundle
            leaves a fully readable page instead of a screen of empty
            photographs — which on this site would be the whole page. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.setAttribute("data-js","on")`,
          }}
        />

        <a href="#main" className="skip-link">
          {ui.skipToContent}
        </a>

        <Header />
        <main id="main">{children}</main>
        <Footer />

        {/* Restaurant-level structured data, on every page because the business
            is a property of the site rather than of any one route. Read
            src/content/schema.ts for the long list of fields it deliberately
            does not assert — the address among them. */}
        <JsonLd data={organizationSchema()} />
      </body>
    </html>
  );
}
