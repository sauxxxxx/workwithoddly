"use client";

import { useEffect, type RefObject } from "react";
import { sceneDescent } from "@/components/scene/descent";

/**
 * Drives the DOM side of the descent (components/scene/descent.ts) inside
 * `root`. Each `[data-descent="<scene id>"]` layer belongs to one scene:
 *   [data-ride]   moves down the screen with the scene (and grows as it leaves)
 *   [data-settle] the copy, shown only while the scene is near the centre
 * The layer itself is hidden while its scene is off-frame. With reduced motion
 * the scenes swap in place (descent.ts returns no travel).
 */
export function useDescent(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-descent]")).map((layer) => ({
      layer,
      id: layer.dataset.descent as string,
      ride: Array.from(layer.querySelectorAll<HTMLElement>("[data-ride]")),
      settle: Array.from(layer.querySelectorAll<HTMLElement>("[data-settle]")),
    }));

    let raf = 0;
    let last = "";

    const clear = () => {
      for (const { layer, ride, settle } of layers) {
        layer.style.visibility = "";
        layer.dataset.active = "true";
        for (const n of [...ride, ...settle]) {
          n.style.transform = "";
          n.style.opacity = "";
        }
      }
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const vh = window.innerHeight;
      const states = layers.map(({ id }) => sceneDescent(id));
      const key = states.map((d) => (d ? `${d.offset.toFixed(4)}:${d.copy.toFixed(3)}` : "-")).join("|") + vh;
      if (key === last) return;
      last = key;
      layers.forEach(({ layer, ride, settle }, i) => {
        const d = states[i];
        const visible = !!d && d.visible;
        layer.style.visibility = visible ? "visible" : "hidden";
        layer.dataset.active = String(visible && !!d && d.copy > 0.5);
        if (!d) return;
        const y = d.offset * vh;
        for (const n of ride) n.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) scale(${d.grow.toFixed(4)})`;
        for (const n of settle) {
          n.style.opacity = d.copy.toFixed(3);
          n.style.transform = `translate3d(0, ${((1 - d.copy) * 16).toFixed(1)}px, 0)`;
        }
      });
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      clear();
    };
  }, [root]);
}

/** Scroll to the middle of a scene's span (its drift), e.g. when a link inside it takes focus. */
export function centreScene(marker: HTMLElement | null | undefined) {
  if (!marker) return;
  const r = marker.getBoundingClientRect();
  window.scrollTo({ top: r.top + window.scrollY + r.height * 0.5, behavior: "instant" as ScrollBehavior });
}
