import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Plate } from "@/components/Plate";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@/components/Icons";
import { nextProject, projectBySlug, projects } from "@/content/projects";
import { contactHref, hasContactEmail, site } from "@/content/site";
import s from "./case.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return {};
  return { title: p.name, description: p.overview };
}

const cap = (x: string) => x[0].toUpperCase() + x.slice(1);

/**
 * A case study in the stage grammar: one complete frame (word, the project's
 * object on the plinth, chip, action, name and description), then the facts,
 * the real media, any written narrative, and the next project.
 */
export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();

  const next = nextProject(p.slug);
  const word = p.art.word ?? p.name;
  const piece = p.art.sculpture ?? "loop";
  const media = [p.media.cover, ...p.media.gallery].filter((m) => m.src);
  const narrative = [
    { title: "Context", body: p.context },
    { title: "The opportunity", body: p.problem },
    { title: "What we delivered", body: p.solution },
    { title: "Results", body: p.results },
  ].filter((x): x is { title: string; body: string } => !!x.body);

  return (
    <article className={s.case}>
      {/* ── The frame ── */}
      <header className={s.hero} data-scene={`case-${piece}`} data-scene-hold="0.5" aria-labelledby="case-title">
        <div className={`${s.layer} ${s.layerBack}`}>
          <p className={`${s.word} display`} style={{ ["--chars" as string]: word.length }} aria-hidden="true">
            {word}
          </p>
        </div>

        <div className={`${s.layer} ${s.layerFront}`}>
          <Link href="/#work" className={s.back}>
            <ArrowLeft /> All work
          </Link>
          <div className={s.meta}>
            <p className={s.tags}>
              <span className={s.chip}>{cap(p.disciplines[0])}</span>
              <span>{p.category}</span>
            </p>
            {p.url ? (
              <a className={s.pill} href={p.url} target="_blank" rel="noopener noreferrer">
                Visit live site <ArrowUpRight />
              </a>
            ) : (
              <a className={s.pill} href={contactHref}>
                Ask about this project <ArrowUpRight />
              </a>
            )}
            <div className={s.about}>
              <h1 id="case-title" className={s.name}>
                {p.name}
              </h1>
              <p>{p.overview}</p>
            </div>
          </div>
        </div>
      </header>

      <div data-scene="away" className={s.body}>
        {/* ── Facts ── */}
        <dl className={s.facts} aria-label="Project facts">
          {p.client && (
            <div>
              <dt>Client</dt>
              <dd>{p.client}</dd>
            </div>
          )}
          <div>
            <dt>Disciplines</dt>
            <dd>
              {p.disciplines.map((d, i) => (
                <span key={d}>
                  {i > 0 && ", "}
                  <Link href={`/services/#${d}`}>{cap(d)}</Link>
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt>Our role</dt>
            <dd>{p.role.join(" · ")}</dd>
          </div>
          <div>
            <dt>Deliverables</dt>
            <dd>{p.deliverables.join(" · ")}</dd>
          </div>
          {p.year && (
            <div>
              <dt>Year</dt>
              <dd>{p.year}</dd>
            </div>
          )}
        </dl>

        {/* ── Real media only ── */}
        {media.length > 0 && (
          <section className={s.gallery} aria-label="Project media" data-count={media.length}>
            {media.map((m, i) => (
              <figure key={m.src} className={s.figure} data-shape={m.ratio === "390/844" ? "phone" : "wide"} data-index={i}>
                <Plate media={m} priority={i === 0} />
                <figcaption>{m.alt}</figcaption>
              </figure>
            ))}
          </section>
        )}

        {/* ── Narrative: only what has been written ── */}
        {narrative.length > 0 ? (
          <section className={s.narrative}>
            {narrative.map((n) => (
              <div key={n.title}>
                <h2>{n.title}</h2>
                <p>{n.body}</p>
              </div>
            ))}
          </section>
        ) : (
          <p className={s.pending}>
            The full write-up of this project is in preparation.{" "}
            <a href={hasContactEmail ? `${contactHref}?subject=${encodeURIComponent(p.name)}` : contactHref}>
              Ask us how it was made
            </a>
            .
          </p>
        )}

        {/* ── Onward ── */}
        <nav className={s.onward} aria-label="More">
          <Link href={`/work/${next.slug}/`} className={s.next}>
            <span className={s.nextLabel}>Next project · {next.name}</span>
            <span className={`${s.nextWord} display`}>{next.art.word ?? next.name}</span>
            <span className={s.nextGo}>
              View project <ArrowRight />
            </span>
          </Link>
          <p className={s.contact}>
            Have a project like this?{" "}
            <a href={contactHref}>{hasContactEmail ? site.contact.email : "Start a project"}</a>
          </p>
        </nav>
      </div>
    </article>
  );
}
