import type { GalleryItem } from "@/types/content";

/**
 * THE SPACE — six photographs of the room, shown full-bleed and stacked.
 *
 * PLACEHOLDER CONTENT. Every image here is a generated stand-in at exactly the
 * path and ratio the real photograph will use, so replacing them is a file swap
 * and nothing else.
 *
 * `category` is the axis a future filter would use, so the values stay a small
 * controlled vocabulary rather than free text. Nothing here names a real place,
 * and no caption asserts anything about the business.
 */
export const galleryItems: GalleryItem[] = [
  {
    id: "s-01",
    title: "پیشخان",
    category: "سالن",
    caption: "شیشه‌ها زیر چراغ",
    image: {
      src: "/media/space-01.jpg",
      alt: "پیشخان بار و شیشه‌هایی که نور را برمی‌گردانند",
      ratio: "3/2",
    },
    order: 1,
  },
  {
    id: "s-02",
    title: "پله",
    category: "سالن",
    image: {
      src: "/media/space-02.jpg",
      alt: "پله‌ای باریک با چراغی در پیچ آن",
      ratio: "3/2",
    },
    order: 2,
  },
  {
    id: "s-03",
    title: "گذرگاه",
    category: "آشپزخانه",
    caption: "چیدن بشقاب",
    image: {
      src: "/media/space-03.jpg",
      alt: "دست‌هایی که بشقاب می‌چینند، بدون آن‌که صورتی دیده شود",
      ratio: "3/2",
    },
    order: 3,
  },
  {
    id: "s-04",
    title: "آشپزخانهٔ باز",
    category: "آشپزخانه",
    caption: "وسط سرو",
    image: {
      src: "/media/space-04.jpg",
      alt: "آشپزخانهٔ باز در میان سرو، بخار و فلز گرم",
      ratio: "3/2",
    },
    order: 4,
  },
  {
    id: "s-05",
    title: "میز کنار پنجره",
    category: "سالن",
    image: {
      src: "/media/space-05.jpg",
      alt: "میز کنار پنجره در شب و خیابان تاریک بیرون",
      ratio: "3/2",
    },
    order: 5,
  },
  {
    id: "s-06",
    title: "میز چیده",
    category: "جزئیات",
    caption: "پیش از نشستن",
    image: {
      src: "/media/space-06.jpg",
      alt: "سفره، قاشق و چنگال و یک لیوان آب، از نزدیک",
      ratio: "3/2",
    },
    order: 6,
  },
];

export const sortedGallery = [...galleryItems].sort((a, b) => a.order - b.order);
