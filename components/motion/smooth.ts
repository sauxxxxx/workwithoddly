import type Lenis from "lenis";

/** The live smooth-scroll instance (null on touch, reduced motion, or between pages). */
export const smooth = { lenis: null as Lenis | null };
