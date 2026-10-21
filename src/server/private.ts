import "server-only";
import { timingSafeEqual } from "node:crypto";

// Jamais envoyée au navigateur tant que la personne n'a pas confirmé. À définir dans la variable EVENT_ADDRESS.
export const ADDRESS = process.env.EVENT_ADDRESS?.trim() || "Adresse communiquée bientôt";

export function checkAdminPassword(input: unknown) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof input !== "string") return false;
  const a = Buffer.from(input.trim().toLowerCase());
  const b = Buffer.from(expected.trim().toLowerCase());
  return a.length === b.length && timingSafeEqual(a, b);
}
