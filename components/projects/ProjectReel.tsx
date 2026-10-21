"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Media } from "@/content/projects";
import s from "./project-reel.module.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * The project's main picture, in a rounded card that opens to the full width
 * of the page as it scrolls up to the top (the Lusion reel), and leans with
 * the scroll on the way. A video loops quietly; its poster stands in under
 * reduced motion.
 */
export function ProjectReel({ media, ground, whole = false }: { media: Media; ground: string; whole?: boolean }) {
  const card = useRef<HTMLDivElement>(null);

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

  const [w, h] = media.ratio.split("/").map(Number);
  const phone = h > w;
  return (
    <div className={s.reel} data-speed-tilt>
      <div ref={card} className={s.card} data-shape={phone ? "phone" : whole ? "whole" : "wide"} style={{ ["--ground" as string]: ground }}>
        {media.kind === "video" ? (
          <video src={media.src ?? undefined} poster={media.poster} autoPlay muted loop playsInline aria-label={media.alt} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={media.src ?? undefined} alt={media.alt} decoding="async" />
        )}
      </div>
    </div>
  );
}
