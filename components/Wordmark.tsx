type Props = {
  className?: string;
  /** Colour of the letters; the dot is always coral. */
  ink?: string;
  title?: string;
};

/**
 * The ODDLY® wordmark, drawn as geometry: O, D, the open reversed bowl that
 * makes the name odd, L, Y, and the coral dot.
 */
export function Wordmark({ className, ink = "currentColor", title = "ODDLY" }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 502 100"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill={ink} fillRule="evenodd">
        {/* O */}
        <path d="M0 50a50 50 0 1 0 100 0A50 50 0 1 0 0 50ZM31 50a19 19 0 1 1 38 0a19 19 0 1 1 -38 0Z" />
        {/* D */}
        <path d="M110 0H155A50 50 0 0 1 155 100H110ZM140 31V69H155A19 19 0 0 0 155 31Z" />
        {/* the open, reversed bowl */}
        <path d="M215 0H245A50 50 0 0 1 245 100H215V69H245A19 19 0 0 0 245 31H215Z" />
        {/* L */}
        <path d="M305 0H336V69H375V100H305Z" />
        {/* Y */}
        <path d="M378 0H413L424 21L435 0H470L440 56V100H408V56Z" />
      </g>
      <circle cx="489" cy="87" r="13" fill="#FF7A59" />
    </svg>
  );
}
