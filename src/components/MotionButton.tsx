"use client";

import { useState, useSyncExternalStore } from "react";
import { EVENT } from "@/data/event";
import type { Theme } from "@/themes/types";
import { rainItems, requestMotionPermission } from "@/lib/motion";

const TOUCH = "(pointer: coarse)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(TOUCH);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};


// Sur téléphone : débloque le gyroscope et l'accéléromètre (obligatoire sur iPhone), puis fait une démo
export default function MotionButton({ className, labels }: { className?: string; labels: Theme["copy"]["motion"] }) {
  const LABELS = {
    idle: labels.idle,
    on: EVENT.easterEgg.enabled ? labels.on : labels.onWithoutEgg,
    denied: EVENT.easterEgg.enabled ? labels.denied : labels.deniedWithoutEgg,
  };
  const isTouch = useSyncExternalStore(subscribe, () => window.matchMedia(TOUCH).matches, () => false);
  const [state, setState] = useState<"idle" | "on" | "denied">("idle");

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
