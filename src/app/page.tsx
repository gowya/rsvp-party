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

export default function Home() {
  return (
    <main>
      <Intro />
      <Countdown />
      <Infos />
      <Rsvp />
      <Guests />
      <Poll />
      <Playlist />
      <Outro />

      {/* Couches d'effets par-dessus la page */}
      <ItemRain />
      <EasterDrawer />
      <MotionController />
      <ScrollScenes />
      <SmoothAnchors />
      <LiveSync />
    </main>
  );
}
