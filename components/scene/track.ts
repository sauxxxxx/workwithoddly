import { SCENE_LEAD } from "./choreography";

/**
 * Converts scroll position into a position along the scene sequence.
 * A mutable singleton read every frame by the 3D stage; written by the
 * ScrollTrigger bridge in Stage.tsx. No React state, no re-renders.
 */

type Hold = { id: string; start: number; end: number; top: number; height: number };

export const track = {
  holds: [] as Hold[],
  /** Index of the scene we are leaving. */
  from: 0,
  /** Index of the scene we are heading to. */
  to: 0,
  /** Eased progress between `from` and `to` (0..1). */
  t: 0,
  /** Raw scroll position in px (drives continuous spin). */
  scroll: 0,
  version: 0,
  viewport: 900,
};

/** Read every `[data-scene]` element and compute the scroll range where its pose holds. */
export function measureMarkers() {
  const vh = window.innerHeight;
  track.viewport = vh;
  const sy = window.scrollY;
  const els = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
  const holds = els
    .map((el) => {
      const rect = el.getBoundingClientRect();
      const top = rect.top + sy;
      const h = rect.height;
      const start = Math.max(0, top - vh * SCENE_LEAD);
      const hold = Number(el.dataset.sceneHold);
      const offset = Number.isFinite(hold) ? Math.min(1.5, Math.max(0.5, hold)) : 1 + SCENE_LEAD;
      const end = Math.max(start, top + h - vh * offset);
      return { id: el.dataset.scene as string, start, end, top, height: h };
    })
    .sort((a, b) => a.start - b.start);

  track.holds = holds;
  track.version++;
  updateTrack(sy);
}

const smooth = (t: number) => t * t * (3 - 2 * t);

export function updateTrack(scroll: number) {
  track.scroll = scroll;
  const h = track.holds;
  if (h.length === 0) {
    track.from = track.to = 0;
    track.t = 0;
    return;
  }
  if (scroll <= h[0].end) {
    track.from = track.to = 0;
    track.t = 0;
    return;
  }
  for (let i = 0; i < h.length; i++) {
    const cur = h[i];
    if (scroll >= cur.start && scroll <= cur.end) {
      track.from = track.to = i;
      track.t = 0;
      return;
    }
    const next = h[i + 1];
    if (next && scroll > cur.end && scroll < next.start) {
      const span = Math.max(1, next.start - cur.end);
      track.from = i;
      track.to = i + 1;
      track.t = smooth((scroll - cur.end) / span);
      return;
    }
  }
  track.from = track.to = h.length - 1;
  track.t = 0;
}

export const sceneIdAt = (i: number) => track.holds[i]?.id ?? "away";

export function sceneProgress(index: number) {
  const scene = track.holds[index];
  if (!scene) return 0;
  return Math.min(1, Math.max(0, (track.scroll - scene.top) / Math.max(track.viewport * 0.8, scene.height - track.viewport * 0.3)));
}

