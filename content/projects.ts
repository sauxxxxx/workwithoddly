import type { Project, ProjectKind } from "./projects/types";
import { featuredProjects } from "./projects/featured";
import { portfolioProjects } from "./projects/portfolio";
import { productProjects } from "./projects/products";

export type { Media, CaseLayout, ProjectKind, Project, Swatch } from "./projects/types";

/**
 * Project and case-study data.
 *
 * Only facts supplied by the studio are written here. Fields set to `null`
 * (context, problem, solution, results, year, url) are intentionally empty and
 * their sections are hidden until real information is added. Never fill them
 * with invented outcomes, metrics, or quotes.
 *
 * The case-study detail (headline, summary, problem/solution/results,
 * highlights, capabilities, technology) comes from the team's own portfolio
 * case studies at remarugsimar.com and zhyronne-batican.vercel.app, rewritten
 * in the studio's voice with the same facts.
 *
 * The first entries with an `art.word` and `art.sculpture` are the home-page
 * stage; their name, category, overview and role are shown there, so the
 * project page reads the richer `summary`/`headline`/`roleSummary` instead.
 *
 * Media: screenshots are fetched into /public/work/<slug>/ by
 * scripts/fetch-project-media.mjs (add new sources to its manifest). A media
 * entry without a `src` renders a labeled placeholder plate.
 */

export const projects: Project[] = [...featuredProjects, ...portfolioProjects, ...productProjects];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);

export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};

/** Projects page filters, in order. */
export const projectKinds: { id: ProjectKind; label: string }[] = [
  { id: "software", label: "Software" },
  { id: "website", label: "Websites" },
  { id: "apps", label: "Mobile & desktop" },
  { id: "creative", label: "Creative" },
];
