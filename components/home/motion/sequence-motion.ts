import { gsap } from "gsap";

/**
 * Statement → reel card → full screen (the Lusion move).
 *
 * The card is laid out full-size and clipped to a frame held in four custom
 * properties on the project layer; the registration marks and caption read
 * the same properties, so they stay exactly under the card as it grows.
 * Tweening the clip-path string directly breaks (browsers serialise symmetric
 * insets as three values, which GSAP misreads), hence the numbers.
 */
export function sequenceMotion(compact: boolean) {
  if (compact) return;
  const project = document.querySelector<HTMLElement>("[data-sequence-project]");
  if (!project) return;

  let full = false;
  const update = (progress: number) => {
    // Hidden from keyboard and screen readers until the card has arrived.
    const away = progress < 0.3;
    project.toggleAttribute("inert", away);
    project.setAttribute("aria-hidden", String(away));
    // Tell the media whether the card fills the screen.
    const open = progress > 0.86;
    if (open !== full) {
      full = open;
      window.dispatchEvent(new CustomEvent("oddly:reveal", { detail: open }));
    }
  };

  const INSET = 12; // the card's own inset from the viewport
  // The card at rest: wide, centred, at most half as tall as it is wide.
  const card = () => {
    const W = window.innerWidth;
    const H = Math.max(window.innerHeight, 600);
    const w = Math.min(W * 0.8, 1180);
    const h = Math.min(w / 2, H * 0.56);
    const cy = H * 0.47;
    return {
      "--ct": `${cy - h / 2 - INSET}px`,
      "--cs": `${(W - w) / 2 - INSET}px`,
      "--cb": `${H - (cy + h / 2) - INSET}px`,
      "--cr": "24px",
    };
  };
  const screen = { "--ct": "0px", "--cs": "0px", "--cb": "0px", "--cr": "14px" };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "[data-opening-sequence]",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => update(self.progress),
      onRefresh: (self) => update(self.progress),
    },
  });

  // 1. The statement leaves (the loop floats off in the 3D layer meanwhile).
  tl.to("[data-sequence-story]", { y: -60, opacity: 0, filter: "blur(2px)", ease: "none", duration: 0.17 }, 0.13);
  tl.to("[data-sequence-form]", { opacity: 0, duration: 0.15 }, 0.2);

  // 2. The card rises in, already at its resting frame.
  tl.set(project, { ...card() }, 0);
  tl.fromTo(project, { opacity: 0, y: 90 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.18 }, 0.3);
  tl.fromTo("[data-reel-title]", { scale: 0.94 }, { scale: 1, ease: "power2.out", duration: 0.25 }, 0.3);
  // It arrives bent, tipped toward you, and flattens as it settles.
  tl.fromTo("[data-sequence-window]", { "--bend": 1 }, { "--bend": 0, ease: "power2.out", duration: 0.24 }, 0.28);
  // The two words come in from either side and close around the play pill.
  tl.fromTo(
    "[data-reel-word]",
    { x: (_: number, el: HTMLElement) => Number(el.dataset.reelWord) * window.innerWidth * 0.2, opacity: 0.2 },
    { x: 0, opacity: 1, ease: "power3.out", duration: 0.24 },
    0.3,
  );
  // `--pop` drives the CSS `scale` property, leaving `transform` to the hover.
  tl.fromTo("[data-reel-pill]", { "--pop": 0.3, opacity: 0 }, { "--pop": 1, opacity: 1, ease: "back.out(1.6)", duration: 0.14 }, 0.42);

  // 3. It grows evenly to the whole screen; marks and caption step aside.
  tl.to(["[data-sequence-marks]", "[data-sequence-caption]"], { opacity: 0, y: 24, ease: "power1.in", duration: 0.1 }, 0.55);
  tl.fromTo(project, { ...card(), immediateRender: false }, { ...screen, ease: "power2.inOut", duration: 0.3 }, 0.55);
  // Full screen, it barely leans with the scroll, so its edges never show.
  tl.fromTo("[data-sequence-window]", { "--give": 1 }, { "--give": 0.15, ease: "none", duration: 0.3, immediateRender: false }, 0.55);

  // 4. As it fills the screen our title steps back, leaving the site's own
  //    hero headline (it is in the footage); then one quiet row arrives.
  tl.to("[data-reel-title]", { autoAlpha: 0, y: -30, ease: "power1.in", duration: 0.08 }, 0.64);
  tl.fromTo("[data-sequence-shade]", { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.08 }, 0.84);
  tl.fromTo("[data-sequence-meta]", { opacity: 0, y: 24 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.08 }, 0.86);

  // Keyboard: tabbing into the card brings it on screen, so focus never lands on something hidden.
  const onFocus = () => {
    const st = tl.scrollTrigger;
    if (!st || (st.progress > 0.3 && st.progress < 0.95)) return;
    window.scrollTo({ top: st.start + (st.end - st.start) * 0.45, behavior: "instant" as ScrollBehavior });
  };
  project.addEventListener("focusin", onFocus);

  return () => {
    project.removeEventListener("focusin", onFocus);
    project.removeAttribute("inert");
    project.removeAttribute("aria-hidden");
  };
}
