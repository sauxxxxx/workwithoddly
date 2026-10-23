/**
 * Team members. Add real people only.
 * Portraits go in /public/team/<file> and are referenced as "/team/<file>";
 * until then the About Us page shows a placeholder portrait.
 */
export type TeamMember = {
  name: string;
  /** Only as the person states it; null leaves the line out. */
  role: string | null;
  portrait: string | null;
};

/**
 * Rendered by the home page's About section when it has entries. Kept empty
 * for now so the home page stays as it is; the About Us page lists `people`.
 */
export const team: TeamMember[] = [];

/** The studio's people, on the About Us page. */
export const people: TeamMember[] = [
  { name: "Jen Estrada", role: null, portrait: "/team/jenneth-estrada.webp" },
  { name: "Remar Ugsimar", role: "Full-stack developer", portrait: "/team/remar-ugsimar.webp" },
  { name: "Zhy Batican", role: "Full-stack developer, AI engineer & UI/UX designer", portrait: "/team/rolex-zhyronne-batican.webp" },
  { name: "Nathan Languido", role: null, portrait: "/team/nathaniel-languido.webp" },
  { name: "Aaron Demol", role: null, portrait: "/team/aaron-demol.webp" },
  { name: "Reynan Montejo", role: null, portrait: null },
  { name: "GD Vergara", role: null, portrait: "/team/gil-denver-vergara.webp" },
];
