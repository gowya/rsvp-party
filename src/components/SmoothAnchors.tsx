"use client";

import { useEffect } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/*
 * Tous les liens internes (#rsvp…) font glisser la page jusqu'au bloc au lieu de sauter.
 * À l'arrivée, l'élément marqué data-land du bloc fait un petit rebond pour montrer où regarder.
 */
export default function SmoothAnchors() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = link?.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      e.preventDefault();

      if (prefersReducedMotion()) {
        target.scrollIntoView();
        return;
      }

      const distance = Math.abs(target.getBoundingClientRect().top);
      // Pas d'autoKill : sur iPhone, l'arrondi du scroll le déclenche et coupe l'animation dès le départ.
      // Un vrai geste (doigt posé, molette) interrompt quand même le défilement.
      const stop = () => tween.kill();
      const cleanup = () => {
        window.removeEventListener("touchstart", stop);
        window.removeEventListener("wheel", stop);
      };
      const tween = gsap.to(window, {
        scrollTo: { y: target, offsetY: 16, autoKill: false },
        duration: gsap.utils.clamp(0.7, 1.6, distance / 1400),
        ease: "power3.inOut",
        onInterrupt: cleanup,
        onComplete: () => {
          cleanup();
          const land = target.querySelector<HTMLElement>("[data-land]");
          if (land) {
            gsap.fromTo(land, { scale: 1 }, { scale: 1.035, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out", clearProps: "transform" });
          }
        },
      });
      window.addEventListener("touchstart", stop, { passive: true });
      window.addEventListener("wheel", stop, { passive: true });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
