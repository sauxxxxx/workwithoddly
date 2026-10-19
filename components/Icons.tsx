/* Authored icon set: one 1.75px stroke, square caps, 24px grid. */

type P = { className?: string };

export function ArrowUpRight({ className = "arrow" }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" aria-hidden="true">
      <path d="M7 17 17 7M8.5 7H17v8.5" />
    </svg>
  );
}

export function ArrowDown({ className = "arrow" }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" aria-hidden="true">
      <path d="M12 4v15M5.5 12.5 12 19l6.5-6.5" />
    </svg>
  );
}

export function ArrowRight({ className = "arrow" }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" aria-hidden="true">
      <path d="M4 12h15M12.5 5.5 19 12l-6.5 6.5" />
    </svg>
  );
}

export function ArrowLeft({ className = "arrow" }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" aria-hidden="true">
      <path d="M20 12H5M11.5 5.5 5 12l6.5 6.5" />
    </svg>
  );
}

export function MailIcon({ className = "icon" }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" aria-hidden="true">
      <path d="M3.5 6.5h17v11h-17zM4 7l8 6.25L20 7" />
    </svg>
  );
}
