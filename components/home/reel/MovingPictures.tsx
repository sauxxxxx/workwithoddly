"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "@/components/Icons";
import { LoopVideo } from "@/components/projects/LoopVideo";
import { homeClips } from "@/content/projects/creative";
import { ClipPlayer } from "./ClipPlayer";
import s from "./moving-pictures.module.css";

gsap.registerPlugin(ScrollTrigger);

const shape = (ratio: string) => {
  const [w, h] = ratio.split("/").map(Number);
  return h > w ? "tall" : "wide";
};

/**
 * Moving pictures: the studio's video work as one row of clips that slides
 * in from the right as the page scrolls (the frame holds still while the row
 * travels, then the page carries on). Each clip loops its silent preview
 * while on screen; a click plays the full edit with sound over the page.
 *
 * On desktop with motion allowed the section is as tall as the row is wide.
 * On phones the row is swiped by hand, card by card; under reduced motion on
 * a desktop the clips simply wrap.
 */
export function MovingPictures() {
  const section = useRef<HTMLElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [playing, setPlaying] = useState<number | null>(null);

  useEffect(() => {
    const el = section.current;
    const row = track.current;
    const head = intro.current;
    if (!el || !row || !head) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      el.dataset.mode = "pinned";
      // How far the row travels: everything past the right edge of the screen.
      const travel = () => Math.max(0, row.scrollWidth - window.innerWidth);
      const size = () => el.style.setProperty("--travel", `${travel()}px`);
      size();
      ScrollTrigger.addEventListener("refreshInit", size);
      const scroll = { trigger: el, start: "top top", end: "bottom bottom", scrub: true, invalidateOnRefresh: true };
      gsap.to(row, { x: () => -travel(), ease: "none", scrollTrigger: scroll });
      // The headline drifts at a quarter of the speed and fades as the clips pass it.
      gsap.to(head, { x: () => -travel() * 0.25, opacity: 0.15, ease: "none", scrollTrigger: scroll });
      ScrollTrigger.refresh();
      return () => {
        ScrollTrigger.removeEventListener("refreshInit", size);
        delete el.dataset.mode;
        el.style.removeProperty("--travel");
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={section} id="video" className={s.section} data-scene="away" aria-labelledby="moving-title">
      <div className={s.frame}>
        <div ref={intro} className={s.intro}>
          <p className={s.kicker}>Creative · Video</p>
          <h2 id="moving-title" className={`${s.title} display`}>
            Moving
            <br />
            pictures<span className="dot" aria-hidden="true" />
          </h2>
          <p className={s.lede}>Planned, filmed and edited by the studio, for travel, food and social.</p>
          <p className={s.hint}>Choose a clip to watch it with sound</p>
        </div>

        <ul ref={track} className={s.track}>
          {homeClips.map(({ project, media }, i) => (
            <li key={media.src} className={s.item} data-shape={shape(media.ratio)}>
              <button type="button" className={s.clip} onClick={() => setPlaying(i)} aria-label={`Play with sound: ${media.alt} (${project.name})`}>
                <span className={s.picture} style={{ ["--ratio" as string]: media.ratio.replace("/", " / ") }} data-speed-tilt>
                  <LoopVideo src={media.preview ?? media.src ?? ""} poster={media.poster} label={media.alt} />
                  <span className={s.play} aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                    </svg>
                  </span>
                </span>
                <span className={s.name}>{project.name}</span>
                <span className={s.role}>{project.roleSummary ?? project.role.join(" · ")}</span>
              </button>
            </li>
          ))}
          <li className={`${s.item} ${s.endItem}`}>
            <Link href="/projects/marketing-content/" className={s.end}>
              <span className={s.endLabel}>All video work</span>
              <span className={`${s.endWord} display`}>See it all</span>
              <ArrowRight />
            </Link>
          </li>
        </ul>
      </div>

      <ClipPlayer clips={homeClips} index={playing} onClose={() => setPlaying(null)} onStep={setPlaying} />
    </section>
  );
}
