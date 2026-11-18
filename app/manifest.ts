import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export const dynamic = "force-static";

/** /manifest.webmanifest: the name, colours and icons used when the site is saved to a phone's home screen. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.legalName}: ${site.positioning}`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#E7E4F4",
    theme_color: "#E7E4F4",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
