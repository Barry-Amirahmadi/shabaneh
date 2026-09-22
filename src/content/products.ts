import type { Dish } from "@/types/content";
import { resolveProducts } from "./resolveProducts";

/**
 * THE MENU — nine dishes, three per course group.
 *
 * PLACEHOLDER CONTENT. This is a fictional restaurant and every dish below is
 * invented. What is *not* invented, anywhere in this file, and must never be
 * added to it:
 *
 * - **No allergen or dietary-safety claim of any kind.** Not «بدون گلوتن», not
 *   «بدون لاکتوز», not «مناسب گیاه‌خواران». If someone acts on a false allergen
 *   label the consequence is medical, and nothing about a portfolio piece is
 *   worth that.
 * - **No health or nutrition claim.** No calories, no «سبک و سالم».
 * - **No award, star, ranking, press quote, chef credential or years of
 *   experience.** No «برترین» of anything.
 * - **No sourcing claim naming a real supplier, farm or region as fact.** The
 *   saffron is «زعفران», not saffron from somewhere that exists.
 * - **No price.** Not here, not on any page, in any form. A fine-dining menu
 *   published without prices is normal, so this costs the design nothing.
 *
 * Describing what happens in the pan is fine, and is the whole voice: name the
 * heat, the smoke, the sour, the hour. A line that says what a dish *does* is
 * copy; a line that says it is «بی‌نظیر» is dead.
 *
 * **`tone` is the scrim weight, not a colour.** It used to be a shade driving
 * an ambient wash on the editorial site this engine came from. Here it decides
 * how heavily a band dims its photograph under the words, which is how the
 * three courses read as different without a label: starters `light`, mains
 * `mid`, desserts `deep`. Every weight holds the same measured legibility floor
 * — see `resolveProducts.ts` and the table in `tokens.css`.
 *
 * **Image ratios are a statement about the source file, not about the layout.**
 * Dishes are shot square and overhead (1024x1024, `1/1`); the close views are
 * landscape (1536x1024, `3/2`). Every band crops to the viewport regardless.
 *
 * Three of the nine carry one extra `views` entry each. The other six carry
 * none, and no slot is manufactured to fill the type.
 */
export const products: Dish[] = [
  /* ---------------------------------------------------------------- پیش‌غذا */
  {
    id: "d-badenjan",
    slug: "badenjan-doodi",
    name: "بادمجان دودی",
    latin: "BADENJAN",
    category: "پیش‌غذا",
    description: "پوست روی شعله می‌سوزد، گوشتش نرم می‌ماند، و دود در بشقاب می‌نشیند.",
    statement:
      "بادمجان را تا وقتی پوستش سیاه شود روی آتش می‌گذاریم، بعد کنار می‌گذاریم تا خودش سرد شود. آن‌چه می‌ماند دود است و نرمی، و کمی نمک.",
    body: [
      "آتش مستقیم تنها راهی است که پوست بادمجان را می‌سوزاند بدون این‌که گوشتش بجوشد. شعله را بلند می‌گیریم و بادمجان را می‌چرخانیم تا هر طرفش نوبت خودش را ببیند. این کار ده دقیقه طول می‌کشد و کوتاه‌ترش نمی‌شود کرد؛ اگر زودتر برداریم، دود به مغز بادمجان نرسیده است.",
      "بعد از آن، کار تمام است. پوست سوخته را می‌کنیم، گوشت را با پشت قاشق باز می‌کنیم و چیزی به آن اضافه نمی‌کنیم جز نمک و روغن زیتون. هر چیز دیگری دود را می‌پوشاند، و دود همان چیزی است که ده دقیقه صرفش شد و جای دیگری پیدا نمی‌شود.",
    ],
    details: [
      { label: "پایه", value: "بادمجان" },
      { label: "روش پخت", value: "روی شعلهٔ مستقیم" },
      { label: "همراه", value: "نان و روغن زیتون" },
      { label: "فصل", value: "همهٔ سال" },
    ],
    tone: "light",
    image: {
      src: "/media/dish-01.jpg",
      alt: "بشقاب بادمجان دودی از بالا، روی میز تیره و در نور کم",
      ratio: "1/1",
    },
    views: [
      {
        src: "/media/view-03.jpg",
        alt: "نمای نزدیک از پوست سوختهٔ بادمجان که از گوشت جدا می‌شود",
        ratio: "3/2",
        caption: "پوست، وقتی کنار می‌رود",
      },
    ],
    status: "published",
  },
  {
    id: "d-adas",
    slug: "soup-adas",
    name: "سوپ عدس و لیمو",
    latin: "ADAS",
    category: "پیش‌غذا",
    description: "عدس تا آخر می‌پزد، بعد آب‌لیموی تازه از بالا و دیگر هیچ.",
    statement:
      "سوپ روی حرارت کم می‌ماند تا عدس از هم باز شود و خودش غلیظ کند. ترشی در آخرین لحظه اضافه می‌شود، وقتی قابلمه از روی گاز پایین آمده است.",
    body: [
      "عدس اگر تند بجوشد پوستش می‌ترکد و سوپ گِلی می‌شود. پس حرارت کم می‌ماند و در قابلمه نیمه‌باز است تا بخار راه داشته باشد. غلظت از خود عدس می‌آید، نه از آرد و نه از خامه؛ چیزی که اضافه کنیم طعم لیمو را از میان می‌برد.",
      "آب‌لیمو را روی حرارت نمی‌ریزیم. حرارت ترشی را تخت می‌کند و بویش را می‌برد، و آن بو نیمی از این کاسه است. قابلمه را پایین می‌آوریم، لیمو را می‌ریزیم، هم می‌زنیم و همان موقع می‌کشیم. نعنا هم آخر می‌آید، خشک و تفت‌داده، روی سطح.",
    ],
    details: [
      { label: "پایه", value: "عدس" },
      { label: "روش پخت", value: "جوش آرام" },
      { label: "همراه", value: "آب‌لیمو و نعنا" },
      { label: "فصل", value: "پاییز و زمستان" },
    ],
    tone: "light",
    image: {
      src: "/media/dish-02.jpg",
      alt: "کاسهٔ سوپ عدس از بالا، بخار کم و سطحی صاف",
      ratio: "1/1",
    },
    status: "published",
  },
  {
    id: "d-gerdoo",
    slug: "kookoo-gerdoo",
    name: "کوکوی گردو",
    latin: "GERDOO",
    category: "پیش‌غذا",
    description: "سبزی خردشده، گردوی کوبیده، و یک روی سوختهٔ نازک که در تابه می‌بندد.",
    statement:
      "سبزی را ریز می‌کنیم و گردو را با دست می‌کوبیم، نه با دستگاه. تابه داغ است و روغن کم؛ کوکو باید یک پوستهٔ نازک ببندد و بعد آرام بپزد.",
    body: [
      "گردوی کوبیده با دست تکه‌های نامساوی می‌دهد، و همان نامساوی بودن است که در دهان حس می‌شود. دستگاه همه را یک‌اندازه می‌کند و کوکو یکدست و بی‌خبر می‌شود. سبزی هم باید خشک باشد، وگرنه آبش در تابه جمع می‌شود و پوسته هیچ‌وقت نمی‌بندد.",
      "تابه را داغ می‌کنیم و بعد حرارت را پایین می‌آوریم. پوسته در سی ثانیهٔ اول بسته می‌شود و باقی کار روی حرارت کم انجام می‌گیرد؛ اگر تند بماند، بیرونش سیاه و وسطش خام می‌شود. یک بار برمی‌گردانیم، نه بیشتر، و هر بار اضافه یعنی کوکوی شکسته.",
    ],
    details: [
      { label: "پایه", value: "سبزی و گردو" },
      { label: "روش پخت", value: "تابهٔ کم‌روغن" },
      { label: "همراه", value: "ماست چکیده" },
      { label: "فصل", value: "بهار" },
    ],
    tone: "light",
    image: {
      src: "/media/dish-03.jpg",
      alt: "برش کوکوی گردو از بالا، لبهٔ سوخته و مغز سبز",
      ratio: "1/1",
    },
    status: "published",
  },

  /* ----------------------------------------------------------- خوراک اصلی */
  {
    id: "d-mahiche",
    slug: "mahiche-aram",
    name: "ماهیچهٔ آرام",
    latin: "MAHICHE",
    category: "خوراک اصلی",
    description: "شش ساعت روی حرارت کم، تا گوشت خودش از استخوان جدا شود.",
    statement:
      "ماهیچه را اول در تابهٔ داغ رنگ می‌دهیم، بعد در قابلمهٔ سربسته می‌گذاریم و فراموشش می‌کنیم. شش ساعت بعد، چاقو لازم نیست.",
    body: [
      "رنگ دادن اول کار، تنها مرحله‌ای است که عجله دارد: تابه باید داغ باشد و گوشت خشک، وگرنه آب می‌افتد و به‌جای سرخ شدن می‌جوشد. آن لایهٔ قهوه‌ای بعد در سس حل می‌شود و تمام عمق خوراک از همان نیم‌ساعت اول می‌آید.",
      "باقی کار حرارت است و زمان. قابلمه سربسته می‌ماند و مایع فقط تا نیمهٔ ماهیچه می‌رسد؛ بیشتر از آن، گوشت را می‌جوشاند نه می‌پزد. سس در همان قابلمه غلیظ می‌شود و چیزی به آن اضافه نمی‌شود — شش ساعت خودش کار غلیظ‌کننده را کرده است.",
    ],
    details: [
      { label: "پایه", value: "ماهیچهٔ گوسفند" },
      { label: "روش پخت", value: "قابلمهٔ سربسته، حرارت کم" },
      { label: "همراه", value: "پلوی زعفران" },
      { label: "فصل", value: "پاییز و زمستان" },
    ],
    tone: "mid",
    image: {
      src: "/media/dish-04.jpg",
      alt: "ماهیچه در بشقاب از بالا، سس تیره دور استخوان",
      ratio: "1/1",
    },
    views: [
      {
        src: "/media/view-01.jpg",
        alt: "نمای نزدیک از قاشقی که سس تیره را روی گوشت می‌ریزد",
        ratio: "3/2",
        caption: "سس، در آخرین لحظه",
      },
    ],
    status: "published",
  },
  {
    id: "d-zaferan",
    slug: "polo-zaferan",
    name: "پلوی زعفران",
    latin: "ZAFERAN",
    category: "خوراک اصلی",
    description: "برنج دم می‌کشد، ته‌دیگ می‌بندد، و زعفران فقط روی نیمی از آن می‌نشیند.",
    statement:
      "برنج را آبکش می‌کنیم و بعد دم می‌گذاریم تا هر دانه جدا بماند. زعفران روی نیمی از آن می‌رود، چون یکدست کردنش رنگ را از معنا می‌اندازد.",
    body: [
      "آبکش کردن یعنی برنج دو بار پخته می‌شود: یک بار در آب زیاد، یک بار در بخار خودش. مرحلهٔ اول کوتاه است و دانه باید هنوز مغز داشته باشد وقتی از آب درمی‌آید؛ اگر آن‌جا کامل بپزد، دم کشیدن جز شکستنش کاری نمی‌کند.",
      "ته‌دیگ از حرارت مستقیم و صبر می‌آید، نه از روغن زیاد. قابلمه را روی حرارت کم می‌گذاریم و در چهل دقیقه بازش نمی‌کنیم. زعفران دم‌کرده آخر کار روی نیمهٔ بشقاب می‌ریزد، و همان مرز بین سفید و نارنجی است که برنج را دیدنی می‌کند.",
    ],
    details: [
      { label: "پایه", value: "برنج و زعفران" },
      { label: "روش پخت", value: "آبکش و دم" },
      { label: "همراه", value: "ماهیچه یا مرغ" },
      { label: "فصل", value: "همهٔ سال" },
    ],
    tone: "mid",
    image: {
      src: "/media/dish-05.jpg",
      alt: "بشقاب پلو از بالا، نیمی سفید و نیمی زعفرانی",
      ratio: "1/1",
    },
    status: "published",
  },
  {
    id: "d-anar",
    slug: "morgh-anar",
    name: "مرغ و انار",
    latin: "ANAR",
    category: "خوراک اصلی",
    description: "رب انار تا جایی می‌جوشد که ترشی‌اش تیز بماند و شیرین نشود.",
    statement:
      "مرغ در سس انار می‌پزد، و سس همان‌جا غلیظ می‌شود. خط باریکی هست بین ترش و شیرین، و این خوراک تمامش روی همان خط ایستاده است.",
    body: [
      "رب انار اگر زیاد بجوشد قندش می‌سوزد و طعمش به مربا می‌زند. پس دیرتر از مرغ اضافه می‌شود و از آن لحظه حرارت پایین می‌ماند. مزه را در سه نوبت می‌چشیم، چون غلظت و ترشی با هم بالا می‌روند و برگشتن از شیرینی ممکن نیست.",
      "مرغ را با پوست می‌گذاریم تا چربی‌اش در سس برود، و بعد بیرون می‌آوریم تا سس تنها بجوشد. آخر کار برمی‌گردد در قابلمه، فقط برای چند دقیقه. دانهٔ انار تازه روی بشقاب می‌آید و پخته نمی‌شود — کارش صدا و ترشی سرد است.",
    ],
    details: [
      { label: "پایه", value: "مرغ و رب انار" },
      { label: "روش پخت", value: "جوش کوتاه روی حرارت کم" },
      { label: "همراه", value: "پلوی سفید" },
      { label: "فصل", value: "پاییز" },
    ],
    tone: "mid",
    image: {
      src: "/media/dish-06.jpg",
      alt: "خوراک مرغ و انار از بالا، سس تیره و دانه‌های انار",
      ratio: "1/1",
    },
    status: "published",
  },

  /* ------------------------------------------------------------------- دسر */
  {
    id: "d-morakkabat",
    slug: "tart-morakkabat",
    name: "تارت مرکبات",
    latin: "MORAKKABAT",
    category: "دسر",
    description: "خمیر ترد، کرم مرکبات ترش، و یک لایهٔ نازک سوختگی روی سطح.",
    statement:
      "خمیر جدا پخته می‌شود تا ترد بماند، و کرم بعد از سرد شدنش می‌آید. سطح را با شعله برشته می‌کنیم، فقط تا جایی که تلخ شود.",
    body: [
      "خمیر و کرم دو کار جدا هستند و با هم پخته نمی‌شوند. اگر کرم خام روی خمیر خام برود، کف تارت خیس می‌ماند و تردی — که تنها دلیل وجود این خمیر است — از دست می‌رود. پس خمیر با وزنه پخته می‌شود، سرد می‌شود، و بعد پر می‌شود.",
      "برشته کردن سطح با شعله چند ثانیه طول می‌کشد و همان‌جا هم می‌تواند خراب شود. لایهٔ تلخ باید نازک باشد؛ ضخیم‌تر از آن، ترشی مرکبات را می‌پوشاند و دسر فقط شیرین می‌ماند. شعله را دور نگه می‌داریم و تارت را می‌چرخانیم، نه شعله را.",
    ],
    details: [
      { label: "پایه", value: "خمیر شکری و مرکبات" },
      { label: "روش پخت", value: "پخت جدا، برشتگی با شعله" },
      { label: "همراه", value: "خامهٔ بی‌شکر" },
      { label: "فصل", value: "زمستان" },
    ],
    tone: "deep",
    image: {
      src: "/media/dish-07.jpg",
      alt: "برش تارت مرکبات از بالا، سطح برشته و لبهٔ خمیر",
      ratio: "1/1",
    },
    views: [
      {
        src: "/media/view-02.jpg",
        alt: "نمای نزدیک از خمیری که زیر قاشق می‌شکند",
        ratio: "3/2",
        caption: "خمیر، وقتی می‌شکند",
      },
    ],
    status: "published",
  },
  {
    id: "d-golab",
    slug: "bastani-golab",
    name: "بستنی گلاب",
    latin: "GOLAB",
    category: "دسر",
    description: "سرد، غلیظ، با گلاب که بعد از قاشق اول تازه پیدا می‌شود.",
    statement:
      "پایهٔ بستنی را می‌پزیم و کامل سرد می‌کنیم، بعد گلاب را اضافه می‌کنیم. گرما بوی گلاب را می‌برد، و آن بو تمام این کاسه است.",
    body: [
      "بستنی سرد است و سردی هر بویی را کم می‌کند، پس گلاب باید بیشتر از آن‌چه در قاشق گرم درست به نظر می‌رسد باشد. اندازه‌اش را در حالت سرد می‌چشیم، نه وقتی پایه هنوز ولرم است؛ آن‌جا هر مقداری زیاد حس می‌شود.",
      "غلظت از چربی می‌آید و از هوا. مخلوط را آرام هم می‌زنیم تا هوای کم بگیرد و بافتش سنگین بماند؛ بستنی پرهوا در دهان زود تمام می‌شود. پستهٔ خردشده روی سطح می‌آید، خام و بی‌نمک، فقط برای این‌که چیزی زیر دندان باشد.",
    ],
    details: [
      { label: "پایه", value: "شیر و گلاب" },
      { label: "روش پخت", value: "پایهٔ پخته، سرد شده" },
      { label: "همراه", value: "پستهٔ خردشده" },
      { label: "فصل", value: "بهار و تابستان" },
    ],
    tone: "deep",
    image: {
      src: "/media/dish-08.jpg",
      alt: "کاسهٔ بستنی گلاب از بالا، پستهٔ خردشده روی سطح",
      ratio: "1/1",
    },
    status: "published",
  },
  {
    id: "d-konjed",
    slug: "halva-konjed",
    name: "حلوای کنجد",
    latin: "KONJED",
    category: "دسر",
    description: "کنجد بو داده، شیرهٔ خرما، و حرارتی که آرام‌آرام سفتش می‌کند.",
    statement:
      "کنجد را تا بوی روغنش بلند شود بو می‌دهیم، بعد آسیاب می‌کنیم. شیرهٔ خرما جای شکر را می‌گیرد و رنگ حلوا از همان می‌آید.",
    body: [
      "بو دادن کنجد مرز باریکی دارد: یک دقیقه کمتر و طعمی ندارد، یک دقیقه بیشتر و تلخ می‌شود. تابه را تکان می‌دهیم و به رنگ نگاه نمی‌کنیم، به بو؛ رنگ دیرتر از بو خبر می‌دهد و تا دیده شود کار گذشته است.",
      "شیرهٔ خرما شیرینی کمتری از شکر دارد و آب بیشتری، پس حلوا دیرتر می‌بندد. روی حرارت کم می‌ماند و مدام هم زده می‌شود تا وقتی از ته قابلمه جدا شود. همان‌جا برمی‌داریم — چند دقیقهٔ بیشتر، حلوا خشک و شکننده می‌شود.",
    ],
    details: [
      { label: "پایه", value: "کنجد و خرما" },
      { label: "روش پخت", value: "بو دادن و هم زدن روی حرارت کم" },
      { label: "همراه", value: "چای بی‌شکر" },
      { label: "فصل", value: "همهٔ سال" },
    ],
    tone: "deep",
    image: {
      src: "/media/dish-09.jpg",
      alt: "برش حلوای کنجد از بالا، سطحی مات و تیره",
      ratio: "1/1",
    },
    status: "published",
  },
];

/**
 * What the menu renders: drafts filtered out, exactly as a CMS would, then
 * resolved so every dish has a scrim weight.
 *
 * Filter before resolve, never after — and see `resolveProducts.ts` for why
 * that ordering still matters even though the fallback is no longer positional.
 */
export const publishedProducts = resolveProducts(
  products.filter((p) => p.status === "published"),
);

/** The dish that owns a slug, or undefined. One lookup, spelled once. */
export function dishBySlug(slug: string) {
  return publishedProducts.find((dish) => dish.slug === slug);
}

/**
 * Where a course group begins, as an index into the rendered list.
 *
 * Derived rather than authored, and that is the whole point: the menu shows a
 * group mark wherever the course changes from the dish before it, so the two
 * marks on a nine-dish menu land between bands three and four and between six
 * and seven without anyone counting. Add a fourth course and a third mark
 * appears; reorder the list and the marks follow.
 *
 * The first dish never gets one — the page's own masthead already says what
 * this is, and a group mark directly under it would read as a subtitle.
 */
export function groupBoundaries(list: readonly Dish[]): Map<number, string> {
  const marks = new Map<number, string>();
  list.forEach((dish, index) => {
    if (index === 0) return;
    if (dish.category !== list[index - 1].category) marks.set(index, dish.category);
  });
  return marks;
}
