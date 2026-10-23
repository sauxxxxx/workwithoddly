import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { people } from "@/content/team";
import { site } from "@/content/site";

export const dynamic = "force-static";

/** Every page Google should index, as /sitemap.xml. The old /work/ addresses only redirect, so they are left out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, site.url).toString();
  const now = new Date();
  return [
    { url: url("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: url("/projects/"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/services/"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/about/"), lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: url("/contact/"), lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    ...projects.map((p) => ({
      url: url(`/projects/${p.slug}/`),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...people.map((m) => ({
      url: url(`/team/${m.slug}/`),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
