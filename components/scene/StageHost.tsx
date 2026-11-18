"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/* Three.js loads after the page has painted and never blocks the HTML. */
const Stage = dynamic(() => import("./Stage"), { ssr: false });

/** On phones the 3D waits this long after load if nobody has touched the page yet. */
const PHONE_DELAY = 2500;

/**
 * While the entrance reveal plays (html[data-intro="play"]), the 3D stage
 * waits: building it takes the main thread, which would stutter the reveal.
 * It mounts as soon as the reveal hands the page over.
 *
 * On phones (under 900px) it also waits for the first touch, scroll or key,
 * or PHONE_DELAY after the page has loaded, so the page itself is ready and
 * responsive first.
 */
export function StageHost() {
  const [go, setGo] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    // Fetch the 3D code during the reveal; only building it has to wait.
    void import("./Stage");
    const phone = window.innerWidth < 900;
    let woken = !phone;
    let timer = 0;
    const check = () => {
      if (woken && html.dataset.intro !== "play") setGo(true);
    };
    const wake = () => {
      if (woken) return;
      woken = true;
      check();
    };
    const events = ["pointerdown", "touchstart", "wheel", "scroll", "keydown"] as const;
    const later = () => {
      timer = window.setTimeout(wake, PHONE_DELAY);
    };
    if (phone) {
      events.forEach((e) => window.addEventListener(e, wake, { once: true, passive: true }));
      if (document.readyState === "complete") later();
      else window.addEventListener("load", later, { once: true });
    }
    const id = requestAnimationFrame(check);
    const observer = new MutationObserver(check);
    observer.observe(html, { attributes: true, attributeFilter: ["data-intro"] });
    return () => {
      cancelAnimationFrame(id);
      observer.disconnect();
      window.clearTimeout(timer);
      window.removeEventListener("load", later);
      events.forEach((e) => window.removeEventListener(e, wake));
    };
  }, []);

  return go ? <Stage /> : null;
}
