import { sceneIdAt, track } from "./track";

/**
 * The Noomo descent. From the first project to Contact, scrolling down moves
 * each scene down the screen as one rigid unit — word, object, plinth and
 * decorations together. A scene drops in from above, decelerates into the
 * centre, keeps drifting (it never stops), then accelerates out of the bottom;
 * a beat of empty ground; the next drops in. The DOM and the 3D both read this,
 * so they cannot drift apart.
 *
 * A descent scene is a `[data-scene]` marker whose span is the scroll range its
 * sticky frame is pinned for. Offsets are in viewport heights, positive = down.
 */

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (v: number) => 1 - (1 - v) ** 3;
const easeIn = (v: number) => v * v * v;

const ENTER = 0.3;
const LEAVE = 0.7;
const FAR = 1.15;
const DRIFT = 0.06;
/** How much a scene grows as it falls away, as if the camera rose past it. */
export const GROW = 0.22;

/** Only the project scenes descend; About and Contact scroll normally. */
export const isDescent = (id: string) => id.startsWith("p-");

/** With reduced motion the scenes swap in place instead of travelling. */
let reducedQuery: MediaQueryList | null = null;
const reducedMotion = () => {
  if (typeof window === "undefined") return false;
  // Read many times a frame: keep one live query rather than a new one per call.
  reducedQuery ??= window.matchMedia("(prefers-reduced-motion: reduce)");
  return reducedQuery.matches;
};

export type Descent = {
  id: string;
  /** Local progress through the scene's span (unclamped). */
  p: number;
  /** Viewport heights, positive = further down the screen. */
  offset: number;
  grow: number;
  /** 0..1: the copy shows only while the scene is near the centre. */
  copy: number;
  visible: boolean;
};

function shape(id: string, p: number): Descent {
  if (reducedMotion()) {
    const on = p > 0 && p < 1;
    return { id, p, offset: 0, grow: 1, copy: on ? 1 : 0, visible: on };
  }
  let offset: number;
  let grow = 1;
  if (p < ENTER) offset = -FAR + (FAR - DRIFT) * easeOut(clamp(p / ENTER));
  else if (p < LEAVE) offset = -DRIFT + 2 * DRIFT * clamp((p - ENTER) / (LEAVE - ENTER));
  else {
    const out = easeIn(clamp((p - LEAVE) / (1 - LEAVE)));
    offset = DRIFT + (FAR - DRIFT) * out;
    grow = 1 + GROW * out;
  }
  const fadeIn = clamp((p - 0.26) / 0.1);
  const fadeOut = 1 - clamp((p - 0.64) / 0.1);
  return { id, p, offset, grow, copy: Math.min(fadeIn, fadeOut), visible: p > 0 && Math.abs(offset) < 1.12 };
}

/** One scene's descent, by its marker id; null if the marker is not measured. */
export function sceneDescent(id: string): Descent | null {
  const hold = track.holds.find((h) => h.id === id);
  if (!hold || hold.height <= 0) return null;
  return shape(id, (track.scroll - hold.top) / hold.height);
}

/**
 * The descent scene currently on stage: the most recent one whose frame has
 * pinned, so a leaving scene keeps its pieces until it is gone. Before the
 * first one pins, it is claimed early (once the track heads for it) with its pieces
 * waiting above the frame, so they are never steered in ahead of their word.
 */
export function activeDescent(): Descent | null {
  const scenes = track.holds.filter((h) => isDescent(h.id) && h.height > 0).sort((a, b) => a.top - b.top);
  if (scenes.length === 0) return null;
  let current = null as (typeof scenes)[number] | null;
  for (const h of scenes) if (track.scroll >= h.top) current = h;
  // Claimed as soon as the track heads for it, so the pieces wait above the frame
  // instead of gliding in over the previous section and snapping away.
  if (!current && (track.scroll >= scenes[0].start || sceneIdAt(track.to) === scenes[0].id)) current = scenes[0];
  if (!current) return null;
  // Once a later, ordinary scene (About) is under way, the choreography takes over.
  const top = current.top;
  if (track.holds.some((h) => !isDescent(h.id) && h.top > top && track.scroll >= h.start)) return null;
  return shape(current.id, (track.scroll - current.top) / current.height);
}
