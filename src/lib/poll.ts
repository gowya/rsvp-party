import config from "@/event.config";

// Ce que les invités peuvent ramener (réglé dans src/event.config.ts, partagé entre le site et le serveur)
export const POLL_ITEMS = config.poll.items;

export const OTHER_MAX = 60;
export const MAX_OTHERS_PER_GUEST = config.poll.maxOthersPerGuest;

export const POLL_KEYS = POLL_ITEMS.map((it) => it.key);

export type { Answer } from "@/config/schema";
import type { Answer } from "@/config/schema";

// Nombre de sons qu'une personne peut proposer
export const MAX_SONGS_PER_GUEST = config.playlist.maxSongsPerGuest;

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
