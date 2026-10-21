"use client";

import { useId, type ReactNode } from "react";
import {
  Celery,
  Cherry,
  CitrusWedge,
  CitrusWheel,
  CoffeeBeans,
  CucumberSlice,
  INK,
  Ice,
  OlivePick,
  Pineapple,
  Sparkle,
  Straw,
  Twist,
  Umbrella,
  o,
} from "./shared";

/*
 * Un cocktail = un verre + un liquide (dégradé) + des glaçons + des garnitures.
 * Tous les verres sont centrés sur x = 70 dans un cadre de 140 x 180.
 */

type GlassKind = "coupe" | "martini" | "margarita" | "highball" | "rocks" | "wine" | "hurricane" | "flute";

type Glass = {
  // Contour intérieur du verre (sert aussi de masque au liquide)
  body: string;
  // Hauteur du liquide par défaut
  fill: number;
  // Pied du verre : y début, y fin (le socle est dessiné à y fin)
  stem?: [number, number];
  // Reflet sur la paroi
  shine: string;
};

const GLASSES: Record<GlassKind, Glass> = {
  coupe: {
    body: "M24 56 H116 C114 88 96 104 70 104 C44 104 26 88 24 56 Z",
    fill: 64,
    stem: [104, 152],
    shine: "M34 68 C36 80 42 88 52 94",
  },
  martini: {
    body: "M20 44 H120 L72 104 H68 Z",
    fill: 54,
    stem: [104, 154],
    shine: "M34 54 L56 82",
  },
  margarita: {
    body: "M16 50 H124 C122 70 100 76 86 78 C80 84 76 92 74 100 H66 C64 92 60 84 54 78 C40 76 18 70 16 50 Z",
    fill: 58,
    stem: [100, 154],
    shine: "M28 60 C34 68 42 72 52 74",
  },
  highball: {
    body: "M40 34 L45 170 H95 L100 34 Z",
    fill: 54,
    shine: "M50 50 L54 156",
  },
  rocks: {
    body: "M28 84 L33 168 H107 L112 84 Z",
    fill: 104,
    shine: "M40 98 L43 156",
  },
  wine: {
    body: "M30 38 H110 C118 74 108 112 70 114 C32 112 22 74 30 38 Z",
    fill: 62,
    stem: [114, 158],
    shine: "M40 52 C38 72 42 92 54 104",
  },
  hurricane: {
    body: "M42 28 H98 C98 52 88 62 88 82 C88 102 102 114 102 138 C102 158 90 170 70 170 C50 170 38 158 38 138 C38 114 52 102 52 82 C52 62 42 52 42 28 Z",
    fill: 46,
    shine: "M48 120 C46 134 48 150 56 160",
  },
  flute: {
    body: "M52 22 H88 C90 62 86 100 70 108 C54 100 50 62 52 22 Z",
    fill: 36,
    stem: [108, 156],
    shine: "M58 34 C58 60 60 84 64 96",
  },
};

type DrinkSpec = {
  glass: GlassKind;
  // Couleurs du liquide, du haut vers le bas
  liquid: string[];
  fill?: number;
  // Mousse sur le dessus (couleur, épaisseur)
  foam?: [string, number];
  ice?: { x: number; y: number; r?: number; s?: number }[];
  bubbles?: boolean;
  // Givre de sel ou de sucre sur le bord
  rim?: "salt" | "sugar";
  // Dessiné derrière le verre (paille, céleri, pique…)
  back?: ReactNode;
  // Dessiné à l'intérieur du liquide (feuilles, rondelles…)
  inside?: ReactNode;
  // Dessiné devant (rondelle sur le bord, cerise…)
  front?: ReactNode;
};

function Drink({ spec, className }: { spec: DrinkSpec; className?: string }) {
  const id = useId().replace(/:/g, "");
  const g = GLASSES[spec.glass];
  const fill = spec.fill ?? g.fill;
  const rimY = Number(/^M\d+ (\d+)/.exec(g.body)?.[1] ?? 40);
  const rimX = /^M(\d+) \d+ H(\d+)/.exec(g.body);
  const [rx1, rx2] = rimX ? [Number(rimX[1]), Number(rimX[2])] : [30, 110];

  return (
    <svg viewBox="0 0 140 180" className={className} aria-hidden="true" overflow="visible">
      <defs>
        <clipPath id={`c${id}`}>
          <path d={g.body} />
        </clipPath>
        <linearGradient id={`l${id}`} x1="0" y1="0" x2="0" y2="1">
          {spec.liquid.map((c, i) => (
            <stop key={i} offset={spec.liquid.length === 1 ? 0 : i / (spec.liquid.length - 1)} stopColor={c} />
          ))}
        </linearGradient>
      </defs>

      {spec.back}

      {/* Le verre vide, très légèrement teinté */}
      <path d={g.body} fill="#fff8e6" fillOpacity="0.45" />

      <g clipPath={`url(#c${id})`}>
        <rect x="0" y={fill} width="140" height={180 - fill} fill={`url(#l${id})`} />
        {spec.foam && <rect x="0" y={fill} width="140" height={spec.foam[1]} fill={spec.foam[0]} />}
        <line x1="0" y1={fill} x2="140" y2={fill} stroke={INK} strokeWidth="1.6" opacity="0.35" />
        {spec.bubbles &&
          [
            [56, 0.35],
            [70, 0.6],
            [84, 0.45],
            [62, 0.8],
            [78, 0.25],
          ].map(([x, t], i) => <circle key={i} cx={x} cy={fill + (170 - fill) * t} r="2" fill="#fff" opacity="0.8" />)}
        {spec.ice?.map((c, i) => <Ice key={i} {...c} />)}
        {spec.inside}
      </g>

      <path d={g.shine} fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
      <path d={g.body} fill="none" {...o} />

      {spec.rim && (
        <line
          x1={rx1 + 2}
          y1={rimY}
          x2={rx2 - 2}
          y2={rimY}
          stroke={spec.rim === "salt" ? "#fffbe6" : "#ffd6e7"}
          strokeWidth="5"
          strokeDasharray="1.5 3"
          strokeLinecap="round"
        />
      )}

      {g.stem && (
        <>
          <rect x="67" y={g.stem[0]} width="6" height={g.stem[1] - g.stem[0]} fill="#fff8e6" {...o} />
          <ellipse cx="70" cy={g.stem[1]} rx="28" ry="6" fill="#fff8e6" {...o} />
        </>
      )}

      {spec.front}
    </svg>
  );
}

const make = (spec: DrinkSpec) =>
  function DrinkIllus({ className }: { className?: string }) {
    return <Drink spec={spec} className={className} />;
  };

export const DrinkMargarita = make({
  glass: "margarita",
  liquid: ["#e8f59a", "#c6e06a"],
  rim: "salt",
  front: <CitrusWheel x={118} y={52} r={15} />,
});

export const DrinkSpritz = make({
  glass: "wine",
  liquid: ["#ffb347", "#ff7a2f"],
  fill: 58,
  bubbles: true,
  ice: [
    { x: 58, y: 70, r: 12 },
    { x: 82, y: 76, r: -16 },
  ],
  back: <Straw x1={86} y1={100} x2={104} y2={12} a="#fff6c2" b="#ff6b4a" />,
  inside: <CitrusWheel x={66} y={96} r={14} kind="orange" />,
});

export const DrinkPinaColada = make({
  glass: "hurricane",
  liquid: ["#fffbe6", "#fff1c4"],
  foam: ["#fffdf3", 8],
  front: (
    <>
      <Umbrella x={94} y={20} rot={18} />
      <Pineapple x={46} y={30} rot={-14} />
      <Cherry x={60} y={22} s={0.9} />
    </>
  ),
});

export const DrinkCosmopolitan = make({
  glass: "martini",
  liquid: ["#ff6f91", "#e8406b"],
  front: <Twist x={108} y={30} kind="lime" rot={-20} />,
});

export const DrinkNegroni = make({
  glass: "rocks",
  liquid: ["#e3263b", "#9c1028"],
  fill: 98,
  ice: [{ x: 70, y: 124, r: 8, s: 2.2 }],
  front: <CitrusWheel x={102} y={92} r={16} kind="orange" />,
});

export const DrinkOldFashioned = make({
  glass: "rocks",
  liquid: ["#e8973a", "#a8521a"],
  fill: 100,
  ice: [{ x: 68, y: 128, r: -6, s: 2.1 }],
  front: (
    <>
      <Twist x={94} y={74} kind="orange" rot={10} />
      <Cherry x={50} y={96} s={0.9} />
    </>
  ),
});

export const DrinkMartini = make({
  glass: "martini",
  liquid: ["#f1f4dc", "#dfe6b8"],
  back: <OlivePick x={86} y={50} rot={28} />,
});

export const DrinkEspressoMartini = make({
  glass: "coupe",
  liquid: ["#3a1d0e", "#1f0f07"],
  foam: ["#d9a86c", 7],
  fill: 62,
  front: <CoffeeBeans x={70} y={60} />,
});

export const DrinkSexOnTheBeach = make({
  glass: "highball",
  liquid: ["#ffb347", "#ff8a3d", "#e8406b"],
  fill: 48,
  ice: [
    { x: 62, y: 66, r: 10 },
    { x: 82, y: 84, r: -14 },
  ],
  back: <Straw x1={60} y1={150} x2={40} y2={10} a="#fff6c2" b="#ff7eb6" />,
  front: <CitrusWheel x={98} y={36} r={16} kind="orange" />,
});

export const DrinkTequilaSunrise = make({
  glass: "highball",
  liquid: ["#ffd43b", "#ffa63a", "#e3263b"],
  fill: 50,
  ice: [{ x: 70, y: 70, r: 14 }],
  front: (
    <>
      <CitrusWedge x={98} y={38} r={17} kind="orange" rot={20} />
      <Cherry x={50} y={40} s={0.9} />
    </>
  ),
});

export const DrinkGinTonic = make({
  glass: "wine",
  liquid: ["#eef8f4", "#d4eee4"],
  fill: 56,
  bubbles: true,
  ice: [
    { x: 56, y: 72, r: 14 },
    { x: 84, y: 70, r: -10 },
  ],
  inside: (
    <>
      <CucumberSlice x={72} y={94} r={13} />
      <CitrusWheel x={52} y={98} r={11} />
    </>
  ),
});

export const DrinkBlueLagoon = make({
  glass: "hurricane",
  liquid: ["#5bc8f5", "#1f7fd1"],
  fill: 48,
  ice: [{ x: 70, y: 70, r: 12 }],
  front: (
    <>
      <CitrusWheel x={96} y={30} r={16} kind="lemon" />
      <Cherry x={56} y={26} s={0.9} />
    </>
  ),
});

export const DrinkCaipirinha = make({
  glass: "rocks",
  liquid: ["#f6fbe6", "#e4f2c4"],
  fill: 94,
  ice: [
    { x: 54, y: 112, r: 10, s: 1.1 },
    { x: 84, y: 118, r: -12, s: 1.1 },
  ],
  inside: (
    <>
      <CitrusWedge x={60} y={150} r={14} rot={-30} />
      <CitrusWedge x={86} y={148} r={14} rot={24} />
    </>
  ),
  front: <CitrusWedge x={106} y={88} r={15} rot={30} />,
});

export const DrinkDaiquiri = make({
  glass: "coupe",
  liquid: ["#f5fbd8", "#e0eea6"],
  front: <CitrusWheel x={112} y={56} r={15} />,
});

export const DrinkBloodyMary = make({
  glass: "highball",
  liquid: ["#d6332b", "#8e1a16"],
  fill: 50,
  rim: "salt",
  ice: [{ x: 76, y: 66, r: -10 }],
  back: <Celery x={56} y={20} rot={-10} />,
  front: <CitrusWedge x={96} y={38} r={15} kind="lemon" rot={20} />,
});

export const DrinkChampagne = make({
  glass: "flute",
  liquid: ["#fff1a6", "#f2cf5a"],
  bubbles: true,
  front: (
    <>
      <Sparkle x={104} y={28} s={0.9} />
      <Sparkle x={34} y={56} s={0.6} fill="#fffbe6" />
    </>
  ),
});
