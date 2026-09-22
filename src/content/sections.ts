import type {
  AboutPageContent,
  DishPageContent,
  HomeContent,
  InquiryContent,
  MenuPageContent,
  NotFoundContent,
  SpacePageContent,
} from "@/types/content";

/**
 * THE COPY DECK — everything a reader sees that is the restaurant speaking.
 *
 * Interface strings live in `ui.ts` instead: that file is what the *interface*
 * is called, this one is what the *restaurant* says. Neither belongs inside a
 * component. Every export here is annotated against an interface in
 * `src/types/content.ts` rather than left to inference, so deleting a field
 * fails `npm run typecheck` instead of silently rendering nothing.
 *
 * ── THE VOICE ──────────────────────────────────────────────────────────────
 *
 * This is the least text of any site in this family, which makes it the hardest
 * copy in it: there is nowhere to hide. Every line is concrete and sensory —
 * name the heat, the smoke, the sour, the hour. Nothing is abstract praise.
 *
 * Words that do not appear anywhere on this site, and must not be added:
 * خلاق · حرفه‌ای · باتجربه · منحصربه‌فرد · پیشرو · بهترین · باکیفیت, and — because
 * they are the default vocabulary of Persian restaurant marketing and would
 * make this read as every other restaurant page — لاکچری · بی‌نظیر ·
 * تجربه‌ای فراموش‌نشدنی · اصیل به‌عنوان ادعا · دست‌پخت بی‌رقیب · طعم واقعی.
 *
 * No parentheses in any Persian string, anywhere. They break RTL rendering.
 *
 * ── WHAT THE NUMBERS MAY SAY ───────────────────────────────────────────────
 *
 * Opening hours, and nothing else. No seat count, no founding year, no covers
 * served, no rating, no award. A cooking time inside a dish's own copy is
 * describing the dish; a number that measures the business is a claim about a
 * business that does not exist.
 */

/**
 * The homepage — five bands and no sixth.
 *
 * OPENING full viewport, the room at night, the name and one line
 * THE ROOM  full viewport, two sentences set low
 * DISHES    three bands at 80dvh, stacked, one dish each
 * THE MENU  no photograph — the pause
 * RESERVE   full viewport, the phone and the hours
 *
 * Deliberately none of: an alternating image-and-text row, a card wall, a
 * statement at 13vw, a visible grid, or a gallery preview strip. Those belong
 * to the other four design languages in this family and this is the fifth.
 */
export const home: HomeContent = {
  opening: {
    line: "شب که می‌شود، این‌جا تازه باز می‌شود.",
    scrollCue: "پایین‌تر",
    image: {
      src: "/media/room-01.jpg",
      alt: "سالن غذاخوری از درگاه ورودی، میزهای چیده و چراغ‌های کم‌نور",
      ratio: "3/2",
    },
  },

  room: {
    heading: "سالن",
    line: "یک سالن کوچک، یک آشپزخانهٔ باز، و نوری که فقط از بالای میزها می‌آید. بلندتر از این حرف نمی‌زنیم.",
    image: {
      src: "/media/room-02.jpg",
      alt: "گوشهٔ خالی سالن با یک شمع روی میز",
      ratio: "3/2",
    },
  },

  /**
   * The three dishes the homepage shows, by slug and in this order.
   *
   * An editorial cut, not the first three of the menu: one from each course, so
   * the sequence says «شام» rather than «پیش‌غذاها». They are also the three
   * that carry a second close view, which is why the dish pages behind them are
   * the fullest ones a reader reaches from here.
   */
  featured: ["badenjan-doodi", "mahiche-aram", "tart-morakkabat"],

  menu: {
    eyebrow: "منو",
    heading: "نه خوراک، سه دسته",
    line: "یک وعده در هر شب، از اول تا آخر.",
    link: { label: "دیدن منو", href: "/products/" },
  },

  reserve: {
    eyebrow: "رزرو",
    heading: "میز شب",
    line: "سالن کوچک است؛ میز را از قبل بگیرید.",
    phoneLabel: "تماس تلفنی",
    whatsappLabel: "پیام در واتس‌اپ",
    labels: { hours: "ساعت", address: "نشانی", phone: "تلفن" },
    image: {
      src: "/media/room-03.jpg",
      alt: "گذرگاه میان آشپزخانه و سالن، نور گرمی که از آن بیرون می‌زند",
      ratio: "3/2",
    },
  },
};

/**
 * The menu page — nine bands, one per dish, and nothing between them but two
 * group marks. No grid of cards, no table, no price column.
 */
export const menuPage: MenuPageContent = {
  eyebrow: "منو",
  heading: "نه خوراک، در سه دسته",
  lead: "منو هر فصل عوض می‌شود و همیشه به همین اندازه می‌ماند. سه پیش‌غذا، سه خوراک اصلی، سه دسر.",
  listLabel: "فهرست خوراک‌ها",
  /** Follows the rendered count, e.g. «۹ خوراک». */
  countLabel: "خوراک",
  seo: {
    title: "منو",
    description:
      "نه خوراک در سه دسته — پیش‌غذا، خوراک اصلی و دسر. منوی شبانه هر فصل عوض می‌شود و به همین اندازه می‌ماند.",
  },
};

export const dishPage: DishPageContent = {
  detailsHeading: "جزئیات",
  viewsHeading: "نمای نزدیک",
  relatedEyebrow: "ادامه",
  relatedHeading: "ادامهٔ منو",
  backLabel: "بازگشت به منو",
  breadcrumbHome: "صفحهٔ اصلی",
  breadcrumbMenu: "منو",
  /** Accessible name of the trail itself, which is a navigation landmark. */
  breadcrumbLabel: "مسیر صفحه",
  groupLabel: "دسته",
};

/**
 * The space — full-bleed photographs stacked vertically, not a tiled grid.
 *
 * Every other site in this family tiles this page. This one does not, and that
 * is the point: a tile grid turns six photographs into six thumbnails, and on a
 * site where the photograph *is* the design a thumbnail is a demotion.
 */
export const spacePage: SpacePageContent = {
  eyebrow: "فضا",
  heading: "سالن، پیش از مهمان‌ها",
  lead: "این‌ها را ساعت شش عصر گرفتیم، وقتی چراغ‌ها روشن شده‌اند و هنوز کسی نیامده است.",
  /** Precedes the photograph's title in the zoom button's accessible name. */
  viewLabel: "نمای بزرگ",
  seo: {
    title: "فضا",
    description: "سالن، پیشخان و آشپزخانهٔ باز شبانه، پیش از آن‌که مهمان‌ها بیایند.",
  },
};

export const aboutPage: AboutPageContent = {
  eyebrow: "دربارهٔ ما",
  heading: "چرا فقط شب",
  lead: "شبانه یک وعده در روز سرو می‌کند. این صفحه می‌گوید چرا، و چه چیزی از آن تصمیم بیرون آمد.",
  body: [
    "شبانه فقط شب‌ها باز است، و این تصمیم اول بود نه نتیجهٔ چیز دیگری. آشپزخانه‌ای که صبح و ظهر و شب کار می‌کند، هر سه وعده را کمی کمتر از توانش انجام می‌دهد. ما یکی را انتخاب کردیم و باقی روز را صرف آماده کردن همان یکی می‌کنیم.",
    "شب تنها ساعتی است که کسی برای غذا خوردن عجله ندارد. ناهار همیشه بین دو کار است؛ شام خودش کار است. منو برای همان ساعت نوشته شده — نه خوراک که پشت سر هم می‌آیند و هیچ‌کدامشان سریع نیست.",
    "سالن کوچک است و بزرگ‌تر نمی‌شود. آشپزخانه باز است، پس هر صدایی که از آن بیاید شما هم می‌شنوید: صدای تابه، صدای چاقو روی تخته، و سکوت وقتی چیزی در قابلمهٔ سربسته مانده است. این‌ها را نپوشاندیم، چون نیمی از شام همین است.",
    "نور کم است و کم بودنش انتخاب شده. یک چراغ بالای هر میز، یک چراغ روی پیشخان، و باقی سالن تاریک می‌ماند. در تاریکی، بشقاب روشن‌ترین چیز روی میز است و همان‌جایی است که باید نگاه کنید.",
    "برای گرفتن میز تلفن می‌زنید یا در واتس‌اپ پیام می‌دهید، و کسی جواب می‌دهد. فرم و تقویم آنلاینی وجود ندارد؛ برای سالنی به این اندازه، یک مکالمهٔ کوتاه دقیق‌تر از هر فرمی است.",
  ],
  images: [
    {
      src: "/media/about-01.jpg",
      alt: "سالن خالی پیش از سرو، صندلی‌ها پایین و نور کم",
      ratio: "3/2",
      caption: "شش عصر، پیش از سرو",
    },
    {
      src: "/media/about-02.jpg",
      alt: "درگاه سالن در پایان شب، یک چراغ که هنوز روشن است",
      ratio: "3/2",
      caption: "پایان شب، یک چراغ روشن",
    },
  ],
  seo: {
    title: "دربارهٔ ما",
    description:
      "شبانه فقط شب‌ها باز است؛ یک سالن کوچک با آشپزخانهٔ باز و نور کم، و یک وعده در هر شب.",
  },
};

/**
 * The reservation, as a WhatsApp message.
 *
 * This is the site's whole conversion mechanism. There is no cart, no form and
 * no booking widget — a reservation form is exactly what a restaurant site
 * invites, and on a static host a form with nowhere to post falls back to a GET
 * at the current URL: the page reloads, the scroll position is lost, and
 * whatever the visitor typed ends up in the URL, in browser history and in any
 * outgoing referrer. The smoke suite asserts no such form exists.
 */
export const inquiry: InquiryContent = {
  label: "رزرو میز",
  /** `{dish}` is replaced with the dish name at render time. */
  message: "سلام. می‌خواهم برای شب میز رزرو کنم. {dish} را در منو دیدم.",
  generalLabel: "پیام در واتس‌اپ",
  generalMessage: "سلام. می‌خواهم برای شب میز رزرو کنم.",
  /** Appended for screen readers to any link that leaves the site. */
  newWindow: "در پنجرهٔ تازه باز می‌شود",
};

export const notFound: NotFoundContent = {
  /** Rendered through `toFa()`, like every other numeral on the site. */
  eyebrow: "404",
  heading: "این نشانی وجود ندارد",
  lead: "صفحه‌ای که خواستید نیست. منو و فضا هر دو از این‌جا در دسترس‌اند.",
  action: { label: "بازگشت به صفحهٔ اصلی", href: "/" },
};
