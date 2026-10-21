"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowUpRight } from "@/components/Icons";
import { projects, type Project } from "@/content/projects";
import { disciplineById } from "@/content/services";
import { sceneIdAt, track } from "@/components/scene/track";
import { GROW, TRAVEL, stageTravel } from "@/components/scene/travel";
import { ScrambleText } from "@/components/motion/ScrambleText";
import s from "./stage.module.css";

/* Scene order follows the disciplines: technology, automation, creative. */
const ORDER = ["joyno-accounting", "sharks-tail", "joynosync", "casatoon", "nxone-dc", "marketing-content"];

const cap = (x: string) => x[0].toUpperCase() + x.slice(1);

/**
 * The project stage: the screen stays put and each project replaces the last
 * in place. Two sticky full-screen layers (sticky positioning isolates
 * stacking): the words sit behind the 3D stage, the copy in front. Invisible
 * markers spaced down the section drive the 3D objects through the shared
 * scroll track, and the DOM reads that same track every frame, so the word,
 * the copy and the object always change together.
 */
export function ProjectStage() {
  const scenes = ORDER.map((slug) => projects.find((p) => p.slug === slug)).filter(
    (p): p is Project => !!p?.art.word && !!p.art.sculpture,
  );
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ids = scenes.map((p) => `p-${p.art.sculpture}`);
    const layers = ids.map((id) => Array.from(el.querySelectorAll<HTMLElement>(`[data-stage-scene="${id}"]`)));
    const travelling = layers.map((nodes) => nodes.flatMap((n) => Array.from(n.querySelectorAll<HTMLElement>("[data-travel]"))));
    const settling = layers.map((nodes) => nodes.flatMap((n) => Array.from(n.querySelectorAll<HTMLElement>("[data-settle]"))));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    let raf = 0;
    let last = "";

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const from = sceneIdAt(track.from);
      const to = sceneIdAt(track.to);
      const t = track.t;
      const vh = window.innerHeight;
      const key = `${from}|${to}|${t.toFixed(4)}|${vh}`;
      if (key === last) return;
      last = key;
      const travel = reduced.matches ? null : stageTravel();
      ids.forEach((id, i) => {
        if (travel && (from === id || to === id)) {
          // Project to project: the word travels with its sculpture (travel.ts);
          // the copy fades where it stands, and the next scene's copy waits
          // until its scene has all but settled.
          const leaving = from === id;
          const y = (leaving ? travel.leave : -travel.arrive) * (TRAVEL / 2) * vh;
          const scale = leaving ? 1 + GROW * travel.leave : 1;
          const shown = leaving ? 1 - clamp(t / 0.15) : clamp((t - 0.9) / 0.1);
          for (const node of layers[i]) {
            node.style.opacity = "1";
            node.style.transform = "";
            node.style.filter = "";
            node.dataset.active = String(shown > 0.5);
          }
          for (const node of travelling[i]) node.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
          for (const node of settling[i]) {
            node.style.opacity = String(shown);
            node.style.transform = `translate3d(0, ${((1 - shown) * 14).toFixed(1)}px, 0)`;
          }
          return;
        }
        // Into and out of the stage: the leaving scene clears in the first
        // half, the next arrives in the second.
        const w = from === id && to === id ? 1 : from === id ? 1 - clamp(t / 0.5) : to === id ? clamp((t - 0.5) / 0.5) : 0;
        // Leaving rises out; arriving rises in from below.
        const dir = from === id && to !== id ? -1 : 1;
        const y = reduced.matches ? 0 : (1 - w) * 44 * dir;
        const blur = reduced.matches ? 0 : (1 - w) * 6;
        for (const node of layers[i]) {
          node.style.opacity = String(w);
          node.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
          node.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "";
          node.dataset.active = String(w > 0.5);
        }
        for (const node of travelling[i]) node.style.transform = "";
        for (const node of settling[i]) {
          node.style.opacity = "";
          node.style.transform = "";
        }
      });
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [scenes]);

  /* Keyboard: focusing a link in a hidden scene brings that scene on stage. */
  const bringIntoView = (i: number) => {
    const marker = root.current?.querySelectorAll<HTMLElement>("[data-stage-marker]")[i];
    if (!marker) return;
    const top = marker.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + window.innerHeight * 0.05, behavior: "auto" });
  };

  return (
    <section
      ref={root}
      id="services"
      className={s.stage}
      style={{ ["--n" as string]: scenes.length }}
      aria-label="Selected projects"
    >
      {scenes.map((p, i) => {
        const lead = p.disciplines[0];
        const first = i === 0 || scenes[i - 1].disciplines[0] !== lead;
        return (
          <div
            key={p.slug}
            id={first ? lead : undefined}
            className={s.marker}
            style={{ ["--i" as string]: i }}
            data-scene={`p-${p.art.sculpture}`}
            data-scene-hold="1"
            data-stage-marker
          />
        );
      })}

      {/* Behind the 3D: the full words. */}
      <div className={`${s.frame} ${s.back}`}>
        {scenes.map((p) => (
          <div key={p.slug} className={s.layer} data-stage-scene={`p-${p.art.sculpture}`}>
            <h2 id={`stage-${p.slug}`} className={`${s.word} display`} style={{ ["--chars" as string]: p.art.word?.length }} data-travel>
              {p.art.word}
            </h2>
          </div>
        ))}
      </div>

      {/* In front of the 3D: the right half of each word, and the copy. */}
      <div className={`${s.frame} ${s.front}`}>
        {scenes.map((p, i) => {
          const lead = disciplineById(p.disciplines[0]);

          return (
            <div key={p.slug} className={s.layer} data-stage-scene={`p-${p.art.sculpture}`} aria-labelledby={`stage-${p.slug}`}>
              <p className={s.index} data-settle>
                <span>{String(i + 1).padStart(2, "0")}</span> / {String(scenes.length).padStart(2, "0")} · {lead.name}
              </p>
              <span
                className={`${s.word} ${s.wordFront} display`}
                style={{ ["--chars" as string]: p.art.word?.length }}
                aria-hidden="true"
                data-travel
              >
                {p.art.word}
              </span>
              <div className={s.meta} data-settle>
                <p className={s.tags}>
                  <span className={s.chip}>{cap(p.disciplines[0])}</span>
                  <span>{p.category}</span>
                </p>
                <Link className={s.pill} href={`/work/${p.slug}/`} onFocus={() => bringIntoView(i)}>
                  View project <ArrowUpRight />
                </Link>
                <div className={s.about}>
                  <p className={s.name}>
                    <ScrambleText text={p.name} />
                  </p>
                  <p>{p.overview}</p>
                  <p className={s.role}>{p.role.join(" · ")}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
