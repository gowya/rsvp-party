import { defineEvent } from "./config/schema";

// L'événement : c'est le seul fichier à modifier pour créer un nouveau site.
// Le détail de chaque réglage est dans src/config/schema.ts.
// L'adresse exacte et le mot de passe admin sont dans les variables d'environnement (voir .env.example).

export default defineEvent({
  name: "Camille",
  badge: { big: "30", small: "ans" },
  title: "Les 30 ans de Camille",
  description: "Samedi 31 octobre, 20h, chez moi. Viens fêter mes 30 ans !",

  date: {
    start: "2026-10-31T20:00:00+01:00",
    end: "2026-11-01T02:00:00+01:00",
    timeZone: "Europe/Paris",
  },

  place: {
    label: "Chez moi",
    city: "Montpellier",
    revealAddress: "after-rsvp",
  },

  theme: "disco",

  photos: { hero: null, rsvp: null },

  sections: {
    countdown: true,
    infos: true,
    rsvp: true,
    guests: true,
    poll: true,
    playlist: true,
  },

  dresscode: {
    title: "Code couleur :",
    highlight: "jaune",
    text: "Du jaune sur toi, un peu ou beaucoup.",
  },

  poll: {
    items: [
      { key: "softs", label: "Softs", emoji: "🧃", limit: 15 },
      { key: "alcool", label: "Alcool", emoji: "🍾", limit: null },
      { key: "chips", label: "Chips", emoji: "🍟", limit: 6 },
      { key: "bonbons", label: "Bonbons", emoji: "🍬", limit: 7 },
      { key: "pizza", label: "Pizza", emoji: "🍕", limit: 10 },
      { key: "gobelets", label: "Gobelets", emoji: "🥤", limit: 2 },
    ],
    maxOthersPerGuest: 3,
  },

  playlist: { maxSongsPerGuest: 5 },

  easterEgg: { enabled: true },

  texts: {
    tagline: "On fête mes 30 ans.",
    rsvpCaption: "moi quand tu dis oui",
    thanks: {
      oui: "Trop bien, j'ai hâte de te voir !",
      "peut-etre": "Ok, je garde une place au chaud. Dis-moi vite !",
      non: "Snif. On trinquera à ta santé quand même.",
    },
    pollIntro: "coche ce que tu ramènes, merci beaucoup d'avance boss 😝",
    vinyl: "31.10 · 30 ANS",
    outro: ["À", "samedi"],
  },

  storageKey: "rsvp-party",
});
