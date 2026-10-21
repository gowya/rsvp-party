"use client";

import { useId, type ReactNode } from "react";

// Briques de dessin partagées par toutes les illustrations (style « sticker » : trait encre, aplats)

export const INK = "#2b1608";

export const o = { stroke: INK, strokeWidth: 2.6, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
export const thin = { ...o, strokeWidth: 1.6 };

const CITRUS = {
  lime: { peel: "#8ccf3f", flesh: "#e3f59a", seg: "#b5df5a" },
  lemon: { peel: "#ffd43b", flesh: "#fff3a6", seg: "#ffe066" },
  orange: { peel: "#ff8a3d", flesh: "#ffc36b", seg: "#ffa94d" },
};
export type Citrus = keyof typeof CITRUS;

export function Sparkle({ x, y, s = 1, fill = "#ffd95a" }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 -9 C1 -3 3 -1 9 0 C3 1 1 3 0 9 C-1 3 -3 1 -9 0 C-3 -1 -1 -3 0 -9 Z"
      fill={fill}
      {...o}
      strokeWidth={2 / s}
    />
  );
}

export function Ice({ x, y, r = 0, s = 1 }: { x: number; y: number; r?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <rect x="-9" y="-9" width="18" height="18" rx="4" fill="#f4fbff" fillOpacity="0.85" {...thin} />
      <path d="M-5 -5 L-1 -5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

export function Mint({ x, y, r = 0, s = 1 }: { x: number; y: number; r?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0 -10 C8 -6 8 6 0 10 C-8 6 -8 -6 0 -10 Z" fill="#3fbf6f" {...thin} />
      <path d="M0 -8 V8 M0 -2 L3.5 -5 M0 3 L-3.5 0" stroke="#1f7a43" strokeWidth="1.1" fill="none" strokeLinecap="round" />
    </g>
  );
}

// Rondelle d'agrume vue de face
export function CitrusWheel({ x, y, r = 14, kind = "lime" }: { x: number; y: number; r?: number; kind?: Citrus }) {
  const c = CITRUS[kind];
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill={c.peel} {...o} />
      <circle r={r * 0.78} fill={c.flesh} />
      {Array.from({ length: 8 }, (_, i) => (
        <line key={i} x1="0" y1="0" x2="0" y2={-r * 0.72} transform={`rotate(${i * 45})`} stroke={c.seg} strokeWidth="1.6" />
      ))}
      <circle r={r * 0.12} fill={c.seg} />
    </g>
  );
}

// Quartier d'agrume posé sur le bord du verre
export function CitrusWedge({ x, y, r = 16, kind = "lime", rot = 0 }: { x: number; y: number; r?: number; kind?: Citrus; rot?: number }) {
  const c = CITRUS[kind];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M${-r} 0 A${r} ${r} 0 0 1 ${r} 0 Z`} fill={c.peel} {...o} />
      <path d={`M${-r * 0.78} 0 A${r * 0.78} ${r * 0.78} 0 0 1 ${r * 0.78} 0 Z`} fill={c.flesh} />
      <path d={`M0 0 L${-r * 0.55} ${-r * 0.55} M0 0 L0 ${-r * 0.75} M0 0 L${r * 0.55} ${-r * 0.55}`} stroke={c.seg} strokeWidth="1.6" />
      <path d={`M${-r} 0 A${r} ${r} 0 0 1 ${r} 0 Z`} fill="none" {...o} />
    </g>
  );
}

// Zeste en spirale
export function Twist({ x, y, kind = "orange", rot = 0 }: { x: number; y: number; kind?: Citrus; rot?: number }) {
  const d = "M0 0 C8 -4 10 6 4 8 C-2 10 -4 18 4 20 C12 22 12 30 6 32";
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={d} fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />
      <path d={d} fill="none" stroke={CITRUS[kind].peel} strokeWidth="4.5" strokeLinecap="round" />
    </g>
  );
}

export function Cherry({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -6 C2 -16 8 -22 14 -24" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      <circle r="8" fill="#e3262b" {...o} />
      <circle cx="-3" cy="-3" r="2.2" fill="#fff" opacity="0.8" />
    </g>
  );
}

export function OlivePick({ x, y, rot = 20 }: { x: number; y: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <line x1="0" y1="-30" x2="0" y2="34" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="0" cy="-30" r="3" fill="#e3262b" {...thin} />
      {[6, 22].map((cy) => (
        <g key={cy}>
          <ellipse cx="0" cy={cy} rx="7" ry="8.5" fill="#7fa83a" {...o} />
          <circle cx="0" cy={cy - 3} r="2.6" fill="#e3262b" />
        </g>
      ))}
    </g>
  );
}

export function Umbrella({ x, y, rot = -20, a = "#ff7eb6", b = "#fff6c2" }: { x: number; y: number; rot?: number; a?: string; b?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <line x1="0" y1="0" x2="0" y2="46" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M-26 2 C-22 -18 22 -18 26 2 Z" fill={a} {...o} />
      <path d="M-26 2 C-18 -6 -10 -6 -9 2 Z M9 2 C10 -6 18 -6 26 2 Z" fill={b} />
      <path d="M-9 2 L0 -14 L9 2 M0 -14 L0 2" fill="none" {...thin} />
      <path d="M-26 2 C-22 -18 22 -18 26 2 Z" fill="none" {...o} />
    </g>
  );
}

export function Pineapple({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d="M-4 -12 L-10 -30 L-2 -18 L2 -34 L6 -18 L14 -28 L8 -12 Z" fill="#3fbf6f" {...o} />
      <path d="M-16 -10 H20 L2 16 Z" fill="#ffd43b" {...o} />
      <path d="M-8 -6 L0 2 M6 -6 L12 -2 M-2 -6 L4 4" stroke="#e9a92e" strokeWidth="1.8" strokeLinecap="round" />
    </g>
  );
}

export function CoffeeBeans({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[-10, 0, 10].map((dx, i) => (
        <g key={dx} transform={`translate(${dx} ${i === 1 ? -2 : 0}) rotate(${dx * 2})`}>
          <ellipse rx="4.5" ry="6" fill="#5a2d14" {...thin} />
          <path d="M0 -5 C2 -1 -2 1 0 5" fill="none" stroke="#2b1608" strokeWidth="1.3" />
        </g>
      ))}
    </g>
  );
}

export function Celery({ x, y, rot = 12 }: { x: number; y: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x="-5" y="-6" width="10" height="70" rx="4" fill="#9ed36a" {...o} />
      <path d="M-1 0 V60" stroke="#6fae3d" strokeWidth="1.6" />
      <path d="M0 -6 C-14 -10 -16 -26 -6 -30 C-4 -40 8 -40 8 -30 C18 -28 16 -12 0 -6 Z" fill="#3fbf6f" {...o} />
    </g>
  );
}

export function CucumberSlice({ x, y, r = 12 }: { x: number; y: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="#2f8f4e" {...o} />
      <circle r={r * 0.78} fill="#d6f2b8" />
      {[0, 120, 240].map((a) => (
        <ellipse key={a} cx="0" cy={-r * 0.35} rx="1.6" ry="2.6" fill="#a8d98a" transform={`rotate(${a})`} />
      ))}
    </g>
  );
}

export function Straw({ x1, y1, x2, y2, a, b }: { x1: number; y1: number; x2: number; y2: number; a: string; b: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <>
      <defs>
        <pattern id={`s${id}`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="10" height="10" fill={a} />
          <rect width="5" height="10" fill={b} />
        </pattern>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth="11" strokeLinecap="round" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={`url(#s${id})`} strokeWidth="6.5" strokeLinecap="round" />
    </>
  );
}

// Retourne une illustration en miroir (gauche / droite)
export function Mirror({ flip, children }: { flip: boolean; children: ReactNode }) {
  return <span style={{ display: "contents" }}>{flip ? <span style={{ display: "block", transform: "scaleX(-1)" }}>{children}</span> : children}</span>;
}
