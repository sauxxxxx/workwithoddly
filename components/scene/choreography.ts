/**
 * Animation configuration for the sculpture installation.
 *
 * Every element in the DOM carrying `data-scene="<id>"` is a scene marker.
 * While a marker's section fills the viewport the installation holds that
 * scene's pose; between markers it travels from one pose to the next, driven by
 * scroll progress. Pieces whose start and end are both out of frame jump
 * rather than cross the page.
 *
 * Pose coordinates are screen-relative so compositions survive any aspect:
 *   x, y  — fraction of the viewport half-width / half-height (±1 = edge)
 *   z     — depth in world units (positive = toward the viewer)
 *   r     — Euler rotation in radians
 *   s     — apparent size (1 = the piece's designed size)
 */

import type { ObjectId } from "./sculptures";

export type { ObjectId };
export { OBJECT_IDS } from "./sculptures";

export type Pose = {
  x: number;
  y: number;
  z: number;
  r: [number, number, number];
  s: number;
};

export type Scene = Record<ObjectId, Pose> & {
  /** Purposeful local rotation across a chapter, independent of total page length. */
  turn?: Partial<Record<ObjectId, [number, number, number]>>;
  /** Wires between pieces (the system view). */
  links: number;
  /** Wires hanging from the top edge (the mobile at rest). */
  hang: number;
  /** Fraction of the approach to wait before moving toward this scene. */
  enter?: number;
};

const P = (x: number, y: number, z: number, rx: number, ry: number, rz: number, s: number): Pose => ({
  x,
  y,
  z,
  r: [rx, ry, rz],
  s,
});

type Poses = Record<ObjectId, Pose>;

/**
 * Phones show each project object on its plinth exactly as desktop composes
 * it, scaled down as one group: the object's desktop pose and the plinth
 * (StageDressing) both shrink by `k` about the line `y`, so the object still
 * rests on the plinth instead of floating above or sinking into it.
 */
export const PHONE_STAGE = { k: 0.55, y: 0.16 };
const onPhone = (d: Pose): Pose => ({ ...d, x: d.x * PHONE_STAGE.k, y: PHONE_STAGE.y + d.y * PHONE_STAGE.k, s: d.s * PHONE_STAGE.k });
type Extra = { links?: number; hang?: number; enter?: number; turn?: Scene["turn"] };

/* Each piece always leaves the same way, so exits read as one gesture. */
const AWAY: Poses = {
  loop: P(1.75, 1.35, 0, 0.9, -0.6, 1.4, 1),
  twist: P(-1.75, 1.5, 0, 1.2, 0.4, 0.6, 1),
  knot: P(1.75, -1.5, 0, 0.6, 1.2, 0.8, 1),
  coil: P(-1.75, -1.6, 0, 0.4, 0.2, -0.3, 1),
  scribbleA: P(-1.6, 1.5, 0, 0.3, 0.5, -0.4, 0.5),
  scribbleB: P(1.6, -1.5, 0, -0.2, 0.4, 0.5, 0.5),
  // Project pieces wait above the frame: they drop in and lift out, clear of the captions.
  stack: P(0.25, 1.9, 0.6, 0.6, 0.2, 0.1, 1),
  wave: P(-0.25, 1.9, 0.6, 0.2, -0.3, 0.1, 1),
  chain: P(0.25, 1.9, 0.6, 0.4, 0.6, 0.2, 1),
  spring: P(-0.25, 1.9, 0.6, 0.1, 0.0, 0.2, 1),
  lens: P(0.25, 1.9, 0.6, 0.3, 0.4, -0.3, 1),
  rosette: P(-0.25, 1.9, 0.6, 0.5, 0.3, 0.1, 1),
};

const M_AWAY: Poses = {
  loop: P(1.6, 1.3, 0, 0.9, -0.6, 1.4, 0.5),
  twist: P(-1.6, 1.4, 0, 1.2, 0.4, 0.6, 0.45),
  knot: P(1.6, -1.4, 0, 0.6, 1.2, 0.8, 0.45),
  coil: P(-1.6, -1.5, 0, 0.4, 0.2, -0.3, 0.45),
  scribbleA: P(-1.6, 1.5, 0, 0.3, 0.5, -0.4, 0.3),
  scribbleB: P(1.6, -1.5, 0, -0.2, 0.4, 0.5, 0.3),
  stack: P(0.2, 1.9, 0.4, 0.6, 0.2, 0.1, 0.5),
  wave: P(-0.2, 1.9, 0.4, 0.2, -0.3, 0.1, 0.5),
  chain: P(0.2, 1.9, 0.4, 0.4, 0.6, 0.2, 0.5),
  spring: P(-0.2, 1.9, 0.4, 0.1, 0.0, 0.2, 0.5),
  lens: P(0.2, 1.9, 0.4, 0.3, 0.4, -0.3, 0.5),
  rosette: P(-0.2, 1.9, 0.4, 0.5, 0.3, 0.1, 0.5),
};

const scene =
  (base: Poses) =>
  (poses: Partial<Poses>, extra: Extra = {}): Scene => ({
    ...base,
    ...poses,
    links: 0,
    hang: 0,
    ...extra,
  });
const D = scene(AWAY);
const M = scene(M_AWAY);

const desktop: Record<string, Scene> = {
  /* Opening — an installation around the headline: the lavender ring and stone
     coil hold the left corners, the coral loop threads the middle line from
     the right, the sage knot leans in at the edge, two fine strokes wrap the type. */
  hero: D({
    loop: P(0.6, 0.22, 0.8, 0.42, -0.5, 0.55, 1.0),
    twist: P(-0.86, 0.6, 0.2, 0.45, 0.35, 0.3, 1.0),
    coil: P(-0.74, -0.74, 0.4, 0.4, 0.2, -0.3, 1.0),
    knot: P(0.93, -0.52, 0.2, 0.5, 0.6, 0.2, 0.92),
    scribbleA: P(-0.36, 0.36, 1.6, 0.5, 0.6, -0.9, 0.95),
    scribbleB: P(0.42, -0.5, 1.6, -0.4, 0.5, 0.35, 0.8),
  }),
  /* The statement: the loop passes through the middle line, centre frame. */
  studio: D({
    loop: P(0.1, -0.03, 0.8, 0.42, -0.5, 0.35, 0.8),
    twist: P(-1.4, -1.18, 0.2, 0.45, 0.35, 0.3, 0.8),
    knot: P(1.4, -1.18, 0.2, 0.5, 0.6, 0.2, 0.68),
  }),
  featured: D({}),
  technology: D({ knot: P(0.92, -0.04, 0.5, 0.5, 0.6, 0.2, 1.7) }, { turn: { knot: [0.15, 0.8, 0.12] } }),
  "tech-a": D({
    knot: P(0.0, 0.02, 1.4, 0.18, 0.28, 0.785, 1.25),
  }),
  "tech-b": D({
    knot: P(-0.96, -0.72, 0.2, 0.95, 1.7, 1.3, 0.38),
  }),
  automation: D(
    {
      twist: P(-0.82, -0.1, 0.3, 0.45, 0.35, 0.3, 1.5),
    },
    { links: 0, turn: { twist: [0.08, 0.28, 0.65] } },
  ),
  creative: D({ loop: P(-0.58, -0.05, 0.6, 0.42, -0.5, 0.8, 1.4) }, { turn: { loop: [0.1, 0.6, -0.2] } }),
  "creative-b": D({
    loop: P(-0.96, -0.72, 0.2, 3.2, 1.9, 4.6, 0.38),
  }),
  work: D({}),
  /* About is the quiet room: nothing in frame, the pieces wait overhead. */
  about: D({ knot: P(0.55, 0.18, 0.4, 0.5, 0.6, 0.2, 0.72), twist: P(0.24, -0.3, 0.1, 0.45, 0.35, 0.3, 0.72), loop: P(0.96, -0.15, 0.3, 0.42, -0.5, 0.55, 0.95) }),
  /* Closing — the mobile at rest; the loop hangs above the wordmark's dot. */
  closing: D(
    {
      loop: P(0.96, -0.1, 0.6, 0.42, -0.5, 0.55, 1.7),
    },
    { hang: 0 },
  ),
  /* Project scenes — one word, one piece. The piece sits in the word's line,
     slightly off centre, and turns slowly while the scene holds. */
  "p-stack": D({ stack: P(0.0, -0.12, 1.2, 0.5, 0.3, 0.1, 0.95) }, { turn: { stack: [0.1, 1.4, 0] } }),
  "p-wave": D({ wave: P(0.0, -0.1, 1.2, 0.2, -0.35, 0.05, 0.95) }, { turn: { wave: [0.05, 0.9, 0.05] } }),
  "p-chain": D({ chain: P(0.0, -0.12, 1.2, 0.45, 0.55, 0.2, 0.9) }, { turn: { chain: [0.9, 0.3, 0.15] } }),
  "p-spring": D({ spring: P(0.0, -0.1, 1.2, 0.1, 0.0, 0.12, 0.95) }, { turn: { spring: [0.05, 1.6, 0] } }),
  "p-lens": D({ lens: P(0.0, -0.1, 1.2, 0.25, 0.45, -0.25, 0.9) }, { turn: { lens: [0.15, 0.9, 0.15] } }),
  "p-rosette": D({ rosette: P(0.0, -0.1, 1.2, 0.5, 0.35, 0.1, 0.95) }, { turn: { rosette: [0.3, 0.6, 1.0] } }),
  /* Case studies — the project's piece frames the title. */
  /* Case studies and services: the piece rests on the plinth, as in the stage. */
  "case-loop": D({ loop: P(0.0, -0.17, 1.2, 0.5, -0.4, 0.4, 0.62) }, { turn: { loop: [0.1, 0.8, 0] } }),
  "case-knot": D({ knot: P(0.0, -0.17, 1.2, 0.5, 0.6, 0.2, 0.62) }, { turn: { knot: [0.1, 0.8, 0] } }),
  "case-twist": D({ twist: P(0.0, -0.17, 1.2, 0.45, 0.35, 0.3, 0.7) }, { turn: { twist: [0.1, 0.8, 0] } }),
  away: D({}),
};

/* Phones: fewer pieces, smaller, kept to the edges so the type owns the centre. */
const mobile: Record<string, Scene> = {
  hero: M({
    loop: P(0.62, 0.64, 0.4, 0.42, -0.5, 0.55, 0.55),
    twist: P(-0.8, 0.72, 0.0, 1.05, 0.3, 0.4, 0.42),
    coil: P(-0.7, -0.74, 0.2, 0.4, 0.2, -0.3, 0.46),
    knot: P(0.86, -0.6, 0.2, 0.5, 0.6, 0.2, 0.42),
  }),
  studio: M({
    loop: P(0.97, 0.67, 0.4, 0.42, -0.5, 0.55, 0.76),
    twist: P(-1.03, -0.91, 0.0, 1.05, 0.3, 0.4, 0.45),
    knot: P(1.05, -0.81, 0.2, 0.5, 0.6, 0.2, 0.38),
  }),
  featured: M({}),
  technology: M({}),
  "tech-a": M({}),
  "tech-b": M({}),
  automation: M({}),
  creative: M({ loop: P(0.68, 0.72, 0.8, 2.45, 1.1, 3.8, 0.5) }),
  "creative-b": M({}),
  work: M({}),
  about: M({
    loop: P(0.62, 1.7, 0.6, 0.35, -0.3, 0.4, 0.36),
    twist: P(-0.5, 1.7, 0.4, 0.3, 0.4, 0.2, 0.32),
    knot: P(0.06, 1.7, 0.4, 0.2, -0.5, 0.0, 0.3),
  }),
  closing: M(
    {
      loop: P(0.66, 0.5, 0.6, 0.35, -0.3, 0.4, 0.36),
      twist: P(-0.62, 0.66, 0.4, 0.3, 0.4, 0.2, 0.32),
      knot: P(0.02, 0.58, 0.4, 0.2, -0.5, 0.0, 0.3),
    },
    { hang: 1, enter: 0.65 },
  ),
  "p-stack": M({ stack: onPhone(desktop["p-stack"].stack) }, { turn: desktop["p-stack"].turn }),
  "p-wave": M({ wave: onPhone(desktop["p-wave"].wave) }, { turn: desktop["p-wave"].turn }),
  "p-chain": M({ chain: onPhone(desktop["p-chain"].chain) }, { turn: desktop["p-chain"].turn }),
  "p-spring": M({ spring: onPhone(desktop["p-spring"].spring) }, { turn: desktop["p-spring"].turn }),
  "p-lens": M({ lens: onPhone(desktop["p-lens"].lens) }, { turn: desktop["p-lens"].turn }),
  "p-rosette": M({ rosette: onPhone(desktop["p-rosette"].rosette) }, { turn: desktop["p-rosette"].turn }),
  "case-loop": M({ loop: P(0.0, -0.02, 0.6, 0.5, -0.4, 0.4, 0.34) }),
  "case-knot": M({ knot: P(0.0, -0.02, 0.6, 0.5, 0.6, 0.2, 0.34) }),
  "case-twist": M({ twist: P(0.0, -0.02, 0.6, 0.45, 0.35, 0.3, 0.38) }),
  away: M({}),
};

/* Each project object holds the same pose on its case study as in the stage. */
for (const piece of ["stack", "wave", "chain", "spring", "lens", "rosette"]) {
  desktop[`case-${piece}`] = desktop[`p-${piece}`];
  mobile[`case-${piece}`] = mobile[`p-${piece}`];
}
/* The services page: one frame per discipline, each with its family piece. */
desktop["svc-technology"] = desktop["case-knot"];
desktop["svc-automation"] = desktop["case-twist"];
desktop["svc-creative"] = desktop["case-loop"];
mobile["svc-technology"] = mobile["case-knot"];
mobile["svc-automation"] = mobile["case-twist"];
mobile["svc-creative"] = mobile["case-loop"];

export const choreography = { desktop, mobile };

/** How early (in viewport heights) a scene finishes arriving before its section top reaches the viewport top. */
export const SCENE_LEAD = 0.38;

/** Camera and motion constants. */
export const CAMERA = { fov: 30, z: 12 };
export const DAMPING = 10; // short settling time; Lenis owns wheel interpolation
