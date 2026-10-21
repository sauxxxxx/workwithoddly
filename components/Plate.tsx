import type { CSSProperties } from "react";
import type { Media } from "@/content/projects";
import styles from "./plate.module.css";

type Props = {
  media: Media;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
};

/** Real project media only: an image or a video. Without a source it renders nothing. */
export function Plate({ media, className, style, priority }: Props) {
  if (!media.src) return null;
  const frame: CSSProperties = { aspectRatio: media.ratio, ...style };
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
