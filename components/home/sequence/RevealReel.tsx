"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The Beach Park reveal: the live site's own hero frame fills the screen; the
 * full screen recording of the site (which scrolls through long text
 * sections) plays only on request. It pauses offscreen, when the tab is
 * hidden, and when the reveal closes again.
 */
export function RevealReel({ controlClass }: { controlClass?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const pause = () => v.pause();
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio < 0.35) pause();
    }, { threshold: [0, 0.35] });
    const onVisibility = () => {
      if (document.hidden) pause();
    };
    const onReveal = (e: Event) => {
      if (!(e as CustomEvent<boolean>).detail) pause();
    };
    const sync = () => setPlaying(!v.paused);
    observer.observe(v);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("oddly:reveal", onReveal);
    v.addEventListener("play", sync);
    v.addEventListener("pause", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("oddly:reveal", onReveal);
      v.removeEventListener("play", sync);
      v.removeEventListener("pause", sync);
      v.pause();
    };
  }, []);

  return (
    <>
      <video
        ref={video}
        src="/work/the-beach-park-hadsan/interface-reel.mp4"
        poster="/work/the-beach-park-hadsan/reel-poster.webp"
        muted
        loop
        playsInline
        preload="none"
        aria-label="Screen recording of The Beach Park website: the aerial welcome, then the day planner and accommodation"
      />
      <button
        type="button"
        className={controlClass}
        aria-pressed={playing}
        onClick={() => {
          const v = video.current;
          if (!v) return;
          if (v.paused) void v.play().catch(() => {});
          else v.pause();
        }}
      >
        {playing ? "Pause" : "Watch the site"}
        <span className="sr-only"> recording</span>
      </button>
    </>
  );
}
