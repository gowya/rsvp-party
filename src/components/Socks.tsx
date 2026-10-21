"use client";

import { EVENT } from "@/data/event";
import { createContext, useContext, useId, type ReactNode } from "react";

export const INK = "#2b1608";
export const C = {
  cream: "#fffbe6",
  sun100: "#fff6c2",
  sun: "#ffee8c",
  sun400: "#ffd95a",
  apricot: "#ffb347",
  tangerine: "#ff8a3d",
  coral: "#ff6b4a",
  rose: "#ff7eb6",
  roseDeep: "#e0559a",
  lilac: "#b9a4ff",
  lilacDeep: "#9b82f5",
  mint: "#5fd3b5",
  green: "#3fbf8f",
  melon: "#ff6b7f",
  red: "#ff5a4a",
};

// Silhouettes, pied vers la droite
const SHORT =
  "M32 14 H74 V96 C74 104 80 109 88 113 L116 127 C133 135 133 160 114 164 C105 166 97 164 89 160 L46 141 C32 135 28 124 28 110 Z";
const LONG =
  "M32 14 H74 V156 C74 164 80 169 88 173 L116 187 C133 195 133 220 114 224 C105 226 97 224 89 220 L46 201 C32 195 28 184 28 170 Z";

export const line = { stroke: INK, strokeWidth: 2.4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

type FrameProps = {
  viewBox?: string;
  path?: string;
  defs?: (id: string) => ReactNode;
  inside: (id: string) => ReactNode;
  over?: ReactNode;
  className?: string;
};

// true : la chaussette est dessinée en miroir, pied vers la gauche
export const SockFlip = createContext(false);

const WIDTH = 150;

export function Frame({ viewBox = "0 0 150 175", path = SHORT, defs, inside, over, className }: FrameProps) {
  const id = useId().replace(/:/g, "");
  const flip = useContext(SockFlip);
  return (
    <svg viewBox={viewBox} className={className} aria-hidden="true" overflow="visible">
      <defs>
        <clipPath id={`c${id}`}>
          <path d={path} />
        </clipPath>
        {defs?.(id)}
      </defs>
      <g transform={flip ? `translate(${WIDTH} 0) scale(-1 1)` : undefined}>
        <g clipPath={`url(#c${id})`}>{inside(id)}</g>
        <path d={path} fill="none" stroke={INK} strokeWidth="3.2" strokeLinejoin="round" />
        {over}
      </g>
    </svg>
  );
}

// Garde un texte lisible quand la chaussette est en miroir (cx : centre horizontal du texte)
export function Upright({ cx, children }: { cx: number; children: ReactNode }) {
  const flip = useContext(SockFlip);
  return flip ? <g transform={`translate(${cx * 2} 0) scale(-1 1)`}>{children}</g> : <>{children}</>;
}

export function Ribs({ y = 16, h = 13, xs = [38, 46, 54, 62, 70] }: { y?: number; h?: number; xs?: number[] }) {
  return (
    <>
      {xs.map((x) => (
        <line key={x} x1={x} y1={y} x2={x} y2={y + h} stroke={INK} strokeWidth="1.6" opacity="0.45" />
      ))}
    </>
  );
}

export function Sparkle({ x, y, s = 1, fill = C.sun400 }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 -9 C1 -3 3 -1 9 0 C3 1 1 3 0 9 C-1 3 -3 1 -9 0 C-3 -1 -1 -3 0 -9 Z"
      fill={fill}
      {...line}
      strokeWidth={2 / s}
    />
  );
}

/* 1. Chaussette à doigts arc-en-ciel */
export function SockToes({ className }: { className?: string }) {
  const toeColors = [C.coral, C.sun400, C.mint, C.lilac, C.rose];
  const toes = [-75, -40, -5, 30, 65].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return { x: 112 + 17 * Math.cos(a), y: 145 + 17 * Math.sin(a), deg };
  });
  const bands = [C.rose, C.sun400, C.mint, C.lilac, C.tangerine];
  return (
    <Frame
      className={className}
      inside={() => (
        <>
          <rect width="150" height="175" fill={C.cream} />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} y={30 + i * 12} width="150" height="7" fill={bands[i % bands.length]} />
          ))}
          <ellipse cx="40" cy="138" rx="20" ry="17" fill={C.lilac} {...line} />
          <rect x="20" y="0" width="70" height="30" fill={C.coral} {...line} />
          <Ribs />
        </>
      )}
      over={
        <>
          {toes.map((t, i) => (
            <ellipse
              key={i}
              cx={t.x}
              cy={t.y}
              rx="9"
              ry="7.5"
              transform={`rotate(${t.deg} ${t.x} ${t.y})`}
              fill={toeColors[i]}
              {...line}
              strokeWidth="2.8"
            />
          ))}
          <Sparkle x={18} y={60} s={0.9} />
        </>
      }
    />
  );
}

/* 3. Chaussette léopard rose à volants */
export function SockLeopard({ className }: { className?: string }) {
  const scallops = Array.from({ length: 5 }, (_, i) => {
    const x = 88 - i * 13.2;
    return `A6.6 6.6 0 0 1 ${x - 13.2} 26`;
  }).join(" ");
  return (
    <Frame
      className={className}
      defs={(id) => (
        <pattern id={`p${id}`} width="34" height="30" patternUnits="userSpaceOnUse">
          <ellipse cx="10" cy="9" rx="5" ry="4" fill={C.roseDeep} />
          <path d="M3.5 7 C5 2 13 1.5 16 5.5 M16.5 12 C14 16 7 16.5 4.5 13.5" fill="none" {...line} />
          <ellipse cx="26" cy="23" rx="4" ry="3.4" fill={C.roseDeep} />
          <path d="M20.5 21 C22 17 29 17 31 20.5 M31.5 25.5 C29 28.5 23 28.5 21 26" fill="none" {...line} />
        </pattern>
      )}
      inside={(id) => (
        <>
          <rect width="150" height="175" fill={C.rose} />
          <rect width="150" height="175" fill={`url(#p${id})`} />
          <ellipse cx="124" cy="146" rx="18" ry="22" fill={INK} />
          <ellipse cx="40" cy="138" rx="20" ry="17" fill={INK} />
        </>
      )}
      over={
        <>
          <path d={`M22 4 H88 V26 ${scallops} Z`} fill={C.cream} {...line} />
          {[30, 43, 56, 69, 82].map((x) => (
            <circle key={x} cx={x} cy={30} r="1.6" fill={INK} />
          ))}
          <path d="M88 18 L74 9 L75 27 Z" fill={C.sun400} {...line} />
          <path d="M88 18 L102 9 L101 27 Z" fill={C.sun400} {...line} />
          <circle cx="88" cy="18" r="4" fill={C.coral} {...line} />
          <Sparkle x={118} y={104} s={0.8} fill={C.cream} />
        </>
      }
    />
  );
}

/* 4. Chaussette pastèque */
export function SockMelon({ className }: { className?: string }) {
  return (
    <Frame
      className={className}
      defs={(id) => (
        <pattern id={`p${id}`} width="22" height="22" patternUnits="userSpaceOnUse">
          <ellipse cx="6" cy="6" rx="2" ry="3.4" fill={INK} transform="rotate(-20 6 6)" />
          <ellipse cx="17" cy="16" rx="2" ry="3.4" fill={INK} transform="rotate(15 17 16)" />
        </pattern>
      )}
      inside={(id) => (
        <>
          <rect width="150" height="175" fill={C.melon} />
          <rect y="30" width="150" height="145" fill={`url(#p${id})`} />
          <ellipse cx="124" cy="146" rx="20" ry="24" fill={C.green} {...line} />
          <ellipse cx="119" cy="146" rx="13" ry="18" fill={C.cream} />
          <ellipse cx="40" cy="138" rx="20" ry="17" fill={C.green} {...line} />
          <ellipse cx="44" cy="134" rx="13" ry="10" fill={C.cream} />
          <rect x="20" y="0" width="70" height="30" fill={C.green} {...line} />
          {[26, 40, 54, 68, 82].map((x) => (
            <path key={x} d={`M${x} 0 C${x + 4} 10 ${x - 4} 20 ${x} 30`} fill="none" stroke="#8be3b5" strokeWidth="4" />
          ))}
        </>
      )}
      over={<Sparkle x={20} y={70} s={0.85} fill={C.mint} />}
    />
  );
}

/* 5. Chaussette en flammes */
export function SockFlames({ className }: { className?: string }) {
  const flame =
    "M10 190 L10 120 C 20 104 30 112 34 98 C 37 84 29 76 36 60 C 44 74 52 78 51 92 C 57 82 60 70 68 58 C 68 78 76 86 75 100 C 83 92 93 96 97 86 C 99 104 111 108 122 102 C 120 120 134 124 150 116 L150 190 Z";
  return (
    <Frame
      className={className}
      inside={() => (
        <>
          <rect width="150" height="175" fill={C.sun} />
          <path d={flame} fill={C.coral} {...line} />
          <path d={flame} fill={C.tangerine} transform="translate(0 16)" {...line} />
          <path d={flame} fill={C.sun400} transform="translate(0 32)" {...line} />
          <rect x="20" y="0" width="70" height="30" fill={INK} />
          <rect x="20" y="9" width="70" height="3" fill={C.sun400} />
          <rect x="20" y="17" width="70" height="3" fill={C.coral} />
        </>
      )}
      over={
        <>
          <Sparkle x={22} y={46} s={0.7} fill={C.cream} />
          <Sparkle x={88} y={70} s={0.9} />
        </>
      }
    />
  );
}

/* 7. Chaussette smileys acides */
export function SockSmiley({ className }: { className?: string }) {
  return (
    <Frame
      className={className}
      defs={(id) => (
        <pattern id={`p${id}`} width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="14" cy="14" r="9" fill={C.sun400} stroke={INK} strokeWidth="1.6" />
          <circle cx="11" cy="12" r="1.4" fill={INK} />
          <circle cx="17" cy="12" r="1.4" fill={INK} />
          <path d="M9.5 15.5 Q14 20.5 18.5 15.5" fill="none" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
        </pattern>
      )}
      inside={(id) => (
        <>
          <rect width="150" height="175" fill={C.mint} />
          <rect y="30" width="150" height="145" fill={`url(#p${id})`} />
          <ellipse cx="40" cy="138" rx="20" ry="17" fill={C.rose} {...line} />
          <ellipse cx="124" cy="146" rx="18" ry="22" fill={C.rose} {...line} />
          <rect x="20" y="0" width="70" height="30" fill={C.rose} {...line} />
          <Ribs />
        </>
      )}
    />
  );
}

/* 8. Chaussette de sport montante « 18 » à pompon */
export function SockSport({ className }: { className?: string }) {
  // Pompon : un nuage de boules, contour commun (trait épais dessous, remplissage dessus)
  const puffs = [[84, 12, 7], ...Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2;
    return [84 + 9 * Math.cos(a), 12 + 9 * Math.sin(a), 6] as const;
  })] as const;
  return (
    <Frame
      viewBox="0 0 150 235"
      path={LONG}
      className={className}
      inside={() => (
        <>
          <rect width="150" height="235" fill={C.cream} />
          <rect y="36" width="150" height="8" fill={C.coral} />
          <rect y="50" width="150" height="8" fill={C.tangerine} />
          <rect y="64" width="150" height="8" fill={C.sun400} />
          <ellipse cx="40" cy="198" rx="20" ry="17" fill={C.tangerine} {...line} />
          <ellipse cx="124" cy="206" rx="18" ry="22" fill={C.tangerine} {...line} />
          <rect x="20" y="0" width="70" height="30" fill={C.cream} {...line} />
          <Ribs />
          <Upright cx={52}>
          <text
            x="52"
            y="136"
            textAnchor="middle"
            fontFamily="var(--font-display), sans-serif"
            fontWeight="800"
            fontSize="44"
            letterSpacing="-2"
            fill={C.rose}
            stroke={INK}
            strokeWidth="2.4"
            paintOrder="stroke"
          >
            {EVENT.age}
          </text>
          </Upright>
        </>
      )}
      over={
        <>
          {puffs.map(([x, y, r], i) => (
            <circle key={`o${i}`} cx={x} cy={y} r={r} fill={INK} stroke={INK} strokeWidth="5" />
          ))}
          {puffs.map(([x, y, r], i) => (
            <circle key={`f${i}`} cx={x} cy={y} r={r} fill={C.rose} />
          ))}
          <Sparkle x={16} y={100} s={0.9} />
          <Sparkle x={92} y={150} s={0.6} fill={C.cream} />
        </>
      }
    />
  );
}
