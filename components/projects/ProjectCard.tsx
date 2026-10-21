import Link from "next/link";
import type { Media, Project } from "@/content/projects";
import { ScrambleText } from "@/components/motion/ScrambleText";
import s from "./project-card.module.css";

const tall = (m: Media) => {
  const [w, h] = m.ratio.split("/").map(Number);
  return h > w;
};

/** The image a card shows: a still (a video's poster), or nothing. */
const still = (m: Media) => (m.kind === "video" ? m.poster : m.src) ?? null;

/** Tags under the image: the stack, or the kind of project. */
export const tagLine = (p: Project) => (p.stack?.length ? p.stack : [p.headline ?? p.category]).join(" • ");

/**
 * One project in the grid (the Lusion card): the screenshot leans with the
 * scroll, its title resolves out of shuffled letters. Phone screens sit whole
 * on the project's ground; a project without media shows its name there.
 */
export function ProjectCard({ project: p, index }: { project: Project; index: number }) {
  const src = still(p.media.cover);
  const shape = src && tall(p.media.cover) ? "phone" : "wide";
  return (
    <Link href={`/projects/${p.slug}/`} className={s.card}>
      <span className={s.frame} data-speed-tilt data-shape={shape} style={{ ["--ground" as string]: `var(--${p.art.ground})` }}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={p.media.cover.alt} loading={index < 4 ? "eager" : "lazy"} decoding="async" />
        ) : (
          <span className={`${s.placeholder} display`} style={{ color: `var(--${p.art.ink})` }} aria-hidden="true">
            {p.name}
          </span>
        )}
      </span>
      <span className={s.tags}>{tagLine(p)}</span>
      <span className={s.name}>
        <ScrambleText text={p.name} />
        <span className={s.go} aria-hidden="true">
          →
        </span>
      </span>
    </Link>
  );
}
