import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export const dynamic = "force-static";

/**
 * /robots.txt: everything open, and the sitemap. The old /work/ addresses stay
 * crawlable so Google can follow them to their /projects/ canonicals.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", site.url).toString(),
    host: site.url,
  };
}
