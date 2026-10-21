"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The Beach Park reel card. The client's own aerial footage loops quietly
 * (muted; only in view, motion allowed, tab visible). The play pill between
 * the title words swaps in the full screen recording of the website, with
 * native controls; pressing it again returns to the footage.
 */
export function ReelCard({ classes }: { classes: Record<"media" | "title" | "word" | "pill" | "glyph" | "back", string> }) {
  const ambient = useRef<HTMLVideoElement>(null);
  const recording = useRef<HTMLVideoElement>(null);
  const [site, setSite] = useState(false);

  useEffect(() => {
    const a = ambient.current;
    const rec = recording.current;
    if (!a) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    const sync = () => {
      const r = recording.current;
      const showSite = !!r && !r.hidden;
      if (inView && !document.hidden && !reduced.matches && !showSite) void a.play().catch(() => {});
      else a.pause();
      if (r && (!inView || document.hidden)) r.pause();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.intersectionRatio > 0.2;
        sync();
      },
      { threshold: [0, 0.2] },
    );
    // Watch the card itself: the videos swap visibility, the card stays.
    observer.observe(a.parentElement ?? a);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
      a.pause();
      rec?.pause();
    };
  }, []);

  const toggle = () => {
    const a = ambient.current;
    const r = recording.current;
    if (!a || !r) return;
    if (site) {
      r.pause();
      setSite(false);
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) void a.play().catch(() => {});
    } else {
      a.pause();
      setSite(true);
      r.currentTime = 0;
      void r.play().catch(() => {});
    }
  };

  return (
    <>
      <video
        ref={ambient}
        className={classes.media}
        src="/work/the-beach-park-hadsan/cover.mp4"
        poster="/work/the-beach-park-hadsan/cover.webp"
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        hidden={site}
      />
      <video
        ref={recording}
        className={classes.media}
        src="/work/the-beach-park-hadsan/interface-reel.mp4"
        poster="/work/the-beach-park-hadsan/reel-poster.webp"
        muted
        playsInline
        controls
        preload="none"
        hidden={!site}
        aria-label="Screen recording of The Beach Park website: the aerial welcome, then the day planner and accommodation"
      />
      <p className={classes.title} data-reel-title hidden={site}>
        <span className={classes.word} data-reel-word="-1">
          The Beach
        </span>
        <button type="button" className={classes.pill} aria-pressed={site} onClick={toggle} data-reel-pill>
          <svg className={classes.glyph} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
          </svg>
          <span className="sr-only">Play the website recording</span>
        </button>
        <span className={classes.word} data-reel-word="1">
          Park
        </span>
      </p>
      {site && (
        <button type="button" className={classes.back} onClick={toggle}>
          <svg className={classes.glyph} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="sr-only">Back to the footage</span>
        </button>
      )}
    </>
  );
}
