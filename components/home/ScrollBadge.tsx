import s from "./badge.module.css";

/**
 * The brand's coral dot, enlarged into a scroll cue. The ring of text turns
 * slowly (stopped under reduced motion); the whole badge is a real link.
 */
export function ScrollBadge({ href, label }: { href: string; label: string }) {
  return (
    <a className={s.badge} href={href} aria-label={label}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <path id="badge-ring" d="M60 60m-43 0a43 43 0 1 1 86 0a43 43 0 1 1 -86 0" />
        </defs>
        <circle cx="60" cy="60" r="60" fill="#FF7A59" />
        <g className={s.ring}>
          <text>
            <textPath href="#badge-ring" startOffset="0">
              DIFFERENT BY DESIGN · BUILT FOR BETTER ·
            </textPath>
          </text>
        </g>
        <circle cx="60" cy="60" r="19" fill="#0F172A" />
        <path d="M60 51v17M53.5 61.5 60 68l6.5-6.5" fill="none" stroke="#F8F6EF" strokeWidth="2" strokeLinecap="square" />
      </svg>
    </a>
  );
}
