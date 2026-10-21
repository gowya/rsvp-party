import { EVENT } from "@/data/event";
import type { Theme } from "./types";
import { disco } from "./disco";

// Les thèmes disponibles. Pour en ajouter un : créer src/themes/<nom>, l'importer ici,
// puis l'ajouter au type `theme` de src/config/schema.ts.
const THEMES: Record<typeof EVENT.theme, Theme> = { disco };

export const THEME = THEMES[EVENT.theme];

// Les couleurs du thème en variables CSS, posées sur <html>
export function themeCssVars(theme: Theme): Record<string, string> {
  const c = theme.colors;
  const ramp = theme.sky.ramp;
  return {
    "--ink": c.ink,
    "--ink-soft": c.inkSoft,
    "--paper": c.paper,
    "--paper-2": c.paper2,
    "--brand": c.brand,
    "--brand-strong": c.brandStrong,
    "--accent": c.accent,
    "--accent-mid": c.accentMid,
    "--accent-soft": c.accentSoft,
    "--pop-1": c.pop1,
    "--pop-2": c.pop2,
    "--pop-3": c.pop3,
    "--sky-top": ramp[0],
    "--sky-bottom": ramp[ramp.length - 1],
    "--night": theme.sky.night,
  };
}
