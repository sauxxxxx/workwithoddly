"use client";

import { Component, useCallback, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Installation } from "./Installation";
import { measureMarkers, sceneIdAt, track, updateTrack } from "./track";
import { CAMERA } from "./choreography";
import type { Quality } from "./geometry";
import styles from "./stage.module.css";
import { journey } from "./journey";

gsap.registerPlugin(ScrollTrigger);

/** WebGL failure of any kind drops to the static still — the page never depends on it. */
class StageBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    const context = c.getContext("webgl2") || c.getContext("webgl");
    const available = !!context;
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    return available;
  } catch {
    return false;
  }
}

function pickQuality(): Quality {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const small = window.innerWidth < 760;
  const weak = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
  return small || weak ? "low" : "high";
}

const isCompact = () => window.innerWidth < 900 || window.innerWidth / window.innerHeight < 0.78;

/** Static stand-in when real-time 3D is unavailable: a pre-rendered still of the opening composition. */
function Still() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return (
    <div className={styles.still} aria-hidden="true">
      <picture>
        <source media="(max-width: 759px)" srcSet="/stills/opening-mobile.webp" />
        <img src="/stills/opening-desktop.webp" alt="" />
      </picture>
    </div>
  );
}

export default function Stage() {
  const pathname = usePathname();
  // This component only ever renders in the browser (loaded with ssr: false),
  // so capabilities are read once, synchronously, as initial state.
  const [mode, setMode] = useState<"live" | "still">(() => (hasWebGL() ? "live" : "still"));
  const [quality] = useState<Quality>(pickQuality);
  const [compact, setCompact] = useState(isCompact);
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [ready, setReady] = useState(false);
  const [pastOpening, setPastOpening] = useState(false);
  const [pastLiveScenes, setPastLiveScenes] = useState(false);
  const [dpr, setDpr] = useState(() =>
    Math.min(window.devicePixelRatio || 1, window.innerWidth < 760 ? 1.5 : 1.75),
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReduced(mq.matches);
      setCompact(isCompact());
    };

    const onResize = () => setCompact(isCompact());
    mq.addEventListener("change", apply);
    window.addEventListener("resize", onResize);
    return () => {
      mq.removeEventListener("change", apply);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /* Scroll bridge: ScrollTrigger owns refresh timing; the track owns the maths. */
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        updateTrack(self.scroll());
        setPastOpening(self.scroll() > window.innerHeight * 0.55);
        {
          // Phones keep the live canvas for the opening and the project scenes (one piece each).
          const current = sceneIdAt(track.t > 0.5 ? track.to : track.from);
          const live = ["hero", "studio"].includes(current) || current.startsWith("p-");
          setPastLiveScenes(!live || (current === "studio" && journey().active && journey().progress > .3));
        }
      },
    });
    const onRefresh = () => measureMarkers();
    ScrollTrigger.addEventListener("refresh", onRefresh);

    // Layout changes (fonts, media, route content) re-measure the markers.
    let timer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 160);
    });
    ro.observe(document.body);
    measureMarkers();

    return () => {
      st.kill();
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      ro.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  /* New route, new markers — the canvas itself is never remounted. */
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      measureMarkers();
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  const onFirstFrame = useCallback(() => setReady(true), []);

  if (mode === "still") return <Still />;

  const hidden = (reduced && (pastOpening || pathname !== "/")) || (compact && pastLiveScenes && pathname === "/");

  return (
    <div
      className={styles.stage}
      data-live-stage
      data-ready={ready}
      data-hidden={hidden}
      aria-hidden="true"
      data-track-version={track.version}
    >
      <StageBoundary fallback={<Still />}>
        <Canvas
          frameloop={hidden ? "never" : "always"}
          dpr={dpr}
          shadows={quality === "high" ? "percentage" : false}
          camera={{ fov: CAMERA.fov, position: [0, 0, CAMERA.z], near: 0.1, far: 60 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
            toneMapping: THREE.NeutralToneMapping,
            toneMappingExposure: 1.0,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
            gl.domElement.addEventListener("webglcontextlost", () => setMode("still"), { once: true });
          }}
        >
          <PerformanceMonitor
            onDecline={() => setDpr(1)}
            onIncline={() => setDpr((d) => Math.min(d, 1.75))}
          />
          <Installation
            quality={quality}
            compact={compact}
            reducedMotion={reduced}
            onFirstFrame={onFirstFrame}
          />
        </Canvas>
      </StageBoundary>
    </div>
  );
}
