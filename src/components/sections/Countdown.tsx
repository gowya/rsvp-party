"use client";

import { useEffect, useState } from "react";
import { EVENT } from "@/data/event";
import { DrinkSpritz } from "../illus/Drinks";
import DrawerTrigger from "../DrawerTrigger";
import s from "./sections.module.css";

const TARGET = new Date(EVENT.start).getTime();
const UNITS = ["Jours", "Heures", "Min", "Sec"];

function split(ms: number) {
  const t = Math.max(0, Math.floor(ms / 1000));
  return [Math.floor(t / 86400), Math.floor((t % 86400) / 3600), Math.floor((t % 3600) / 60), t % 60];
}

export default function Countdown() {
  // Rendu « -- » côté serveur, l'heure réelle n'arrive qu'au montage
  const [parts, setParts] = useState<number[] | null>(null);

  useEffect(() => {
    const tick = () => setParts(split(TARGET - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className={`${s.section} ${s.sky1}`} id="countdown">
      <svg className={s.wave} viewBox="0 0 1440 56" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 56 V28 C120 0 240 0 360 28 S600 56 720 28 S960 0 1080 28 S1320 56 1440 28 V56 Z" fill="var(--sky-1)" />
      </svg>
      <div className={s.wrap}>
        <span className={s.kicker}>✦ Le jour J approche</span>
        <h2 className={s.title}>
          Encore
          <br />
          <span className={s.outline}>un peu</span>
          <br />
          de patience
        </h2>
        <div className={s.countGrid} role="timer" aria-live="off">
          {UNITS.map((unit, i) => (
            <div key={unit} className={s.tile}>
              <span className={s.tileNum}>{parts ? String(parts[i]).padStart(2, "0") : "--"}</span>
              <span className={s.tileLabel}>{unit}</span>
            </div>
          ))}
        </div>
        <DrawerTrigger flip className={s.deco} style={{ right: "2%", top: "-4%", width: "clamp(70px, 10vw, 140px)", rotate: "16deg" }}>
          <DrinkSpritz />
        </DrawerTrigger>
      </div>
    </section>
  );
}
