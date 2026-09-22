/**
 * Content model.
 *
 * These types are the contract between the UI and whatever supplies content.
 * Today the supplier is a set of TypeScript files under `src/content`; a real
 * CMS could replace them without a component changing, and that claim is
 * checkable rather than aspirational — **every export in `src/content/*.ts` is
 * annotated against an explicit interface here, never left to inference.**
 * Delete a field from a source file and `npm run typecheck` fails. See
 * docs/MASTER-HANDOFF.md §52.
 *
 * What changed from the editorial engine this is derived from:
 *
 * - `ProductLayout` and `Product.layout` are **gone.** They described which
 *   columns a product took in an alternating twelve-column spread, and this
 *   site has no grid, no columns and no rows — every dish is a full-viewport
 *   photograph with its name over it. A field no component reads is the exact
 *   kind of dead content the typed-contract rule exists to prevent.
 * - `Product.tone` is **repurposed, not removed.** It used to be a CSS colour
 *   driving an ambient wash. It is now the weight of the scrim between a
 *   photograph and the words on it, which is how the three course groups read
 *   as different without a label. See `resolveProducts()`.
 * - `Product.views` is **new**, and optional. `image` stays required and
 *   unchanged: every band, every card and the share card read it.
 */

/** Fixed aspect ratios. Crops are part of the art direction, not per-image
 *  guesswork — an editor picks one, never a raw pixel size.
 *
 *  `3/2` is the landscape shape of the environment photography (1536x1024) and
 *  `1/1` the overhead shape of the dishes (1024x1024). Both are cropped by the
 *  band to whatever the viewport is, so the ratio is a statement about the
 *  source file rather than about the layout. */
export type Ratio = "1/1" | "4/5" | "3/4" | "4/3" | "3/2" | "8/5" | "16/9";

export interface MediaAsset {
  /** Path today, CMS asset URL later. */
  src: string;
  /** Describes the picture for someone who cannot see it. Never the filename. */
  alt: string;
  ratio: Ratio;
  /** Optional editorial caption shown under or over the image. */
  caption?: string;
}

/**
 * How heavily a band dims its photograph under the words.
 *
 * Every weight holds the same minimum legibility — the plateau the text sits
 * on never drops below 90% of the ground, which is the number the contrast
 * table in `tokens.css` is measured from. What varies is how far up the frame
 * the dimming reaches, i.e. how much photograph survives. Starters read
 * lighter, desserts heavier.
 */
export type ScrimWeight = "light" | "mid" | "deep" | "full";

export interface Dish {
  id: string;
  /** URL segment — /products/[slug]. */
  slug: string;
  /** Persian dish name. Two to four words. */
  name: string;
  /** Latin transliteration, used only for micro-labels. */
  latin: string;
  /** The course group: پیش‌غذا, خوراک اصلی or دسر. Also drives the scrim
   *  weight fallback and the group marks on the menu. */
  category: string;
  /** The one line that appears under the name on every band. 10–14 words. */
  description: string;
  /**
   * Detail-page copy. All optional: a dish can be published with nothing but
   * the fields above, and the detail page degrades to the listing copy.
   *
   * These are *editorial copy* — what the kitchen says about the plate. There
   * is deliberately no `price`, no `allergens`, no `calories` and no
   * `provenance` field here, and adding one would be the single most harmful
   * thing that could be done to this model: an allergen label someone acts on
   * has a medical consequence, and a sourcing claim naming a real farm is a
   * factual assertion about a business that does not exist.
   */
  statement?: string;
  /** Body paragraphs. An array so the editor controls the breaks, not a regex. */
  body?: string[];
  /**
   * Key information as label/value pairs rather than a fixed schema. The
   * vocabulary is پایه · روش پخت · همراه · فصل, and every value restates
   * something the dish's own copy already says.
   */
  details?: { label: string; value: string }[];
  /** Scrim weight. Optional because an editor can save a dish without picking
   *  one — see resolveDishes() for what happens then. */
  tone?: ScrimWeight;
  /** The one photograph every surface uses. Required, and never removed. */
  image: MediaAsset;
  /**
   * Extra close views, shown as full-bleed bands on the dish page and openable
   * in the lightbox. Three of the nine dishes have one; the rest have none, and
   * no slot is manufactured to fill the type.
   */
  views?: MediaAsset[];
  status: "published" | "draft";
  seo?: {
    title?: string;
    description?: string;
  };
}

/**
 * A dish with every presentation field guaranteed present.
 *
 * `Dish` is the *authoring* shape, where presentation fields may be absent;
 * `ResolvedDish` is the *rendering* shape, where they never are. Keeping the
 * two separate means no component ever carries a `?? fallback` for a missing
 * field, and the defaulting rules live in exactly one place.
 */
export interface ResolvedDish extends Dish {
  tone: ScrimWeight;
}

export interface GalleryItem {
  id: string;
  title: string;
  /** Persian label — the axis a future gallery filter would use. */
  category: string;
  caption?: string;
  image: MediaAsset;
  /** Manual sort position, as an editor would set it. */
  order: number;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteContent {
  brand: {
    name: string;
    latin: string;
    /** One line, used in the footer and as the meta description base. */
    line: string;
  };
  /**
   * Document-level metadata for the site as a whole. Per-route titles live on
   * the section that owns the route; these are the default and the wrapper.
   */
  seo: {
    /** The homepage <title>, and the fallback for any route without its own. */
    title: string;
    /** `%s` is the route's own title. */
    titleTemplate: string;
    /** The homepage meta description. Longer than `brand.line`, which is a
     *  display string and too short to be a useful search snippet. */
    description: string;
    /** The share card. `src` is root-relative; the absolute URL is composed at
     *  build time, because Open Graph requires one. */
    ogImage: { src: string; alt: string; width: number; height: number };
  };
  nav: NavItem[];
  headerCta: NavItem;
  contact: {
    city: string;
    /**
     * Where the restaurant is, at district level and visibly invented.
     *
     * No street number, no plaque, no map embed and no coordinates anywhere on
     * this site. A demo that sends a stranger to somebody's actual building is
     * a real-world harm rather than a styling bug, so the address is a
     * placeholder in exactly the way the phone number is.
     */
    address: string;
    /** Display string, Persian digits. Opening hours are a plain fact about a
     *  restaurant and make the site read as real, so they are stated plainly
     *  and nothing else about the business is quantified. */
    hours: string;
    /** Display string, in Persian digits. */
    phone: string;
    /** Dial string, in Latin digits. Kept separate: Persian digits are not
     *  matched by \d, so a tel: href cannot be derived from `phone`. */
    phoneHref: string;
    /** WhatsApp click-to-chat number, Latin digits only, no punctuation. */
    whatsapp: string;
    email: string;
    /** Secondary path, for someone at the discovery stage rather than booking. */
    instagram: { handle: string; href: string };
  };
  social: NavItem[];
  legal: NavItem[];
  /** Column headings in the footer. Brand copy, not structure. */
  footer: {
    navHeading: string;
    contactHeading: string;
  };
  copyright: string;
}

/* -------------------------------------------------------------------------- */
/*  Band copy                                                                 */
/* -------------------------------------------------------------------------- */

/** Per-route metadata, on the section that owns the route. */
export interface SeoFields {
  title: string;
  description: string;
}

/**
 * The opening band. The name, one line of six to nine words, one scroll cue.
 * Nothing else — no buttons, no eyebrow, no second image.
 */
export interface OpeningContent {
  line: string;
  scrollCue: string;
  image: MediaAsset;
}

/** A band with a heading and one or two sentences over a photograph. */
export interface PhotoBandContent {
  heading: string;
  line: string;
  image: MediaAsset;
}

/**
 * The band with no photograph. After four full-bleed images the absence of one
 * is what makes this read as a pause rather than as a gap.
 */
export interface MenuTeaserContent {
  eyebrow: string;
  heading: string;
  line: string;
  link: NavItem;
}

/** The closing band: how to actually get a table. */
export interface ReserveContent {
  eyebrow: string;
  heading: string;
  line: string;
  phoneLabel: string;
  whatsappLabel: string;
  labels: { hours: string; address: string; phone: string };
  image: MediaAsset;
}

/** The homepage, assembled. `featured` names the three dishes it shows, in
 *  order, by slug — an editorial cut of the menu, not the first three. */
export interface HomeContent {
  opening: OpeningContent;
  room: PhotoBandContent;
  featured: string[];
  menu: MenuTeaserContent;
  reserve: ReserveContent;
}

export interface MenuPageContent {
  eyebrow: string;
  heading: string;
  lead: string;
  /** Accessible name of the list of dishes, which is a landmark. */
  listLabel: string;
  /** Follows the rendered dish count, e.g. «۹ خوراک». */
  countLabel: string;
  seo: SeoFields;
}

export interface DishPageContent {
  detailsHeading: string;
  viewsHeading: string;
  relatedEyebrow: string;
  relatedHeading: string;
  backLabel: string;
  breadcrumbHome: string;
  breadcrumbMenu: string;
  breadcrumbLabel: string;
  /** Precedes the course group on the dish page, e.g. «دسته». */
  groupLabel: string;
}

export interface SpacePageContent {
  eyebrow: string;
  heading: string;
  lead: string;
  /** Accessible name of each photograph's zoom button. */
  viewLabel: string;
  seo: SeoFields;
}

export interface AboutPageContent {
  eyebrow: string;
  heading: string;
  lead: string;
  /** Body paragraphs. An array so the editor controls the breaks. Four to five
   *  — the most text on the site, deliberately, because this is the one place
   *  the reader has agreed to read. */
  body: string[];
  /** The two full-bleed photographs that break the column. */
  images: [MediaAsset, MediaAsset];
  seo: SeoFields;
}

/**
 * The reservation invitation, as a WhatsApp message.
 *
 * There is no form on this site and there must not be one. A form on a static
 * host with nothing behind it falls back to a GET at the current URL: the page
 * reloads, the scroll position is lost, and whatever was typed is written into
 * the URL and therefore into history and any outgoing referrer. A reservation
 * form is precisely the thing this site invites, and the smoke suite forbids it.
 */
export interface InquiryContent {
  label: string;
  /** `{dish}` is substituted with the dish name at render time. */
  message: string;
  /** The same channel with no dish in hand. */
  generalLabel: string;
  generalMessage: string;
  /** Appended for screen readers to any link that leaves the site. */
  newWindow: string;
}

export interface NotFoundContent {
  eyebrow: string;
  heading: string;
  lead: string;
  action: NavItem;
}

/* -------------------------------------------------------------------------- */
/*  Interface strings                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Accessible names, and the few words the interface says on its own behalf
 * rather than the restaurant's.
 *
 * Modelled for the same reason the copy deck is: §28 has no exception for text
 * only a screen reader hears, and a string a component hardcodes is a string no
 * editor and no translator can reach.
 */
export interface UiStrings {
  /** First focusable element on every page. */
  skipToContent: string;
  nav: {
    primary: string;
    footer: string;
    /** Trailing half of the wordmark's accessible name, after the name. */
    home: string;
    openMenu: string;
    closeMenu: string;
    /** The mobile panel is a dialog and needs its own name. */
    menuDialog: string;
  };
  gallery: {
    lightbox: string;
    close: string;
    previous: string;
    next: string;
    /** Joins position and total, e.g. «۳ از ۹». */
    counterJoin: string;
  };
}
