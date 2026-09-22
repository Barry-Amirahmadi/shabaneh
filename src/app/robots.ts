import type { MetadataRoute } from "next";

/**
 * robots.txt — disallow everything.
 *
 * This is a demo of a restaurant that does not exist, with an invented address
 * and a placeholder phone number. It should not appear in search results for
 * anything, so nothing here is crawlable.
 *
 * **A caveat worth knowing before reading anything into this file:** a crawler
 * only ever fetches `/robots.txt` from the *origin root*. On a GitHub Pages
 * project site the deployment owns `user.github.io/repo/`, not
 * `user.github.io/`, so the file generated here is served at `/repo/robots.txt`
 * and no crawler will look for it there — the rules that actually apply come
 * from whatever sits at the root, which this repository does not control.
 *
 * **So the `noindex` meta tag in `layout.tsx` is what actually does the work.**
 * Both are set, and the meta tag is the one to keep if one of them ever has to
 * go. This file is generated anyway because it is correct for the two
 * deployments that would serve this repo from a root — a custom domain, and a
 * user or organisation site — and there it lands exactly where it should.
 *
 * No `sitemap:` line, and that is not an oversight: advertising a sitemap while
 * disallowing every path in it is a contradictory instruction. The sitemap is
 * still generated, because it is part of what makes the template technically
 * complete, and it becomes meaningful the moment a real business removes the
 * disallow.
 */
/** Required under `output: "export"` — see the note in `sitemap.ts`. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
  };
}
