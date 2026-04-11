import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import logo from "./assets/logo-lifewrap.svg";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LifeWrapped | Il tuo anno in dati",
  description:
    "Come Spotify Wrapped, ma per tutta la tua vita digitale. Carica i tuoi dati da Google, Instagram, Spotify, Netflix e Steam.",
  icons: {
    icon: logo.src,
    shortcut: logo.src,
    apple: logo.src,
  },
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
    <html
      lang="it"
      className={`${inter.variable} ${spaceGrotesk.variable} dark`}
    >
      <body className="min-h-screen bg-[#0e0e0e] text-white antialiased">
        {children}
      </body>
    </html>
  );
}