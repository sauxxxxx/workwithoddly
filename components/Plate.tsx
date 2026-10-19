import type { CSSProperties } from "react";
import type { Media, Swatch } from "@/content/projects";
import styles from "./plate.module.css";

export const SWATCH: Record<Swatch, string> = {
  charcoal: "#0F172A",
  coral: "#FF7A59",
  lavender: "#A78BFA",
  sage: "#7BA894",
  cream: "#F8F6EF",
};

type Props = {
  media: Media;
  /** Shown on the placeholder so it is never mistaken for real work. */
  label: string;
  /** Optional credit line under the label (e.g. the project a deliverable belongs to). */
  sublabel?: string;
  ground: Swatch;
  ink: Swatch;
  accent: Swatch;
  /** Changes the placeholder composition so neighbouring plates differ. */
  seed?: number;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
};

/* Deterministic composition of the brand pattern — large circles cropped by
   the frame — standing in until the real asset is supplied. */
function pattern(seed: number) {
  const r = (n: number) => {
    const x = Math.sin(seed * 9301 + n * 49297) * 233280;
    return x - Math.floor(x);
  };
  return [
    { cx: 8 + r(1) * 30, cy: 90 + r(2) * 20, rad: 34 + r(3) * 14 },
    { cx: 62 + r(4) * 30, cy: -6 + r(5) * 18, rad: 30 + r(6) * 16 },
    { cx: 70 + r(7) * 26, cy: 82 + r(8) * 26, rad: 18 + r(9) * 12 },
  ];
}

export function Plate({ media, label, sublabel, ground, ink, accent, seed = 1, className, style, priority }: Props) {
  const frame: CSSProperties = { aspectRatio: media.ratio, ...style };

  if (media.src) {
    return (
      <figure className={`${styles.plate} ${className ?? ""}`} style={frame}>
        {media.kind === "video" ? (
          <video src={media.src} poster={media.poster} controls muted playsInline preload="none" aria-label={media.alt} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={media.src} alt={media.alt} loading={priority ? "eager" : "lazy"} decoding="async" />
        )}
      </figure>
    );
  }

  const circles = pattern(seed);
  // A cream plate on the cream page would vanish; set it on deeper paper instead.
  const field = ground === "cream" ? "#ECE7DA" : SWATCH[ground];
  const fills = [SWATCH[accent], SWATCH[ink], ground === "cream" ? SWATCH.sage : SWATCH.cream];

  return (
    <figure
      className={`${styles.plate} ${styles.placeholder} ${className ?? ""}`}
      style={{ ...frame, background: field, color: SWATCH[ink], ["--plate-ground" as string]: field }}
      aria-label={`${media.alt} — imagery in preparation`}
    >
      <svg className={styles.pattern} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {circles.map((c, i) => (
          <circle key={i} cx={c.cx} cy={c.cy} r={c.rad} fill={fills[i]} opacity={i === 1 ? 0.92 : 1} />
        ))}
      </svg>
      <figcaption className={styles.caption}>
        <span className={styles.label}>
          <span className={styles.name}>{label}</span>
          {sublabel && <span className={styles.sub}>{sublabel}</span>}
        </span>
        <span className={styles.note}>
          <span className={styles.noteLong}>Imagery in preparation</span>
          <span className={styles.noteShort}>Pending</span>
        </span>
      </figcaption>
    </figure>
  );
}
