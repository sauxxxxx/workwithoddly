import { track } from "./track";

export const clamp = (value: number) => Math.max(0, Math.min(1, value));
export const ease = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};
export const range = (value: number, from: number, to: number) =>
  ease((value - from) / (to - from));

/** One measured timeline, shared by the HTML reveal, sculpture, and room. */
export function journey() {
  const section = track.holds.find((item) => item.id === "studio");
  if (!section) return { active: false, progress: 0, exit: 1, light: 0 };
  const distance = Math.max(track.viewport, section.height - track.viewport);
  const progress = clamp((track.scroll - section.top) / distance);
  const exit = clamp((track.scroll - section.top - distance) / track.viewport);
  const active =
    track.scroll >= section.top && track.scroll <= section.top + section.height;
  const returnToStudio = range(
    track.scroll,
    section.top + section.height + track.viewport * 0.3,
    section.top + section.height + track.viewport * 1.2,
  );
  return {
    active,
    progress,
    exit,
    light: range(progress, 0.18, 0.68) * (1 - returnToStudio),
  };
}
