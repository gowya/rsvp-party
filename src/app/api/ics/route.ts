import { EVENT } from "@/data/event";
import { sql } from "@/server/db";
import { ADDRESS } from "@/server/private";
import { isToken } from "@/server/state";

// Fichier agenda (Apple, Outlook) : l'adresse exacte seulement pour qui a confirmé
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  let confirmed = false;
  if (isToken(token)) {
    const [row] = (await sql()`select answer from responses where token = ${token}`) as { answer: string }[];
    confirmed = Boolean(row && row.answer !== "non");
  }
  const location = (confirmed ? ADDRESS : EVENT.city).replace(/,/g, "\\,");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//rsvp-party//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${EVENT.storageKey}-${EVENT.icsStart}@rsvp-party`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${EVENT.icsStart}`,
    `DTEND:${EVENT.icsEnd}`,
    `SUMMARY:${EVENT.title}`,
    `DESCRIPTION:${EVENT.description}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      // inline : l'iPhone ouvre directement le calendrier au lieu de proposer un téléchargement
      "Content-Disposition": `inline; filename="${EVENT.storageKey}.ics"`,
      "Cache-Control": "no-store",
    },
  });
}
