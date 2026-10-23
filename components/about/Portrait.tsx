import type { CSSProperties } from "react";
import type { TeamMember } from "@/content/team";
import s from "./portrait.module.css";

const GROUNDS = ["lavender", "sage", "cream", "coral"] as const;

/** The brand ground behind person `i`, the same on the About grid and their page. */
export const groundFor = (i: number) => GROUNDS[i % GROUNDS.length];

/** First and last initial: "Reynan Montejo" → "RM". */
const initials = (name: string) => {
  const words = name.split(" ").filter(Boolean);
  return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
};

/**
 * A person's portrait in a tall 4:5 frame. Until a photo exists the frame
 * holds their initials, large and tone on tone in one of the brand grounds.
 * On the grid the photo is grey until hovered; on a profile page it is in colour.
 */
export function Portrait({
  person,
  index,
  colour = false,
  tilt = false,
  eager = false,
  className,
}: {
  person: TeamMember;
  index: number;
  colour?: boolean;
  tilt?: boolean;
  eager?: boolean;
  className?: string;
}) {
  const ground = { ["--ground" as string]: `var(--${groundFor(index)})` } as CSSProperties;
  return (
    <figure
      className={className ? `${s.portrait} ${className}` : s.portrait}
      style={ground}
      data-colour={colour || undefined}
      data-speed-tilt={tilt || undefined}
    >
      {person.portrait ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={person.portrait} alt={person.name} loading={eager ? "eager" : "lazy"} decoding="async" />
      ) : (
        <>
          <span className={`${s.initials} display`} aria-hidden="true">
            {initials(person.name)}
          </span>
          <span className={s.soon}>Photo soon</span>
        </>
      )}
    </figure>
  );
}
