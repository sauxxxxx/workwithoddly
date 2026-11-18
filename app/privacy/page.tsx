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
 * The privacy notice: what this site collects and why, in plain words, set
 * out along the lines the Data Privacy Act of 2012 (RA 10173) and its
 * implementing rules expect. It describes how the site actually works; the
 * form section follows `site.formEndpoint`. Revisit it whenever that changes.
 */
export default function Privacy() {
  const tel = site.contact.phone?.replace(/\s/g, "");
  const form = !!site.formEndpoint;
  const mail = <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>;
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
          {site.legalName} is a creative technology studio in {site.location.city}, {site.location.country}. This notice explains
          what personal information workwithoddly.com collects, why, who handles it, and what you can ask of us under the Data
          Privacy Act of 2012 (Republic Act No. 10173).
        </p>
      </header>

      <div className={s.body}>
        <section>
          <h2>Who we are</h2>
          <p>
            {site.legalName} is the personal information controller for the information described here. For anything about your
            personal information, including the requests below, contact us at {mail}
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
          {form ? (
            <p>
              When you send the project brief on this site, we receive your name, email address, what you are interested in and
              your description of the project, together with the page you sent it from. The brief is saved to a spreadsheet in our
              Google account and emailed to our inbox. If you email, message or call us instead, we receive what you choose to
              share.
            </p>
          ) : (
            <p>
              The project brief on this site does not send anything by itself. It prepares a message that you send from your own
              email, Gmail or phone. When you do, or when you email, message or call us, we receive what you choose to share: usually
              your name, email address, what you need and a description of your project.
            </p>
          )}
          <p>
            Please do not include sensitive personal information (such as health, financial or government ID details) in a brief.
          </p>
        </section>

        <section>
          <h2>Why we use it</h2>
          <p>
            We use what you send only to reply to you, to discuss and prepare a proposal for your project, and to carry out the work
            if we go ahead. We process it because you chose to send it to us for that purpose, and, once we work together, because it
            is needed for our agreement with you. We do not sell it, and we do not add you to mailing lists without asking.
          </p>
        </section>

        <section>
          <h2>What the site records</h2>
          <ul>
            <li>
              <strong>Visit statistics.</strong> Vercel Web Analytics counts page views, referring sites, countries and device types
              without cookies and without identifying you.
            </li>
            <li>
              <strong>Speed measurements.</strong> Vercel Speed Insights records how quickly pages load for visitors, so we can keep the
              site fast.
            </li>
            <li>
              <strong>Hosting logs.</strong> Like any web host, the services below process technical data such as IP addresses to
              deliver pages and protect the site from abuse.
            </li>
            <li>
              <strong>Your browser.</strong> We set no cookies of our own. The site keeps one note in your browser&rsquo;s session storage
              so the opening animation plays only once per visit; it is cleared when you close the tab.
            </li>
          </ul>
        </section>

        <section>
          <h2>Who else handles it</h2>
          <p>We use a few service providers, who process information on our behalf and only to provide their service:</p>
          <ul>
            <li>
              <strong>Vercel</strong> hosts the site and provides the visit statistics and speed measurements.
            </li>
            <li>
              <strong>Cloudflare</strong> delivers the site and protects it from attacks.
            </li>
            <li>
              <strong>Google</strong> provides our email{form && " and the spreadsheet where briefs are saved"}.
            </li>
          </ul>
          <p>
            These providers may store or process information outside the Philippines, including in the United States. We rely on
            their published security and data-protection commitments, and we share with them only what their service needs.
          </p>
        </section>

        <section>
          <h2>How we protect it</h2>
          <p>
            Access to briefs and enquiries is limited to the people on our team who need it to respond or to work on your project, and
            the accounts that hold them are protected by passwords and the providers&rsquo; own security. If a breach affecting your
            personal information occurs, we will notify the National Privacy Commission and you as the law requires.
          </p>
        </section>

        <section>
          <h2>How long we keep it</h2>
          <p>
            We keep enquiries for as long as we need them to respond to you and, if we work together, for the length of the project and
            the business records that follow from it. You can ask us to delete them at any time, unless the law requires us to keep
            them.
          </p>
        </section>

        <section>
          <h2>Your rights</h2>
          <p>Under the Data Privacy Act you have the right to:</p>
          <ul>
            <li>be informed about how your personal information is used, as this notice does;</li>
            <li>access the personal information we hold about you;</li>
            <li>have it corrected if it is wrong or incomplete;</li>
            <li>object to its processing, and to have it erased or blocked;</li>
            <li>receive a copy of it in a commonly used electronic format;</li>
            <li>be compensated for damages caused by inaccurate, unlawfully obtained or unauthorised use of it; and</li>
            <li>
              file a complaint with the{" "}
              <a href="https://privacy.gov.ph" target="_blank" rel="noopener noreferrer">
                National Privacy Commission
              </a>
              .
            </li>
          </ul>
          <p>To use any of these rights, email us at {mail}. We will respond as soon as we can.</p>
        </section>

        <section>
          <h2>Children</h2>
          <p>This site is meant for businesses and adults. We do not knowingly collect personal information from children.</p>
        </section>

        <section>
          <h2>Links to other sites</h2>
          <p>
            Our project pages and footer link to live websites, source code and social profiles. Those sites have their own privacy
            practices, which this notice does not cover.
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
