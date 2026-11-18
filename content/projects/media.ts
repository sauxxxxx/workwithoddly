import type { Media } from "./types";

export const plate = (alt: string, ratio = "16/10"): Media => ({ src: null, alt, ratio });
export const shot = (slug: string, file: string, alt: string, ratio: string): Media => ({ src: `/work/${slug}/${file}.webp`, alt, ratio });

/** A video prepared by scripts/encode-project-video.mjs: the edit, its card loop and its still. */
export const clip = (slug: string, name: string, alt: string, ratio: string): Media => ({
  src: `/work/${slug}/${name}.mp4`,
  poster: `/work/${slug}/${name}.webp`,
  preview: `/work/${slug}/${name}-preview.mp4`,
  kind: "video",
  sound: true,
  alt,
  ratio,
});
