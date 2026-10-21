// L'événement : un seul endroit à modifier pour l'adapter (l'adresse exacte est dans la variable EVENT_ADDRESS)

const BASE = {
  name: "Camille",
  age: 30,
  // Heure locale avec décalage. La fin est une estimation pour l'agenda.
  start: "2026-10-31T20:00:00+01:00",
  end: "2026-11-01T02:00:00+01:00",
  timeZone: "Europe/Paris",
  place: "Chez moi",
  city: "Montreuil",
  // Photos dans /public (optionnelles : une illustration les remplace sinon)
  photos: {
    hero: null as { src: string; alt: string } | null,
    rsvp: null as { src: string; alt: string } | null,
  },
  // Préfixe des clés gardées dans le navigateur (une par événement)
  storageKey: "rsvp-party",
};

const fmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("fr-FR", { timeZone: BASE.timeZone, ...opts }).format(new Date(BASE.start));
const two = (n: string) => n.padStart(2, "0");
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const day = two(fmt({ day: "numeric" }));
const month = two(fmt({ month: "numeric" }));
const year = fmt({ year: "numeric" });
const hour = fmt({ hour: "numeric", hour12: false }).replace(/\D/g, "");

export const EVENT = {
  ...BASE,
  title: `Les ${BASE.age} ans de ${BASE.name}`,
  // « Samedi 12 juin »
  dateLong: cap(fmt({ weekday: "long", day: "numeric", month: "long" })),
  // « Samedi 12.06 »
  dateShortWithDay: `${cap(fmt({ weekday: "long" }))} ${day}.${month}`,
  // « 12.06 », « 12.06.2027 »
  dateShort: `${day}.${month}`,
  dateFull: `${day}.${month}.${year}`,
  // « 20h »
  time: `${Number(hour)}h`,
  // « juin », pour le « À juin » de la fin
  month: fmt({ month: "long" }),
  // Format agenda : 20270612T180000Z
  icsStart: new Date(BASE.start).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""),
  icsEnd: new Date(BASE.end).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""),
  description: `On fête mes ${BASE.age} ans ! RDV ${Number(hour)}h chez moi.`,
};
