import { EVENT } from "@/data/event";
import { MAX_OTHERS_PER_GUEST, OTHER_MAX, POLL_ITEMS, POLL_KEYS } from "@/lib/poll";
import { sql } from "@/server/db";
import { disabled, getPublicState, isToken, json } from "@/server/state";

// Cocher ce qu'on ramène : il faut avoir répondu au formulaire, et respecter les limites par truc
export async function POST(request: Request) {
  if (!EVENT.sections.poll) return disabled();
  const body = await request.json().catch(() => null);
  const { token, brings, others } = (body ?? {}) as Record<string, unknown>;
  if (!isToken(token) || !Array.isArray(brings)) return json({ error: "invalid" }, 400);

  const clean = [...new Set(brings.filter((b): b is string => typeof b === "string" && (POLL_KEYS as string[]).includes(b)))];
  const otherList = [
    ...new Set(
      (Array.isArray(others) ? others : [])
        .filter((o): o is string => typeof o === "string")
        .map((o) => o.trim().replace(/\s+/g, " ").slice(0, OTHER_MAX))
        .filter(Boolean),
    ),
  ].slice(0, MAX_OTHERS_PER_GUEST);

  const [mine] = (await sql()`select id, answer, brings from responses where token = ${token}`) as { id: string; answer: string; brings: string[] }[];
  if (!mine) return json({ error: "answer-first" }, 404);

  // Les trucs nouvellement cochés ne doivent pas dépasser leur limite (on ne compte pas la personne elle-même)
  const added = clean.filter((k) => !mine.brings.includes(k));
  const limited = POLL_ITEMS.filter((it) => it.limit !== null && added.includes(it.key));
  if (limited.length) {
    const rows = (await sql()`
      select unnest(brings) as k, count(*)::int as n from responses
      where answer <> 'non' and id <> ${mine.id}
      group by k
    `) as { k: string; n: number }[];
    const full = limited.find((it) => (rows.find((r) => r.k === it.key)?.n ?? 0) >= (it.limit as number));
    if (full) return json({ error: "full", key: full.key, ...(await getPublicState(token)) }, 409);
  }

  await sql()`update responses set brings = ${clean}, brings_others = ${otherList}, updated_at = now() where id = ${mine.id}`;
  return json(await getPublicState(token));
}
