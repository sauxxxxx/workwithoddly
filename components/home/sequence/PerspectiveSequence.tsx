import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import { ReelCard } from "./ReelCard";
import s from "./sequence.module.css";

const project = "/work/the-beach-park-hadsan/";

/**
 * After the hero: one statement, then the first project.
 *
 * 1. Three thin lines, centred, with the coral loop passing through them.
 * 2. The loop floats away; the Beach Park reel card rises in on its grid of
 *    marks, then grows evenly to fill the screen, with one quiet row of copy.
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
          {/* The card: full-size and clipped to its frame, which grows to the screen. */}
          <div className={s.card} data-sequence-window>
            <ReelCard
              classes={{ media: s.media, title: s.reelTitle, word: s.reelWord, pill: s.playPill, glyph: s.glyph, back: s.reelBack }}
            />
            <span className={s.shade} data-sequence-shade aria-hidden="true" />
            <div className={s.fullMeta} data-sequence-meta>
              <p className={s.tags}>
                <span className={s.chip}>Technology</span>
                <span>Hospitality website</span>
              </p>
              <Link className={s.pill} href={project}>
                View project <ArrowUpRight />
              </Link>
            </div>
          </div>

          {/* Registration marks and caption, set from the same frame. */}
          <div className={s.marks} data-sequence-marks aria-hidden="true">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} />
            ))}
          </div>
          <div className={s.caption} data-sequence-caption>
            <div>
              <p className={s.captionTags}>Website • Digital experience • SEO</p>
              <p className={s.captionName}>The Beach Park — Hadsan</p>
            </div>
            <Link href={project} className={s.captionLink}>
              View project <ArrowUpRight />
            </Link>
          </div>
        </div>
      </div>
      <span id="work" className={s.workAnchor} aria-hidden="true" />
    </section>
  );
}
