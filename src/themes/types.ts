import type { ComponentType } from "react";
import type { Answer } from "@/config/schema";

// Ce qu'un thème doit fournir. Pour en créer un : copier src/themes/disco, l'adapter, l'ajouter à src/themes/index.ts.

export type Illus = ComponentType<{ className?: string }>;

// Une ligne de grand titre : du texte simple, ou un texte mis en valeur (contour, couleur du thème)
export type TitleLine = string | { text: string; style: "outline" | "accent" };

export type SectionCopy = { kicker: string; title: TitleLine[] };

// Couleurs du thème, sous des noms neutres utilisés par tout le site
export type ThemeColors = {
  // Encre : textes, contours, ombres des cartes
  ink: string;
  inkSoft: string;
  // Papier : fond des cartes, des pastilles et des champs
  paper: string;
  paper2: string;
  // Couleur signature du thème (fond de page, surlignage)
  brand: string;
  brandStrong: string;
  // Accent : boutons principaux, chiffres, détails
  accent: string;
  accentMid: string;
  accentSoft: string;
  // Couleurs vives des illustrations et des pastilles
  pop1: string;
  pop2: string;
  pop3: string;
};

export type Theme = {
  id: string;
  colors: ThemeColors;
  // Le fond des sections, du haut vers le bas de la page (au moins 3 tons), puis la nuit de la fin
  sky: { ramp: string[]; night: string };
  // Classes des polices (next/font) : --font-display, --font-hand, --font-mono
  fontClassName: string;
  // Couleurs des confettis de la réponse
  confetti: string[];

  // Le premier écran (chargement compris) et l'animation signature au scroll
  Hero: ComponentType;
  Scenes: ComponentType | null;
  // Décor de la section de fin (derrière le titre)
  OutroBackdrop: ComponentType | null;

  // Illustrations posées sur les sections (null : rien)
  decor: {
    countdown: Illus | null;
    infos: Illus | null;
    guests: Illus | null;
    poll: Illus | null;
    playlist: Illus | null;
    outro: [Illus, Illus] | null;
  };
  DresscodeIllus: Illus | null;
  // Remplace la photo à côté du formulaire quand aucune n'est fournie
  RsvpPlaceholder: Illus;

  // Le tiroir caché (et la pluie d'objets quand on secoue le téléphone)
  easterEgg: {
    title: string;
    subtitle: (count: number) => string;
    handle: string;
    open: string;
    hint: string;
    items: { key: string; label: string; Comp: Illus }[];
  };

  // Tous les textes communs du site, dans la voix du thème (tutoiement, vouvoiement…)
  copy: {
    motion: { idle: string; on: string; onWithoutEgg: string; denied: string; deniedWithoutEgg: string };
    countdown: SectionCopy & { units: [string, string, string, string] };
    infos: SectionCopy & {
      when: string;
      rdv: string;
      where: string;
      dresscode: string;
      addressPending: (city: string) => string;
      confirm: string;
      openMap: string;
    };
    rsvp: SectionCopy & {
      name: string;
      namePlaceholder: string;
      answer: string;
      answers: Record<Answer, string>;
      submit: string;
      sending: string;
      error: string;
      done: (name: string) => string;
      edit: string;
    };
    guests: SectionCopy & { empty: string; you: string; count: (n: number) => string };
    poll: SectionCopy & {
      full: string;
      tooLate: (label: string) => string;
      notComing: string;
      answerFirst: string;
      answerLink: string;
      other: string;
      otherLabel: string;
      otherPlaceholder: string;
      otherRemove: string;
      ok: string;
    };
    playlist: SectionCopy & {
      empty: string;
      label: string;
      placeholder: string;
      add: string;
      adding: string;
      error: string;
      full: (max: number) => string;
      answerFirst: string;
      answerLink: string;
      remove: string;
    };
  };
};
