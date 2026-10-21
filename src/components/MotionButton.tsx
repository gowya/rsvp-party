"use client";

import { useState, useSyncExternalStore } from "react";
import { EVENT } from "@/data/event";
import { rainItems, requestMotionPermission } from "@/lib/motion";

const TOUCH = "(pointer: coarse)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(TOUCH);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

const LABELS = {
  idle: "✨ Active les paillettes",
  on: EVENT.easterEgg.enabled ? "Penche ton tel… et secoue-le 👀" : "Penche ton tel 👀",
  denied: EVENT.easterEgg.enabled ? "Pas grave, tape sur les cocktails 🍹" : "Pas grave, la fête continue 🪩",
};

// Sur téléphone : débloque le gyroscope et l'accéléromètre (obligatoire sur iPhone), puis fait une démo
export default function MotionButton({ className }: { className?: string }) {
  const isTouch = useSyncExternalStore(subscribe, () => window.matchMedia(TOUCH).matches, () => false);
  const [state, setState] = useState<keyof typeof LABELS>("idle");

  if (!isTouch) return null;

  const onClick = async () => {
    if (state !== "idle") {
      rainItems();
      return;
    }
    const granted = await requestMotionPermission();
    setState(granted ? "on" : "denied");
    if (granted) rainItems();
  };

  return (
    <button type="button" className={className} onClick={onClick}>
      {LABELS[state]}
    </button>
  );
}
