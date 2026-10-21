"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/* Three.js loads after the page has painted and never blocks the HTML. */
const Stage = dynamic(() => import("./Stage"), { ssr: false });

/**
 * While the entrance reveal plays (html[data-intro="play"]), the 3D stage
 * waits: building it takes the main thread, which would stutter the reveal.
 * It mounts as soon as the reveal hands the page over.
 */
export function StageHost() {
  const [go, setGo] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    // Fetch the 3D code during the reveal; only building it has to wait.
    void import("./Stage");
    const check = () => {
      if (html.dataset.intro !== "play") setGo(true);
    };
    const id = requestAnimationFrame(check);
    const observer = new MutationObserver(check);
    observer.observe(html, { attributes: true, attributeFilter: ["data-intro"] });
    return () => {
      cancelAnimationFrame(id);
      observer.disconnect();
    };
  }, []);

  return go ? <Stage /> : null;
}
