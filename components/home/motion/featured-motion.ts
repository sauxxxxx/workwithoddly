import { gsap } from "gsap";

export function featuredMotion(compact: boolean) {
  gsap.fromTo(
    "[data-work-reel]",
    { y: compact ? 24 : 60 },
    {
      y: 0,
      ease: "none",
      scrollTrigger: {
        trigger: "[data-work-detail]",
        start: "top 85%",
        end: "top 10%",
        scrub: true,
      },
    },
  );
  gsap.fromTo(
    "[data-detail-phone]",
    { y: compact ? 18 : 100 },
    {
      y: 0,
      ease: "none",
      scrollTrigger: {
        trigger: "[data-work-detail]",
        start: "top 80%",
        end: "top top",
        scrub: true,
      },
    },
  );
}
