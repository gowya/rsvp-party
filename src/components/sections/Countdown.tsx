"use client";

import { THEME } from "@/themes";
import Title from "./Title";
import { skyClass, type Sky } from "@/lib/sky";
import { useEffect, useState } from "react";
import { EVENT } from "@/data/event";
import DrawerTrigger from "../DrawerTrigger";
import s from "./sections.module.css";

const TARGET = new Date(EVENT.start).getTime();
const COPY = THEME.copy.countdown;
const UNITS = COPY.units;
const Decor = THEME.decor.countdown;

function split(ms: number) {
  const t = Math.max(0, Math.floor(ms / 1000));
  return [Math.floor(t / 86400), Math.floor((t % 86400) / 3600), Math.floor((t % 3600) / 60), t % 60];
}

export default function Countdown({ sky }: { sky: Sky }) {
  // Rendu « -- » côté serveur, l'heure réelle n'arrive qu'au montage
  const [parts, setParts] = useState<number[] | null>(null);

  useEffect(() => {
    const tick = () => setParts(split(TARGET - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className={skyClass(s, sky)} style={sky.style} id="countdown">
      <div className={s.wrap}>
        <span className={s.kicker}>{COPY.kicker}</span>
        <Title lines={COPY.title} />
        <div className={s.countGrid} role="timer" aria-live="off">
          {UNITS.map((unit, i) => (
            <div key={unit} className={s.tile}>
              <span className={s.tileNum}>{parts ? String(parts[i]).padStart(2, "0") : "--"}</span>
              <span className={s.tileLabel}>{unit}</span>
            </div>
          ))}
        </div>
        {Decor && (
          <DrawerTrigger flip className={s.deco} style={{ right: "2%", top: "-4%", width: "clamp(70px, 10vw, 140px)", rotate: "16deg" }}>
            <Decor />
          </DrawerTrigger>
        )}
      </div>
    </section>
  );
}
