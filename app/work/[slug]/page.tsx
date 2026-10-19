import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Plate, SWATCH } from "@/components/Plate";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@/components/Icons";
import { disciplineById } from "@/content/services";
import { nextProject, projectBySlug, projects, type Media, type Project } from "@/content/projects";
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

/* Layouts that paint the title panel in the project colour show the placeholder on cream. */
const COLOURED = new Set(["split", "tide", "sheet"]);

function plate(p: Project, m: Media, seed: number, priority = false, onPanel = false) {
  const swap = onPanel && COLOURED.has(p.art.layout) && p.art.ground !== "cream";
  return (
    <Plate
      media={m}
      label={p.name}
      ground={swap ? "cream" : p.art.ground}
      ink={swap ? "charcoal" : p.art.ink}
      accent={swap && p.art.accent === "cream" ? "coral" : p.art.accent}
      seed={seed}
      priority={priority}
    />
  );
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();

  const lead = disciplineById(p.disciplines[0]);
  const next = nextProject(p.slug);
  const coloured = COLOURED.has(p.art.layout) && p.art.ground !== "cream";
  const narrative = [
    { title: "Context", body: p.context },
    { title: "The opportunity", body: p.problem },
    { title: "What we delivered", body: p.solution },
    { title: "Results", body: p.results },
  ].filter((x): x is { title: string; body: string } => !!x.body);

  const theme = {
    ["--case-ground" as string]: SWATCH[p.art.ground],
    ["--case-ink" as string]: SWATCH[p.art.ink],
    ["--case-accent" as string]: SWATCH[p.art.accent],
  };

  return (
    <article className={s.case} data-layout={p.art.layout} style={theme}>
      {/* ── Title composition, varied per project ── */}
      <header className={`${s.hero} ${coloured ? s.heroColoured : ""}`} data-scene={`case-${p.art.object ?? lead.object}`}>
        <Link href="/#work" className={`${s.back} front`}>
          <ArrowLeft /> All work
        </Link>

        <div className={`${s.titleBlock} front`}>
          <h1 className={`${s.title} display`}>{p.name}</h1>
          <p className={s.category}>{p.category}</p>
        </div>

        <div className={s.cover}>{plate(p, p.media.cover, p.slug.length * 3, true, true)}</div>
      </header>

      <div data-scene="away">
        {/* ── Facts ── */}
        <section className={s.facts} aria-label="Project facts">
          <p className={s.overview}>{p.overview}</p>
          <dl className={s.factList}>
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
                    <Link href={`/#${d}`}>{cap(d)}</Link>
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt>Our role</dt>
              <dd>
                <ul>
                  {p.role.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt>Deliverables</dt>
              <dd>
                <ul>
                  {p.deliverables.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </dd>
            </div>
            {p.year && (
              <div>
                <dt>Year</dt>
                <dd>{p.year}</dd>
              </div>
            )}
            {p.url && (
              <div>
                <dt>Live</dt>
                <dd>
                  <a href={p.url} target="_blank" rel="noopener">
                    Visit site <ArrowUpRight />
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </section>

        {/* ── Narrative: only what has been written ── */}
        {narrative.length > 0 ? (
          <section className={s.narrative}>
            {narrative.map((n) => (
              <div key={n.title} className={s.chapter}>
                <h2>{n.title}</h2>
                <p>{n.body}</p>
              </div>
            ))}
          </section>
        ) : (
          <section className={s.pending}>
            <p>
              The full write-up of this project is in preparation. If you&rsquo;d like to hear how it was made,{" "}
              <a className="ink-link" href={hasContactEmail ? `${contactHref}?subject=${encodeURIComponent(p.name)}` : contactHref}>
                ask us directly
              </a>
              .
            </p>
          </section>
        )}

        {/* ── Media ── */}
        <section className={s.gallery} aria-label="Project media">
          {p.media.gallery.map((m, i) => (
            <div key={i} className={s.frame} style={{ ["--n" as string]: i }}>
              {plate(p, m, i * 7 + p.name.length)}
              <p className={s.frameCap}>{m.alt}</p>
            </div>
          ))}
        </section>

        {/* ── Onward ── */}
        <nav className={s.onward} aria-label="More">
          <Link href={`/work/${next.slug}/`} className={s.next}>
            <span className={s.nextLabel}>Next project</span>
            <span className={`${s.nextName} display`}>{next.name}</span>
            <span className={s.nextCat}>
              {next.category} <ArrowRight />
            </span>
          </Link>
          <div className={s.contact}>
            <p>Have a project like this?</p>
            <a className={s.mail} href={contactHref}>
              {hasContactEmail ? site.contact.email : "Start a project"}
              <ArrowUpRight />
            </a>
          </div>
        </nav>
      </div>
    </article>
  );
}
