"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import DiscoBall from "./DiscoBall";
import Image from "next/image";
import { EVENT } from "@/data/event";
import PhotoPlaceholder from "./PhotoPlaceholder";
import { CocktailPornstar } from "./illus/Cocktails";
import { openDrawer } from "@/components/drawer";
import { easterEgg } from "./easterEgg";
import { copy } from "./copy";
import { DrinkCosmopolitan, DrinkMargarita, DrinkNegroni, DrinkPinaColada, DrinkSpritz } from "./illus/Drinks";
import MotionButton from "@/components/MotionButton";
import { markIntroDone } from "@/lib/motion";
import s from "./Hero.module.css";

gsap.registerPlugin(useGSAP);

const NAME = EVENT.name.toUpperCase();
// Le bouton rond mène au formulaire, ou aux infos si le formulaire est désactivé
const CTA = EVENT.sections.rsvp
  ? { href: "#rsvp", label: "Confirme ta présence", ring: "CONFIRME TA PRÉSENCE ✦ CONFIRME TA PRÉSENCE ✦ " }
  : { href: EVENT.sections.infos ? "#infos" : "#fin", label: "Toutes les infos", ring: "TOUTES LES INFOS ✦ TOUTES LES INFOS ✦ TOUTES LES INFOS ✦ " };

const ITEMS = [
  { slot: s.slot1, Comp: DrinkSpritz, depth: 1.3 },
  { slot: s.slot2, Comp: DrinkMargarita, depth: 1 },
  { slot: s.slot3, Comp: DrinkPinaColada, depth: 1.2 },
  { slot: s.slot4, Comp: DrinkCosmopolitan, depth: 0.6 },
  { slot: s.slot5, Comp: DrinkNegroni, depth: 0.5 },
];

// Un objet du hero : ouvre le tiroir de l'easter egg s'il est actif, sinon simple décor
function Clickable({ className, children }: { className: string; children: ReactNode }) {
  if (!EVENT.easterEgg.enabled) return <div className={className}>{children}</div>;
  return (
    <button type="button" className={className} onClick={openDrawer} aria-label={easterEgg.open}>
      {children}
    </button>
  );
}

// Le premier écran du thème disco : chargement, soleil couchant rayé, boule disco, cocktails
export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(`.${s.loader}`, { display: "none" });
        markIntroDone();
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const html = document.documentElement;
        html.style.overflow = "hidden";

        gsap.set(`.${s.letter}`, { yPercent: 115 });
        gsap.set(`.${s.sun}`, { yPercent: 35, scale: 0.7, autoAlpha: 0 });
        gsap.set(`.${s.ball}`, { scale: 0.3, autoAlpha: 0 });
        gsap.set(`.${s.string}`, { scaleY: 0 });
        gsap.set(`.${s.badge}`, { scale: 0, rotate: -40 });
        gsap.set(`.${s.photo}`, { yPercent: -60, rotate: -25, autoAlpha: 0 });
        gsap.set(`.${s.item}`, { scale: 0, rotate: "-=50" });
        gsap.set(`.${s.reveal}`, { y: 24, autoAlpha: 0 });

        const progress = { v: 0 };
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.to(progress, {
          v: 100,
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate: () => {
            if (counter.current) counter.current.textContent = String(Math.round(progress.v));
          },
        })
          .fromTo(`.${s.lineFill}`, { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: "power2.inOut" }, 0)
          .to(`.${s.loaderInner}`, { y: -40, autoAlpha: 0, duration: 0.3, ease: "power2.in" }, "+=0.05")
          .to(`.${s.loader}`, { yPercent: -100, duration: 0.7, ease: "power4.inOut" }, "<0.1")
          .set(`.${s.loader}`, { display: "none" })
          .to(`.${s.sun}`, { yPercent: 0, scale: 1, autoAlpha: 1, duration: 1 }, "-=0.45")
          .to(`.${s.string}`, { scaleY: 1, duration: 0.4, ease: "power2.out" }, "<")
          .to(`.${s.ball}`, { scale: 1, autoAlpha: 1, duration: 0.9, ease: "back.out(1.6)" }, "<0.1")
          .to(`.${s.letter}`, { yPercent: 0, duration: 0.7, stagger: 0.05 }, "<0.1")
          .to(`.${s.badge}`, { scale: 1, rotate: -8, duration: 0.6, ease: "back.out(2.5)" }, "-=0.45")
          .to(`.${s.photo}`, { yPercent: 0, rotate: 6, autoAlpha: 1, duration: 0.8, ease: "elastic.out(1, 0.6)" }, "<")
          .to(`.${s.item}`, { scale: 1, rotate: "+=50", duration: 0.7, stagger: 0.05, ease: "back.out(2)" }, "<-0.3")
          .to(`.${s.reveal}`, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08, clearProps: "transform" }, "<0.1")
          .add(() => {
            html.style.overflow = "";
            markIntroDone();
            // Les objets flottent ensuite en continu
            gsap.utils.toArray<HTMLElement>(`.${s.item}`).forEach((el, i) => {
              gsap.to(el, {
                y: gsap.utils.random(-14, -6),
                rotate: `+=${i % 2 ? 7 : -7}`,
                duration: gsap.utils.random(1.8, 2.8),
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
              });
            });
          });

        return () => {
          html.style.overflow = "";
        };
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <div className={s.loader} aria-hidden="true">
        <div className={s.loaderInner}>
          <div className={s.count}>
            <span ref={counter}>0</span>
            <sup>%</sup>
          </div>
          <div className={s.line}>
            <span className={s.lineFill} />
          </div>
          <p className={s.caption}>on chauffe la boule disco…</p>
        </div>
      </div>

      <section className={s.hero} id="hero">
        <header className={`${s.topbar} ${s.reveal}`}>
          <span>✦ Invitation officielle</span>
          <span>{EVENT.dateFull}</span>
        </header>

        <div className={s.sunSet}>
          <div className={s.sun} />
        </div>
        <span className={s.string} />
        <div className={s.ballSlot}>
          <DiscoBall className={s.ball} />
        </div>

        <div className={s.title}>
          {EVENT.badge && (
            <div className={s.badge}>
              <span className={s.badgeNum}>{EVENT.badge.big}</span>
              <span className={s.badgePill}>{EVENT.badge.small}</span>
            </div>
          )}
          <h1 className={s.name} aria-label={NAME}>
            {NAME.split("").map((char, i) => (
              <span key={i} className={s.letterMask} aria-hidden="true">
                <span className={s.letter}>{char}</span>
              </span>
            ))}
          </h1>
        </div>

        <div className={s.photoSlot}>
          <figure className={s.photo}>
            <div className={s.photoInner}>
              {EVENT.photos.hero ? (
                <Image src={EVENT.photos.hero.src} alt={EVENT.photos.hero.alt} fill sizes="(max-width: 700px) 120px, 180px" priority />
              ) : (
                <PhotoPlaceholder variant="sun" />
              )}
            </div>
          </figure>
        </div>

        {ITEMS.map(({ slot, Comp, depth }, i) => (
          <div key={i} className={`${s.itemSlot} ${slot}`} style={{ "--depth": depth } as CSSProperties}>
            <Clickable className={s.item}>
              <Comp />
            </Clickable>
          </div>
        ))}
        <div className={`${s.itemSlot} ${s.slot6}`} style={{ "--depth": 0.8 } as CSSProperties}>
          <Clickable className={s.item}>
            <CocktailPornstar />
          </Clickable>
        </div>

        <div className={`${s.info} ${s.reveal}`}>
          <p className={s.infoTitle}>{EVENT.texts.tagline}</p>
          <p className={s.infoMeta}>
            {EVENT.dateShortWithDay} · {EVENT.time} · {EVENT.city}
          </p>
          <MotionButton className={s.motionBtn} labels={copy.motion} />
        </div>

        <a href={CTA.href} className={`${s.cta} ${s.reveal}`} aria-label={CTA.label}>
          <svg viewBox="0 0 200 200" className={s.ctaRing} aria-hidden="true">
            <defs>
              <path id="cta-circle" d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0" />
            </defs>
            <text>
              <textPath href="#cta-circle" textLength="462">
                {CTA.ring}
              </textPath>
            </text>
          </svg>
          <span className={s.ctaCenter} aria-hidden="true">↓</span>
        </a>

        {/* Vague qui raccorde le hero au ciel des sections */}
        <svg className={s.wave} viewBox="0 0 1440 56" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 56 V28 C120 0 240 0 360 28 S600 56 720 28 S960 0 1080 28 S1320 56 1440 28 V56 Z" fill="var(--sky-top)" />
        </svg>
      </section>
    </div>
  );
}
