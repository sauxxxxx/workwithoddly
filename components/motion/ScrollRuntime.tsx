"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** One scroll clock for DOM choreography and the persistent sculpture stage. */
export function ScrollRuntime() {
  const pathname = usePathname();
  useEffect(() => {
    const motion = gsap.matchMedia();
    motion.add(
      "(prefers-reduced-motion: no-preference) and (pointer: fine)",
      () => {
        const scroll = new Lenis({
          lerp: 0.085,
          smoothWheel: true,
          syncTouch: false,
          anchors: { offset: -88, duration: 1.25 },
          prevent: (node) => node.closest("[data-scroll-native]") !== null,
        });
        const tick = (time: number) => scroll.raf(time * 1000);
        scroll.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(tick);
        const lock = () => {
          if (document.documentElement.style.overflow === "hidden")
            scroll.stop();
          else scroll.start();
        };
        const observer = new MutationObserver(lock);
        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["style"],
        });
        lock();
        return () => {
          observer.disconnect();
          gsap.ticker.remove(tick);
          scroll.destroy();
        };
      },
    );
    return () => motion.revert();
  }, [pathname]);
  return null;
}
