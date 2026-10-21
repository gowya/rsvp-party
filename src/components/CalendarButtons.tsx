"use client";

import { useSyncExternalStore } from "react";
import { androidCalendarIntent, detectPlatform, googleCalendarUrl, type Platform } from "@/lib/calendar";
import { getToken, useLive } from "@/lib/live";

const noop = () => () => {};

/*
 * Ajout à l'agenda selon l'appareil (l'adresse exacte y figure dès que la personne a confirmé) :
 * - iPhone : le calendrier de l'iPhone via le fichier .ics (on peut y choisir son agenda Google)
 * - Android : l'appli Google Agenda préremplie, ou un autre agenda via le .ics
 * - ordinateur : Google Agenda sur le web, ou Apple / Outlook via le .ics
 */
export default function CalendarButtons({ className, primaryClass, rowClass }: { className: string; primaryClass?: string; rowClass: string }) {
  const { address } = useLive();
  const platform = useSyncExternalStore<Platform>(noop, detectPlatform, () => "desktop");
  const icsLink = (label: string, extra = "") => (
    <a className={`${className} ${extra}`} href="/api/ics" onClick={(e) => (e.currentTarget.href = `/api/ics?token=${getToken()}`)}>
      {label}
    </a>
  );

  if (platform === "ios") return <div className={rowClass}>{icsLink("+ Ajouter à mon agenda", primaryClass)}</div>;

  return (
    <div className={rowClass}>
      <a
        className={`${className} ${primaryClass ?? ""}`}
        href={platform === "android" ? androidCalendarIntent(address) : googleCalendarUrl(address)}
        target={platform === "android" ? undefined : "_blank"}
        rel="noopener"
      >
        + Google Agenda
      </a>
      {icsLink(platform === "android" ? "+ Autre agenda" : "+ Apple / Outlook")}
    </div>
  );
}
