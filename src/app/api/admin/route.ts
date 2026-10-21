import { sql } from "@/server/db";
import { DEMO } from "@/server/demo";
import { checkAdminPassword } from "@/server/private";
import { isUuid, json } from "@/server/state";

// Toutes les réponses, avec les prénoms : réservé aux organisateurs
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!checkAdminPassword(body?.password)) return json({ error: "unauthorized" }, 401);

  const rows = await sql()`
    select r.id, r.name, r.answer, r.brings, r.brings_others, r.created_at, r.updated_at,
      coalesce(array_agg(s.title order by s.created_at) filter (where s.id is not null), '{}') as songs
    from responses r
    left join songs s on s.response_id = r.id
    where not ${DEMO} or r.is_seed
    group by r.id
    order by r.created_at
  `;
  return json({ responses: rows, demo: DEMO });
}

// Supprimer une réponse (doublon, test, spam)
export async function DELETE(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!checkAdminPassword(body?.password)) return json({ error: "unauthorized" }, 401);
  if (DEMO) return json({ error: "demo" }, 403);
  if (!isUuid(body?.id)) return json({ error: "invalid" }, 400);

  await sql()`delete from responses where id = ${body.id}`;
  return json({ ok: true });
}
