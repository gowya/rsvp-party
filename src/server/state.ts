import "server-only";
import { POLL_KEYS, type Answer, type PublicState } from "@/lib/poll";
import { EVENT } from "@/data/event";
import { sql } from "./db";
import { ADDRESS } from "./private";

type Row = { id: string; token: string; name: string; answer: Answer; brings: string[]; brings_others: string[] };
type SongRow = { id: string; response_id: string; title: string };

// L'état public : prénoms des « oui », comptes du sondage, sons sans auteur, et la réponse de la personne
export async function getPublicState(token: string | null): Promise<PublicState> {
  // Sans formulaire de réponse, pas besoin de base de données
  if (!EVENT.sections.rsvp) {
    return { guests: [], counts: {}, songs: [], others: [], me: null, address: EVENT.revealAddress === "always" ? ADDRESS : null };
  }

  const [rows, songRows] = (await Promise.all([
    sql()`select id, token, name, answer, brings, brings_others from responses order by created_at`,
    sql()`select id, response_id, title from songs order by created_at`,
  ])) as [Row[], SongRow[]];

  const counts: Record<string, number> = Object.fromEntries(POLL_KEYS.map((k) => [k, 0]));
  for (const r of rows) {
    if (r.answer === "non") continue;
    for (const b of r.brings) if (b in counts) counts[b] += 1;
  }

  const mine = token ? rows.find((r) => r.token === token) : undefined;

  return {
    guests: rows.filter((r) => r.answer === "oui").map((r) => ({ id: r.id, name: r.name })),
    counts,
    // Anonymes : identifiant neutre et ordre alphabétique, pour qu'on ne puisse pas recouper avec les prénoms
    songs: songRows
      .map((s) => s.title)
      .sort((a, b) => a.localeCompare(b, "fr"))
      .map((title, i) => ({ id: `son-${i}`, title })),
    others: rows
      .filter((r) => r.answer !== "non")
      .flatMap((r) => r.brings_others)
      .sort((a, b) => a.localeCompare(b, "fr"))
      .map((title, i) => ({ id: `autre-${i}`, title })),
    me: mine
      ? {
          id: mine.id,
          name: mine.name,
          answer: mine.answer,
          brings: mine.brings,
          bringsOthers: mine.brings_others,
          songs: songRows.filter((s) => s.response_id === mine.id).map((s) => ({ id: s.id, title: s.title })),
        }
      : null,
    address: EVENT.revealAddress === "always" || (mine && mine.answer !== "non") ? ADDRESS : null,
  };
}

export const isToken = (t: unknown): t is string => typeof t === "string" && /^[A-Za-z0-9-]{16,64}$/.test(t);

export const isUuid = (v: unknown): v is string => typeof v === "string" && /^[0-9a-f-]{36}$/.test(v);

// Réponse des routes d'une section désactivée dans src/event.config.ts
export const disabled = () => json({ error: "disabled" }, 404);

export const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
