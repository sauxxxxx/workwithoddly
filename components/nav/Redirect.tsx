"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * A page that has moved. The static export cannot answer with a real
 * redirect, so the route is replaced on the client at once (search engines
 * run it, and the page's canonical points at the new address), with a plain
 * link for anything that does not run scripts.
 */
export function Redirect({ to, label }: { to: string; label: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(to);
  }, [router, to]);
  return (
    <p style={{ padding: "calc(var(--nav-h) + 2rem) var(--margin)" }}>
      This page has moved to <Link href={to}>{label}</Link>.
    </p>
  );
}
