import { gsap } from "gsap";

export function chapterMotion(compact: boolean) {
  gsap.utils
    .toArray<HTMLElement>("[data-reveal-heading]")
    .forEach((heading) => {
      gsap.fromTo(
        heading,
        { y: compact ? 28 : 54 },
        {
          y: 0,
          duration: 1.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 92%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });
}
