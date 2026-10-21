import { THEME } from "@/themes";
import Title from "./Title";
import { skyClass, type Sky } from "@/lib/sky";
import CalendarButtons from "../CalendarButtons";
import PlaceCard from "./PlaceCard";
import { EVENT } from "@/data/event";
import DrawerTrigger from "../DrawerTrigger";
import s from "./sections.module.css";

const COPY = THEME.copy.infos;
const Decor = THEME.decor.infos;
const DresscodeIllus = THEME.DresscodeIllus;

export default function Infos({ sky }: { sky: Sky }) {
  return (
    <section className={skyClass(s, sky)} style={sky.style} id="infos">
      <div className={s.wrap}>
        <span className={s.kicker}>{COPY.kicker}</span>
        <Title lines={COPY.title} />

        <div className={s.bento}>
          <article className={s.card}>
            <p className={s.label}>{COPY.when}</p>
            <p className={s.cardBig}>{EVENT.dateLong}</p>
            <p className={s.cardMeta}>
              {COPY.rdv} {EVENT.time}
            </p>
            <CalendarButtons rowClass={s.btnRow} className={s.btn} />
          </article>

          <PlaceCard />

          {EVENT.dresscode && (
            <article className={`${s.card} ${s.dresscode}`}>
              <div>
                <p className={s.label}>{COPY.dresscode}</p>
                <p className={s.cardBig}>
                  {EVENT.dresscode.title} <span className={s.yellowMark}>{EVENT.dresscode.highlight}</span>
                </p>
                <p className={s.cardText}>{EVENT.dresscode.text}</p>
              </div>
              {DresscodeIllus && <DresscodeIllus />}
            </article>
          )}
        </div>

        {Decor && (
          <DrawerTrigger className={`${s.deco} ${s.infosDeco}`}>
            <Decor />
          </DrawerTrigger>
        )}
      </div>
    </section>
  );
}
