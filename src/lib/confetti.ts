"use client";

import { gsap, prefersReducedMotion } from "./gsap";
import { THEME } from "@/themes";

const COLORS = THEME.confetti;

let layer: HTMLDivElement | null = null;

function getLayer() {
  if (layer && document.body.contains(layer)) return layer;
  layer = document.createElement("div");
  Object.assign(layer.style, { position: "fixed", inset: "0", pointerEvents: "none", zIndex: "95", overflow: "hidden" });
  document.body.appendChild(layer);
  return layer;
}

type BurstOptions = { count?: number; angle?: number; spread?: number; speed?: [number, number] };

// Explosion de confettis à un point de l'écran (coordonnées viewport)
export function burstConfetti(x: number, y: number, { count = 70, angle = -90, spread = 60, speed = [500, 1000] }: BurstOptions = {}) {
  if (prefersReducedMotion()) return;
  const host = getLayer();
  for (let i = 0; i < count; i++) {
    const el = document.createElement("i");
    const w = gsap.utils.random(6, 12);
    const round = Math.random() < 0.3;
    Object.assign(el.style, {
      position: "absolute",
      left: `${x}px`,
      top: `${y}px`,
      width: `${w}px`,
      height: `${round ? w : w * gsap.utils.random(0.4, 1.4)}px`,
      background: COLORS[i % COLORS.length],
      borderRadius: round ? "50%" : "2px",
      border: "1.5px solid #2b1608",
    });
    host.appendChild(el);
    const duration = gsap.utils.random(1.4, 2.2);
    gsap.to(el, {
      physics2D: { velocity: gsap.utils.random(speed[0], speed[1]), angle: angle + gsap.utils.random(-spread, spread), gravity: 1400 },
      rotation: gsap.utils.random(-720, 720),
      duration,
      ease: "none",
      onComplete: () => el.remove(),
    });
    gsap.to(el, { opacity: 0, delay: duration * 0.65, duration: duration * 0.35 });
  }
}
