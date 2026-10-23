"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "@/components/Icons";
import { projects, type Project } from "@/content/projects";
import { disciplineById } from "@/content/services";
import { centreScene, useDescent } from "./useDescent";
import { ScrambleText } from "@/components/motion/ScrambleText";
import s from "./stage.module.css";

/* Scene order follows the disciplines: technology, automation, creative. */
const ORDER = ["joyno-accounting", "sharks-tail", "joynosync", "casatoon", "nxone-dc", "marketing-content"];

const cap = (x: string) => x[0].toUpperCase() + x.slice(1);

/**
 * The project stage, in the Noomo descent (components/scene/descent.ts): each
 * project drops in from above, drifts through the centre and falls out of the
 * bottom, its word, object and plinth moving as one. Two sticky full-screen
 * layers (sticky isolates stacking): the words behind the 3D stage, the copy
 * in front. One invisible marker per scene drives both the DOM and the 3D.
 */
export function ProjectStage() {
  const scenes = ORDER.map((slug) => projects.find((p) => p.slug === slug)).filter(
    (p): p is Project => !!p?.art.word && !!p.art.sculpture,
  );
  const root = useRef<HTMLElement>(null);
  useDescent(root);

  /* Keyboard: focusing a link in a scene brings that scene to the centre. */
  const bringIntoView = (i: number) =>
    centreScene(root.current?.querySelectorAll<HTMLElement>("[data-stage-marker]")[i]);

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
          <div key={p.slug} className={s.layer} data-descent={`p-${p.art.sculpture}`}>
            <h2 id={`stage-${p.slug}`} className={`${s.word} display`} style={{ ["--chars" as string]: p.art.word?.length }} data-ride>
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
            <div key={p.slug} className={s.layer} data-descent={`p-${p.art.sculpture}`} aria-labelledby={`stage-${p.slug}`}>
              <p className={s.index} data-settle>
                <span>{String(i + 1).padStart(2, "0")}</span> / {String(scenes.length).padStart(2, "0")} · {lead.name}
              </p>
              <span
                className={`${s.word} ${s.wordFront} display`}
                style={{ ["--chars" as string]: p.art.word?.length }}
                aria-hidden="true"
                data-ride
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
