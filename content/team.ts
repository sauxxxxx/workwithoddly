/**
 * Team members. Intentionally empty: no team information has been supplied.
 * Add real people only — the About section renders this list when it has entries.
 * Portraits go in /public/team/<file> and are referenced as "/team/<file>".
 */
export type TeamMember = {
  name: string;
  role: string;
  portrait: string | null;
};

export const team: TeamMember[] = [];
