import type { Media } from "./types";

export const plate = (alt: string, ratio = "16/10"): Media => ({ src: null, alt, ratio });
export const shot = (slug: string, file: string, alt: string, ratio: string): Media => ({ src: `/work/${slug}/${file}.webp`, alt, ratio });
