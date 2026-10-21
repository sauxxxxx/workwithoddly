import type { DisciplineId } from "../services";

export type Media = {
  src: string | null;
  alt: string;
  /** Static cover for video, including reduced motion and unavailable playback. */
  poster?: string;
  /** "image" or "video" (mp4/webm). */
  kind?: "image" | "video";
  /** Aspect ratio used for layout before the asset loads, e.g. "16/10". */
  ratio: string;
};

export type CaseLayout = "panorama" | "split" | "ledger" | "tide" | "sheet";

/** The Projects page filter. */
export type ProjectKind = "software" | "website" | "apps" | "creative";

export type Project = {
  slug: string;
  name: string;
  client: string | null;
  /** Short category line, as supplied by the studio. */
  category: string;
  disciplines: DisciplineId[];
  /** One-sentence overview derived from the supplied category. */
  overview: string;
  context: string | null;
  /** The challenge. */
  problem: string | null;
  role: string[];
  /** Our approach. */
  solution: string | null;
  deliverables: string[];
  /** What it delivers. */
  results: string | null;
  year: string | null;
  url: string | null;
  /** Public source code, when the project is open. */
  repo?: string;
  kind: ProjectKind;
  /** Project page: the line above the name. Falls back to `category`. */
  headline?: string;
  /** Project page: the line under the name. Falls back to `overview`. */
  summary?: string;
  /** Project page: the role, as one line. Falls back to `role`. */
  roleSummary?: string;
  platform?: string;
  /** Card tags on the Projects page. */
  stack?: string[];
  highlights?: { title: string; body: string }[];
  capabilities?: string[];
  technology?: { label: string; items: string }[];
  media: { cover: Media; gallery: Media[] };
  art: {
    /** Palette tokens from the brand: charcoal | coral | lavender | sage | cream */
    ground: Swatch;
    ink: Swatch;
    accent: Swatch;
    layout: CaseLayout;
    /** Sculpture that frames the case-study title; defaults to the lead discipline's. */
    object?: "loop" | "twist" | "knot";
    /** Home-page scene: one giant word for what the project is… */
    word?: string;
    /** …and the clay piece that passes through it (components/scene/sculptures.ts). */
    sculpture?: "stack" | "wave" | "chain" | "spring" | "lens" | "rosette";
  };
};

export type Swatch = "charcoal" | "coral" | "lavender" | "sage" | "cream";
