import { sql } from "@/server/db";
import { getPublicState, isToken, json } from "@/server/state";

const ANSWERS = new Set(["oui", "peut-etre", "non"]);
const MAX_RESPONSES = 400;

// Envoyer ou modifier sa réponse (une seule par téléphone, grâce au token)
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return json({ error: "invalid" }, 400);
  const { token, name, answer, website } = body as Record<string, unknown>;

  // Champ invisible pour les humains : s'il est rempli, c'est un robot
  if (typeof website === "string" && website.trim()) return json({ error: "invalid" }, 400);

  const cleanName = typeof name === "string" ? name.trim().replace(/\s+/g, " ").slice(0, 40) : "";
  if (!isToken(token) || !cleanName || typeof answer !== "string" || !ANSWERS.has(answer)) {
    return json({ error: "invalid" }, 400);
  }

  const [{ total }] = (await sql()`select count(*)::int as total from responses`) as { total: number }[];
  if (total >= MAX_RESPONSES) {
    const [exists] = await sql()`select 1 from responses where token = ${token}`;
    if (!exists) return json({ error: "full" }, 429);
  }

  await sql()`
    insert into responses (token, name, answer)
    values (${token}, ${cleanName}, ${answer})
    on conflict (token) do update
      set name = excluded.name, answer = excluded.answer, updated_at = now()
  `;

  return json(await getPublicState(token));
}
