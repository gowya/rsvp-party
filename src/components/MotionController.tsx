"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { motion, rainItems } from "@/lib/motion";
import { repaintPatternsSoon } from "@/lib/repaint";

const clamp = gsap.utils.clamp(-1, 1);

/*
 * Chef d'orchestre du mouvement :
 * - inclinaison : gyroscope sur téléphone, souris sur ordinateur, lissée puis écrite en variables CSS sur le hero
 * - vitesse de scroll : fait tourner la boule disco plus vite
 * - secousse du téléphone : pluie d'objets (easter egg)
 */
export default function MotionController() {
  useEffect(() => {
    // Motifs SVG dessinés dès le chargement (contournement Safari)
    repaintPatternsSoon();
    const onLoad = () => repaintPatternsSoon();
    window.addEventListener("load", onLoad, { once: true });
    document.fonts?.ready.then(onLoad);
    if (prefersReducedMotion()) return () => window.removeEventListener("load", onLoad);

    const target = { x: 0, y: 0 };

    const onPointer = (e: PointerEvent) => {
      if (motion.gyroActive || e.pointerType === "touch") return;
      target.x = clamp((e.clientX / window.innerWidth - 0.5) * 2);
      target.y = clamp((e.clientY / window.innerHeight - 0.5) * 2);
    };

    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      motion.gyroActive = true;
      // Téléphone tenu normalement : environ 45° d'inclinaison avant / arrière
      target.x = clamp(e.gamma / 30);
      target.y = clamp((e.beta - 45) / 30);
    };

    // Secousse : plusieurs gros à-coups d'accélération rapprochés
    let last: { x: number; y: number; z: number } | null = null;
    let jolts: number[] = [];
    let cooldownUntil = 0;
    const onMotion = (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity;
      if (!a || a.x == null || a.y == null || a.z == null) return;
      const now = performance.now();
      if (last) {
        const delta = Math.abs(a.x - last.x) + Math.abs(a.y - last.y) + Math.abs(a.z - last.z);
        if (delta > 28) {
          jolts = [...jolts.filter((t) => now - t < 800), now];
          if (jolts.length >= 3 && now > cooldownUntil) {
            cooldownUntil = now + 6000;
            jolts = [];
            rainItems();
          }
        }
      }
      last = { x: a.x, y: a.y, z: a.z };
    };

    const scrollWatch = ScrollTrigger.create({
      onUpdate: (self) => {
        motion.spinBoost = Math.max(motion.spinBoost, Math.min(4, Math.abs(self.getVelocity()) / 900));
      },
    });

    let hero: HTMLElement | null = null;
    let lastX = 0;
    let lastY = 0;
    const tick = () => {
      motion.tiltX += (target.x - motion.tiltX) * 0.08;
      motion.tiltY += (target.y - motion.tiltY) * 0.08;
      motion.spinBoost *= 0.94;
      hero ??= document.getElementById("hero");
      if (hero && (Math.abs(motion.tiltX - lastX) > 0.002 || Math.abs(motion.tiltY - lastY) > 0.002)) {
        lastX = motion.tiltX;
        lastY = motion.tiltY;
        hero.style.setProperty("--tilt-x", motion.tiltX.toFixed(3));
        hero.style.setProperty("--tilt-y", motion.tiltY.toFixed(3));
      }
    };
    gsap.ticker.add(tick);

    window.addEventListener("pointermove", onPointer);
    window.addEventListener("deviceorientation", onOrientation);
    window.addEventListener("devicemotion", onMotion);

    return () => {
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(tick);
      scrollWatch.kill();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onOrientation);
      window.removeEventListener("devicemotion", onMotion);
    };
  }, []);

  return null;
}
