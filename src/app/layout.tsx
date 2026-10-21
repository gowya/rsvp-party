import type { Metadata, Viewport } from "next";
import "./globals.css";
import { EVENT } from "@/data/event";
import { THEME, themeCssVars } from "@/themes";
import type { CSSProperties } from "react";

const DESCRIPTION = EVENT.description;
const TITLE = EVENT.title;
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
    images: [{ url: "/apercu.jpg", width: 800, height: 800, type: "image/jpeg", alt: `${EVENT.title} : l'invitation` }],
  },
  twitter: { card: "summary_large_image", title: `${TITLE} ☀︎`, description: DESCRIPTION, images: ["/apercu.jpg"] },
};

export const viewport: Viewport = {
  themeColor: THEME.colors.brand,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={THEME.fontClassName} style={themeCssVars(THEME) as CSSProperties}>
      <body>{children}</body>
    </html>
  );
}
