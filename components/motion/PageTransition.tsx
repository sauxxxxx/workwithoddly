"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { smooth } from "./smooth";
import s from "./page-transition.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

export type Leave = {
  href: string;
  label: string;
  /** Where the coral circle starts (viewport px) and how big; default: the centre, from nothing. */
  origin?: { x: number; y: number; r?: number };
};

/** Open another page through the coral iris (see PageTransition). */
export const leaveTo = (detail: Leave) => window.dispatchEvent(new CustomEvent<Leave>("oddly:leave", { detail }));

const SCROLL_KEYS = new Set([" ", "PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End"]);

/* Swallow scrolling input without locking overflow: a stopped Lenis clips the
   root (`overflow: clip`), and a clipped root cannot be scrolled back to the
   top, by us or by Next. Capturing on window runs ahead of Lenis's listener. */
function blockScrolling() {
  const stop = (e: Event) => {
    e.preventDefault();
    e.stopImmediatePropagation();
  };
  const keys = (e: KeyboardEvent) => {
    if (SCROLL_KEYS.has(e.key)) stop(e);
  };
  const opts = { capture: true, passive: false };
  window.addEventListener("wheel", stop, opts);
  window.addEventListener("touchmove", stop, opts);
  window.addEventListener("keydown", keys, opts);
  return () => {
    window.removeEventListener("wheel", stop, opts);
    window.removeEventListener("touchmove", stop, opts);
    window.removeEventListener("keydown", keys, opts);
  };
}

const circle = (r: number, x: number, y: number) => `circle(${r.toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px)`;

/** Radius that covers the whole viewport from (x, y). */
const reach = (x: number, y: number) =>
  Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) + 8;

/**
 * Page changes: the coral dot iris. Lives in the layout, so it outlasts the
 * page it leaves. A coral circle grows from where the reader asked to go —
 * the next-page ring, or the link they clicked — until it floods the screen;
 * the route changes underneath; then the circle closes into the new page's
 * coral heading dot while the heading's lines rise out of their masks. The
 * brand's dot opens one page and becomes the full stop of the next.
 *
 * Every internal link goes through it (a capture-phase click listener; Next's
 * Link stands down when the click is already handled). Back/forward and first
 * load do not: history steps fade the opening in place, the first load
 * belongs to the intro.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const cover = useRef<HTMLDivElement>(null);
  const pending = useRef<{ unblock: () => void; x: number; y: number } | null>(null);
  const last = useRef<string | null>(null);
  // Links open a page at its top; back/forward returns to where the reader
  // was on that page (null = not a history step).
  const restore = useRef<number | null>(null);

  useEffect(() => {
    const seen = new Map<string, number>();
    const onScroll = () => seen.set(window.location.pathname, window.scrollY);
    // Read before anything on the arriving page scrolls and overwrites it.
    const onPop = () => {
      restore.current = seen.get(window.location.pathname) ?? 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  // Internal links: the iris starts at the click.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;
      if ((a.target && a.target !== "_self") || a.hasAttribute("download") || a.dataset.transition === "own") return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.hash || url.pathname === window.location.pathname) return;
      if (/\.[a-z0-9]+$/i.test(url.pathname)) return;
      e.preventDefault();
      let { clientX: x, clientY: y } = e;
      // Keyboard activation has no pointer: start from the link itself.
      if (x === 0 && y === 0) {
        const r = a.getBoundingClientRect();
        x = r.left + r.width / 2;
        y = r.top + r.height / 2;
      }
      leaveTo({ href: url.pathname + url.search, label: a.textContent?.trim() ?? "", origin: { x, y } });
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, []);

  // Leaving: the coral floods out from the origin, then the route changes.
  useEffect(() => {
    const onLeave = (e: Event) => {
      const { href, origin } = (e as CustomEvent<Leave>).detail;
      const el = cover.current;
      if (pending.current || !el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(href);
        return;
      }
      const x = origin?.x ?? window.innerWidth / 2;
      const y = origin?.y ?? window.innerHeight / 2;
      pending.current = { unblock: blockScrolling(), x, y };
      gsap.fromTo(
        el,
        { visibility: "visible", clipPath: circle(origin?.r ?? 0, x, y) },
        {
          clipPath: circle(reach(x, y), x, y),
          duration: 0.6,
          ease: "power3.in",
          // We place the new page ourselves once it is in (below).
          onComplete: () => router.push(href, { scroll: false }),
        },
      );
    };
    window.addEventListener("oddly:leave", onLeave);
    return () => window.removeEventListener("oddly:leave", onLeave);
  }, [router]);

  // Arriving: before the first paint of a new route.
  useLayoutEffect(() => {
    // First load (and Strict Mode's second run of it): nothing to enter from.
    if (last.current === null || last.current === pathname) {
      last.current = pathname;
      return;
    }
    last.current = pathname;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chain = pending.current;
    const el = cover.current;
    const back = restore.current;
    restore.current = null;

    // Next keeps the old scroll position whenever any of the new page is
    // visible there, so a card clicked deep in a list would open the next
    // page at its footer. Place the page ourselves: the top for a link, the
    // reader's last position for back/forward.
    const place = (y: number) => {
      smooth.lenis?.scrollTo(y, { immediate: true, force: true });
      window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
    };
    let settle = 0;
    if (!chain && !window.location.hash) {
      const y = back ?? 0;
      place(y);
      // Once more after Next's own scroll handling and the new page's Lenis.
      settle = requestAnimationFrame(() => {
        place(y);
        ScrollTrigger.refresh();
      });
    }

    const ctx = gsap.context(() => {});

    if (reduced) {
      chain?.unblock();
      pending.current = null;
      if (el) gsap.set(el, { visibility: "hidden" });
      return () => cancelAnimationFrame(settle);
    }
    if (!chain || !el) {
      // A history step: the opening fades in where it stands.
      ctx.add(() =>
        gsap.fromTo(
          gsap.utils.toArray<HTMLElement>("main [data-enter]"),
          { opacity: 0 },
          { opacity: 1, duration: 0.45, ease: "power2.out", stagger: 0.04, clearProps: "opacity" },
        ),
      );
      return () => {
        cancelAnimationFrame(settle);
        ctx.revert();
      };
    }

    // Hidden by the coral for now; set before the first paint.
    ctx.add(() => gsap.set("main [data-enter]", { opacity: 0 }));
    let split: SplitText | null = null;
    // Two frames: the new page is laid out and ScrollRuntime has its new Lenis.
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => {
        place(0);
        ScrollTrigger.refresh();
        const heading = document.querySelector<HTMLElement>('main [data-enter="word"]');
        // The circle closes into the heading's coral dot (or its first line).
        const dot = document.querySelector<HTMLElement>("main h1 .dot");
        const mark = (dot ?? heading)?.getBoundingClientRect();
        const tx = mark ? (dot ? mark.left + mark.width / 2 : mark.left) : window.innerWidth / 2;
        const ty = mark ? (dot ? mark.top + mark.height / 2 : mark.top + mark.height / 2) : window.innerHeight / 2;
        const tr = dot && mark ? mark.width / 2 : 0;
        const rest = gsap.utils.toArray<HTMLElement>('main [data-enter]:not([data-enter="word"])');

        const tl = gsap.timeline({
          onComplete: () => {
            split?.revert();
            split = null;
            chain.unblock();
            pending.current = null;
            gsap.set(el, { visibility: "hidden", clearProps: "clipPath" });
          },
        });
        tl.fromTo(el, { clipPath: circle(reach(chain.x, chain.y), chain.x, chain.y) }, { clipPath: circle(tr, tx, ty), duration: 0.9, ease: "power3.inOut" }, 0.05);
        if (heading) {
          split = SplitText.create(heading, { type: "lines", mask: "lines" });
          tl.set(heading, { opacity: 1 }, 0);
          tl.fromTo(split.lines, { yPercent: 108 }, { yPercent: 0, duration: 0.85, ease: "power3.out", stagger: 0.07 }, 0.12);
        }
        tl.fromTo(rest, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.05, clearProps: "opacity,transform" }, 0.45);
      });
    });
    return () => {
      cancelAnimationFrame(raf);
      split?.revert();
      ctx.revert();
    };
  }, [pathname]);

  return <div ref={cover} className={s.cover} aria-hidden="true" />;
}
