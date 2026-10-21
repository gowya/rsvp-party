"use client";

import { THEME } from "@/themes";
import Title from "./Title";
import { skyClass, type Sky } from "@/lib/sky";
import { EVENT } from "@/data/event";
import { useLive } from "@/lib/live";
import DrawerTrigger from "../DrawerTrigger";
import s from "./sections.module.css";

const COLORS = ["var(--pop-1)", "var(--brand-strong)", "var(--pop-3)", "var(--pop-2)", "var(--accent-soft)", "var(--paper)"];
const TILTS = [-3, 2, -1, 3, -2, 1, 0];

// Ils seront là : la personne fêtée en star, puis les « oui », en direct
const COPY = THEME.copy.guests;
const Decor = THEME.decor.guests;

export default function Guests({ sky }: { sky: Sky }) {
  const { guests, me, flying } = useLive();
  const meComing = me?.answer === "oui";

  return (
    <section className={skyClass(s, sky)} style={sky.style} id="invites">
      <div className={s.wrap}>
        <div className={s.guestsHead}>
          <div>
            <span className={s.kicker}>{COPY.kicker}</span>
            <Title lines={COPY.title} />
          </div>
          {guests.length > 0 ? (
            <p className={s.guestCount}>
              <span className={s.guestNum}>{guests.length}</span>
              <span className={s.label}>{COPY.count(guests.length)}</span>
            </p>
          ) : (
            <a className={`${s.hand} ${s.guestEmpty}`} href="#rsvp">
              {COPY.empty}
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
                  background: mine ? "var(--pop-3)" : COLORS[i % COLORS.length],
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
                {COPY.you}
              </a>
            </li>
          )}
        </ul>

        {Decor && (
          <DrawerTrigger flip className={`${s.deco} ${s.guestsDeco}`}>
            <Decor />
          </DrawerTrigger>
        )}
      </div>
    </section>
  );
}
