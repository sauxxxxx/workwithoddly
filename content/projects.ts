import type { DisciplineId } from "./services";

/**
 * Project and case-study data.
 *
 * Only facts supplied by the studio are written here. Fields set to `null`
 * (context, problem, solution, results, year, url) are intentionally empty and
 * their sections are hidden until real information is added. Never fill them
 * with invented outcomes, metrics, or quotes.
 *
 * Media: drop files into /public/work/<slug>/ and point `media.cover` and
 * `media.gallery[].src` at them (e.g. "/work/casatoon/cover.jpg"). Until then
 * the site renders a labeled placeholder plate in the project's palette.
 */

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
  problem: string | null;
  role: string[];
  solution: string | null;
  deliverables: string[];
  results: string | null;
  year: string | null;
  url: string | null;
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

const plate = (alt: string, ratio = "16/10"): Media => ({ src: null, alt, ratio });

export const projects: Project[] = [
  {
    slug: "the-beach-park-hadsan",
    name: "The Beach Park — Hadsan",
    client: "The Beach Park — Hadsan",
    category: "Hospitality website, digital experience & SEO",
    disciplines: ["technology", "creative"],
    overview:
      "A hospitality website and digital experience for The Beach Park — Hadsan, supported by search engine optimization.",
    context: null,
    problem: null,
    role: ["Website design & development", "Digital experience", "Search engine optimization"],
    solution: null,
    deliverables: ["Hospitality website", "Digital guest experience", "SEO"],
    results: null,
    year: null,
    url: "https://thebeachpark.vercel.app/",
    media: {
      cover: {
        src: "/work/the-beach-park-hadsan/cover.mp4",
        poster: "/work/the-beach-park-hadsan/cover.webp",
        kind: "video",
        alt: "Hero footage from The Beach Park Hadsan website supplied by the studio",
        ratio: "16/9",
      },
      gallery: [
        { src: "/work/the-beach-park-hadsan/desktop.webp", alt: "The Beach Park website — desktop homepage", ratio: "1440/1000" },
        { src: "/work/the-beach-park-hadsan/detail.webp", alt: "The Beach Park website — accommodation section", ratio: "1440/1000" },
        { src: "/work/the-beach-park-hadsan/mobile.webp", alt: "The Beach Park website — mobile homepage", ratio: "390/844" },
      ],
    },
    art: { ground: "sage", ink: "charcoal", accent: "cream", layout: "panorama" },
  },
  {
    slug: "casatoon",
    name: "CasaToon",
    client: null,
    category: "AI animation product & creative technology",
    disciplines: ["automation", "creative"],
    overview: "An AI animation product built where creative technology meets automation.",
    context: null,
    problem: null,
    role: ["Product design", "AI integration", "Creative technology"],
    solution: null,
    deliverables: ["AI animation product"],
    results: null,
    year: null,
    url: "https://app.casatoon.com/",
    media: {
      cover: { src: "/work/casatoon/entry.webp", alt: "CasaToon public sign-in interface", ratio: "1440/1000" },
      gallery: [],
    },
    art: { ground: "lavender", ink: "charcoal", accent: "coral", layout: "split", word: "ANIMATION", sculpture: "spring" },
  },
  {
    slug: "joyno-accounting",
    name: "Joyno Accounting",
    client: null,
    category: "Accounting software & business systems",
    disciplines: ["technology"],
    overview: "Accounting software built as part of a wider set of business systems.",
    context: null,
    problem: null,
    role: ["Software design & development", "UI/UX design", "Business systems"],
    solution: null,
    deliverables: ["Accounting software"],
    results: null,
    year: null,
    url: "https://joynoadmin.tech/",
    media: {
      cover: { src: "/work/joyno-accounting/entry.webp", alt: "Joyno Accounting public sign-in interface", ratio: "1440/1000" },
      gallery: [],
    },
    art: { ground: "cream", ink: "charcoal", accent: "coral", layout: "ledger", word: "SOFTWARE", sculpture: "stack" },
  },
  {
    slug: "joynosync",
    name: "JoynoSync",
    client: null,
    category: "CRM & workflow management",
    disciplines: ["automation", "technology"],
    overview: "A CRM and workflow management system for organising customers and the work around them.",
    context: null,
    problem: null,
    role: ["Product design & development", "CRM", "Workflow automation"],
    solution: null,
    deliverables: ["CRM", "Workflow management"],
    results: null,
    year: null,
    url: "https://joynosync.web.app/",
    media: {
      cover: { src: "/work/joynosync/entry.webp", alt: "JoynoSync public sign-in interface", ratio: "1440/1000" },
      gallery: [],
    },
    art: { ground: "sage", ink: "charcoal", accent: "lavender", layout: "ledger", word: "WORKFLOW", sculpture: "chain" },
  },
  {
    slug: "sharks-tail",
    name: "Shark's Tail",
    client: "Shark's Tail",
    category: "Hospitality website & digital presentation",
    disciplines: ["technology", "creative"],
    overview: "A hospitality website and digital presentation for Shark's Tail.",
    context: null,
    problem: null,
    role: ["Website design & development", "Digital presentation"],
    solution: null,
    deliverables: ["Hospitality website", "Digital presentation"],
    results: null,
    year: null,
    url: null,
    media: {
      cover: plate("Shark's Tail website", "21/9"),
      gallery: [plate("Website detail", "16/10"), plate("Mobile view", "9/16")],
    },
    art: { ground: "charcoal", ink: "cream", accent: "coral", layout: "tide", object: "loop", word: "HOSPITALITY", sculpture: "wave" },
  },
  {
    slug: "nxone-dc",
    name: "NxOne DC",
    client: "NxOne DC",
    category: "Marketing, content & SEO",
    disciplines: ["creative"],
    overview: "Marketing, content, and search engine optimization for NxOne DC.",
    context: null,
    problem: null,
    role: ["Digital marketing", "Content creation", "Search engine optimization"],
    solution: null,
    deliverables: ["Marketing", "Content", "SEO"],
    results: null,
    year: null,
    url: null,
    media: {
      cover: plate("NxOne DC content", "4/5"),
      gallery: [plate("Content piece", "1/1"), plate("Content piece", "1/1"), plate("Content piece", "1/1")],
    },
    art: { ground: "coral", ink: "charcoal", accent: "cream", layout: "sheet", word: "SEARCH", sculpture: "lens" },
  },
  {
    slug: "marketing-content",
    name: "Marketing & Content",
    client: null,
    category: "Campaigns, social graphics & video production",
    disciplines: ["creative"],
    overview: "Campaigns, social graphics, and video production across the studio's creative work.",
    context: null,
    problem: null,
    role: ["Campaign design", "Social media graphics", "Video production"],
    solution: null,
    deliverables: ["Campaigns", "Social graphics", "Video"],
    results: null,
    year: null,
    url: null,
    media: {
      cover: plate("Campaign artwork", "4/5"),
      gallery: [
        plate("Social graphic", "4/5"),
        plate("Video still", "9/16"),
        plate("Campaign artwork", "4/5"),
        plate("Social graphic", "1/1"),
      ],
    },
    art: { ground: "cream", ink: "charcoal", accent: "coral", layout: "sheet", word: "CAMPAIGNS", sculpture: "rosette" },
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);

export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
