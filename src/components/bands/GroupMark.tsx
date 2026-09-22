import { Reveal } from "@/components/motion/Reveal";

/**
 * A course boundary on the menu.
 *
 * Small plain type between two bands, with a hairline running out from it. It is
 * not a sticky bar, not a section header with its own ground, and not a filter —
 * a reader scrolling the menu passes it the way they pass a course, and it
 * leaves as soon as the next photograph arrives.
 *
 * Where these appear is derived, not authored: `groupBoundaries()` marks every
 * point where the course changes from the dish before it. On a menu of three
 * courses of three, that puts one between bands three and four and one between
 * six and seven. Nobody counted; reorder the menu and the marks follow.
 *
 * Not a heading element. A course is a boundary between siblings rather than a
 * parent of them — making it an `h2` would put the six dishes after it inside a
 * section they are not inside, and nesting each course's dishes under it would
 * mean wrapping three bands in a container the design does not have.
 */
export function GroupMark({ label }: { label: string }) {
  return (
    <div className="container">
      <Reveal className="group-mark">
        <span className="t-meta text-[var(--color-brass)]">{label}</span>
        <span className="group-mark__line" />
      </Reveal>
    </div>
  );
}
