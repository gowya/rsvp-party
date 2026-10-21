import CalendarButtons from "../CalendarButtons";
import DresscodeIllus from "../DresscodeIllus";
import PlaceCard from "./PlaceCard";
import { DrinkMargarita } from "../illus/Drinks";
import { EVENT } from "@/data/event";
import DrawerTrigger from "../DrawerTrigger";
import s from "./sections.module.css";

export default function Infos() {
  return (
    <section className={`${s.section} ${s.sky2}`} id="infos">
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

          <article className={`${s.card} ${s.dresscode}`}>
            <div>
              <p className={s.label}>Dress code</p>
              <p className={s.cardBig}>
                Code couleur : <span className={s.yellowMark}>jaune</span>
              </p>
              <p className={s.cardText}>
                Du jaune sur toi, un peu ou beaucoup.
              </p>
            </div>
            <DresscodeIllus />
          </article>
        </div>

        <DrawerTrigger className={`${s.deco} ${s.infosDeco}`}>
          <DrinkMargarita />
        </DrawerTrigger>
      </div>
    </section>
  );
}
