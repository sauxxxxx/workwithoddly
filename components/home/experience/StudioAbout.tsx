import Link from "next/link";
import { SculptureStill } from "./SculptureStill";
import { LocalTime } from "../LocalTime";
import { site } from "@/content/site";
import { team } from "@/content/team";
import s from "./studio-ending.module.css";

export function StudioAbout() {
  return (
    <section
      id="about"
      className={s.about}
      data-scene="about"
      data-scene-hold="0.8"
      aria-labelledby="about-title"
    >
      <p className={`${s.kicker} front`}>The studio / Cebu, Philippines</p>
      <h2
        id="about-title"
        className={`${s.aboutTitle} display front`}
        data-reveal-heading
      >
        One studio.
        <br />A shared
        <br />
        direction
        <span className="dot" aria-hidden="true" />
      </h2>
      <p className={`${s.aboutCopy} front`}>
        Based in Cebu. Working across the things your customers see and the
        systems your team depends on.
      </p>
      <div className={s.forms}>
        <SculptureStill form="knot" className={s.aboutKnot} />
        <SculptureStill form="twist" className={s.aboutTwist} />
        <SculptureStill form="loop" className={s.aboutLoop} />
      </div>
      {team.length > 0 && (
        <ul className={`${s.team} front`}>
          {team.map((person) => (
            <li key={person.name}>
              <strong>{person.name}</strong>
              <span>{person.role}</span>
            </li>
          ))}
        </ul>
      )}
      <div className={`${s.aboutFooter} front`}>
        <p>
          <Link href="#technology">Technology</Link> /{" "}
          <Link href="#automation">Automation</Link> /{" "}
          <Link href="#creative">Creative</Link>
        </p>
        <p>
          Cebu, PH &nbsp; <LocalTime timeZone={site.location.timeZone} />
        </p>
      </div>
    </section>
  );
}
