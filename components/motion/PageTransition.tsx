"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Wordmark } from "@/components/Wordmark";
import { smooth } from "./smooth";
import s from "./page-transition.module.css";

gsap.registerPlugin(ScrollTrigger);

export type Leave = { href: string; label: string };

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
 * Page changes, Lusion-fashion. Lives in the layout, so it outlasts the page
 * it leaves: on `oddly:leave` a charcoal cover sweeps up with the wordmark and
 * the next page's name, the route changes behind it, the new page is set at
 * its top, and the cover sweeps off while the page's hero rises in.
 *
 * The entrance (elements marked `data-enter`, the giant word as
 * `data-enter="word"`) also plays, without a cover, after any other client
 * navigation; never on first load, which belongs to the intro.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const cover = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
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

  // Leaving: cover in, then change the route underneath it.
  useEffect(() => {
    const onLeave = (e: Event) => {
      const { href, label } = (e as CustomEvent<Leave>).detail;
      const el = cover.current;
      if (pending.current || !el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(href);
        return;
      }
      setLabel(label);
      pending.current = { unblock: blockScrolling() };
      gsap
        .timeline()
        .set(el, { visibility: "visible", clipPath: "inset(100% 0% 0% 0%)" })
        .to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "power3.inOut" }, 0)
        .fromTo(el.querySelectorAll("[data-cover-rise]"), { yPercent: 110 }, { yPercent: 0, duration: 0.5, stagger: 0.07, ease: "power3.out" }, 0.22)
        // We place the new page ourselves once it is in (below).
        .add(() => router.push(href, { scroll: false }), 0.62);
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
    const entrance = () =>
      ctx.add(() => {
        const words = gsap.utils.toArray<HTMLElement>('main [data-enter="word"]');
        const rest = gsap.utils.toArray<HTMLElement>('main [data-enter]:not([data-enter="word"])');
        return gsap
          .timeline()
          .fromTo(words, { y: 110, opacity: 0, scale: 1.06 }, { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power3.out", clearProps: "transform,opacity" }, 0)
          .fromTo(rest, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.06, clearProps: "transform,opacity" }, 0.2);
      });

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

    // Hold the entrance pieces down while the cover is still up.
    ctx.add(() => {
      gsap.set('main [data-enter="word"]', { y: 110, opacity: 0, scale: 1.06 });
      gsap.set('main [data-enter]:not([data-enter="word"])', { y: 28, opacity: 0 });
    });
    // Two frames: the new page is laid out and ScrollRuntime has its new Lenis.
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => {
        toTop();
        ScrollTrigger.refresh();
        gsap
          .timeline({
            onComplete: () => {
              chain.unblock();
              pending.current = null;
              gsap.set(el, { visibility: "hidden" });
            },
          })
          .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.75, ease: "power3.inOut" }, 0.08)
          .add(() => {
            entrance();
          }, 0.3);
      });
    });
    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [pathname]);

  return (
    <div ref={cover} className={s.cover} aria-hidden="true">
      <span className={s.mask}>
        <span className={s.rise} data-cover-rise>
          <Wordmark className={s.mark} ink="var(--cream)" />
        </span>
      </span>
      <span className={s.mask}>
        <span className={`${s.rise} ${s.label}`} data-cover-rise>
          Next · {label}
        </span>
      </span>
    </div>
  );
}
