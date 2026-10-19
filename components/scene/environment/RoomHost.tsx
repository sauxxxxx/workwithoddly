"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import s from "./room.module.css";

const Environment = dynamic(() => import("./StudioEnvironment"), {
  ssr: false,
});
class RoomBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Decorative background is below both HTML type planes and the transparent sculpture stage. */
export function RoomHost() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<{
    reduced: boolean;
    compact: boolean;
  } | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion:reduce)");
    const update = () =>
      setSettings({ reduced: query.matches, compact: innerWidth < 900 });
    const id = requestAnimationFrame(update);
    addEventListener("resize", update, { passive: true });
    query.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(id);
      removeEventListener("resize", update);
      query.removeEventListener("change", update);
    };
  }, []);
  if (pathname !== "/") return null;
  return (
    <div className={s.room} aria-hidden="true" data-studio-room>
      {settings && !failed && (
        <RoomBoundary>
          <Environment {...settings} onFailure={() => setFailed(true)} />
        </RoomBoundary>
      )}
      <div className={s.texture} />
    </div>
  );
}
