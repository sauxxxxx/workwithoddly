import Link from "next/link";

export default function NotFound() {
  return (
    <section
      data-scene="hero"
      style={{
        minHeight: "100svh",
        display: "grid",
        placeContent: "center",
        justifyItems: "center",
        gap: "var(--s-5)",
        padding: "var(--nav-h) var(--margin)",
        textAlign: "center",
      }}
    >
      <h1 className="display" style={{ fontSize: "min(30vw, 40vh)" }}>
        Odd<span className="dot" aria-hidden="true" />
      </h1>
      <p style={{ fontFamily: "var(--f-brand)", fontSize: "var(--t-lead)" }}>
        Even for us, this page doesn&rsquo;t exist.
      </p>
      <Link className="ink-link" href="/" style={{ fontWeight: 600 }}>
        Back to the studio
      </Link>
    </section>
  );
}
