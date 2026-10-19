type Props = { className?: string; title?: string };

/** The ODDLY app icon from the brand kit: charcoal square, cream O, coral dot. */
export function AppIcon({ className, title }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <rect width="64" height="64" rx="14" fill="#0F172A" />
      <path
        fill="#F8F6EF"
        fillRule="evenodd"
        d="M12 32a17 17 0 1 0 34 0a17 17 0 1 0-34 0Zm10.5 0a6.5 6.5 0 1 1 13 0a6.5 6.5 0 1 1-13 0Z"
      />
      <circle cx="50" cy="45" r="5" fill="#FF7A59" />
    </svg>
  );
}
