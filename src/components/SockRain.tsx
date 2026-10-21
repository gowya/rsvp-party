"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SOCK_RAIN_EVENT } from "@/lib/motion";
import { SOCK_LIBRARY } from "./sockLibrary";
import { SockFlip } from "./Socks";
import { repaintPatternsSoon } from "@/lib/repaint";

type Drop = { id: number; sock: number; left: number; size: number; flip: boolean; pile: number; rot: number };

let nextId = 0;

// Secouer le téléphone : une pluie de chaussettes qui s'empilent en bas de l'écran
export default function SockRain() {
  const root = useRef<HTMLDivElement>(null);
  const [drops, setDrops] = useState<Drop[]>([]);
  const raining = useRef(false);

  useEffect(() => {
    const onRain = () => {
      if (raining.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      raining.current = true;
      const count = window.innerWidth < 700 ? 16 : 24;
      setDrops(
        Array.from({ length: count }, () => ({
          id: nextId++,
          sock: Math.floor(Math.random() * SOCK_LIBRARY.length),
          left: Math.random() * 100,
          size: gsap.utils.random(64, 110),
          flip: Math.random() < 0.5,
          pile: Math.random(),
          rot: gsap.utils.random(-70, 70),
        })),
      );
      if (navigator.vibrate) navigator.vibrate(80);
    };
    window.addEventListener(SOCK_RAIN_EVENT, onRain);
    return () => window.removeEventListener(SOCK_RAIN_EVENT, onRain);
  }, []);

  useGSAP(
    () => {
      if (drops.length === 0) return;
      repaintPatternsSoon(root.current ?? undefined);
      const els = gsap.utils.toArray<HTMLElement>("[data-drop]");
      const h = window.innerHeight;
      const tl = gsap.timeline({
        onComplete: () => {
          raining.current = false;
          setDrops([]);
        },
      });
      els.forEach((el, i) => {
        const d = drops[i];
        // Plus la chaussette tombe tard, plus elle se pose haut sur la pile
        const land = h - d.size * 0.8 - d.pile * Math.min(140, h * 0.18) - (i / els.length) * 40;
        tl.fromTo(
          el,
          { y: -d.size * 1.6, rotation: d.rot - 120 },
          { y: land, rotation: d.rot, duration: gsap.utils.random(1, 1.5), ease: "bounce.out" },
          gsap.utils.random(0, 0.9),
        );
      });
      tl.to(els, { y: `+=${h * 0.4}`, autoAlpha: 0, duration: 0.6, stagger: 0.02, ease: "power2.in" }, "+=2.6");
    },
    { scope: root, dependencies: [drops] },
  );

  return (
    <div ref={root} aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 85, pointerEvents: "none", overflow: "hidden" }}>
      {drops.map((d) => {
        const Comp = SOCK_LIBRARY[d.sock].Comp;
        return (
          <div
            key={d.id}
            data-drop=""
            style={{
              position: "absolute",
              top: 0,
              left: `calc(${d.left}% - ${d.size / 2}px)`,
              width: d.size,
              filter: "drop-shadow(3px 4px 0 rgb(43 22 8 / 0.2))",
              transform: "translateY(-200px)",
            }}
          >
            <SockFlip value={d.flip}>
              <Comp />
            </SockFlip>
          </div>
        );
      })}
    </div>
  );
}
