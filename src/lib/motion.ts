import { repaintPatternsSoon } from "./repaint";

// État de mouvement partagé : inclinaison (souris ou gyroscope), vitesse de scroll, secousse

export const motion = {
  // -1..1, lissés par MotionController
  tiltX: 0,
  tiltY: 0,
  // Accélération de la boule disco quand on scrolle vite
  spinBoost: 0,
  // true dès que le gyroscope envoie des données (la souris ne pilote plus l'inclinaison)
  gyroActive: false,
  // true quand l'intro (loader + hero) est terminée
  introDone: false,
};

export const ITEM_RAIN_EVENT = "item-rain";
export const INTRO_DONE_EVENT = "intro:done";

export function markIntroDone() {
  motion.introDone = true;
  repaintPatternsSoon();
  window.dispatchEvent(new Event(INTRO_DONE_EVENT));
}

export function rainItems() {
  window.dispatchEvent(new Event(ITEM_RAIN_EVENT));
}

type PermissionApi = { requestPermission?: () => Promise<"granted" | "denied"> };

// Sur iPhone, Safari exige une autorisation donnée au tap pour le gyroscope et l'accéléromètre
export function needsMotionPermission() {
  const api = window.DeviceOrientationEvent as unknown as PermissionApi | undefined;
  return typeof api?.requestPermission === "function";
}

export async function requestMotionPermission(): Promise<boolean> {
  const orientation = window.DeviceOrientationEvent as unknown as PermissionApi | undefined;
  const deviceMotion = window.DeviceMotionEvent as unknown as PermissionApi | undefined;
  // Les deux demandes partent dans le même geste utilisateur, avant tout await
  const asks = [orientation?.requestPermission?.(), deviceMotion?.requestPermission?.()].filter(
    (p): p is Promise<"granted" | "denied"> => Boolean(p),
  );
  if (asks.length === 0) return true;
  try {
    const results = await Promise.all(asks);
    return results.every((r) => r === "granted");
  } catch {
    return false;
  }
}
