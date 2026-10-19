"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { openingMotion } from "./motion/opening-motion";
import { chapterMotion } from "./motion/chapter-motion";
import { sequenceMotion } from "./motion/sequence-motion";
import { projectMotion } from "./motion/project-motion";

gsap.registerPlugin(ScrollTrigger);

/** One reversible motion context; reduced motion keeps the finished still compositions. */
export function HomeMotion() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    let active = true;
    const setup = (compact: boolean) => {
      openingMotion(compact);
      const cleanup = sequenceMotion(compact);
      chapterMotion(compact);
      projectMotion(compact);
      return cleanup;
    };
    mm.add(
      "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
      () => setup(false),
    );
    mm.add(
      "(max-width: 899px) and (prefers-reduced-motion: no-preference)",
      () => setup(true),
    );
    document.fonts?.ready.then(() => {
      if (active) ScrollTrigger.refresh();
    });
    return () => {
      active = false;
      mm.revert();
    };
  }, []);

  return null;
}
