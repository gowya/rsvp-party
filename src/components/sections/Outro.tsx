import { DrinkEspressoMartini, DrinkPinaColada } from "../illus/Drinks";
import { DRAWER } from "../drawerItems";
import { EVENT } from "@/data/event";
import DrawerTrigger from "../DrawerTrigger";
import CalendarButtons from "../CalendarButtons";
import s from "./sections.module.css";

// Tirage pseudo-aléatoire stable, pour placer les étoiles pareil au rendu serveur et dans le navigateur
function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}
const rand = seeded(1912);
const STARS = Array.from({ length: 42 }, () => ({
  left: rand() * 100,
  top: rand() * 58,
  size: 5 + rand() * 11,
  delay: rand() * 2.4,
}));

export default function Outro() {
  return (
    <section className={s.outro} id="fin">
      <div className={s.outroNight}>
        {STARS.map((star, i) => (
          <span
            key={i}
            className={s.star}
            style={{ left: `${star.left}%`, top: `${star.top}%`, width: star.size, height: star.size, animationDelay: `${star.delay}s` }}
          />
        ))}
      </div>
      <div className={s.outroSun} />
      <div className={s.outroContent}>
        <h2 className={s.outroTitle}>
          <span>À</span>
          <span>{EVENT.month}</span>
        </h2>
        <CalendarButtons rowClass={`${s.btnRow} ${s.btnRowCenter}`} className={s.btn} primaryClass={s.btnPrimary} />
      </div>
      <DrawerTrigger className={s.deco} style={{ left: "8%", top: "16%", width: "clamp(70px, 9vw, 130px)", rotate: "-16deg" }}>
        <DrinkEspressoMartini />
      </DrawerTrigger>
      <DrawerTrigger flip className={s.deco} style={{ right: "8%", top: "26%", width: "clamp(60px, 8vw, 110px)", rotate: "20deg" }}>
        <DrinkPinaColada />
      </DrawerTrigger>
      <footer className={s.footer}>
        <span>
          {EVENT.name} ☀︎ {EVENT.age} ans
        </span>
        <span>{DRAWER.hint}</span>
        <span>{EVENT.dateFull}</span>
      </footer>
    </section>
  );
}
