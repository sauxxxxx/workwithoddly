import type { CompoundName, CurveName } from "./geometry";

/**
 * The ODDLY installation: one family of clay strokes in the brand palette.
 * Sizes are in world units at pose scale 1 (the view is ~6.4 units tall).
 */
export type SculptureSpec = {
  id: ObjectId;
  /** A single stroke along a named curve… */
  curve?: CurveName;
  /** …or a compound piece fused from several strokes (the project sculptures). */
  compound?: CompoundName;
  colour: string;
  size: number;
  radius: number;
  closed: boolean;
  /** Scroll-linked rotation per px of scroll, applied on the piece's own axes. */
  spin: [number, number, number];
  /** Rendered on phones? Fine strokes are dropped on small screens. */
  phone: boolean;
  /**
   * Optional modelled replacement: a glTF/GLB path under /public, e.g.
   * "/models/stack.glb". When set, the model is shown (scaled to `size`) and
   * the procedural shape is only the loading/fallback state.
   */
  model?: string;
};

export type ObjectId =
  | "loop"
  | "twist"
  | "knot"
  | "coil"
  | "scribbleA"
  | "scribbleB"
  | "stack"
  | "wave"
  | "chain"
  | "spring"
  | "lens"
  | "rosette";

export const SCULPTURES: SculptureSpec[] = [
  { id: "loop", curve: "loop", colour: "#FF7A59", size: 3.3, radius: 0.27, closed: true, spin: [0, 0.00042, 0], phone: true },
  { id: "twist", curve: "twist", colour: "#A78BFA", size: 2.5, radius: 0.4, closed: true, spin: [0, 0, 0.0006], phone: true },
  { id: "knot", curve: "knot", colour: "#7BA894", size: 2.6, radius: 0.3, closed: true, spin: [0.0003, 0.0004, 0], phone: true },
  { id: "coil", curve: "coil", colour: "#D9D3C9", size: 3.6, radius: 0.29, closed: false, spin: [0.00025, 0, 0], phone: true },
  { id: "scribbleA", curve: "scribble", colour: "#CFC8BD", size: 1.5, radius: 0.07, closed: false, spin: [0, 0, 0], phone: false },
  { id: "scribbleB", curve: "scribble", colour: "#1E2638", size: 1.3, radius: 0.062, closed: false, spin: [0, 0, 0], phone: false },
  /* Project sculptures — one per project scene (see content/projects.ts → art.sculpture). */
  { id: "stack", compound: "stack", colour: "#FF7A59", size: 2.5, radius: 0.27, closed: true, spin: [0, 0.0005, 0], phone: true },
  { id: "wave", compound: "wave", colour: "#7BA894", size: 3.1, radius: 0.27, closed: false, spin: [0, 0.0003, 0], phone: true },
  { id: "chain", compound: "chain", colour: "#A78BFA", size: 3.4, radius: 0.19, closed: true, spin: [0.0004, 0, 0], phone: true },
  { id: "spring", compound: "spring", colour: "#FF7A59", size: 2.8, radius: 0.17, closed: false, spin: [0, 0.0007, 0], phone: true },
  { id: "lens", compound: "lens", colour: "#D9D3C9", size: 2.8, radius: 0.2, closed: true, spin: [0, 0, 0.0003], phone: true },
  { id: "rosette", compound: "rosette", colour: "#A78BFA", size: 2.7, radius: 0.2, closed: true, spin: [0, 0, 0.0005], phone: true },
];

export const OBJECT_IDS = SCULPTURES.map((s) => s.id);

/** Wires that make the system visible (Automation): [from, to]. */
export const LINKS: Array<[ObjectId, ObjectId]> = [
  ["twist", "loop"],
  ["twist", "knot"],
];

/** Pieces that hang on wires in the closing mobile. */
export const HANGERS: ObjectId[] = ["loop", "twist", "knot"];
