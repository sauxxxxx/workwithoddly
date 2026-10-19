import { gsap } from "gsap";

/**
 * Statement → frame → full screen.
 *
 * The recording window is laid out full-size and clipped. Its first clip
 * matches the 3D frame the coral loop morphs into (same maths as
 * components/scene/portal-geometry.ts: width min(68vw, 1040px, 104vh),
 * 8:5, centred at 55% of the height); it then opens to the whole window
 * while the 3D rim is covered, and the copy row settles in last.
 */
export function sequenceMotion(compact: boolean) {
  if (compact) return;
  const project = document.querySelector<HTMLElement>("[data-sequence-project]");
  let revealed = false;
  const accessible = (progress: number) => {
    // Tell the recording whether the window fills the screen (it pauses when not).
    const open = progress > 0.86;
    if (open !== revealed) {
      revealed = open;
      window.dispatchEvent(new CustomEvent("oddly:reveal", { detail: open }));
    }
  };
  accessible(0);

  const INSET = 12; // the window's own inset from the viewport
  // The clip is driven through four numeric custom properties (see
  // sequence.module.css). Tweening the clip-path string directly breaks:
  // browsers serialise symmetric insets as three values, which GSAP misreads.
  const frame = (collapsed: boolean) => {
    const W = window.innerWidth;
    const H = Math.max(window.innerHeight, 600);
    const fw = Math.min(W * 0.68, 1040, H * 1.04);
    const fh = fw / 1.6;
    const cy = H * 0.55;
    return {
      "--ct": `${cy - fh / 2 - INSET}px`,
      "--cs": `${collapsed ? (W - 2 * INSET) / 2 : (W - fw) / 2 - INSET}px`,
      "--cb": `${H - (cy + fh / 2) - INSET}px`,
      "--cr": "12px",
    };
  };
  const full = { "--ct": "0px", "--cs": "0px", "--cb": "0px", "--cr": "14px" };

  const sequence = gsap.timeline({
    scrollTrigger: {
      trigger: "[data-opening-sequence]",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => accessible(self.progress),
      onRefresh: (self) => accessible(self.progress),
    },
  });

  sequence.to(
    "[data-sequence-story]",
    { y: -60, opacity: 0, filter: "blur(2px)", ease: "none", duration: 0.17 },
    0.13,
  );
  sequence.to("[data-sequence-form]", { opacity: 0, duration: 0.2 }, 0.48);
  sequence.fromTo(
    "[data-sequence-project]",
    { opacity: 0 },
    { opacity: 1, ease: "none", duration: 0.06 },
    0.5,
  );
  // Open inside the loop's frame…
  sequence.fromTo(
    "[data-sequence-window]",
    { ...frame(true), immediateRender: true },
    { ...frame(false), ease: "power2.inOut", duration: 0.24 },
    0.5,
  );
  // …then grow past it to the whole screen.
  sequence.fromTo(
    "[data-sequence-window]",
    { ...frame(false), immediateRender: false },
    { ...full, ease: "power2.inOut", duration: 0.14 },
    0.78,
  );
  sequence.fromTo("[data-sequence-shade]", { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.08 }, 0.84);
  sequence.fromTo(
    "[data-sequence-meta]",
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, ease: "power2.out", duration: 0.08 },
    0.86,
  );
  sequence.fromTo("[data-sequence-progress]", { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 }, 0);

  // The project stays reachable by keyboard: tabbing into it scrolls to the
  // point where it fills the screen, so focus never lands on something hidden.
  const onFocus = () => {
    const st = sequence.scrollTrigger;
    if (!st || st.progress > 0.9) return;
    window.scrollTo({ top: st.start + (st.end - st.start) * 0.95, behavior: "instant" as ScrollBehavior });
  };
  project?.addEventListener("focusin", onFocus);

  return () => {
    project?.removeEventListener("focusin", onFocus);
  };
}
