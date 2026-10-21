import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import { disciplines } from "@/content/services";
import { projectBySlug } from "@/content/projects";
import { contactHref } from "@/content/site";
import { NextPage } from "@/components/nav/NextPage";
import s from "./services.module.css";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Technology, automation, and creative services from ODDLY®, a creative technology studio in Cebu, Philippines.",
};

/**
 * Services, in the stage grammar: one complete frame per discipline. The word
 * sits in the top third, the discipline's piece rests on the plinth, the
 * services are listed at the right, and one action sits at the bottom.
 */
export default function Services() {
  return (
    <>
      <header className={s.intro} data-scene="away">
        <p className={s.tag} data-enter>
          ODDLY® · Services
        </p>
        <h1 className={`${s.title} display`} data-enter="word">
          Three ways we work<span className="dot" aria-hidden="true" />
        </h1>
        <nav className={s.jump} aria-label="Disciplines" data-enter>
          {disciplines.map((d) => (
            <a key={d.id} href={`#${d.id}`}>
              {d.name}
            </a>
          ))}
        </nav>
      </header>

      {disciplines.map((d, i) => {
        const work = d.projects.map((slug) => projectBySlug(slug)).filter((p) => !!p);
        return (
          <section
            key={d.id}
            id={d.id}
            className={s.frame}
            data-scene={`svc-${d.id}`}
            data-scene-hold="0.5"
            aria-labelledby={`${d.id}-title`}
          >
            <div className={`${s.layer} ${s.layerBack}`}>
              <h2 id={`${d.id}-title`} className={`${s.word} display`} style={{ ["--chars" as string]: d.name.length }}>
                {d.name}
              </h2>
            </div>

            <div className={`${s.layer} ${s.layerFront}`}>
              <p className={s.index}>
                <span>{String(i + 1).padStart(2, "0")}</span> / {String(disciplines.length).padStart(2, "0")}
              </p>

              <p className={s.lede}>{d.lede}</p>

              <ul className={s.list} aria-label={`${d.name} services`}>
                {d.services.map((svc) => (
                  <li key={svc.name}>
                    <strong>{svc.name}</strong>
                    <span>{svc.description}</span>
                  </li>
                ))}
              </ul>

              <div className={s.bottom}>
                <p className={s.seen}>
                  In practice:{" "}
                  {work.map((p, j) => (
                    <span key={p.slug}>
                      {j > 0 && ", "}
                      <Link href={`/projects/${p.slug}/`}>{p.name}</Link>
                    </span>
                  ))}
                </p>
                <a className={s.pill} href={contactHref}>
                  Start a project <ArrowUpRight />
                </a>
              </div>
            </div>
          </section>
        );
      })}
      <NextPage href="/projects/" label="Projects" />
    </>
  );
}
