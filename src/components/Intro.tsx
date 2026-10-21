"use client";

import { useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import DiscoBall from "./DiscoBall";
import Image from "next/image";
import { EVENT } from "@/data/event";
import PhotoPlaceholder from "./PhotoPlaceholder";
import { CocktailPornstar } from "./Cocktails";
import { openSockDrawer } from "./sockLibrary";
import { SockFlames, SockFlip, SockLeopard, SockMelon, SockSmiley, SockToes } from "./Socks";
import MotionButton from "./MotionButton";
import { markIntroDone } from "@/lib/motion";
import s from "./Intro.module.css";

gsap.registerPlugin(useGSAP);

const NAME = EVENT.name.toUpperCase();
const CTA_TEXT = "CONFIRME TA PRÉSENCE ✦ CONFIRME TA PRÉSENCE ✦ ";

const SOCKS = [
  { slot: s.sock1, Comp: SockToes, flip: false, depth: 1.3 },
  { slot: s.sock2, Comp: SockLeopard, flip: true, depth: 1 },
  { slot: s.sock3, Comp: SockMelon, flip: true, depth: 1.2 },
  { slot: s.sock4, Comp: SockSmiley, flip: false, depth: 0.6 },
  { slot: s.sock5, Comp: SockFlames, flip: true, depth: 0.5 },
];

export default function Intro() {
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
        gsap.set(`.${s.sock}`, { scale: 0, rotate: "-=50" });
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
          .to(`.${s.sock}`, { scale: 1, rotate: "+=50", duration: 0.7, stagger: 0.05, ease: "back.out(2)" }, "<-0.3")
          .to(`.${s.reveal}`, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08, clearProps: "transform" }, "<0.1")
          .add(() => {
            html.style.overflow = "";
            markIntroDone();
            // Les chaussettes flottent ensuite en continu
            gsap.utils.toArray<HTMLElement>(`.${s.sock}`).forEach((el, i) => {
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
          <div className={s.badge}>
            <span className={s.badgeNum}>{EVENT.age}</span>
            <span className={s.badgePill}>ans</span>
          </div>
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

        {SOCKS.map(({ slot, Comp, flip, depth }, i) => (
          <div key={i} className={`${s.sockSlot} ${slot}`} style={{ "--depth": depth } as CSSProperties}>
            <button type="button" className={s.sock} onClick={openSockDrawer} aria-label="Ouvrir le tiroir à chaussettes">
              <SockFlip value={flip}>
                <Comp />
              </SockFlip>
            </button>
          </div>
        ))}
        <div className={`${s.sockSlot} ${s.sock6}`} style={{ "--depth": 0.8 } as CSSProperties}>
          <div className={s.sock}>
            <CocktailPornstar />
          </div>
        </div>

        <div className={`${s.info} ${s.reveal}`}>
          <p className={s.infoTitle}>On fête mes {EVENT.age} ans.</p>
          <p className={s.infoMeta}>
            {EVENT.dateShortWithDay} · {EVENT.time} · {EVENT.city}
          </p>
          <MotionButton className={s.motionBtn} />
        </div>

        <a href="#rsvp" className={`${s.cta} ${s.reveal}`} aria-label="Confirme ta présence">
          <svg viewBox="0 0 200 200" className={s.ctaRing} aria-hidden="true">
            <defs>
              <path id="cta-circle" d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0" />
            </defs>
            <text>
              <textPath href="#cta-circle" textLength="462">
                {CTA_TEXT}
              </textPath>
            </text>
          </svg>
          <span className={s.ctaCenter} aria-hidden="true">↓</span>
        </a>
      </section>
    </div>
  );
}
