import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import { ServiceList } from "@/components/home/experience/ServiceList";
import { disciplines } from "@/content/services";
import { projectBySlug } from "@/content/projects";
import s from "./services.module.css";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Technology, automation, and creative services from ODDLY®, a creative technology studio in Cebu, Philippines.",
};

/* The one place the full service descriptions live; the home page keeps to a word per scene. */
export default function Services() {
  return (
    <>
      <header className={`${s.intro} front`} data-scene="away">
        <p className={s.tag}>ODDLY® / Services</p>
        <h1 className={`${s.title} display`}>
          Three ways
          <br />
          we work
          <span className="dot" aria-hidden="true" />
        </h1>
        <nav className={s.jump} aria-label="Disciplines">
          {disciplines.map((d) => (
            <a key={d.id} href={`#${d.id}`}>
              {d.name}
            </a>
          ))}
        </nav>
      </header>

      {disciplines.map((d, i) => (
        <section
          key={d.id}
          id={d.id}
          className={s.discipline}
          data-scene={`case-${d.object}`}
          data-side={i % 2 ? "left" : "right"}
          aria-labelledby={`${d.id}-title`}
        >
          <div className={`${s.head} front`}>
            <p className={s.tag}>
              <span>{String(i + 1).padStart(2, "0")}</span> {d.name}
            </p>
            <h2 id={`${d.id}-title`} className={`${s.word} display`}>
              {d.name}
            </h2>
            <p className={s.lede}>{d.lede}</p>
          </div>
          <div className={`${s.list} front`}>
            <ServiceList discipline={d} />
            <p className={s.seen}>
              In practice:{" "}
              {d.projects.map((slug, j) => {
                const p = projectBySlug(slug);
                if (!p) return null;
                return (
                  <span key={slug}>
                    {j > 0 && ", "}
                    <Link href={`/work/${slug}/`}>{p.name}</Link>
                  </span>
                );
              })}
            </p>
          </div>
        </section>
      ))}

      <section className={`${s.close} front`} data-scene="away">
        <Link className={s.pill} href="/#contact">
          Start a project <ArrowUpRight />
        </Link>
      </section>
    </>
  );
}
