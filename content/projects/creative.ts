import type { Project } from "./types";
import { clip } from "./media";

/**
 * Video work. Clients are deliberately not named; the copy describes only what
 * the footage shows and what the studio did (planning, filming, editing), as
 * confirmed by the studio. Videos are prepared with scripts/encode-project-video.mjs.
 */
export const creativeProjects: Project[] = [
  {
    slug: "travel-tours-reels",
    name: "Travel & Tours Reels",
    client: null,
    category: "Promotional reels for a travel and tour operator",
    disciplines: ["creative"],
    overview: "Promotional reels for a travel and tour operator: island hopping, a sky-bike ride over the trees, and a party cruise at sea.",
    context: null,
    problem: null,
    role: ["Planning", "Filming", "Video editing"],
    solution: null,
    deliverables: ["Promotional reels"],
    results: null,
    year: null,
    url: null,
    kind: "creative",
    headline: "Travel & tour promotion",
    roleSummary: "Planning, filming and video editing",
    media: {
      cover: clip("travel-tours-reels", "island", "Island hopping and adventure reel for a travel and tour operator", "1280/720"),
      gallery: [clip("travel-tours-reels", "party-cruise", "Vertical reel of a party cruise at sea", "720/1280")],
    },
    art: { ground: "sage", ink: "charcoal", accent: "coral", layout: "panorama" },
  },
  {
    slug: "yakitori-restaurant-reels",
    name: "Yakitori Restaurant Reels",
    client: null,
    category: "Promotional reels for a Japanese restaurant",
    disciplines: ["creative"],
    overview: "Short promotional reels for a Japanese yakitori restaurant in Cebu: skewers fresh off the grill, the dishes, and the dining room.",
    context: null,
    problem: null,
    role: ["Planning", "Filming", "Video editing"],
    solution: null,
    deliverables: ["Promotional reels"],
    results: null,
    year: null,
    url: null,
    kind: "creative",
    headline: "Restaurant promotion",
    roleSummary: "Planning, filming and video editing",
    media: {
      cover: clip("yakitori-restaurant-reels", "grill", "Yakitori skewers prepared and served off the grill", "640/360"),
      gallery: [clip("yakitori-restaurant-reels", "plates", "Montage of Japanese dishes and diners at the restaurant", "640/360")],
    },
    art: { ground: "charcoal", ink: "cream", accent: "coral", layout: "panorama" },
  },
  {
    slug: "food-hall-reels",
    name: "Food Hall Reels",
    client: null,
    category: "Promotional reels for a group of restaurants",
    disciplines: ["creative"],
    overview: "Promotional reels for three restaurants under one roof in Lapu-Lapu City, Korean and Vietnamese kitchens, from the entrance to the plate.",
    context: null,
    problem: null,
    role: ["Planning", "Filming", "Video editing"],
    solution: null,
    deliverables: ["Promotional reels"],
    results: null,
    year: null,
    url: null,
    kind: "creative",
    headline: "Restaurant group promotion",
    roleSummary: "Planning, filming and video editing",
    media: {
      cover: clip("food-hall-reels", "three-kitchens", "Reel introducing three restaurants: diners, storefronts and dishes", "1280/720"),
      gallery: [clip("food-hall-reels", "come-hungry", "Reel for a Korean bistro: the dining room and its dishes", "1280/720")],
    },
    art: { ground: "cream", ink: "charcoal", accent: "coral", layout: "panorama" },
  },
  {
    slug: "short-form-reels",
    name: "Short-form Reels",
    client: null,
    category: "Talking-head and social video edits",
    disciplines: ["creative"],
    overview: "Short-form edits for social: talking-head reels with hooks, word-by-word captions, screen inserts and closing calls to action, and a title-led campaign post.",
    context: null,
    problem: null,
    role: ["Planning", "Filming", "Video editing"],
    solution: null,
    deliverables: ["Short-form reels"],
    results: null,
    year: null,
    url: null,
    kind: "creative",
    headline: "Social video edits",
    roleSummary: "Planning, filming and video editing",
    media: {
      cover: clip("short-form-reels", "hook-reel", "Talking-head reel with bold word-by-word captions", "720/1280"),
      gallery: [
        clip("short-form-reels", "nail-tech", "Coaching reel for nail technicians with a headline caption and profile inserts", "720/1280"),
        clip("short-form-reels", "womens-day", "Title-led International Women's Day post", "360/640"),
      ],
    },
    art: { ground: "lavender", ink: "charcoal", accent: "coral", layout: "split" },
  },
];

/** One clip and the project it belongs to. */
export type FeaturedClip = { project: Project; media: Project["media"]["cover"] };

const pick = (slug: string, name: string): FeaturedClip => {
  const project = creativeProjects.find((p) => p.slug === slug);
  const media = project && [project.media.cover, ...project.media.gallery].find((m) => m.src?.endsWith(`/${name}.mp4`));
  if (!project || !media) throw new Error(`No clip ${slug}/${name}`);
  return { project, media };
};

/**
 * The home page's moving-pictures strip, in order: wide and vertical in turn.
 * The 360p clips (the yakitori reels, the Women's Day post) stay on their
 * project pages; at this size they would look soft beside the rest.
 */
export const homeClips: FeaturedClip[] = [
  pick("travel-tours-reels", "island"),
  pick("travel-tours-reels", "party-cruise"),
  pick("food-hall-reels", "three-kitchens"),
  pick("short-form-reels", "hook-reel"),
  pick("food-hall-reels", "come-hungry"),
  pick("short-form-reels", "nail-tech"),
];
