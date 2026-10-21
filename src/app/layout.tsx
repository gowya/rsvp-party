import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Caveat, Space_Mono } from "next/font/google";
import "./globals.css";
import { EVENT } from "@/data/event";

// Polices allégées : graisse seule pour Bricolage (128 → 40 ko), une graisse pour Caveat et Space Mono
const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

// L'écriture manuscrite n'apparaît pas au premier écran : pas de préchargement
const hand = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});

const mono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: "700",
});

const DESCRIPTION = `${EVENT.dateLong}, ${EVENT.time}, chez moi. Viens fêter mes ${EVENT.age} ans !`;
const TITLE = `${EVENT.name} a ${EVENT.age} ans`;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Icônes : app/icon.svg et app/apple-icon.png. Image d'aperçu : public/apercu.jpg
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: false },
  // Image carrée (Messages, Instagram la recadrent mal en format large), à une adresse simple pour WhatsApp
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: EVENT.title,
    title: `${TITLE} ☀︎`,
    description: DESCRIPTION,
    images: [{ url: "/apercu.jpg", width: 800, height: 800, type: "image/jpeg", alt: `${EVENT.title} : une boule disco, « ${EVENT.age} ans » en géant et des chaussettes à motifs` }],
  },
  twitter: { card: "summary_large_image", title: `${TITLE} ☀︎`, description: DESCRIPTION, images: ["/apercu.jpg"] },
};

export const viewport: Viewport = {
  themeColor: "#FFEE8C",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${display.variable} ${hand.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
