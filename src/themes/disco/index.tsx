import type { Theme } from "../types";
import { copy } from "./copy";
import { fontClassName } from "./fonts";
import Hero from "./Hero";
import Scenes from "./Scenes";
import OutroBackdrop from "./OutroBackdrop";
import DresscodeIllus from "./DresscodeIllus";
import PhotoPlaceholder from "./PhotoPlaceholder";
import { DrinkChampagne, DrinkEspressoMartini, DrinkMargarita, DrinkPinaColada, DrinkSpritz, DrinkTequilaSunrise } from "./illus/Drinks";
import { CocktailMojito } from "./illus/Cocktails";
import { easterEgg } from "./easterEgg";

const RsvpPlaceholder = () => <PhotoPlaceholder variant="yay" />;

// Anniversaire disco : un coucher de soleil jaune-orangé qui finit en nuit étoilée, une boule disco, des cocktails
export const disco: Theme = {
  id: "disco",
  colors: {
    ink: "#2b1608",
    inkSoft: "#6b4424",
    paper: "#fffbe6",
    paper2: "#fff6c2",
    brand: "#ffee8c",
    brandStrong: "#ffd95a",
    accent: "#ff6b4a",
    accentMid: "#ff8a3d",
    accentSoft: "#ffb347",
    pop1: "#ff7eb6",
    pop2: "#b9a4ff",
    pop3: "#5fd3b5",
  },
  sky: {
    ramp: ["#ffee8c", "#ffdf73", "#ffc65a", "#ffa645", "#f98236", "#d8572a", "#8e3517", "#2e140a"],
    night: "#170a05",
  },
  fontClassName,
  confetti: ["#ffd95a", "#ffb347", "#ff8a3d", "#ff6b4a", "#fffbe6", "#5fd3b5", "#b9a4ff"],

  Hero,
  Scenes,
  OutroBackdrop,

  decor: {
    countdown: DrinkSpritz,
    infos: DrinkMargarita,
    guests: DrinkChampagne,
    poll: DrinkTequilaSunrise,
    playlist: CocktailMojito,
    outro: [DrinkEspressoMartini, DrinkPinaColada],
  },
  DresscodeIllus,
  RsvpPlaceholder,

  easterEgg,

  copy,
};
