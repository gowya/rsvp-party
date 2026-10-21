import { skyClass, type Sky } from "@/lib/sky";
import CalendarButtons from "../CalendarButtons";
import DresscodeIllus from "../DresscodeIllus";
import PlaceCard from "./PlaceCard";
import { DrinkMargarita } from "../illus/Drinks";
import { EVENT } from "@/data/event";
import DrawerTrigger from "../DrawerTrigger";
import s from "./sections.module.css";

export default function Infos({ sky }: { sky: Sky }) {
  return (
    <section className={skyClass(s, sky)} style={sky.style} id="infos">
      <div className={s.wrap}>
        <span className={s.kicker}>✦ À noter quelque part</span>
        <h2 className={s.title}>
          Les infos
          <br />
          <span className={s.sunset}>pratiques</span>
        </h2>

        <div className={s.bento}>
          <article className={s.card}>
            <p className={s.label}>Quand</p>
            <p className={s.cardBig}>{EVENT.dateLong}</p>
            <p className={s.cardMeta}>RDV {EVENT.time}</p>
            <CalendarButtons rowClass={s.btnRow} className={s.btn} />
          </article>

          <PlaceCard />

          {EVENT.dresscode && (
            <article className={`${s.card} ${s.dresscode}`}>
              <div>
                <p className={s.label}>Dress code</p>
                <p className={s.cardBig}>
                  {EVENT.dresscode.title} <span className={s.yellowMark}>{EVENT.dresscode.highlight}</span>
                </p>
                <p className={s.cardText}>{EVENT.dresscode.text}</p>
              </div>
              <DresscodeIllus />
            </article>
          )}
        </div>

        <DrawerTrigger className={`${s.deco} ${s.infosDeco}`}>
          <DrinkMargarita />
        </DrawerTrigger>
      </div>
    </section>
  );
}
