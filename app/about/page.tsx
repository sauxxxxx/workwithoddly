import type { Metadata } from "next";
import { pageMeta } from "@/components/seo/meta";
import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import { TeamGrid } from "@/components/about/TeamGrid";
import { LocalTime } from "@/components/home/LocalTime";
import { NextPage } from "@/components/nav/NextPage";
import { disciplines } from "@/content/services";
import { site } from "@/content/site";
import { people } from "@/content/team";
import s from "./about.module.css";

export const metadata: Metadata = pageMeta({
  title: "About us",
  description: `Meet the team behind ${site.legalName}, a creative technology studio in ${site.location.city}, ${site.location.country}: one studio for technology, automation and creative work.`,
  path: "/about/",
});

const pad = (n: number) => String(n).padStart(2, "0");

/** The studio: who we are, what we do, the people, and where we are. */
export default function About() {
  return (
    <div className={s.page} data-scene="away">
      <header className={s.hero}>
        <p className={s.tag} data-enter>
          About us · {site.location.city}, {site.location.country}
        </p>
        <h1 className={`${s.title} display`} data-enter="word">
          One studio.
          <br />A shared direction<span className="dot" aria-hidden="true" />
        </h1>
        <p className={s.lede} data-enter>
          {site.description}
        </p>
      </header>

      <section className={s.what} aria-labelledby="what-title">
        <h2 id="what-title" className={s.label}>
          What we do
        </h2>
        <ol className={s.disciplines}>
          {disciplines.map((d, i) => (
            <li key={d.id}>
              <Link href={`/services/#${d.id}`}>
                <span className={s.num}>{pad(i + 1)}</span>
                <span className={`${s.discipline} display`}>{d.name}</span>
                <span className={s.disciplineLede}>{d.lede}</span>
                <ArrowUpRight />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {people.length > 0 && <TeamGrid people={people} />}

      <section className={s.place} aria-label="Where we are">
        <p className={`${s.city} display`}>{site.location.city}</p>
        <p>
          {site.location.country} · <LocalTime timeZone={site.location.timeZone} />
        </p>
      </section>

      <NextPage href="/contact/" label="Contact" title={"Let’s make\nit Oddly."} size="min(13vw, 22svh)" leading={0.88} centered />
    </div>
  );
}
