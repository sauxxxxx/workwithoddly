"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { smooth } from "./smooth";
import s from "./page-transition.module.css";

gsap.registerPlugin(ScrollTrigger);

export type Leave = {
  href: string;
  label: string;
  /** The band on screen; the cover copies it so the swap is invisible. */
  from?: HTMLElement;
};

/** Open another page behind the cover (see PageTransition). */
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

/**
 * Page changes, Lusion's pull-through. Lives in the layout, so it outlasts the
 * page it leaves. Every page ends in a band set like the next page's opening
 * (NextPage); on `oddly:leave` that band, now filling the screen, is copied
 * onto a cover that looks exactly the same, the route changes underneath, the
 * new page is set at its top, and the cover fades away to show it. Nothing
 * slides or rises: it reads as one page that keeps going.
 *
 * After any other client navigation the new page's opening (elements marked
 * `data-enter`) fades in where it stands; never on first load, which belongs
 * to the intro.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const cover = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const pending = useRef<{ unblock: () => void } | null>(null);
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

  // Leaving: the screen as it stands onto the cover, then change the route.
  useEffect(() => {
    const onLeave = (e: Event) => {
      const { href, from } = (e as CustomEvent<Leave>).detail;
      const el = cover.current;
      const into = slot.current;
      if (pending.current || !el || !into) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(href);
        return;
      }
      pending.current = { unblock: blockScrolling() };
      // We place the new page ourselves once it is in (below).
      const go = () => router.push(href, { scroll: false });
      if (from) {
        const rect = from.getBoundingClientRect();
        const copy = from.cloneNode(true) as HTMLElement;
        copy.removeAttribute("id");
        copy.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
        copy.setAttribute("inert", "");
        Object.assign(copy.style, {
          position: "absolute",
          top: `${rect.top}px`,
          left: "0px",
          width: "100%",
          height: `${rect.height}px`,
          minHeight: "0px",
          margin: "0px",
        });
        into.replaceChildren(copy);
        gsap.set(el, { visibility: "visible", opacity: 1 });
        requestAnimationFrame(go);
      } else {
        into.replaceChildren();
        gsap.fromTo(el, { visibility: "visible", opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out", onComplete: go });
      }
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
    const toTop = () => place(0);
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
    // The opening fades in where it stands: no rise, no scale.
    const entrance = () =>
      ctx.add(() =>
        gsap.fromTo(
          gsap.utils.toArray<HTMLElement>("main [data-enter]"),
          { opacity: 0 },
          { opacity: 1, duration: 0.45, ease: "power2.out", stagger: 0.04, clearProps: "opacity" },
        ),
      );

    if (reduced) {
      chain?.unblock();
      pending.current = null;
      return () => cancelAnimationFrame(settle);
    }
    if (!chain || !el) {
      entrance();
      return () => {
        cancelAnimationFrame(settle);
        ctx.revert();
      };
    }

    // Two frames: the new page is laid out and ScrollRuntime has its new Lenis.
    // The cover still shows the band, which matches this page's opening; it
    // fades off to reveal it.
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => {
        toTop();
        ScrollTrigger.refresh();
        gsap.to(el, {
          opacity: 0,
          duration: 0.45,
          ease: "power2.out",
          delay: 0.05,
          onComplete: () => {
            chain.unblock();
            pending.current = null;
            gsap.set(el, { visibility: "hidden" });
            slot.current?.replaceChildren();
          },
        });
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return (
    <div ref={cover} className={s.cover} aria-hidden="true">
      <div ref={slot} className={s.slot} />
    </div>
  );
}
