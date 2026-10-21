import type { CSSProperties } from "react";
import { THEME } from "@/themes";

// Le ciel du site (rampe de couleurs du thème) : du haut vers le bas de la page. Chaque section en prend une tranche,
// selon le nombre de sections affichées, pour que le coucher de soleil reste continu.
const RAMP = THEME.sky.ramp;

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (rgb: number[]) => "#" + rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

// Couleur du ciel à une position sur la rampe (0 = premier ton, RAMP.length - 1 = nuit)
function at(x: number) {
  const i = Math.min(RAMP.length - 2, Math.floor(x));
  const a = hex(RAMP[i]);
  const b = hex(RAMP[i + 1]);
  return toHex(a.map((v, k) => v + (b[k] - v) * (x - i)));
}

function luminance(h: string) {
  const [r, g, b] = hex(h).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export type Sky = { style: CSSProperties; warm: boolean; dark: boolean };

// Frontières des sections sur la rampe : les premières se partagent le jour et le coucher de soleil,
// la dernière plonge seule dans la nuit (6 sections : 0, 1, 2, 3, 4, 5, puis 7)
const edge = (i: number, count: number) => (i >= count ? RAMP.length - 1 : (i / count) * (RAMP.length - 2));

export function skyFor(index: number, count: number): Sky {
  const from = at(edge(index, count));
  const to = at(edge(index + 1, count));
  return {
    style: { background: `linear-gradient(180deg, ${from}, ${to})` },
    // Fond orangé : les titres passent aux jaunes du soleil
    warm: luminance(from) < 0.55,
    // Fond sombre dès le haut de la section : les textes passent en crème
    dark: luminance(to) < 0.1 && luminance(from) < 0.3,
  };
}

// Classes à poser sur la section (le module CSS des sections définit .warm et .dark)
export const skyClass = (s: Record<string, string>, sky: Sky) =>
  [s.section, sky.warm ? s.warm : "", sky.dark ? s.dark : ""].filter(Boolean).join(" ");
