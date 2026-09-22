import { home } from "@/content/sections";
import { Reveal } from "@/components/motion/Reveal";
import { Band } from "@/components/bands/Band";

/**
 * The second screen: the room itself.
 *
 * A heading and two sentences, nineteen words in total, set low over an interior
 * photograph. This is where an editorial site would put an image beside a
 * paragraph and a list of three values; there is no such row here and there is
 * not going to be one anywhere on this site.
 */
export function RoomBand() {
  return (
    <Band media={home.room.image} height={100} scrim="mid" aria-labelledby="room-heading">
      <Reveal>
        <h2 id="room-heading" className="t-h2">
          {home.room.heading}
        </h2>
      </Reveal>

      <Reveal delay={140}>
        <p className="t-lead max-w-[40ch]">{home.room.line}</p>
      </Reveal>
    </Band>
  );
}
