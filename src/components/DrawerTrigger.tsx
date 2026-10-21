"use client";

import type { CSSProperties, ReactNode } from "react";
import { DRAWER, openDrawer } from "./drawerItems";
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
  return (
    <button
      type="button"
      className={className}
      style={{ background: "none", border: 0, padding: 0, cursor: "pointer", pointerEvents: "auto", ...style }}
      onClick={openDrawer}
      aria-label={DRAWER.open}
    >
      <Mirror flip={flip}>{children}</Mirror>
    </button>
  );
}
