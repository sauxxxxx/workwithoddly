"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * A page that has moved. The static export cannot answer with a real
 * redirect, so: replace the route on the client at once, with a short
 * meta refresh and a plain link for anything that does not run scripts.
 */
export function Redirect({ to, label }: { to: string; label: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(to);
  }, [router, to]);
  return (
    <>
      <meta httpEquiv="refresh" content={`2;url=${to}`} />
      <meta name="robots" content="noindex" />
      <link rel="canonical" href={to} />
      <p style={{ padding: "calc(var(--nav-h) + 2rem) var(--margin)" }}>
        This page has moved to <Link href={to}>{label}</Link>.
      </p>
    </>
  );
}
