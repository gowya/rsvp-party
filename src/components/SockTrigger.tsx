"use client";

import type { CSSProperties, ReactNode } from "react";
import { openSockDrawer } from "./sockLibrary";
import { SockFlip } from "./Socks";

// Une chaussette décorative qui ouvre le tiroir quand on clique dessus
export default function SockTrigger({
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
      onClick={openSockDrawer}
      aria-label="Ouvrir le tiroir à chaussettes"
    >
      <SockFlip value={flip}>{children}</SockFlip>
    </button>
  );
}
