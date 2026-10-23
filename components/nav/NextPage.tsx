"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowDown } from "@/components/Icons";
import { leaveTo } from "@/components/motion/PageTransition";
import { smooth } from "@/components/motion/smooth";
import s from "./next-page.module.css";

/** How long the reader rests at the very bottom before the next page opens. */
const DWELL = 450;

/**
 * The page never ends (the Lusion pull-through): the last screen is the next
 * page's opening — its name, set like its hero — with a ring that fills as it
 * scrolls into view. Resting at the bottom with the ring full opens the next
 * page: the ring floods the screen with coral (PageTransition's iris).
 * Clicking the ring scrolls the rest of the way and does the same. Only once the
 * reader has scrolled into the band themselves, never on load, and never
 * under reduced motion, where the ring is a link.
 */
export function NextPage({
  href,
  label,
  title = label,
  size,
  leading,
  centered = false,
}: {
  href: string;
  label: string;
  /** The next page's heading; a newline breaks it, a final "." becomes the coral dot. */
  title?: string;
  /** That heading's font-size and line-height, so the swap lines up. */
  size?: string;
  leading?: number;
  /** Mirror a hero that centres its heading (Contact) rather than topping it. */
  centered?: boolean;
}) {
  const dot = title.endsWith(".");
  const words = dot ? title.slice(0, -1) : title;
  const band = useRef<HTMLElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const percent = useRef<HTMLSpanElement>(null);
  const button = useRef<HTMLAnchorElement>(null);
  const gone = useRef(false);

  // The iris grows out of the ring itself.
  const fromRing = () => {
    const r = button.current?.getBoundingClientRect();
    return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2, r: r.width / 2 } : undefined;
  };

  const leave = () => {
    if (gone.current) return;
    gone.current = true;
    leaveTo({ href, label, origin: fromRing() });
  };

  useEffect(() => {
    const el = band.current;
    const fill = ring.current;
    const count = percent.current;
    if (!el || !fill || !count) return;
    gone.current = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let armed = false;
    let fullSince = 0;
    let shown = -1;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / Math.min(rect.height, vh)));
      const step = Math.round(progress * 100);
      if (step !== shown) {
        shown = step;
        fill.style.strokeDashoffset = (1 - progress).toFixed(4);
        count.textContent = `${step}%`;
        el.dataset.full = step >= 100 ? "true" : "false";
      }
      // Armed only after the reader has been above the band's end.
      if (progress < 0.9) armed = true;
      if (!armed || gone.current || reduced.matches || progress < 0.995) {
        fullSince = 0;
        return;
      }
      fullSince ||= now;
      if (now - fullSince > DWELL) {
        gone.current = true;
        leaveTo({ href, label, origin: fromRing() });
      }
    };
    // Measure only while the band is in or near view, not on every frame of the page.
    const watch = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(raf);
        raf = 0;
        if (entry.isIntersecting) raf = requestAnimationFrame(frame);
      },
      { rootMargin: "25% 0px 25% 0px" },
    );
    watch.observe(el);
    return () => {
      watch.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [href, label]);

  // A plain click scrolls the rest of the way, then leaves; modified clicks stay native.
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const el = band.current;
    if (!el || gone.current) return;
    const rest = el.getBoundingClientRect().bottom - window.innerHeight;
    if (rest < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      leave();
      return;
    }
    const target = window.scrollY + rest;
    if (smooth.lenis) {
      smooth.lenis.scrollTo(target, { duration: 0.9, force: true, onComplete: leave });
    } else {
      window.scrollTo({ top: target, behavior: "smooth" });
      window.setTimeout(leave, 700);
    }
  };

  return (
    <section ref={band} className={s.band} data-scene="away" aria-label={`Next page: ${label}`}>
      <div className={centered ? `${s.top} ${s.centered}` : s.top}>
        <p className={s.kicker}>
          Next page<span className={s.sep}>·</span>
          {label}
        </p>
        <p
          className={`${s.title} display`}
          style={{ ["--title-size" as string]: size, ["--title-leading" as string]: leading }}
          aria-hidden="true"
        >
          {words}
          {dot && <span className="dot" />}
        </p>
        {centered && <span className={s.spacer} aria-hidden="true" />}
      </div>
      <div className={s.bottom}>
        <p className={s.cue}>
          <span className={s.bob} aria-hidden="true">
            <ArrowDown />
          </span>
          Keep scrolling
          <span ref={percent} className={s.percent} aria-hidden="true">
            0%
          </span>
        </p>
        <Link ref={button} href={href} className={s.ring} onClick={onClick} data-transition="own" aria-label={`Go to ${label}`}>
          <svg className={s.dial} viewBox="0 0 100 100" aria-hidden="true">
            <circle className={s.track} cx="50" cy="50" r="48" pathLength={1} />
            <circle ref={ring} className={s.fill} cx="50" cy="50" r="48" pathLength={1} />
          </svg>
          <span className={s.arrow} aria-hidden="true">
            <ArrowDown />
          </span>
        </Link>
      </div>
    </section>
  );
}
