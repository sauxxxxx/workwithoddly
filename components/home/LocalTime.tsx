"use client";

import { useEffect, useState } from "react";

/** The studio's current local time, rendered client-side to avoid a server/client mismatch. */
export function LocalTime({ timeZone }: { timeZone: string }) {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 20_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return (
    <time suppressHydrationWarning>
      {now ?? "--:--"} <span style={{ color: "var(--ink-mute)" }}>GMT+8</span>
    </time>
  );
}
