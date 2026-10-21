import "server-only";
import { sql } from "./db";

/*
 * Mode démo (variable DEMO_MODE=1) pour un site public de présentation :
 * - les réponses « graines » (is_seed) sont visibles par tous ;
 * - chaque visiteur ne voit, en plus, que ses propres réponses : rien de ce que tapent les autres ;
 * - les réponses des visiteurs s'effacent au bout de 2 jours ;
 * - l'admin ne montre que les graines et ne supprime rien.
 */
export const DEMO = process.env.DEMO_MODE === "1";

export async function cleanupDemo() {
  if (!DEMO) return;
  await sql()`delete from responses where not is_seed and created_at < now() - interval '2 days'`;
}
