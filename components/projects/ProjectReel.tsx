"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Media } from "@/content/projects";
import s from "./project-reel.module.css";

gsap.registerPlugin(ScrollTrigger);

/** Below this width a picture would blur at full width, so its frame stays narrower. */
const SHARP = 1000;

/**
 * The project's main picture, in a rounded card that opens to the full width
 * of the page as it scrolls up to the top (the Lusion reel), and leans with
 * the scroll on the way. A video plays silently while it is on screen, with a
 * button for its sound; under reduced motion it waits, with its controls, for
 * the reader to start it.
 */
export function ProjectReel({ media, ground, whole = false }: { media: Media; ground: string; whole?: boolean }) {
  const card = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [still, setStill] = useState(false);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    const el = card.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        el,
        { scale: 0.82, borderRadius: "2rem" },
        {
          scale: 1,
          borderRadius: "0.75rem",
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "top 12%", scrub: true },
        },
      );
    });
    return () => mm.revert();
  }, []);

  // The video plays only while on screen, the tab is visible and motion is allowed.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    setStill(reduced.matches);
    let inView = false;
    const sync = () => {
      if (inView && !document.hidden && !reduced.matches) void v.play().catch(() => {});
      else if (!reduced.matches) v.pause();
    };
    const watch = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    watch.observe(v);
    document.addEventListener("visibilitychange", sync);
    return () => {
      watch.disconnect();
      document.removeEventListener("visibilitychange", sync);
      v.pause();
    };
  }, []);

  const toggleSound = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setSound(!v.muted);
    if (!v.muted) void v.play().catch(() => {});
  };

  const [w, h] = media.ratio.split("/").map(Number);
  const phone = h > w;
  return (
    <div className={s.reel} data-speed-tilt data-small={!phone && w < SHARP ? "true" : undefined}>
      <div ref={card} className={s.card} data-shape={phone ? "phone" : whole ? "whole" : "wide"} style={{ ["--ground" as string]: ground }}>
        {media.kind === "video" ? (
          <>
            <video
              ref={video}
              src={media.src ?? undefined}
              poster={media.poster}
              muted
              loop
              playsInline
              controls={still}
              preload="metadata"
              aria-label={media.alt}
            />
            {!still && media.sound && (
              <button type="button" className={s.sound} onClick={toggleSound} aria-pressed={sound}>
                {sound ? "Sound off" : "Sound on"}
              </button>
            )}
          </>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={media.src ?? undefined} alt={media.alt} decoding="async" />
        )}
      </div>
    </div>
  );
}
