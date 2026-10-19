import { gsap } from "gsap";

/**
 * Project scenes: the word drifts across its scene (the piece holds still in
 * the 3D layer, so the two read at different depths) and the edge copy rises
 * in as the scene settles.
 */
export function projectMotion(compact: boolean) {
  gsap.utils.toArray<HTMLElement>("[data-project-scene]").forEach((scene) => {
    const rail = scene.querySelectorAll<HTMLElement>("[data-scene-rail]");
    const meta = scene.querySelector<HTMLElement>("[data-scene-meta]");
    const dir = scene.dataset.side === "left" ? -1 : 1;
    if (rail.length) {
      gsap.fromTo(
        rail,
        { xPercent: dir * (compact ? 1.5 : 4.5) },
        {
          xPercent: -dir * (compact ? 1.5 : 4.5),
          ease: "none",
          scrollTrigger: { trigger: scene, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    }
    if (meta) {
      gsap.fromTo(
        meta.children,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: scene, start: "top 35%", toggleActions: "play none none reverse" },
        },
      );
    }
  });
}
