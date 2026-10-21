"use client";

import { burstConfetti } from "./confetti";
import { gsap, prefersReducedMotion } from "./gsap";
import { setFlying } from "./live";

let flying = false;

const center = (r: DOMRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

/*
 * La confirmation (les confettis sont déjà partis au clic) : la pastille du prénom apparaît sur le bouton,
 * reste à l'écran pendant que la page descend jusqu'à « Ils seront là », puis atterrit à côté de la personne fêtée.
 * La vraie pastille, déjà dans la liste, reste cachée pendant le vol.
 */
export async function flyToGuests(name: string, from: DOMRect, pillClass: string) {
  const start = center(from);
  if (prefersReducedMotion() || flying) return;
  flying = true;
  setFlying(true);

  const pill = document.createElement("span");
  pill.className = pillClass;
  pill.textContent = name;
  Object.assign(pill.style, {
    position: "fixed",
    left: `${start.x}px`,
    top: `${start.y}px`,
    zIndex: "96",
    background: "var(--mint)",
    whiteSpace: "nowrap",
    pointerEvents: "none",
  });
  gsap.set(pill, { xPercent: -50, yPercent: -50, scale: 0, rotate: -12 });
  document.body.appendChild(pill);

  try {
    await gsap.to(pill, { scale: 1.25, rotate: 4, duration: 0.55, ease: "back.out(3)" });
    // La pastille remonte au milieu de l'écran et y reste pendant que la page défile dessous
    await gsap.to(pill, { top: window.innerHeight * 0.42, left: window.innerWidth / 2, duration: 0.5, ease: "power2.inOut" });
    await gsap.to(window, { scrollTo: { y: "#invites", offsetY: 24 }, duration: 1.3, ease: "power2.inOut" });

    const target = document.querySelector<HTMLElement>("[data-me]");
    if (target) {
      const end = center(target.getBoundingClientRect());
      // Trajectoire en cloche : x et y n'ont pas le même rythme
      await Promise.all([
        gsap.to(pill, { left: end.x, duration: 0.75, ease: "power2.inOut" }),
        gsap.to(pill, { top: end.y, duration: 0.75, ease: "back.in(1.4)" }),
        gsap.to(pill, { scale: 1, rotate: 0, duration: 0.75, ease: "power2.in" }),
      ]);
      setFlying(false);
      burstConfetti(end.x, end.y, { count: 36, spread: 80, speed: [300, 650] });
      const star = document.querySelector<HTMLElement>("[data-star]");
      if (star) gsap.fromTo(star, { rotation: -4 }, { rotation: 4, duration: 0.12, repeat: 5, yoyo: true, ease: "sine.inOut", clearProps: "transform" });
      if (navigator.vibrate) navigator.vibrate([30, 40, 30]);
    }
  } finally {
    pill.remove();
    setFlying(false);
    flying = false;
  }
}
