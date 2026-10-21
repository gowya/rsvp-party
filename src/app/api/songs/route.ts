import { MAX_SONGS_PER_GUEST } from "@/lib/poll";
import { sql } from "@/server/db";
import { getPublicState, isToken, isUuid, json } from "@/server/state";

async function responseId(token: string) {
  const [row] = (await sql()`select id from responses where token = ${token}`) as { id: string }[];
  return row?.id ?? null;
}

// Proposer un son : il faut avoir répondu au formulaire (l'admin sait ainsi qui l'a proposé)
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const title = typeof body?.title === "string" ? body.title.trim().replace(/\s+/g, " ").slice(0, 100) : "";
  if (!isToken(body?.token) || !title) return json({ error: "invalid" }, 400);

  const id = await responseId(body.token);
  if (!id) return json({ error: "answer-first" }, 404);

  const [{ total }] = (await sql()`select count(*)::int as total from songs where response_id = ${id}`) as { total: number }[];
  if (total >= MAX_SONGS_PER_GUEST) return json({ error: "too-many" }, 429);

  await sql()`insert into songs (response_id, title) values (${id}, ${title})`;
  return json(await getPublicState(body.token));
}

// Retirer un de ses propres sons
export async function DELETE(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!isToken(body?.token) || !isUuid(body?.id)) return json({ error: "invalid" }, 400);

  const id = await responseId(body.token);
  if (!id) return json({ error: "answer-first" }, 404);

  await sql()`delete from songs where id = ${body.id} and response_id = ${id}`;
  return json(await getPublicState(body.token));
}
