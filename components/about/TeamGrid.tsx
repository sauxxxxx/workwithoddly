import Link from "next/link";
import { ScrambleText } from "@/components/motion/ScrambleText";
import { skillLine, type TeamMember } from "@/content/team";
import { Portrait } from "./Portrait";
import s from "./team-grid.module.css";

const COLUMNS = 4;

/**
 * The team, as portraits: a tall frame, a hairline, the name, the first few
 * skills. Each card opens the person's profile page. An unfinished last row
 * is centred.
 */
export function TeamGrid({ people }: { people: TeamMember[] }) {
  const rest = people.length % COLUMNS;
  const lastRow = rest ? people.length - rest : -1;

  return (
    <section id="team" className={s.team} aria-labelledby="team-title">
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
          return (
            <li key={person.slug} className={s.person} style={start}>
              <Link href={`/team/${person.slug}/`} className={s.card} aria-label={`${person.name}, profile`}>
                <Portrait person={person} index={i} tilt className={s.portrait} />
                <h3 className={s.name}>
                  <ScrambleText text={person.name} />
                  <span className={s.go} aria-hidden="true">
                    →
                  </span>
                </h3>
                {person.skills.length > 0 && <p className={s.role}>{skillLine(person)}</p>}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
