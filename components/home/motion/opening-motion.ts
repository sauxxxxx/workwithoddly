import { gsap } from "gsap";

export function openingMotion(compact: boolean) {
  const drift = [-5, 6, -3];
  gsap.utils.toArray<HTMLElement>("[data-hero-line]").forEach((line, index) => {
    gsap.fromTo(
      line,
      { xPercent: 0, scaleX: 1, opacity: 1 },
      {
        xPercent: drift[index] * (compact ? 0.5 : 1),
        scaleX: 1.12,
        opacity: 0.18,
        ease: "none",
        scrollTrigger: {
          trigger: line.closest("section"),
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  });
}
