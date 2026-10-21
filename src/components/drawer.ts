// Ouverture du tiroir de l'easter egg (son contenu vient du thème : THEME.easterEgg)
export const OPEN_DRAWER_EVENT = "drawer:open";

export function openDrawer() {
  window.dispatchEvent(new Event(OPEN_DRAWER_EVENT));
}
