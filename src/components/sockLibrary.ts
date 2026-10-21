import { SockFlames, SockLeopard, SockMelon, SockSmiley, SockSport, SockToes } from "./Socks";
import { EVENT } from "@/data/event";

// Le contenu du tiroir (l'easter egg du thème « anniversaire disco »)
export const SOCK_LIBRARY = [
  { key: "toes", label: "À doigts arc-en-ciel", Comp: SockToes },
  { key: "leopard", label: "Léopard à volants", Comp: SockLeopard },
  { key: "melon", label: "Pastèque", Comp: SockMelon },
  { key: "flames", label: "En flammes", Comp: SockFlames },
  { key: "smiley", label: "Smileys", Comp: SockSmiley },
  { key: "sport", label: `La ${EVENT.age}`, Comp: SockSport },
];

export const OPEN_DRAWER_EVENT = "sock-drawer:open";

export function openSockDrawer() {
  window.dispatchEvent(new Event(OPEN_DRAWER_EVENT));
}
