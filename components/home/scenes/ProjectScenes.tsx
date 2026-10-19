import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import { projects } from "@/content/projects";
import { disciplineById } from "@/content/services";
import s from "./project-scenes.module.css";

/* Scene order follows the disciplines: technology, automation, creative. */
const ORDER = ["joyno-accounting", "sharks-tail", "joynosync", "casatoon", "nxone-dc", "marketing-content"];

const cap = (x: string) => x[0].toUpperCase() + x.slice(1);

/**
 * One word, one clay piece, one project per screen. The word is set twice:
 * the full word behind the 3D stage and a clipped copy in front of it, so the
 * piece passes between the letters. Copy is kept to the edges.
 */
export function ProjectScenes() {
  const scenes = ORDER.map((slug) => projects.find((p) => p.slug === slug)).filter(
    (p): p is NonNullable<typeof p> => !!p?.art.word && !!p.art.sculpture,
  );

  return (
    <div id="services" className={s.scenes}>
      {scenes.map((p, i) => {
        const lead = p.disciplines[0];
        const firstOfDiscipline = i === 0 || scenes[i - 1].disciplines[0] !== lead;
        const word = p.art.word as string;
        const id = `scene-${p.slug}`;
        return (
          <section
            key={p.slug}
            id={firstOfDiscipline ? lead : undefined}
            className={s.scene}
            data-scene={`p-${p.art.sculpture}`}
            data-scene-hold="1.05"
            data-project-scene
            data-side={i % 2 ? "left" : "right"}
            aria-labelledby={id}
            style={{ ["--chars" as string]: word.length }}
          >
            {/* Two sticky layers: sticky positioning isolates stacking, so the
                back layer sits under the 3D stage and the front layer over it. */}
            <div className={`${s.sticky} ${s.backLayer}`}>
              <div className={s.rail} data-scene-rail>
                <h2 id={id} className={s.word}>
                  {word}
                </h2>
              </div>
            </div>

            <div className={`${s.sticky} ${s.frontLayer}`}>
              <p className={s.index}>
                <span>{String(i + 2).padStart(2, "0")}</span> {disciplineById(lead).name}
              </p>
              <div className={s.rail} data-scene-rail aria-hidden="true">
                <span className={`${s.word} ${s.wordFront}`}>{word}</span>
              </div>

              <div className={s.meta} data-scene-meta>
                <p className={s.tags}>
                  <span className={s.chip}>{cap(lead)}</span>
                  <span>{p.category}</span>
                </p>
                <Link className={s.pill} href={`/work/${p.slug}/`}>
                  View project <ArrowUpRight />
                </Link>
                <p className={s.about}>
                  <strong>{p.name}</strong>
                  <span>{p.overview}</span>
                </p>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
