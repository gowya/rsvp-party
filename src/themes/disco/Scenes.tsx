"use client";

import { gsap, useGSAP } from "@/lib/gsap";

/*
 * L'animation signature du thème disco, un coucher de soleil raconté au scroll :
 * 1. le soleil du hero descend sous l'horizon
 * 2. le ciel des sections passe du jour à la nuit (fond calculé dans lib/sky.ts)
 * 3. sur la fin, en pleine nuit, les étoiles s'allument et la lune se lève
 */
export default function Scenes() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const hero = document.getElementById("hero");
      if (hero) {
        gsap.fromTo(
          hero,
          { "--sunset": 0 },
          { "--sunset": 1, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 } },
        );
      }

      gsap
        .timeline({ scrollTrigger: { trigger: "#fin", start: "top 85%", end: "bottom bottom", scrub: 0.8 } })
        .to("[data-outro-night]", { opacity: 1, ease: "none" }, 0)
        .fromTo("[data-outro-moon]", { yPercent: 30 }, { yPercent: 0, ease: "none" }, 0);
    });
  });

  return null;
}
