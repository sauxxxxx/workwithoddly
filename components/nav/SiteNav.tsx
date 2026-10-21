"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/Wordmark";
import { ArrowUpRight, MailIcon } from "@/components/Icons";
import { AppIcon } from "@/components/AppIcon";
import { SoundToggle } from "@/components/sound/SoundToggle";
import { contactHref, hasContactEmail, site } from "@/content/site";
import { disciplines } from "@/content/services";
import { projects } from "@/content/projects";
import styles from "./nav.module.css";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [tucked, setTucked] = useState(false);
  const [darkSurface, setDarkSurface] = useState(false);
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  /* Bar state: transparent at the top, a quiet paper strip once scrolled,
     tucked away while reading downward, back on any upward scroll. */
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setTucked(y > window.innerHeight * 0.8 && y > last + 2);
      if (y < last - 2) setTucked(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Observe the narrow band behind the fixed controls, including on route changes.
  useEffect(() => {
    let observer: IntersectionObserver;
    const observe = () => {
      observer?.disconnect();
      observer = new IntersectionObserver((entries) => {
        setDarkSurface(entries.some((entry) => entry.isIntersecting));
      }, { rootMargin: `-35px 0px -${Math.max(0, window.innerHeight - 36)}px 0px` });
      const surfaces = document.querySelectorAll('[data-nav-theme="dark"]');
      if (!surfaces.length) setDarkSurface(false);
      surfaces.forEach((surface) => observer.observe(surface));
    };
    observe();
    window.addEventListener("resize", observe, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", observe);
    };
  }, [pathname]);

  /* Close the menu on navigation. */
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  /* Menu: lock scroll, trap focus, close on Escape, restore focus on close. */
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const focusables = () =>
      Array.from(panel.current?.querySelectorAll<HTMLElement>("a[href], button") ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const toggleEl = toggle.current;
    return () => {
      document.documentElement.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      toggleEl?.focus();
    };
  }, [open]);

  return (
    <header
      className={styles.bar}
      data-scrolled={scrolled}
      data-tucked={tucked && !open}
      data-open={open}
      data-dark={darkSurface}
    >
      <Link href="/" className={styles.logo} aria-label="ODDLY — home" data-nav-logo>
        <AppIcon className={styles.icon} />
        <Wordmark className={styles.wordmark} />
      </Link>

      <div className={styles.actions}>
        <SoundToggle className={styles.round} />
        <a className={styles.round} href={contactHref} aria-label="Start a project">
          <MailIcon />
        </a>
        <button
          ref={toggle}
          type="button"
          className={styles.round}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span className={styles.bars} aria-hidden="true" />
        </button>
      </div>

      <div
        id="site-menu"
        data-scroll-native
        ref={panel}
        className={styles.menu}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!open}
      >
        <div className={styles.menuInner}>
          <ul className={styles.menuPrimary}>
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.menuSide}>
            <p className={styles.menuHead}>Services</p>
            <ul>
              {disciplines.map((d) => (
                <li key={d.id}>
                  <Link href={`/#${d.id}`} onClick={() => setOpen(false)}>
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
            <p className={styles.menuHead}>Projects</p>
            <ul>
              {/* The featured few (the home stage's); the rest are on the Projects page. */}
              {projects
                .filter((p) => p.art.word)
                .map((p) => (
                  <li key={p.slug}>
                    <Link href={`/projects/${p.slug}/`} onClick={() => setOpen(false)}>
                      {p.name}
                    </Link>
                  </li>
                ))}
              <li>
                <Link href="/projects/" onClick={() => setOpen(false)}>
                  All projects ({projects.length}) →
                </Link>
              </li>
            </ul>
          </div>

          <a className={styles.menuMail} href={contactHref} onClick={() => setOpen(false)}>
            {hasContactEmail ? site.contact.email : "Start a project"}
            <ArrowUpRight />
          </a>
        </div>
      </div>
    </header>
  );
}
