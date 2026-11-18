import type { Metadata } from "next";
import { site } from "@/content/site";

/** The share picture, rendered at build time by app/og.png/route.tsx. */
export const ogImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: `${site.legalName}: ${site.positioning} in ${site.location.city}, ${site.location.country}`,
};

/** Open Graph fields every page shares. A page's own `openGraph` replaces the layout's, so each repeats these. */
export const ogShared = {
  type: "website" as const,
  siteName: site.legalName,
  locale: "en_PH",
  images: [ogImage],
};

/**
 * A page's own search and sharing tags: its title and description, its
 * canonical address, and an Open Graph entry pointing at that address. Pages
 * without this would inherit the home page's canonical and preview.
 */
export function pageMeta({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  /** A page's own share picture (1200×630); the site's otherwise. */
  image?: { url: string; alt: string };
}): Metadata {
  const images = image ? [{ ...ogImage, ...image }] : ogShared.images;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...ogShared, images, title: `${title} — ${site.legalName}`, description, url: path },
    ...(image && { twitter: { card: "summary_large_image", images: [image.url] } }),
  };
}
