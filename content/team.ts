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
  { name: "Jenneth Estrada", role: null, portrait: null },
  { name: "Remar Ugsimar", role: "Full-stack developer", portrait: null },
  { name: "Rolex Zhyronne Batican", role: "Full-stack developer, AI engineer & UI/UX designer", portrait: null },
  { name: "Nathaniel Languido", role: null, portrait: null },
  { name: "Aaron Demol", role: null, portrait: null },
  { name: "John Reynan Montejo", role: null, portrait: null },
  { name: "Gil Denver Vergara", role: null, portrait: null },
];
