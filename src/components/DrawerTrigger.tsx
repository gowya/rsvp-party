"use client";

import type { CSSProperties, ReactNode } from "react";
import { openDrawer } from "./drawer";
import { THEME } from "@/themes";
import { EVENT } from "@/data/event";
import { Mirror } from "./illus/shared";

// Un objet décoratif qui ouvre le tiroir de l'easter egg quand on clique dessus
export default function DrawerTrigger({
  className,
  style,
  flip = false,
  children,
}: {
  className?: string;
  flip?: boolean;
  style?: CSSProperties;
  children: ReactNode;
}) {
  // Easter egg désactivé : simple décor
  if (!EVENT.easterEgg.enabled) {
    return (
      <div className={className} style={{ pointerEvents: "none", ...style }}>
        <Mirror flip={flip}>{children}</Mirror>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={className}
      style={{ background: "none", border: 0, padding: 0, cursor: "pointer", pointerEvents: "auto", ...style }}
      onClick={openDrawer}
      aria-label={THEME.easterEgg.open}
    >
      <Mirror flip={flip}>{children}</Mirror>
    </button>
  );
}
