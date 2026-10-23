import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMeta } from "@/components/seo/meta";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@/components/Icons";
import { NextPage } from "@/components/nav/NextPage";
import { Portrait } from "@/components/about/Portrait";
import { JsonLd, absolute } from "@/components/seo/JsonLd";
import { adjacentMembers, memberBySlug, people } from "@/content/team";
import s from "./team.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return people.map((p) => ({ slug: p.slug }));
}

const describe = (name: string, skills: string[]) =>
  `${name} of ODDLY, a creative technology studio in Cebu, Philippines: ${skills.join(", ").toLowerCase()}.`;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = memberBySlug(slug);
  if (!m) return {};
  return pageMeta({ title: `${m.name}, ODDLY team`, description: describe(m.name, m.skills), path: `/team/${m.slug}/` });
}

const pad = (n: number) => String(n).padStart(2, "0");
/** The longest word in a name, in characters: phones size the heading so it fits whole. */
const longest = (name: string) => ({ ["--longest" as string]: Math.max(...name.split(/\s+/).map((w) => w.length)) });

/**
 * A team member's page: their name, what they do, their portrait, and the
 * links they have shared. Links appear only once supplied; nothing is
 * filled in on their behalf.
 */
export default async function MemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = memberBySlug(slug);
  if (!m) notFound();
  const index = people.indexOf(m);
  const { previous, next } = adjacentMembers(m.slug);
  const first = m.name.split(" ")[0];
  const links = [
    m.links.portfolio && { label: "Portfolio", href: m.links.portfolio },
    m.links.github && { label: "GitHub", href: m.links.github },
  ].filter((l): l is { label: string; href: string } => !!l);

  const url = absolute(`/team/${m.slug}/`);
  const structured = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${url}#person`,
        name: m.name,
        url,
        ...(m.portrait && { image: absolute(m.portrait) }),
        knowsAbout: m.skills,
        worksFor: { "@id": absolute("/#studio") },
        ...(links.length > 0 && { sameAs: links.map((l) => l.href) }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absolute("/") },
          { "@type": "ListItem", position: 2, name: "About", item: absolute("/about/") },
          { "@type": "ListItem", position: 3, name: m.name, item: url },
        ],
      },
    ],
  };

  return (
    <article className={s.page} data-scene="away">
      <JsonLd data={structured} />

      <header className={s.hero}>
        <div className={s.top} data-enter>
          <Link href="/about/#team" className={s.back}>
            <ArrowLeft /> The team
          </Link>
          <p className={s.kicker}>
            <span>{pad(index + 1)}</span> / {pad(people.length)} · ODDLY team
          </p>
        </div>
        <h1 className={`${s.name} display`} style={longest(m.name)} data-enter="word">
          {m.name}
          <span className="dot" aria-hidden="true" />
        </h1>
      </header>

      <section className={s.profile} aria-label={`About ${first}`}>
        <div className={s.about} data-enter>
          <h2 className={s.label}>What {first} does</h2>
          <ol className={s.skills}>
            {m.skills.map((skill, i) => (
              <li key={skill}>
                <span className={s.num}>{pad(i + 1)}</span>
                {skill}
              </li>
            ))}
          </ol>
          <div className={s.links}>
            {links.length > 0 ? (
              links.map((l) => (
                <a key={l.label} className={s.pill} href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label} <ArrowUpRight />
                </a>
              ))
            ) : (
              <p className={s.soon}>Links coming soon</p>
            )}
          </div>
        </div>
        <Portrait person={m} index={index} colour eager className={s.portrait} />
      </section>

      <nav className={s.others} aria-label="More of the team">
        <Link href={`/team/${previous.slug}/`} className={s.other}>
          <span className={s.otherLabel}>
            <ArrowLeft /> Previous
          </span>
          <span className={s.otherName}>{previous.name}</span>
        </Link>
        <Link href={`/team/${next.slug}/`} className={`${s.other} ${s.otherNext}`}>
          <span className={s.otherLabel}>
            Next <ArrowRight />
          </span>
          <span className={s.otherName}>{next.name}</span>
        </Link>
      </nav>

      <NextPage href="/contact/" label="Contact" title={"Let’s make\nit Oddly."} size="min(13vw, 22svh)" leading={0.88} centered />
    </article>
  );
}
