import { THEME } from "@/themes";
import { EVENT } from "@/data/event";
import DrawerTrigger from "../DrawerTrigger";
import CalendarButtons from "../CalendarButtons";
import s from "./sections.module.css";

const { OutroBackdrop } = THEME;
const [OutroLeft, OutroRight] = THEME.decor.outro ?? [null, null];

export default function Outro() {
  return (
    <section className={s.outro} id="fin">
      {OutroBackdrop && <OutroBackdrop />}
      <div className={s.outroContent}>
        <h2 className={s.outroTitle}>
          {EVENT.texts.outro.map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </h2>
        <CalendarButtons rowClass={`${s.btnRow} ${s.btnRowCenter}`} className={s.btn} primaryClass={s.btnPrimary} />
      </div>
      {OutroLeft && (
        <DrawerTrigger className={s.deco} style={{ left: "8%", top: "16%", width: "clamp(70px, 9vw, 130px)", rotate: "-16deg" }}>
          <OutroLeft />
        </DrawerTrigger>
      )}
      {OutroRight && (
        <DrawerTrigger flip className={s.deco} style={{ right: "8%", top: "26%", width: "clamp(60px, 8vw, 110px)", rotate: "20deg" }}>
          <OutroRight />
        </DrawerTrigger>
      )}
      <footer className={s.footer}>
        <span>
          {EVENT.name} ☀︎{EVENT.badge ? ` ${EVENT.badge.big} ${EVENT.badge.small}` : ""}
        </span>
        {EVENT.easterEgg.enabled && <span>{THEME.easterEgg.hint}</span>}
        <span>{EVENT.dateFull}</span>
      </footer>
    </section>
  );
}
