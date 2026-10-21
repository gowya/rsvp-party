"use client";

import { EVENT } from "@/data/event";
import { mapsUrl } from "@/lib/calendar";
import { useLive } from "@/lib/live";
import s from "./sections.module.css";

// La carte « Où » : l'adresse exacte apparaît une fois la venue confirmée (ou tout de suite si revealAddress = always)
export default function PlaceCard() {
  const { address } = useLive();
  return (
    <article className={s.card}>
      <p className={s.label}>Où</p>
      <p className={s.cardBig}>{EVENT.place.label}</p>
      {address ? (
        <>
          <p className={s.cardText}>{address}</p>
          <div className={s.btnRow}>
            <a className={s.btn} href={mapsUrl(address)} target="_blank" rel="noopener">
              Ouvrir le plan ↗
            </a>
          </div>
        </>
      ) : EVENT.revealAddress === "always" ? (
        <p className={s.cardText}>À {EVENT.city}.</p>
      ) : (
        <>
          <p className={s.cardText}>À {EVENT.city}. L&apos;adresse exacte s&apos;affiche ici dès que tu as confirmé ta venue.</p>
          <div className={s.btnRow}>
            <a className={s.btn} href="#rsvp">
              Confirmer ma venue ↓
            </a>
          </div>
        </>
      )}
    </article>
  );
}
