import type { Metadata } from "next";
import { pageMeta } from "@/components/seo/meta";
import Link from "next/link";
import { ContactBrief } from "@/components/home/experience/ContactBrief";
import { LocalTime } from "@/components/home/LocalTime";
import { NextPage } from "@/components/nav/NextPage";
import { Wordmark } from "@/components/Wordmark";
import { hasContactEmail, site } from "@/content/site";
import s from "./contact.module.css";

export const metadata: Metadata = pageMeta({
  title: "Contact",
  description: `Start a project with ${site.legalName}, a creative technology studio in ${site.location.city}, ${site.location.country}. Email ${site.contact.email}.`,
  path: "/contact/",
});

/** The invitation, how to reach us, and back to the start. */
export default function Contact() {
  const social = site.social.filter((x): x is { label: string; url: string } => !!x.url);
  return (
    <div className={s.page} data-scene="away">
      <header className={s.hero}>
        <p className={s.tag} data-enter>
          Contact · Have something in mind?
        </p>
        <h1 className={`${s.title} display`} data-enter="word">
          Let’s make
          <br />
          it Oddly<span className="dot" aria-hidden="true" />
        </h1>
        <div className={s.action} data-enter>
          <ContactBrief />
          <p>Tell us what you’re building, fixing, or launching.</p>
        </div>
      </header>

      <section className={s.details} aria-label="How to reach us">
        <div>
          <h2 className={s.label}>Write</h2>
          {hasContactEmail ? <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> : <p>Use the project brief above.</p>}
          {site.contact.phone && <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`}>{site.contact.phone}</a>}
        </div>
        <div>
          <h2 className={s.label}>Studio</h2>
          <p>
            {site.location.city}, {site.location.country}
          </p>
          <p>
            <LocalTime timeZone={site.location.timeZone} />
          </p>
        </div>
        <div>
          <h2 className={s.label}>Elsewhere</h2>
          {social.length > 0 ? (
            social.map((x) => (
              <a key={x.label} href={x.url} target="_blank" rel="noopener noreferrer">
                {x.label}
              </a>
            ))
          ) : (
            <p>
              <Link href="/projects/">Our projects</Link> · <Link href="/about/">About us</Link>
            </p>
          )}
        </div>
      </section>

      <footer className={s.footer}>
        <Link href="/" aria-label="ODDLY home">
          <Wordmark className={s.wordmark} />
        </Link>
        <p>© {new Date().getFullYear()} ODDLY®</p>
      </footer>

      <NextPage href="/" label="Back to the start" title={"Creative\nTechnology\nStudio."} />
    </div>
  );
}
