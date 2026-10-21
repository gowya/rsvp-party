"use client";

import { EVENT } from "@/data/event";

const TITLE = EVENT.title;
const DETAILS = EVENT.description;

// Lien Google Agenda : l'adresse exacte seulement si la personne a confirmé, sinon la ville
export function googleCalendarUrl(address: string | null) {
  return (
    // « eventedit » s'affiche en version mobile (l'ancien « render?action=TEMPLATE » ouvre la version ordinateur)
    "https://calendar.google.com/calendar/r/eventedit?" +
    new URLSearchParams({
      text: TITLE,
      dates: `${EVENT.icsStart}/${EVENT.icsEnd}`,
      details: DETAILS,
      location: address ?? EVENT.city,
    }).toString()
  );
}

// Android : ouvre l'appli d'agenda (Google Agenda) avec l'événement prérempli
export function androidCalendarIntent(address: string | null) {
  const enc = encodeURIComponent;
  return (
    "intent:#Intent;action=android.intent.action.INSERT;type=vnd.android.cursor.item/event;" +
    `S.title=${enc(TITLE)};S.description=${enc(DETAILS)};S.eventLocation=${enc(address ?? EVENT.city)};` +
    `l.beginTime=${Date.parse(EVENT.start)};l.endTime=${Date.parse(EVENT.end)};` +
    `S.browser_fallback_url=${enc(googleCalendarUrl(address))};end`
  );
}

export type Platform = "ios" | "android" | "desktop";

export function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  // Les iPad récents se présentent comme des Mac, d'où le test du tactile
  if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

export function mapsUrl(address: string) {
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(address);
}
