import type { CSSProperties } from "react";
import { ScrambleText } from "@/components/motion/ScrambleText";
import type { TeamMember } from "@/content/team";
import s from "./team-grid.module.css";

const GROUNDS = ["lavender", "sage", "cream", "coral"] as const;
const COLUMNS = 4;

/** First and last initial: "Reynan Montejo" → "RM". */
const initials = (name: string) => {
  const words = name.split(" ").filter(Boolean);
  return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
};

/**
 * The team, as portraits: a tall frame, a hairline, the name, the role when
 * it is known. Until a photo exists the frame holds the person's initials,
 * large and tone on tone in one of the brand grounds. An unfinished last row
 * is centred.
 */
export function TeamGrid({ people }: { people: TeamMember[] }) {
  const rest = people.length % COLUMNS;
  const lastRow = rest ? people.length - rest : -1;

  return (
    <section className={s.team} aria-labelledby="team-title">
      <header className={s.head}>
        <h2 id="team-title" className={`${s.title} display`}>
          The team
          <sup className={s.count}>{people.length}</sup>
        </h2>
        <p className={s.lede}>The people behind ODDLY, in Cebu.</p>
      </header>

      <ul className={s.grid}>
        {people.map((person, i) => {
          // Each portrait spans two of eight tracks; the last row starts further in.
          const start = i === lastRow ? { ["--start" as string]: 1 + (COLUMNS - rest) } : undefined;
          const ground = { ["--ground" as string]: `var(--${GROUNDS[i % GROUNDS.length]})` } as CSSProperties;
          return (
            <li key={person.name} className={s.person} style={start}>
              <figure className={s.portrait} style={ground} data-speed-tilt>
                {person.portrait ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={person.portrait} alt={person.name} loading="lazy" decoding="async" />
                ) : (
                  <>
                    <span className={`${s.initials} display`} aria-hidden="true">
                      {initials(person.name)}
                    </span>
                    <span className={s.soon}>Photo soon</span>
                  </>
                )}
              </figure>
              <h3 className={s.name}>
                <ScrambleText text={person.name} />
              </h3>
              {person.role && <p className={s.role}>{person.role}</p>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
