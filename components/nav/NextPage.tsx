"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight } from "@/components/Icons";
import { leaveTo } from "@/components/motion/PageTransition";
import s from "./next-page.module.css";

/** How long the reader rests at the very bottom before the next page opens. */
const DWELL = 450;

/**
 * The page never ends (the Lusion move): a dark band after the footer says
 * "keep scrolling", its bar fills as the band comes into view, and resting at
 * the bottom with the bar full opens the next page through the page
 * transition. Only once the reader has scrolled into the band themselves,
 * never on load, and never under reduced motion, where the band is a link.
 */
export function NextPage({ href, label }: { href: string; label: string }) {
  const band = useRef<HTMLElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = band.current;
    const fill = bar.current;
    if (!el || !fill) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let armed = false;
    let fullSince = 0;
    let gone = false;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / Math.min(rect.height, vh)));
      fill.style.transform = `scaleX(${progress.toFixed(4)})`;
      // Armed only after the reader has been above the band's end.
      if (progress < 0.9) armed = true;
      if (!armed || gone || reduced.matches || progress < 0.995) {
        fullSince = 0;
        return;
      }
      fullSince ||= now;
      if (now - fullSince > DWELL) {
        gone = true;
        leaveTo({ href, label });
      }
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [href, label]);

  // A plain click goes through the same transition; modified clicks stay native.
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    leaveTo({ href, label });
  };

  return (
    <section ref={band} className={s.band} data-scene="away" aria-label="Next page">
      <div className={s.inner}>
        <p className={s.kicker}>
          Keep scrolling
          <br />
          to see more
        </p>
        <p className={`${s.label} display`}>{label}</p>
        <Link href={href} className={s.go} onClick={onClick}>
          <span>Next page</span>
          <span className={s.track} aria-hidden="true">
            <span ref={bar} className={s.fill} />
          </span>
          <ArrowRight />
        </Link>
      </div>
    </section>
  );
}
