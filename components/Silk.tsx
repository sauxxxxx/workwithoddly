import s from "./silk.module.css";

/**
 * The ground's white silk: broad white ribbons sweeping across the lavender
 * like light on fabric. Each fold is a pair — a soft lavender shadow on its
 * underside and a white highlight with a fine bright crease — so it reads as
 * raised cloth rather than a haze. Fixed behind everything; it drifts very
 * slowly and, where the browser supports scroll-linked animation, rises a
 * little as the page scrolls. Decorative.
 */
export function Silk() {
  return (
    <div className={s.silk} aria-hidden="true">
      <div className={s.scroll}>
        <svg className={s.drift} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="silk-light" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1600" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.3" stopColor="#fff" stopOpacity="1" />
              <stop offset="0.72" stopColor="#fff" stopOpacity="0.75" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="silk-shade" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1600" y2="0">
              <stop offset="0" stopColor="#8f7fd6" stopOpacity="0" />
              <stop offset="0.35" stopColor="#8f7fd6" stopOpacity="0.32" />
              <stop offset="0.75" stopColor="#8f7fd6" stopOpacity="0.22" />
              <stop offset="1" stopColor="#8f7fd6" stopOpacity="0" />
            </linearGradient>
            <filter id="silk-soft" x="-20%" y="-60%" width="140%" height="220%">
              <feGaussianBlur stdDeviation="30" />
            </filter>
            <filter id="silk-shadow" x="-20%" y="-60%" width="140%" height="220%">
              <feGaussianBlur stdDeviation="46" />
            </filter>
            <filter id="silk-sheen" x="-20%" y="-60%" width="140%" height="220%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>

          {/* The broad fold, high on the page: shadow, body, crease. */}
          <path
            d="M-250 450 C 200 240, 620 640, 1050 420 S 1650 160, 1900 290"
            fill="none"
            stroke="url(#silk-shade)"
            strokeWidth="200"
            filter="url(#silk-shadow)"
          />
          <path
            d="M-250 330 C 200 120, 620 520, 1050 300 S 1650 40, 1900 170"
            fill="none"
            stroke="url(#silk-light)"
            strokeWidth="210"
            filter="url(#silk-soft)"
          />
          <path
            d="M-250 255 C 200 45, 620 445, 1050 225 S 1650 -35, 1900 95"
            fill="none"
            stroke="url(#silk-light)"
            strokeWidth="14"
            filter="url(#silk-sheen)"
          />

          {/* A lower fold sweeping the other way. */}
          <path
            d="M-200 960 C 300 740, 760 1080, 1200 800 S 1700 660, 1850 740"
            fill="none"
            stroke="url(#silk-shade)"
            strokeWidth="170"
            filter="url(#silk-shadow)"
          />
          <path
            d="M-200 860 C 300 640, 760 980, 1200 700 S 1700 560, 1850 640"
            fill="none"
            stroke="url(#silk-light)"
            strokeWidth="170"
            filter="url(#silk-soft)"
          />
          <path
            d="M-200 795 C 300 575, 760 915, 1200 635 S 1700 495, 1850 575"
            fill="none"
            stroke="url(#silk-light)"
            strokeWidth="10"
            filter="url(#silk-sheen)"
            opacity="0.85"
          />
        </svg>
      </div>
    </div>
  );
}
