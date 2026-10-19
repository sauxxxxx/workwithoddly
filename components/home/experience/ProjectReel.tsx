"use client";

import { useEffect, useRef } from "react";

/** Show the actual website interaction, with native playback controls and an honest still fallback. */
export function ProjectReel() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let started = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.5) video.pause();
        else if (
          !started &&
          !reduced.matches &&
          window.matchMedia("(pointer: fine)").matches
        ) {
          started = true;
          void video.play().catch(() => {});
        }
      },
      { threshold: [0, 0.5] },
    );
    const pause = () => {
      if (reduced.matches || document.hidden) video.pause();
    };
    observer.observe(video);
    reduced.addEventListener("change", pause);
    document.addEventListener("visibilitychange", pause);
    return () => {
      observer.disconnect();
      reduced.removeEventListener("change", pause);
      document.removeEventListener("visibilitychange", pause);
      video.pause();
    };
  }, []);
  return (
    <video
      ref={ref}
      src="/work/the-beach-park-hadsan/interface-detail.mp4"
      poster="/work/the-beach-park-hadsan/detail.webp"
      controls
      muted
      playsInline
      preload="none"
      aria-label="Recording of The Beach Park website interface and accommodation section"
    />
  );
}
