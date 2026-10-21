import { sceneIdAt, track } from "./track";

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const easeIn = (v: number) => v * v * v;
const easeOut = (v: number) => 1 - (1 - v) ** 3;

/** How far a scene travels, in screen half-heights (2 = one full screen). */
export const TRAVEL = 2.3;
/** How much a leaving scene grows as it drops away. */
export const GROW = 0.22;

/**
 * Between two project scenes the stage travels instead of crossfading (the
 * Noomo move): the leaving scene accelerates out of the bottom of the frame
 * and grows, as if the camera were rising past it; a beat of empty ground;
 * then the next scene drops in from the top and settles. The words, the
 * sculptures and the plinth all read this, so they travel together.
 *
 * `leave` runs 0 (at rest) → 1 (gone below); `arrive` runs 1 (above) → 0
 * (settled). Null outside a project-to-project change.
 */
export function stageTravel() {
  if (track.from === track.to) return null;
  if (!sceneIdAt(track.from).startsWith("p-") || !sceneIdAt(track.to).startsWith("p-")) return null;
  const t = track.t;
  return {
    t,
    leave: easeIn(clamp(t / 0.42)),
    arrive: 1 - easeOut(clamp((t - 0.58) / 0.42)),
  };
}
