"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+/<>=?@";

/**
 * A title that resolves out of shuffled characters, left to right (the Lusion
 * label move). Inside a project-stage layer it replays each time that layer
 * becomes the active scene; anywhere else, each time it scrolls into view.
 * Screen readers get the plain text; the shuffle is decoration.
 */
export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;

    const play = () => {
      cancelAnimationFrame(raf);
      if (reduced.matches) return;
      const start = performance.now();
      const duration = 380 + text.length * 22;
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        // Characters lock in one by one; the rest keep shuffling.
        const locked = Math.floor(p * text.length);
        let out = text.slice(0, locked);
        for (let i = locked; i < text.length; i++) {
          out += text[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        el.textContent = out;
        if (p < 1) raf = requestAnimationFrame(tick);
        else el.textContent = text;
      };
      raf = requestAnimationFrame(tick);
    };

    const host = el.closest<HTMLElement>("[data-descent]");
    let stop: () => void;
    if (host) {
      let was = host.dataset.active === "true";
      const watch = new MutationObserver(() => {
        const now = host.dataset.active === "true";
        if (now && !was) play();
        was = now;
      });
      watch.observe(host, { attributes: true, attributeFilter: ["data-active"] });
      stop = () => watch.disconnect();
    } else {
      const watch = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) play();
        },
        { threshold: 0.6 },
      );
      watch.observe(el);
      stop = () => watch.disconnect();
    }
    return () => {
      stop();
      cancelAnimationFrame(raf);
      el.textContent = text;
    };
  }, [text]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
