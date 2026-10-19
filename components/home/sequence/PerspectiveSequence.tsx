import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import { RevealReel } from "./RevealReel";
import s from "./sequence.module.css";

const project = "/work/the-beach-park-hadsan/";

/**
 * After the hero: one statement, then the first project.
 *
 * 1. Three thin lines, centred, with the coral loop passing through them.
 * 2. The loop becomes a frame; the Beach Park recording opens inside it and
 *    then grows to fill the screen (the Lusion move), with one quiet row of
 *    copy at the bottom.
 *
 * Two sticky layers: sticky positioning isolates stacking, so the back layer
 * sits under the 3D stage and the front layer over it.
 */
export function PerspectiveSequence() {
  const lines = ["The website.", "The system.", "The story."];
  return (
    <section
      id="studio"
      className={s.journey}
      data-opening-sequence
      data-scene="studio"
      data-scene-hold="1"
      aria-labelledby="perspective-title"
    >
      <div className={`${s.sticky} ${s.back}`}>
        <div className={s.story} data-sequence-story>
          <h2 id="perspective-title" className={s.lines}>
            {lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p className={s.label}>One studio for all three</p>
        </div>
        <div className={s.fallbackForm} data-sequence-form aria-hidden="true">
          <Image src="/art/forms/loop.webp" width={1800} height={1800} alt="" loading="lazy" />
        </div>
      </div>

      <div className={`${s.sticky} ${s.front}`}>
        {/* The middle line again, over the stage, so the loop passes behind it. */}
        <div className={s.story} data-sequence-story aria-hidden="true">
          <p className={`${s.lines} ${s.linesFront}`}>
            {lines.map((line, i) => (
              <span key={line} style={{ visibility: i === 1 ? "visible" : "hidden" }}>
                {line}
              </span>
            ))}
          </p>
          <p className={s.label} style={{ visibility: "hidden" }}>
            One studio for all three
          </p>
        </div>

        <div className={s.project} data-sequence-project>
          <div className={s.window} data-sequence-window>
            <span className={s.shade} data-sequence-shade aria-hidden="true" />
            <RevealReel controlClass={s.playToggle} />
          </div>

          <div className={s.meta} data-sequence-meta>
            <p className={s.tags}>
              <span className={s.chip}>Technology</span>
              <span>Hospitality website</span>
            </p>
            <Link className={s.pill} href={project}>
              View project <ArrowUpRight />
            </Link>
            <p className={s.about}>
              <strong>The Beach Park — Hadsan</strong>
              <span>Hospitality, thoughtfully connected.</span>
            </p>
          </div>
        </div>

        <div className={s.progress} aria-hidden="true">
          <span data-sequence-progress />
        </div>
      </div>
      <span id="work" className={s.workAnchor} aria-hidden="true" />
    </section>
  );
}
