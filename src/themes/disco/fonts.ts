import { Bricolage_Grotesque, Caveat, Space_Mono } from "next/font/google";

// Polices allégées : graisse seule pour Bricolage, une graisse pour Caveat et Space Mono
const display = Bricolage_Grotesque({ variable: "--font-display", subsets: ["latin"] });

// L'écriture manuscrite n'apparaît pas au premier écran : pas de préchargement
const hand = Caveat({ variable: "--font-hand", subsets: ["latin"], weight: "400", preload: false });

const mono = Space_Mono({ variable: "--font-mono", subsets: ["latin"], weight: "700" });

export const fontClassName = `${display.variable} ${hand.variable} ${mono.variable}`;
