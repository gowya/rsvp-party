"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { OPEN_DRAWER_EVENT, SOCK_LIBRARY } from "./sockLibrary";
import { SockFlip } from "./Socks";
import { repaintPatternsSoon } from "@/lib/repaint";
import s from "./SockDrawer.module.css";

type Drag = { startY: number; startP: number; lastY: number; lastT: number; v: number; moved: boolean; h: number; ac: AbortController };

const clamp01 = gsap.utils.clamp(0, 1);
const shuffleFlips = () => SOCK_LIBRARY.map(() => Math.random() < 0.5);

/*
 * Le tiroir à chaussettes, un easter egg : il se découvre au tap sur une chaussette.
 * Une fois découvert, sa poignée reste en bas de l'écran pour le rouvrir au doigt.
 * On le referme en le tirant vers le bas, en tapant à côté ou avec Échap.
 */
export default function SockDrawer() {
  const root = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLButtonElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const progress = useRef({ p: 0 });
  const drag = useRef<Drag | null>(null);
  // La poignée ne se montre qu'une fois le tiroir découvert, et seulement entre le hero et l'outro
  const discovered = useRef(false);
  const inZone = useRef(false);
  const [open, setOpen] = useState(false);
  const [flips, setFlips] = useState<boolean[]>([]);
  // Les 22 chaussettes ne sont construites qu'à la première découverte (page plus légère au chargement)
  const [ready, setReady] = useState(false);
  const [popKey, setPopKey] = useState(0);

  // p = 0 : fermé, p = 1 : ouvert
  const apply = (p: number) => {
    gsap.set(panel.current, { yPercent: (1 - p) * 100 });
    gsap.set(backdrop.current, { opacity: p });
    gsap.set(overlay.current, { visibility: p > 0 ? "visible" : "hidden" });
  };

  const showHandle = () => {
    const visible = discovered.current && inZone.current;
    gsap.to(handle.current, {
      yPercent: visible ? 0 : 160,
      autoAlpha: visible ? 1 : 0,
      duration: 0.5,
      ease: visible ? "back.out(2)" : "power2.in",
    });
  };

  const animateTo = (target: 0 | 1) => {
    gsap.killTweensOf(progress.current);
    if (target === 1) setOpen(true);
    gsap.to(progress.current, {
      p: target,
      duration: target ? 0.65 : 0.4,
      ease: target ? "back.out(1.05)" : "power3.in",
      onUpdate: () => apply(progress.current.p),
      onComplete: () => {
        if (target === 0) {
          setOpen(false);
          showHandle();
        } else panel.current?.focus({ preventScroll: true });
      },
    });
  };

  const openWithPop = () => {
    discovered.current = true;
    setReady(true);
    setFlips(shuffleFlips());
    setPopKey((k) => k + 1);
    animateTo(1);
  };

  // Les chaussettes tombent dans le tiroir à chaque ouverture au tap (après leur rendu)
  useGSAP(
    () => {
      if (!popKey) return;
      repaintPatternsSoon(root.current ?? undefined);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(`.${s.item}`, {
        y: 60,
        scale: 0.6,
        rotate: () => gsap.utils.random(-30, 30),
        autoAlpha: 0,
        duration: 0.6,
        stagger: 0.03,
        delay: 0.25,
        ease: "back.out(2)",
      });
    },
    { scope: root, dependencies: [popKey] },
  );

  // Ouverture au tap sur une chaussette du site
  useEffect(() => {
    const onOpen = () => openWithPop();
    window.addEventListener(OPEN_DRAWER_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_DRAWER_EVENT, onOpen);
  });

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && animateTo(0);
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  });

  // La poignée : cachée au départ, puis elle sautille de temps en temps une fois visible
  useGSAP(
    () => {
      // Position de départ posée par GSAP seul (un transform CSS serait relu comme un décalage en px)
      gsap.set(panel.current, { y: 0 });
      apply(0);
      gsap.set(handle.current, { yPercent: 160, autoAlpha: 0 });
      // Zone autorisée : après le hero, avant l'outro (elle y cacherait le bas de page).
      // Éléments passés directement : un sélecteur texte serait cherché dans le tiroir (scope du contexte GSAP)
      ScrollTrigger.create({
        trigger: document.getElementById("hero"),
        start: "bottom 70%",
        endTrigger: document.getElementById("fin"),
        end: "top 60%",
        onToggle: (self) => {
          inZone.current = self.isActive;
          showHandle();
        },
      });
      gsap
        .timeline({ repeat: -1, repeatDelay: 7, delay: 9 })
        .to(handle.current, { y: -10, duration: 0.2, ease: "power2.out" })
        .to(handle.current, { y: 0, duration: 0.5, ease: "bounce.out" });
    },
    { scope: root },
  );

  const onMove = (e: PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dy = e.clientY - d.startY;
    if (Math.abs(dy) > 6) d.moved = true;
    const dt = e.timeStamp - d.lastT;
    if (dt > 0) d.v = (e.clientY - d.lastY) / dt;
    d.lastY = e.clientY;
    d.lastT = e.timeStamp;
    progress.current.p = clamp01(d.startP - dy / d.h);
    apply(progress.current.p);
  };

  const onEnd = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    d.ac.abort();
    if (!d.moved) {
      // Simple tap : la poignée ouvre, le haut du tiroir ouvert ne fait rien
      if (d.startP === 0) openWithPop();
      else animateTo(1);
      return;
    }
    const flickUp = d.v < -0.45;
    const flickDown = d.v > 0.45;
    const threshold = d.startP === 0 ? 0.3 : 0.75;
    animateTo(flickUp || (!flickDown && progress.current.p > threshold) ? 1 : 0);
  };

  const onStart = (e: ReactPointerEvent) => {
    // Les boutons du haut du tiroir restent cliquables
    if (e.currentTarget !== handle.current && (e.target as HTMLElement).closest("button")) return;
    gsap.killTweensOf(progress.current);
    if (progress.current.p === 0) setFlips(shuffleFlips());
    const ac = new AbortController();
    drag.current = {
      startY: e.clientY,
      startP: progress.current.p,
      lastY: e.clientY,
      lastT: e.timeStamp,
      v: 0,
      moved: false,
      h: panel.current?.offsetHeight ?? window.innerHeight,
      ac,
    };
    window.addEventListener("pointermove", onMove, { signal: ac.signal });
    window.addEventListener("pointerup", onEnd, { signal: ac.signal });
    window.addEventListener("pointercancel", onEnd, { signal: ac.signal });
  };

  return (
    <div ref={root}>
      <button ref={handle} type="button" className={s.handle} onPointerDown={onStart} aria-label="Ouvrir le tiroir à chaussettes">
        <span className={s.handleKnob} aria-hidden="true" />
        <span className={s.handleLabel}>🧦 tire-moi</span>
      </button>

      <div ref={overlay} className={s.overlay} role="dialog" aria-modal="true" aria-hidden={!open} aria-labelledby="drawer-title">
        <div ref={backdrop} className={s.backdrop} onClick={() => animateTo(0)} />
        <div ref={panel} className={s.panel} tabIndex={-1}>
          <div className={s.grab} onPointerDown={onStart}>
            <span className={s.knob} aria-hidden="true" />
            <header className={s.head}>
              <div>
                <p className={s.kicker}>✦ Easter egg débloqué</p>
                <h2 id="drawer-title" className={s.title}>
                  Mon tiroir à chaussettes
                </h2>
                <p className={s.sub}>{SOCK_LIBRARY.length} paires. Oui, je sais.</p>
              </div>
            </header>
          </div>
          <div className={s.body}>
            {ready && (
              <ul className={s.grid}>
                {SOCK_LIBRARY.map(({ key, label, Comp }, i) => (
                  <li key={key} className={s.item}>
                    <SockFlip value={flips[i] ?? false}>
                      <Comp className={s.sock} />
                    </SockFlip>
                    <span className={s.label}>{label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
