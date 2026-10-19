"use client";

import { useEffect, useState } from "react";
import { sound } from "./engine";

/**
 * Round sound control for the nav. Off until pressed; a previous "on" choice
 * is remembered and shown as a hint, but audio only starts on a click (as
 * browsers require).
 */
export function SoundToggle({ className }: { className?: string }) {
  const [on, setOn] = useState(false);
  const [hint, setHint] = useState(false);

  useEffect(() => {
    const off = sound.subscribe(setOn);
    // Remembered preference is surfaced as a gentle pulse, never auto-played.
    const id = requestAnimationFrame(() => setHint(sound.storedPreference()));
    return () => {
      off();
      cancelAnimationFrame(id);
    };
  }, []);

  return (
    <button
      type="button"
      className={className}
      aria-pressed={on}
      data-hint={hint && !on}
      onClick={() => {
        setHint(false);
        void sound.setEnabled(!on);
      }}
    >
      <span className="sr-only">{on ? "Turn sound off" : "Turn sound on"}</span>
      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" aria-hidden="true">
        {on ? (
          <path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2" />
        ) : (
          <path d="M4 12h2M8 12h2M12 12h2M16 12h2M20 12h0.5" />
        )}
      </svg>
    </button>
  );
}
