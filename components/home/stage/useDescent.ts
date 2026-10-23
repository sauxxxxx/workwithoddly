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
    // What each layer last showed: only a layer whose own state changed is
    // written, so the off-frame scenes cost nothing while one scene moves.
    const shown = layers.map(() => ({ key: "", visible: "", active: "" }));
    let lastVh = 0;
    // Read on resize only: reading it every frame, right after the previous
    // frame's style writes, forces a synchronous layout.
    let vh = window.innerHeight;
    const onResize = () => {
      vh = window.innerHeight;
    };
    window.addEventListener("resize", onResize, { passive: true });

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
      const resized = vh !== lastVh;
      lastVh = vh;
      layers.forEach(({ id, layer, ride, settle }, i) => {
        const d = sceneDescent(id);
        const was = shown[i];
        const visible = !!d && d.visible;
        const vis = visible ? "visible" : "hidden";
        if (vis !== was.visible) layer.style.visibility = was.visible = vis;
        const active = String(visible && !!d && d.copy > 0.5);
        if (active !== was.active) layer.dataset.active = was.active = active;
        // Hidden layers keep their last transform; nothing to write.
        if (!d || !visible) return;
        const key = `${d.offset.toFixed(4)}:${d.copy.toFixed(3)}`;
        if (key === was.key && !resized) return;
        was.key = key;
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
      window.removeEventListener("resize", onResize);
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
