/**
 * Team members. Add real people only.
 * Portraits go in /public/team/<file> and are referenced as "/team/<file>";
 * until then the About Us page shows a placeholder portrait.
 * Each person has a profile page at /team/<slug>/ (app/team/[slug]).
 */
export type TeamMember = {
  /** The profile page's address: /team/<slug>/. */
  slug: string;
  name: string;
  /** What the person does, in their own words; the first few show on the About grid. */
  skills: string[];
  portrait: string | null;
  /** Only links the person supplied and that resolve; empty until then. */
  links: { portfolio?: string; github?: string };
};

/**
 * Rendered by the home page's About section when it has entries. Kept empty
 * for now so the home page stays as it is; the About Us page lists `people`.
 */
export const team: TeamMember[] = [];

/** The studio's people, on the About Us page and their own profile pages. */
export const people: TeamMember[] = [
  {
    slug: "jen-estrada",
    name: "Jen Estrada",
    skills: ["Video editing", "Branding", "Marketing"],
    portrait: "/team/jenneth-estrada.webp",
    links: {},
  },
  {
    slug: "remar-ugsimar",
    name: "Remar Ugsimar",
    skills: ["Website developer", "Software developer", "Google SEO specialist", "AI automation", "CRM developer"],
    portrait: "/team/remar-ugsimar.webp",
    links: { portfolio: "https://remarugsimar.com", github: "https://github.com/sauxxxxx" },
  },
  {
    slug: "zhy-batican",
    name: "Zhy Batican",
    skills: ["Website developer", "Software developer", "Google SEO specialist"],
    portrait: "/team/rolex-zhyronne-batican.webp",
    // Portfolio (zhyronne-batican.vercel.app) is offline for now; add it back when it resolves.
    links: { github: "https://github.com/enzizy" },
  },
  {
    slug: "nathan-languido",
    name: "Nathan Languido",
    skills: ["Video editing", "Photography", "Filmmaking", "Software development", "Animation", "Graphic design"],
    portrait: "/team/nathaniel-languido.webp",
    links: {},
  },
  {
    slug: "aaron-demol",
    name: "Aaron Demol",
    skills: ["Presentation design", "Graphics"],
    portrait: "/team/aaron-demol.webp",
    links: {},
  },
  {
    slug: "reynan-montejo",
    name: "Reynan Montejo",
    skills: ["Video editing", "Graphic design", "Web development", "Software development", "SEO & web optimization"],
    portrait: null,
    links: {},
  },
  {
    slug: "gd-vergara",
    name: "GD Vergara",
    skills: ["Video editing", "Web development"],
    portrait: "/team/gil-denver-vergara.webp",
    links: {},
  },
];

export const memberBySlug = (slug: string) => people.find((p) => p.slug === slug);

/** The people either side of one, wrapping round the list. */
export function adjacentMembers(slug: string) {
  const i = people.findIndex((p) => p.slug === slug);
  const n = people.length;
  return { previous: people[(i - 1 + n) % n], next: people[(i + 1) % n] };
}

/** The short line under a name on the About grid: the first three skills. */
export const skillLine = (m: TeamMember) => m.skills.slice(0, 3).join(" · ");
