import type { Metadata } from "next";
import { pageMeta } from "@/components/seo/meta";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Plate } from "@/components/Plate";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@/components/Icons";
import { NextPage } from "@/components/nav/NextPage";
import { ProjectReel } from "@/components/projects/ProjectReel";
import { tagLine } from "@/components/projects/ProjectCard";
import { nextProject, projectBySlug, projects, type Media } from "@/content/projects";
import { contactHref } from "@/content/site";
import { JsonLd, absolute } from "@/components/seo/JsonLd";
import s from "./project.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return {};
  return pageMeta({ title: `${p.name}: ${p.headline ?? p.category}`, description: p.summary ?? p.overview, path: `/projects/${p.slug}/` });
}

const width = (m: Media) => Number(m.ratio.split("/")[0]);
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * A project page. The name, the facts, then the picture opening to the full
 * width; the story in three parts; what the work covers; the technology; the
 * rest of the pictures; and on to the next project. Sections without
 * supplied facts are left out, never filled in.
 */
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();

  const index = projects.indexOf(p) + 1;
  const next = nextProject(p.slug);
  const ground = `var(--${p.art.ground})`;

  // The reel is the cover, unless the cover is a small screenshot and a
  // sharper picture (a device mockup) exists; the rest form the gallery.
  const media = [p.media.cover, ...p.media.gallery].filter((m) => m.src);
  const sharper = media.find((m) => m.kind !== "video" && width(m) >= 1200 && width(m) > width(p.media.cover) * 1.5);
  const reel = p.media.cover.src && width(p.media.cover) < 1000 && sharper ? sharper : p.media.cover.src ? p.media.cover : null;
  const gallery = media.filter((m) => m !== reel);

  const story = [
    { title: "The challenge", body: p.problem },
    { title: "Our approach", body: p.solution },
    { title: "What it delivers", body: p.results },
  ].filter((x): x is { title: string; body: string } => !!x.body);

  const facts = [
    { label: "Role", value: p.roleSummary ?? p.role.join(" · ") },
    { label: "Platform", value: p.platform },
    { label: "Year", value: p.year },
    { label: "Built with", value: p.stack?.length ? p.stack.join(", ") : null },
  ].filter((f): f is { label: string; value: string } => !!f.value);

  const url = absolute(`/projects/${p.slug}/`);
  const structured = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        name: p.name,
        headline: p.headline ?? p.category,
        description: p.summary ?? p.overview,
        url,
        ...(reel?.kind !== "video" && reel?.src && { image: absolute(reel.src) }),
        ...(p.stack?.length && { keywords: p.stack.join(", ") }),
        ...(p.year && { dateCreated: p.year }),
        creator: { "@id": absolute("/#studio") },
        ...(p.url && { sameAs: p.url }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absolute("/") },
          { "@type": "ListItem", position: 2, name: "Projects", item: absolute("/projects/") },
          { "@type": "ListItem", position: 3, name: p.name, item: url },
        ],
      },
    ],
  };

  return (
    <article className={s.page} data-scene="away">
      <JsonLd data={structured} />
      {/* ── The name ── */}
      <header className={s.hero} aria-labelledby="project-title">
        <div className={s.top} data-enter>
          <Link href="/projects/" className={s.back}>
            <ArrowLeft /> All projects
          </Link>
          <p className={s.kicker}>
            <span>{pad(index)}</span> / {pad(projects.length)} · {p.headline ?? p.category}
          </p>
        </div>
        <h1 id="project-title" className={`${s.name} display`} data-enter="word">
          {p.name}
        </h1>
        <div className={s.lead}>
          <p className={s.summary} data-enter>
            {p.summary ?? p.overview}
          </p>
          <div className={s.actions} data-enter>
            {p.url && (
              <a className={s.pill} href={p.url} target="_blank" rel="noopener noreferrer">
                Visit live site <ArrowUpRight />
              </a>
            )}
            {p.repo && (
              <a className={`${s.pill} ${s.pillQuiet}`} href={p.repo} target="_blank" rel="noopener noreferrer">
                View source <ArrowUpRight />
              </a>
            )}
            {!p.url && !p.repo && (
              <a className={s.pill} href={contactHref}>
                Ask about this project <ArrowUpRight />
              </a>
            )}
          </div>
        </div>
        {facts.length > 0 && (
          <dl className={s.facts} data-enter>
            {facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </header>

      {/* ── The picture, opening to the page ── */}
      {reel && <ProjectReel media={reel} ground={ground} whole={reel !== p.media.cover} />}

      {/* ── The story ── */}
      {story.length > 0 && (
        <section className={s.story} aria-labelledby="story-title">
          <h2 id="story-title" className={s.label}>
            The story
          </h2>
          <ol className={s.parts}>
            {story.map((part, i) => (
              <li key={part.title}>
                <span className={s.num}>{pad(i + 1)}</span>
                <h3>{part.title}</h3>
                <p>{part.body}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ── In focus ── */}
      {p.highlights && p.highlights.length > 0 && (
        <section className={s.highlights} aria-label="In focus">
          {p.highlights.map((h) => (
            <div key={h.title}>
              <h3>{h.title}</h3>
              <p>{h.body}</p>
            </div>
          ))}
        </section>
      )}

      {/* ── What the work covers ── */}
      {p.capabilities && p.capabilities.length > 0 && (
        <section className={s.capabilities} aria-labelledby="capabilities-title">
          <h2 id="capabilities-title" className={s.heading}>
            What we built<span className="dot" aria-hidden="true" />
          </h2>
          <ol>
            {p.capabilities.map((c, i) => (
              <li key={c}>
                <span className={s.num}>{pad(i + 1)}</span>
                {c}
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ── Technology ── */}
      {p.technology && p.technology.length > 0 && (
        <section className={s.technology} aria-labelledby="technology-title">
          <h2 id="technology-title" className={s.label}>
            Technology
          </h2>
          <dl>
            {p.technology.map((t) => (
              <div key={t.label}>
                <dt>{t.label}</dt>
                <dd>{t.items}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* ── The rest of the pictures ── */}
      {gallery.length > 0 && (
        <section className={s.gallery} aria-label="More pictures" style={{ ["--ground" as string]: ground }}>
          {gallery.map((m) => {
            const [w, h] = m.ratio.split("/").map(Number);
            return (
              <div key={m.src} className={s.shot} data-shape={h > w ? "phone" : "wide"} data-speed-tilt>
                <Plate media={m} />
              </div>
            );
          })}
        </section>
      )}

      {/* ── Onward ── */}
      <nav className={s.onward} aria-label="More projects">
        <Link href={`/projects/${next.slug}/`} className={s.next} data-speed-tilt>
          <span className={s.nextLabel}>
            Next project · {tagLine(next)}
          </span>
          <span className={`${s.nextWord} display`}>{next.name}</span>
          <span className={s.nextGo}>
            View project <ArrowRight />
          </span>
        </Link>
      </nav>

      <NextPage href="/about/" label="About us" />
    </article>
  );
}
