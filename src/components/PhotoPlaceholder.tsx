// Illustration posée dans les polaroids tant qu'aucune photo n'est fournie (EVENT.photos)
export default function PhotoPlaceholder({ variant = "sun" }: { variant?: "sun" | "yay" }) {
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
        // « Moi quand tu dis oui » : un perso ravi, bras en l'air, chapeau de fête et confettis
        <g stroke="#2b1608" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
          {[
            [24, 40, "#ffee8c", 20],
            [134, 34, "#5fd3b5", -30],
            [30, 150, "#b9a4ff", 40],
            [132, 156, "#ffee8c", -15],
            [118, 92, "#fffbe6", 60],
            [36, 96, "#5fd3b5", 10],
          ].map(([x, y, fill, rot], i) => (
            <rect key={i} x={-5} y={-3} width="10" height="6" rx="1.5" fill={fill as string} strokeWidth="2" transform={`translate(${x} ${y}) rotate(${rot})`} />
          ))}
          {/* Bras levés */}
          <path d="M50 132 C40 112 34 96 30 80" fill="none" strokeWidth="9" />
          <path d="M50 132 C40 112 34 96 30 80" fill="none" stroke="#ffd95a" strokeWidth="4" />
          <path d="M110 132 C120 112 126 96 130 80" fill="none" strokeWidth="9" />
          <path d="M110 132 C120 112 126 96 130 80" fill="none" stroke="#ffd95a" strokeWidth="4" />
          <circle cx="29" cy="76" r="8" fill="#ffd95a" />
          <circle cx="131" cy="76" r="8" fill="#ffd95a" />
          {/* Corps et visage */}
          <path d="M44 200 C44 160 58 140 80 140 C102 140 116 160 116 200 Z" fill="#ff7eb6" />
          <circle cx="80" cy="112" r="34" fill="#ffd95a" />
          <path d="M64 104 Q69 96 74 104 M86 104 Q91 96 96 104" fill="none" strokeWidth="3.5" />
          <path d="M66 116 C68 134 92 134 94 116 Z" fill="#2b1608" strokeWidth="3" />
          <path d="M72 124 C76 130 84 130 88 124" fill="#ff6b4a" stroke="none" />
          <ellipse cx="60" cy="118" rx="6" ry="3.5" fill="#ff7eb6" stroke="none" />
          <ellipse cx="100" cy="118" rx="6" ry="3.5" fill="#ff7eb6" stroke="none" />
          {/* Chapeau de fête */}
          <path d="M66 82 L82 42 L96 84 Z" fill="#5fd3b5" />
          <path d="M72 68 L90 70 M76 56 L86 58" fill="none" stroke="#fffbe6" strokeWidth="3" />
          <circle cx="82" cy="40" r="6" fill="#ffee8c" />
        </g>
      )}
    </svg>
  );
}
