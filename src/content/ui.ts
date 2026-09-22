import type { UiStrings } from "@/types/content";

/**
 * Interface strings — accessible names, and the few words the UI says on its own
 * behalf rather than the restaurant's.
 *
 * Separate from `sections.ts` because the two are edited by different people for
 * different reasons: that file is the copy deck a restaurant rewrites, this one
 * is what the interface is called.
 *
 * Most of these are read only by a screen reader. That is not a reason to leave
 * them in the markup: §28 has no exception for text a sighted reader never sees,
 * and a hardcoded string is one no editor and no translator can reach.
 *
 * The failure mode this creates is specific and worth knowing: an accessible
 * name that resolves to `undefined` or `""` still renders a control that looks
 * completely normal and simply stops announcing itself. The smoke suite asserts
 * no visible control is missing one, with the lightbox open as well as at rest.
 */
export const ui: UiStrings = {
  skipToContent: "پرش به محتوای اصلی",

  nav: {
    primary: "پیمایش اصلی",
    footer: "پیمایش پانوشت",
    /** Follows the name: «شبانه — صفحهٔ اصلی». */
    home: "صفحهٔ اصلی",
    openMenu: "گشودن فهرست",
    closeMenu: "بستن فهرست",
    menuDialog: "فهرست اصلی",
  },

  gallery: {
    lightbox: "نمای بزرگ تصویر",
    close: "بستن نمای بزرگ",
    previous: "تصویر قبلی",
    next: "تصویر بعدی",
    /** Between position and total: «۳ از ۶». */
    counterJoin: "از",
  },
};
