"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { WORDMARK } from "@/components/Wordmark";
import s from "./intro.module.css";

/**
 * "The odd letter" — the entrance reveal (first visit per session, home only).
 *
 * ODDLY appears as a plain word; the second D turns on its axis and becomes
 * the open, reversed bowl; the coral dot drops in; then the wordmark flies
 * into the nav logo while the page opens in a circle from the dot.
 *
 * The decision to play is made before first paint by the inline script in
 * app/layout.tsx (it sets html[data-intro="play"] and locks scroll). Without
 * it, this overlay is hidden by CSS and this component does nothing.
 */

/* Each glyph's slice of the wordmark's 502×100 viewBox: [x, width]. */
const SLOTS = {
  O: [0, 105],
  D: [105, 105],
  third: [210, 92],
  L: [302, 74],
  Y: [376, 98],
  dot: [474, 28],
} as const;

/* Mounted reveals. React may unmount and remount an effect (Strict Mode); the
   page is only released when no reveal remains mounted. */
let mounted = 0;

function Glyph({ slot, children, className }: { slot: keyof typeof SLOTS; children: React.ReactNode; className?: string }) {
  const [x, w] = SLOTS[slot];
  return (
    <svg
      className={className}
      viewBox={`${x} 0 ${w} 100`}
      style={{ width: `calc(var(--mark-h) * ${w / 100})` }}
      overflow="visible"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function LogoReveal() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    if (!el || html.dataset.intro !== "play") return;
    mounted++;
    html.style.overflow = "hidden";

    const q = (sel: string) => el.querySelector<HTMLElement>(sel) as HTMLElement;
    const row = q("[data-row]");
    const letters = el.querySelectorAll<HTMLElement>("[data-rise]");
    const plain = q("[data-plain]");
    const bowl = q("[data-bowl]");
    const dot = q("[data-dot]");
    const label = q("[data-label]");
    const bg = q("[data-bg]");

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      try {
        sessionStorage.setItem("oddly-intro", "seen");
      } catch {}
      html.dataset.intro = "done";
      html.style.overflow = "";
      setGone(true);
    };

    // Where the wordmark lands: the nav logo's wordmark.
    const target = () => {
      const nav = document.querySelector<SVGElement>("[data-nav-logo] svg[aria-label='ODDLY']");
      const from = row.getBoundingClientRect();
      if (!nav) return { x: 0, y: -from.top - from.height, scale: 0.2 };
      const to = nav.getBoundingClientRect();
      return { x: to.left - from.left, y: to.top - from.top, scale: to.width / from.width };
    };

    // The CSS resting state (the first frame) is expressed as transforms; GSAP
    // would read it as a pixel offset, so each tween resets y to 0 and owns yPercent.
    el.dataset.started = "true";
    const tl = gsap.timeline({ onComplete: finish, defaults: { ease: "power3.out" } });
    tl.set(el, { autoAlpha: 1 })
      .fromTo(letters, { y: 0, yPercent: 115 }, { yPercent: 0, duration: 0.6, stagger: 0.06 }, 0.05)
      // The flip: the plain D turns away, the odd bowl turns in.
      .to(plain, { rotateY: 90, duration: 0.26, ease: "power2.in" }, 0.68)
      .fromTo(bowl, { rotateY: -90 }, { rotateY: 0, duration: 0.42, ease: "back.out(2)" }, 0.94)
      .fromTo(label, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, 0.95)
      // The coral dot drops in.
      .fromTo(dot, { y: 0, yPercent: -900, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.55, ease: "bounce.out" }, 1.12)
      // Hand-off: into the nav logo, and the page opens from the dot.
      .add(() => {
        const r = dot.getBoundingClientRect();
        bg.style.setProperty("--cx", `${r.left + r.width / 2}px`);
        bg.style.setProperty("--cy", `${r.top + r.height / 2}px`);
      }, 1.72)
      .to(label, { opacity: 0, duration: 0.2, ease: "none" }, 1.72)
      .to(bg, { "--r": `${Math.hypot(window.innerWidth, window.innerHeight)}px`, duration: 0.75, ease: "power2.in" }, 1.75)
      .to(row, { ...target(), duration: 0.7, ease: "power3.inOut" }, 1.75)
      .add(() => {
        html.dataset.intro = "landing"; // the nav logo can come in under the flying mark
      }, 2.3);

    // Any input skips ahead.
    const skip = () => tl.timeScale(5);
    const opts = { passive: true } as const;
    window.addEventListener("pointerdown", skip, opts);
    window.addEventListener("keydown", skip);
    window.addEventListener("wheel", skip, opts);
    window.addEventListener("touchstart", skip, opts);

    return () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
      tl.revert();
      delete el.dataset.started;
      mounted--;
      // Released only if nothing remounted (a real unmount mid-reveal).
      window.setTimeout(() => {
        if (mounted === 0 && html.dataset.intro !== "done") {
          html.dataset.intro = "done";
          html.style.overflow = "";
        }
      }, 60);
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} className={s.intro} aria-hidden="true">
      <div className={s.bg} data-bg />
      <div className={s.center}>
        <div className={s.row} data-row>
          <span className={s.mask}>
            <span className={s.slot} data-rise>
              <Glyph slot="O">
                <path d={WORDMARK.O} fillRule="evenodd" />
              </Glyph>
            </span>
          </span>
          <span className={s.mask}>
            <span className={s.slot} data-rise>
              <Glyph slot="D">
                <path d={WORDMARK.D} fillRule="evenodd" />
              </Glyph>
            </span>
          </span>
          <span className={s.mask}>
            <span className={`${s.slot} ${s.flip}`} data-rise>
              {/* Holds the slot's width; the two faces turn over it. */}
              <Glyph slot="third" className={s.spacer}>
                <path d={WORDMARK.bowl} fillRule="evenodd" />
              </Glyph>
              <span className={s.faces}>
                <span className={s.face} data-plain>
                  <Glyph slot="third">
                    <path d={WORDMARK.plainD} fillRule="evenodd" />
                  </Glyph>
                </span>
                <span className={`${s.face} ${s.bowl}`} data-bowl>
                  <Glyph slot="third">
                    <path d={WORDMARK.bowl} fillRule="evenodd" />
                  </Glyph>
                </span>
              </span>
            </span>
          </span>
          <span className={s.mask}>
            <span className={s.slot} data-rise>
              <Glyph slot="L">
                <path d={WORDMARK.L} />
              </Glyph>
            </span>
          </span>
          <span className={s.mask}>
            <span className={s.slot} data-rise>
              <Glyph slot="Y">
                <path d={WORDMARK.Y} />
              </Glyph>
            </span>
          </span>
          <span className={s.dotSlot} data-dot>
            <Glyph slot="dot">
              <circle {...WORDMARK.dot} fill="#FF7A59" />
            </Glyph>
          </span>
        </div>
        <p className={s.label} data-label>
          Different by design
        </p>
      </div>
    </div>
  );
}
