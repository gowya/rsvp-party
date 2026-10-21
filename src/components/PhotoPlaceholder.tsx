// Illustration posée dans les polaroids tant qu'aucune photo n'est fournie (EVENT.photos)
export default function PhotoPlaceholder({ variant = "sun" }: { variant?: "sun" | "cheers" }) {
  return (
    <svg viewBox="0 0 160 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`ph-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={variant === "sun" ? "#ffb347" : "#ff7eb6"} />
          <stop offset="1" stopColor={variant === "sun" ? "#ff6b4a" : "#ffb347"} />
        </linearGradient>
      </defs>
      <rect width="160" height="200" fill={`url(#ph-${variant})`} />
      {variant === "sun" ? (
        <g transform="translate(80 110)">
          {Array.from({ length: 12 }, (_, i) => (
            <line key={i} x1="0" y1="-44" x2="0" y2="-58" transform={`rotate(${i * 30})`} stroke="#2b1608" strokeWidth="5" strokeLinecap="round" />
          ))}
          <circle r="36" fill="#ffee8c" stroke="#2b1608" strokeWidth="5" />
          <path d="M-14 -6 Q-9 -14 -4 -6 M4 -6 Q9 -14 14 -6" fill="none" stroke="#2b1608" strokeWidth="4" strokeLinecap="round" />
          <path d="M-16 8 Q0 26 16 8" fill="none" stroke="#2b1608" strokeWidth="4" strokeLinecap="round" />
        </g>
      ) : (
        <g stroke="#2b1608" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
          <path d="M44 60 H84 L80 112 C79 124 49 124 48 112 Z" fill="#fff6c2" transform="rotate(-12 64 90)" />
          <path d="M76 60 H116 L112 112 C111 124 81 124 80 112 Z" fill="#fff6c2" transform="rotate(12 96 90)" />
          <path d="M60 40 L64 28 M80 34 L80 20 M100 40 L96 28" fill="none" />
        </g>
      )}
    </svg>
  );
}
