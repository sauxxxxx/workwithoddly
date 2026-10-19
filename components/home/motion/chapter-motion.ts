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
  gsap.utils.toArray<HTMLElement>("[data-service-list]").forEach((list) => {
    gsap.fromTo(
      list.children,
      { y: compact ? 12 : 22 },
      {
        y: 0,
        duration: 0.85,
        stagger: 0.065,
        ease: "power3.out",
        scrollTrigger: {
          trigger: list,
          start: "top 95%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });
  const studies = gsap.timeline({
    scrollTrigger: {
      trigger: "#creative",
      start: "top 85%",
      end: compact ? "top 5%" : "top top",
      scrub: true,
    },
  });
  studies.fromTo(
    '[data-study="first"]',
    { y: compact ? 30 : 90, rotation: -15 },
    { y: 0, rotation: -7, ease: "none" },
    0,
  );
  studies.fromTo(
    '[data-study="second"]',
    { y: compact ? 64 : 180, rotation: 14 },
    { y: 0, rotation: 5, ease: "none" },
    0.12,
  );
  gsap.fromTo(
    "[data-product-strip]",
    { y: compact ? 24 : 70 },
    {
      y: 0,
      ease: "none",
      scrollTrigger: {
        trigger: "[data-product-strip]",
        start: "top bottom",
        end: "top 35%",
        scrub: true,
      },
    },
  );
}
