import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/components/seo/meta";
import { site } from "@/content/site";
import s from "./privacy.module.css";

export const metadata: Metadata = pageMeta({
  title: "Privacy policy",
  description: `How ${site.legalName} handles personal information sent through workwithoddly.com, under the Philippine Data Privacy Act of 2012.`,
  path: "/privacy/",
});

const UPDATED = "18 November 2026";

/**
 * The privacy policy: what this site collects and why, in plain words. It
 * describes how the site actually works (no cookies of its own, cookieless
 * analytics, enquiries that arrive by the visitor's own email); revisit it
 * whenever that changes, such as adding a form service.
 */
export default function Privacy() {
  const tel = site.contact.phone?.replace(/\s/g, "");
  return (
    <article className={s.page} data-scene="away">
      <header className={s.hero}>
        <p className={s.tag} data-enter>
          Privacy policy · Updated {UPDATED}
        </p>
        <h1 className={`${s.title} display`} data-enter="word">
          Your information<span className="dot" aria-hidden="true" />
        </h1>
        <p className={s.lede} data-enter>
          {site.legalName} is a creative technology studio in {site.location.city}, {site.location.country}. This page explains what
          workwithoddly.com collects, why, and what you can ask of us under the Data Privacy Act of 2012 (Republic Act No. 10173).
        </p>
      </header>

      <div className={s.body}>
        <section>
          <h2>Who we are</h2>
          <p>
            {site.legalName} is responsible for the personal information described here. You can reach us at{" "}
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
            {site.contact.phone && tel && (
              <>
                {" "}
                or <a href={`tel:${tel}`}>{site.contact.phone}</a>
              </>
            )}
            .
          </p>
        </section>

        <section>
          <h2>What you send us</h2>
          <p>
            The project brief on this site does not send anything by itself. It prepares a message that you send from your own email,
            Gmail or phone. When you do, we receive what you chose to write: usually your name, email address, what you need and a
            description of your project.
          </p>
          <p>
            We use it only to reply, to discuss and prepare your project, and to work with you if we go ahead. We do not sell it, and we
            do not add you to mailing lists without asking.
          </p>
        </section>

        <section>
          <h2>What the site records</h2>
          <ul>
            <li>
              <strong>Visit statistics.</strong> We use Vercel Web Analytics, which counts page views, referring sites, countries and
              device types without cookies and without identifying you.
            </li>
            <li>
              <strong>Speed measurements.</strong> Vercel Speed Insights records how quickly pages load for visitors, so we can keep the
              site fast.
            </li>
            <li>
              <strong>Hosting logs.</strong> The site is served by Vercel, with Cloudflare in front of it. Like any web host, they process
              technical data such as IP addresses to deliver pages and protect the site from abuse.
            </li>
            <li>
              <strong>Your browser.</strong> We set no cookies of our own. The site keeps one note in your browser&rsquo;s session storage
              so the opening animation plays only once per visit; it is cleared when you close the tab.
            </li>
          </ul>
        </section>

        <section>
          <h2>How long we keep it</h2>
          <p>
            We keep enquiry emails for as long as we need them to respond to you and, if we work together, for the length of the project
            and the records that follow from it. You can ask us to delete them at any time.
          </p>
        </section>

        <section>
          <h2>Your rights</h2>
          <p>
            Under the Data Privacy Act you can ask to know what personal information we hold about you, to have it corrected, to have it
            deleted or blocked, and to object to how it is used. Email us at{" "}
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> and we will respond as soon as we can. If you are not
            satisfied, you may file a complaint with the{" "}
            <a href="https://privacy.gov.ph" target="_blank" rel="noopener noreferrer">
              National Privacy Commission
            </a>
            .
          </p>
        </section>

        <section>
          <h2>Links to other sites</h2>
          <p>
            Our project pages link to live websites and source code we have built. Those sites have their own privacy practices, which
            this policy does not cover.
          </p>
        </section>

        <section>
          <h2>Changes</h2>
          <p>
            If we change how the site handles information, we will update this page and the date at the top. Questions are always
            welcome: <Link href="/contact/">get in touch</Link>.
          </p>
        </section>
      </div>
    </article>
  );
}
