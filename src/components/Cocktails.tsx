"use client";

import { useId } from "react";
import { INK, Sparkle } from "./Socks";

const o = { stroke: INK, strokeWidth: 2.6, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const thin = { ...o, strokeWidth: 1.6 };

type P = { className?: string };

function Ice({ x, y, r = 0, s = 1 }: { x: number; y: number; r?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <rect x="-9" y="-9" width="18" height="18" rx="4" fill="#f4fbff" fillOpacity="0.85" {...thin} />
      <path d="M-5 -5 L-1 -5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function Mint({ x, y, r = 0, s = 1 }: { x: number; y: number; r?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0 -10 C8 -6 8 6 0 10 C-8 6 -8 -6 0 -10 Z" fill="#3fbf6f" {...thin} />
      <path d="M0 -8 V8 M0 -2 L3.5 -5 M0 3 L-3.5 0" stroke="#1f7a43" strokeWidth="1.1" fill="none" strokeLinecap="round" />
    </g>
  );
}

function LimeWheel({ x, y, r = 14 }: { x: number; y: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="#8ccf3f" {...o} />
      <circle r={r * 0.78} fill="#e3f59a" />
      {Array.from({ length: 8 }, (_, i) => (
        <line
          key={i}
          x1="0" y1="0" x2="0" y2={-r * 0.72}
          transform={`rotate(${i * 45})`}
          stroke="#b5df5a" strokeWidth="1.6"
        />
      ))}
      <circle r={r * 0.12} fill="#b5df5a" />
    </g>
  );
}

function Straw({ x1, y1, x2, y2, a, b }: { x1: number; y1: number; x2: number; y2: number; a: string; b: string }) {
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

/* Pornstar martini : coupe, mousse, demi fruit de la passion et son shot de prosecco */
export function CocktailPornstar({ className }: P) {
  return (
    <svg viewBox="0 0 150 170" className={className} aria-hidden="true" overflow="visible">
      <defs>
        <linearGradient id="pm-liquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffc15e" />
          <stop offset="1" stopColor="#ff8a3d" />
        </linearGradient>
      </defs>
      {/* Shot de prosecco */}
      <path d="M108 104 H134 L131 146 H111 Z" fill="#fff8d6" fillOpacity="0.7" {...o} />
      <path d="M109.5 114 H132.5 L131 146 H111 Z" fill="#fbe58a" />
      <path d="M108 104 H134 L131 146 H111 Z" fill="none" {...o} />
      {[[116, 130], [124, 124], [120, 138], [127, 136]].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.6" fill="#fff" />
      ))}
      {/* Coupe */}
      <path d="M10 40 H100 C98 70 80 86 55 86 C30 86 12 70 10 40 Z" fill="url(#pm-liquid)" />
      <ellipse cx="55" cy="42" rx="44" ry="6" fill="#ffe7b0" />
      <path d="M10 40 H100 C98 70 80 86 55 86 C30 86 12 70 10 40 Z" fill="none" {...o} />
      <path d="M22 50 C24 62 30 70 38 74" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
      <rect x="52" y="86" width="6" height="46" fill="#fff8d6" {...o} />
      <ellipse cx="55" cy="136" rx="26" ry="6" fill="#fff8d6" {...o} />
      {/* Demi fruit de la passion */}
      <ellipse cx="68" cy="40" rx="17" ry="8" fill="#7a3b69" {...o} />
      <ellipse cx="68" cy="39" rx="13" ry="5.4" fill="#ffd43b" />
      {[[62, 38], [67, 40], [72, 37.5], [75, 40], [64, 41]].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.1" fill={INK} />
      ))}
      <Sparkle x={18} y={20} s={0.9} />
      <Sparkle x={124} y={86} s={0.6} fill="#fffbe6" />
    </svg>
  );
}

/* Mojito : verre haut, menthe, citron vert, glaçons, paille */
export function CocktailMojito({ className }: P) {
  return (
    <svg viewBox="0 0 150 190" className={className} aria-hidden="true" overflow="visible">
      <Straw x1={62} y1={160} x2={92} y2={10} a="#fffbe6" b="#ff7eb6" />
      <path d="M28 44 L36 172 H96 L104 44 Z" fill="#e6f7d0" fillOpacity="0.85" />
      <Ice x={52} y={72} r={12} />
      <Ice x={78} y={86} r={-18} />
      <Ice x={60} y={110} r={30} s={0.9} />
      <Mint x={46} y={136} r={-30} />
      <Mint x={82} y={128} r={40} s={0.9} />
      <Mint x={64} y={152} r={10} s={0.8} />
      <path d="M28 44 L36 172 H96 L104 44 Z" fill="none" {...o} />
      <path d="M38 58 L44 160" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <LimeWheel x={100} y={46} r={17} />
      <Mint x={36} y={36} r={-40} s={1.1} />
      <Mint x={48} y={30} r={10} s={0.9} />
    </svg>
  );
}

/* Cuba libre : cola, glaçons, quartier de citron vert */
export function CocktailCubaLibre({ className }: P) {
  return (
    <svg viewBox="0 0 150 190" className={className} aria-hidden="true" overflow="visible">
      <Straw x1={56} y1={160} x2={40} y2={12} a="#2b1608" b="#ff6b4a" />
      <path d="M30 50 L37 172 H95 L102 50 Z" fill="#6b2f17" />
      <path d="M30 50 H102 L101 62 H31 Z" fill="#a0552b" />
      <Ice x={54} y={78} r={-10} />
      <Ice x={78} y={92} r={22} />
      <Ice x={62} y={122} r={-30} s={0.85} />
      {[[48, 140], [84, 130], [70, 156], [56, 104], [88, 110]].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2" fill="#d98a52" />
      ))}
      <path d="M30 50 L37 172 H95 L102 50 Z" fill="none" {...o} />
      <path d="M40 66 L45 160" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.45" />
      {/* Quartier de citron vert sur le bord */}
      <path d="M86 50 A18 18 0 0 1 122 50 Z" fill="#8ccf3f" {...o} />
      <path d="M90 50 A14 14 0 0 1 118 50 Z" fill="#e3f59a" />
      <path d="M104 50 L96 40 M104 50 L104 37 M104 50 L112 40" stroke="#b5df5a" strokeWidth="1.6" />
      <path d="M86 50 A18 18 0 0 1 122 50 Z" fill="none" {...o} />
    </svg>
  );
}

/* Moscow mule : mug en cuivre martelé */
export function CocktailMule({ className }: P) {
  return (
    <svg viewBox="0 0 160 170" className={className} aria-hidden="true" overflow="visible">
      <defs>
        <linearGradient id="mule-copper" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b5592a" />
          <stop offset="0.35" stopColor="#f0a26b" />
          <stop offset="0.6" stopColor="#d9844a" />
          <stop offset="1" stopColor="#9c4a22" />
        </linearGradient>
      </defs>
      <Ice x={52} y={50} r={-14} />
      <Ice x={76} y={46} r={18} />
      <Mint x={98} y={30} r={30} s={1.1} />
      <Mint x={86} y={24} r={-10} />
      <LimeWheel x={42} y={42} r={15} />
      {/* Anse */}
      <path d="M112 74 C140 74 140 128 108 130" fill="none" stroke={INK} strokeWidth="16" strokeLinecap="round" />
      <path d="M112 74 C140 74 140 128 108 130" fill="none" stroke="#c96d36" strokeWidth="10" strokeLinecap="round" />
      {/* Mug */}
      <path d="M20 56 H116 L110 150 C110 156 105 160 99 160 H37 C31 160 26 156 26 150 Z" fill="url(#mule-copper)" />
      {[[38, 80], [56, 96], [44, 120], [70, 72], [90, 88], [80, 118], [62, 140], [98, 130], [34, 140]].map(([cx, cy]) => (
        <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx="5" ry="3.4" fill="#ffd0a6" opacity="0.35" />
      ))}
      <path d="M20 56 H116 L110 150 C110 156 105 160 99 160 H37 C31 160 26 156 26 150 Z" fill="none" {...o} />
      <rect x="16" y="50" width="104" height="10" rx="5" fill="#e8955a" {...o} />
      <path d="M44 70 L48 146" stroke="#ffe0c2" strokeWidth="5" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

export const COCKTAILS = [
  { key: "pornstar", label: "Pornstar martini", Comp: CocktailPornstar },
  { key: "mojito", label: "Mojito", Comp: CocktailMojito },
  { key: "cuba", label: "Cuba libre", Comp: CocktailCubaLibre },
  { key: "mule", label: "Moscow mule", Comp: CocktailMule },
] as const;
