import config from "@/event.config";

// Valeurs dérivées de src/event.config.ts (dates formatées, sections effectives…), utilisées partout dans le site

const fmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("fr-FR", { timeZone: config.date.timeZone, ...opts }).format(new Date(config.date.start));
const two = (n: string) => n.padStart(2, "0");
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const icsDate = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

const day = two(fmt({ day: "numeric" }));
const month = two(fmt({ month: "numeric" }));
const year = fmt({ year: "numeric" });
const hour = Number(fmt({ hour: "numeric", hour12: false }).replace(/\D/g, ""));
const minute = fmt({ minute: "2-digit" }).padStart(2, "0");

// Invités, sondage et playlist n'existent pas sans formulaire de réponse
const rsvp = config.sections.rsvp;

export const EVENT = {
  ...config,
  // Sans formulaire de réponse, l'adresse ne pourrait jamais s'afficher : elle devient visible par tous
  revealAddress: rsvp ? config.place.revealAddress : ("always" as const),
  sections: {
    ...config.sections,
    guests: rsvp && config.sections.guests,
    poll: rsvp && config.sections.poll,
    playlist: rsvp && config.sections.playlist,
  },
  start: config.date.start,
  end: config.date.end,
  city: config.place.city,
  // « Samedi 31 octobre »
  dateLong: cap(fmt({ weekday: "long", day: "numeric", month: "long" })),
  // « Samedi 31.10 »
  dateShortWithDay: `${cap(fmt({ weekday: "long" }))} ${day}.${month}`,
  // « 31.10 », « 31.10.2026 »
  dateShort: `${day}.${month}`,
  dateFull: `${day}.${month}.${year}`,
  // « 20h », « 20h30 »
  time: minute === "00" ? `${hour}h` : `${hour}h${minute}`,
  // Format agenda : 20261031T190000Z
  icsStart: icsDate(config.date.start),
  icsEnd: icsDate(config.date.end),
};
