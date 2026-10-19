"use client";

import dynamic from "next/dynamic";

/* Three.js loads after the page has painted and never blocks the HTML. */
const Stage = dynamic(() => import("./Stage"), { ssr: false });

export function StageHost() {
  return <Stage />;
}
