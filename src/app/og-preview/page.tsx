import { notFound } from "next/navigation";
import DiscoBall from "@/themes/disco/DiscoBall";
import { DrinkCosmopolitan, DrinkMargarita, DrinkPinaColada, DrinkSpritz } from "@/themes/disco/illus/Drinks";
import { EVENT } from "@/data/event";
import s from "./og.module.css";

/*
 * Modèle de l'image d'aperçu des liens partagés (WhatsApp, Messages…), à capturer en local :
 * ouvrir http://localhost:3000/og-preview dans une fenêtre de 1080 x 1080, faire une capture,
 * l'enregistrer en JPEG de 800 px dans public/apercu.jpg. Page indisponible en ligne.
 */
export default function OgPreview() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <div className={s.frame}>
      <span className={s.string} />
      <div className={s.ball}>
        <DiscoBall className={s.ballInner} />
      </div>
      <DrinkSpritz className={`${s.item} ${s.a}`} />
      <DrinkMargarita className={`${s.item} ${s.b}`} />
      <DrinkPinaColada className={`${s.item} ${s.c}`} />
      <DrinkCosmopolitan className={`${s.item} ${s.d}`} />
      {EVENT.badge && (
        <div className={s.age}>
          <span className={s.ageNum}>{EVENT.badge.big}</span>
          <span className={s.agePill}>{EVENT.badge.small}</span>
        </div>
      )}
      <h1 className={s.name}>{EVENT.name.toUpperCase()}</h1>
      <p className={s.meta}>
        {EVENT.dateShortWithDay} · {EVENT.time} · {EVENT.city}
      </p>
    </div>
  );
}
