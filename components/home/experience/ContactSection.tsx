import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";
import { site } from "@/content/site";
import { SculptureStill } from "./SculptureStill";
import { ContactBrief } from "./ContactBrief";
import s from "./studio-ending.module.css";

export function ContactSection() {
  return (
    <section
      id="contact"
      className={s.contact}
      data-scene="closing"
      data-scene-hold="0.7"
      data-nav-theme="dark"
      aria-labelledby="contact-title"
    >
      <p className={`${s.kicker} front`}>Have something in mind?</p>
      <h2
        id="contact-title"
        className={`${s.contactTitle} display front`}
        data-reveal-heading
      >
        Let’s make
        <br />
        it Oddly
        <span className="dot" aria-hidden="true" />
      </h2>
      <SculptureStill form="loop" className={s.contactLoop} />
      <div className={`${s.contactAction} front`}>
        <ContactBrief />
        <p>
          Tell us what you’re building,
          <br />
          fixing, or launching.
        </p>
      </div>
      <footer className={`${s.footer} front`}>
        <Link href="/" aria-label="ODDLY home">
          <Wordmark className={s.wordmark} />
        </Link>
        <nav aria-label="Footer">
          <Link href="#work">Work</Link>
          <Link href="#services">Services</Link>
          <Link href="#about">About</Link>
        </nav>
        <p>
          © {new Date().getFullYear()} ODDLY®
          <br />
          {site.location.city}, {site.location.country}
        </p>
      </footer>
    </section>
  );
}
