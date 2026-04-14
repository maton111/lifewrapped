import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "LifeWrapped | Il tuo anno in dati",
  description:
    "Come Spotify Wrapped, ma per tutta la tua vita digitale. Carica i tuoi dati da Google, Instagram, Spotify, Netflix e Steam.",
  openGraph: {
    title: "LifeWrapped | Il tuo anno in dati",
    description:
      "Come Spotify Wrapped, ma per tutta la tua vita digitale.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${spaceGrotesk.variable} dark`}>
      <body className="min-h-screen bg-[#0e0e0e] text-white antialiased">
        {children}
        <div className="grain-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}