import "server-only";
import { timingSafeEqual } from "node:crypto";

// Jamais envoyée au navigateur tant que la personne n'a pas confirmé. À définir dans la variable EVENT_ADDRESS.
// null tant qu'elle n'est pas renseignée : le site affiche alors seulement la ville.
export const ADDRESS: string | null = process.env.EVENT_ADDRESS?.trim() || null;

export function checkAdminPassword(input: unknown) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof input !== "string") return false;
  const a = Buffer.from(input.trim().toLowerCase());
  const b = Buffer.from(expected.trim().toLowerCase());
  return a.length === b.length && timingSafeEqual(a, b);
}
