"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { smooth } from "./smooth";

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
        smooth.lenis = scroll;
        return () => {
          if (smooth.lenis === scroll) smooth.lenis = null;
          observer.disconnect();
          gsap.ticker.remove(tick);
          scroll.destroy();
        };
      },
    );
    // Scroll speed as `--speed` on the root (about ±1 at a brisk scroll, 0 at
    // rest): cards marked `data-speed-tilt` lean with it, the reel card bends.
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      const root = document.documentElement;
      let raf = 0;
      let prev = window.scrollY;
      let speed = 0;
      let written = "";
      const frame = () => {
        raf = requestAnimationFrame(frame);
        const y = window.scrollY;
        const raw = Math.max(-1.5, Math.min(1.5, (y - prev) / 40));
        prev = y;
        speed += (raw - speed) * 0.12;
        const value = Math.abs(speed) < 0.004 ? "0" : speed.toFixed(3);
        if (value !== written) {
          written = value;
          root.style.setProperty("--speed", value);
        }
      };
      raf = requestAnimationFrame(frame);
      return () => {
        cancelAnimationFrame(raf);
        root.style.removeProperty("--speed");
      };
    });
    return () => motion.revert();
  }, [pathname]);
  return null;
}
