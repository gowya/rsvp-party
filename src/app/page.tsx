import type { ComponentType } from "react";
import Intro from "@/components/Intro";
import EasterDrawer from "@/components/EasterDrawer";
import ItemRain from "@/components/ItemRain";
import MotionController from "@/components/MotionController";
import ScrollScenes from "@/components/ScrollScenes";
import SmoothAnchors from "@/components/SmoothAnchors";
import LiveSync from "@/components/LiveSync";
import Countdown from "@/components/sections/Countdown";
import Infos from "@/components/sections/Infos";
import Rsvp from "@/components/sections/Rsvp";
import Poll from "@/components/sections/Poll";
import Guests from "@/components/sections/Guests";
import Playlist from "@/components/sections/Playlist";
import Outro from "@/components/sections/Outro";
import { EVENT } from "@/data/event";
import { skyFor, type Sky } from "@/lib/sky";

// L'ordre des sections ; celles désactivées dans src/event.config.ts sont retirées
const SECTIONS: [keyof typeof EVENT.sections, ComponentType<{ sky: Sky }>][] = [
  ["countdown", Countdown],
  ["infos", Infos],
  ["rsvp", Rsvp],
  ["guests", Guests],
  ["poll", Poll],
  ["playlist", Playlist],
];

const ACTIVE = SECTIONS.filter(([key]) => EVENT.sections[key]);

export default function Home() {
  return (
    <main>
      <Intro />
      {ACTIVE.map(([key, Section], i) => (
        <Section key={key} sky={skyFor(i, ACTIVE.length)} />
      ))}
      <Outro />

      {/* Couches d'effets par-dessus la page */}
      {EVENT.easterEgg.enabled && (
        <>
          <ItemRain />
          <EasterDrawer />
        </>
      )}
      <MotionController />
      <ScrollScenes />
      <SmoothAnchors />
      <LiveSync />
    </main>
  );
}
