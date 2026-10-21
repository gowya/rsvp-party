"use client";

import { skyClass, type Sky } from "@/lib/sky";
import { EVENT } from "@/data/event";
import { useLive } from "@/lib/live";
import { DrinkChampagne } from "../illus/Drinks";
import DrawerTrigger from "../DrawerTrigger";
import s from "./sections.module.css";

const COLORS = ["var(--rose)", "var(--sun-400)", "var(--mint)", "var(--lilac)", "var(--apricot)", "var(--sun-50)"];
const TILTS = [-3, 2, -1, 3, -2, 1, 0];

// Ils seront là : la personne fêtée en star, puis les « oui », en direct
export default function Guests({ sky }: { sky: Sky }) {
  const { guests, me, flying } = useLive();
  const meComing = me?.answer === "oui";

  return (
    <section className={skyClass(s, sky)} style={sky.style} id="invites">
      <div className={s.wrap}>
        <div className={s.guestsHead}>
          <div>
            <span className={s.kicker}>✦ En direct</span>
            <h2 className={s.title}>
              Ils seront
              <br />
              <span className={s.sunset}>là</span>
            </h2>
          </div>
          {guests.length > 0 ? (
            <p className={s.guestCount}>
              <span className={s.guestNum}>{guests.length}</span>
              <span className={s.label}>{guests.length > 1 ? "personnes confirmées" : "personne confirmée"}</span>
            </p>
          ) : (
            <a className={`${s.hand} ${s.guestEmpty}`} href="#rsvp">
              Personne n&apos;a encore répondu… sois la première personne ↓
            </a>
          )}
        </div>

        <ul className={s.pills}>
          <li className={`${s.pill} ${s.pillStar}`} data-star="">
            {EVENT.name} ☀︎
          </li>
          {guests.map((g, i) => {
            const mine = g.id === me?.id;
            return (
              <li
                key={g.id}
                className={s.pill}
                // Sa propre pastille : en menthe, et cachée pendant que la copie vole jusqu'ici
                {...(mine ? { "data-me": "" } : {})}
                style={{
                  background: mine ? "var(--mint)" : COLORS[i % COLORS.length],
                  rotate: `${TILTS[i % TILTS.length]}deg`,
                  visibility: mine && flying ? "hidden" : "visible",
                }}
              >
                {g.name}
              </li>
            );
          })}
          {!meComing && (
            <li>
              <a className={`${s.pill} ${s.pillGhost}`} href="#rsvp">
                + toi ?
              </a>
            </li>
          )}
        </ul>

        <DrawerTrigger flip className={`${s.deco} ${s.guestsDeco}`}>
          <DrinkChampagne />
        </DrawerTrigger>
      </div>
    </section>
  );
}
