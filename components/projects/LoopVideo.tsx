"use client";

import { useEffect, useRef } from "react";

/**
 * A silent loop that plays only while it is on screen and the tab is visible,
 * and never under reduced motion, where its poster stands still. Loads nothing
 * until it first comes near the screen.
 */
export function LoopVideo({ src, poster, label, className }: { src: string; poster?: string; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    const sync = () => {
      if (inView && !document.hidden && !reduced.matches) {
        if (!video.src) video.src = src;
        void video.play().catch(() => {});
      } else video.pause();
    };
    const watch = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { rootMargin: "10% 0px" },
    );
    watch.observe(video);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    return () => {
      watch.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
      video.pause();
    };
  }, [src]);

  return <video ref={ref} className={className} poster={poster} muted loop playsInline preload="none" aria-label={label} />;
}
