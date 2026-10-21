// Ce que les invités peuvent ramener (partagé entre le site et le serveur).
// limit : nombre de personnes max par truc, null = pas de limite
export const POLL_ITEMS = [
  { key: "softs", label: "Softs", emoji: "🧃", limit: 15 },
  { key: "alcool", label: "Alcool", emoji: "🍾", limit: null },
  { key: "chips", label: "Chips", emoji: "🍟", limit: 6 },
  { key: "bonbons", label: "Bonbons", emoji: "🍬", limit: 7 },
  { key: "pizza", label: "Pizza", emoji: "🍕", limit: 10 },
  { key: "gobelets", label: "Gobelets", emoji: "🥤", limit: 2 },
] as const satisfies readonly { key: string; label: string; emoji: string; limit: number | null }[];

// « Autre chose » : jusqu'à 3 textes libres par personne, affiché comme une ligne de plus dans la liste
export const OTHER_MAX = 60;
export const MAX_OTHERS_PER_GUEST = 3;

export type PollKey = (typeof POLL_ITEMS)[number]["key"];

export const POLL_KEYS = POLL_ITEMS.map((it) => it.key) as PollKey[];

export type Answer = "oui" | "peut-etre" | "non";

// Nombre de sons qu'une personne peut proposer
export const MAX_SONGS_PER_GUEST = 5;

// Ce que le site public reçoit du serveur
export type PublicState = {
  guests: { id: string; name: string }[];
  counts: Record<string, number>;
  songs: { id: string; title: string }[];
  // Les « autre chose » de tout le monde, sans prénom
  others: { id: string; title: string }[];
  me: {
    id: string;
    name: string;
    answer: Answer;
    brings: string[];
    // Ce que la personne ramène en « Autres » (visible seulement par elle et l'admin)
    bringsOthers: string[];
    songs: { id: string; title: string }[];
  } | null;
  // L'adresse exacte, seulement pour qui a répondu oui ou peut-être
  address: string | null;
};
