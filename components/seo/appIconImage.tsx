import { ImageResponse } from "next/og";

/**
 * The app icon (components/AppIcon.tsx) as a PNG at build time, for phones'
 * home screens and the web manifest. `shape`:
 *   rounded   the icon as drawn, transparent corners (browsers, "any")
 *   square    full-bleed charcoal; iOS rounds the corners itself
 *   maskable  full-bleed, artwork shrunk into the centre safe zone (Android)
 */
export function appIconImage(size: number, shape: "rounded" | "square" | "maskable") {
  const art = shape === "maskable" ? 0.72 : 1;
  const offset = (64 - 64 * art) / 2;
  return new ImageResponse(
    (
      <svg width={size} height={size} viewBox="0 0 64 64">
        <rect width="64" height="64" rx={shape === "rounded" ? 14 : 0} fill="#0F172A" />
        <g transform={`translate(${offset} ${offset}) scale(${art})`}>
          <path fill="#F8F6EF" fillRule="evenodd" d="M12 32a17 17 0 1 0 34 0a17 17 0 1 0-34 0Zm10.5 0a6.5 6.5 0 1 1 13 0a6.5 6.5 0 1 1-13 0Z" />
          <circle cx="50" cy="45" r="5" fill="#FF7A59" />
        </g>
      </svg>
    ),
    { width: size, height: size },
  );
}
