import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWrapped } from "../../lib/api";
import type {LifeStats, WrappedResult} from "../../lib/types";
import ShareButton from "../../components/ShareButton";
import logo from "../../assets/logo-lifewrap.svg";
import { mapSourceCards } from "../../lib/statsMapper";
import Link from "next/link";

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  try {
    const result = await getWrapped(token);
    return {
      title: "Il mio LifeWrapped 2025",
      description: result.phrases[0] ?? "Il mio anno in dati.",
      openGraph: {
        title: "Il mio LifeWrapped 2025",
        description: result.phrases[0] ?? "Il mio anno in dati.",
        images: [`/result/${token}/opengraph-image`],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Il mio LifeWrapped 2025",
        images: [`/result/${token}/opengraph-image`],
      },
    };
  } catch {
    return { title: "LifeWrapped" };
  }
}

const PLATFORM_COLORS: Record<string, string> = {
  google: "#4285f4",
  instagram: "#e1306c",
  spotify: "#1db954",
  netflix: "#e50914",
  steam: "#c7d5e0",
};

const PLATFORM_ICONS: Record<string, string> = {
  google: "search",
  instagram: "photo_camera",
  spotify: "music_note",
  netflix: "tv",
  steam: "sports_esports",
};

function getMainStat(source: string, stats: LifeStats): { label: string; value: string } | null {
  switch (source) {
    case "spotify":
      if (!stats.msPlayed) return null;
      return { label: "Minuti Ascoltati", value: Math.round(stats.msPlayed / 60000).toLocaleString("it-IT") };
    case "netflix":
      if (!stats.hoursWatched) return null;
      return { label: "Ore di Bingeing", value: Math.round(stats.hoursWatched).toLocaleString("it-IT") };
    case "steam":
      if (!stats.totalSteamHours) return null;
      return { label: "Ore su Steam", value: Math.round(stats.totalSteamHours).toLocaleString("it-IT") };
    case "google":
      if (!stats.totalSearches) return null;
      return { label: "Ricerche Google", value: stats.totalSearches.toLocaleString("it-IT") };
    case "instagram":
      if (stats.totalLikes) return { label: "Like Dati", value: stats.totalLikes.toLocaleString("it-IT") };
      if (stats.totalDMs) return { label: "DM Inviati", value: stats.totalDMs.toLocaleString("it-IT") };
      return null;
    default:
      return null;
  }
}

export default async function ResultPage({ params }: Props) {
  const { token } = await params;

  let result: WrappedResult;
  try {
    result = await getWrapped(token);
  } catch {
    notFound();
  }

  const sourceCards = mapSourceCards(result.sources, result.stats, result.phrases);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />
      <style>{`.material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }`}</style>

      {/* TopBar */}
      <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-xl flex justify-between items-center px-6 py-4">
        <span
          className="text-2xl font-bold tracking-tighter text-white uppercase"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          LifeWrapped
        </span>
        <a
          href="/"
          className="text-[#adaaaa] hover:text-white transition-colors text-sm"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          Start Over
        </a>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto min-h-screen">
        {/* Header */}
        <header className="mb-16 md:flex justify-between items-end gap-12">
          <div className="max-w-2xl">
            <p
              className="text-[#cc97ff] uppercase tracking-widest text-sm mb-4"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Identity Unlocked
            </p>
            <h1
              className="text-6xl md:text-8xl font-bold tracking-tighter leading-none mb-8"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              The 2025
              <br />
              <span className="text-[#cc97ff]">Reliquary</span>
            </h1>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[#adaaaa] italic" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              &ldquo;I dati non mentono. Ma certamente giudicano.&rdquo;
            </p>
          </div>
        </header>

        {/* Bento stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-24">
          {sourceCards.map((card, i) => {
            const isWide = i % 3 === 0;

            return (
              <div
                key={card.source}
                className={`
                  bg-[#131313] rounded-xl p-8 flex flex-col justify-between
                  border border-transparent hover:border-white/10 transition-all group
                  ${isWide ? "md:col-span-8" : "md:col-span-4"}
                `}
                style={{ minHeight: isWide ? 280 : 220 }}
              >
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${card.sourceColor}33` }}
                    >
                      <span
                        className="material-symbols-outlined text-lg"
                        style={{ color: card.sourceColor, fontVariationSettings: "'FILL' 1" }}
                      >
                        {card.sourceIcon}
                      </span>
                    </div>
                    <span
                      className="text-xs tracking-widest uppercase font-bold"
                      style={{ color: card.sourceColor, fontFamily: "Space Grotesk, sans-serif" }}
                    >
                      {card.sourceLabel}
                    </span>
                  </div>
                  <div className="space-y-4 mb-4">
                    {card.stats.map((stat) => (
                      <div key={stat.key}>
                        <p
                          className="text-[11px] tracking-widest uppercase"
                          style={{ color: card.sourceColor, fontFamily: "Space Grotesk, sans-serif" }}
                        >
                          {stat.label}
                        </p>
                        <p
                          className="text-3xl font-bold text-white tracking-tight"
                          style={{
                            fontFamily: "Space Grotesk, sans-serif",
                            opacity: stat.isMissing ? 0.6 : 1,
                          }}
                        >
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[#adaaaa] text-sm max-w-md leading-relaxed">{card.phrase}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center justify-center gap-8 py-12 border-t border-white/5">
          <h3
            className="text-2xl font-bold tracking-tight text-center"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Genera il tuo LifeWrapped
          </h3>
          <ShareButton token={token} />
          <a
            href="/"
            className="px-12 py-5 rounded-full bg-gradient-to-b from-[#cc97ff] to-[#9c48ea] text-black font-bold text-xl tracking-tight flex items-center gap-3"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Crea il mio
            <span className="material-symbols-outlined">arrow_forward</span>
          </a>
          <p className="text-[#adaaaa] text-xs uppercase tracking-[0.2em] opacity-60">
            Gratuito. Privato. Implacabile.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] w-full py-12 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full max-w-7xl mx-auto text-[10px] uppercase tracking-[0.2em]">
          <div className="text-white font-bold">LifeWrapped</div>
          <div className="text-neutral-600">© 2026 LIFEWRAPPED. NO RIGHTS RESERVED.</div>
          <div className="flex gap-8 text-neutral-600 items-center">
            <a
                href="https://github.com/maton111/lifewrapped"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Apri il repository GitHub di LifeWrapped"
                className="hover:text-white transition-colors flex flex-col items-center gap-1"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                <path d="M12 0.3a12 12 0 0 0-3.79 23.39c0.6 0.11 0.82-0.26 0.82-0.58v-2.23c-3.34 0.73-4.04-1.61-4.04-1.61a3.18 3.18 0 0 0-1.33-1.76c-1.08-0.74 0.08-0.72 0.08-0.72a2.52 2.52 0 0 1 1.84 1.24 2.55 2.55 0 0 0 3.48 1 2.55 2.55 0 0 1 0.76-1.6c-2.67-0.3-5.47-1.34-5.47-5.95a4.65 4.65 0 0 1 1.24-3.22 4.32 4.32 0 0 1 0.12-3.17s1.01-0.32 3.3 1.23a11.44 11.44 0 0 1 6.01 0c2.29-1.55 3.29-1.23 3.29-1.23a4.31 4.31 0 0 1 0.12 3.17 4.64 4.64 0 0 1 1.24 3.22c0 4.62-2.81 5.65-5.49 5.94a2.86 2.86 0 0 1 0.82 2.22v3.29c0 0.32 0.21 0.7 0.83 0.58A12 12 0 0 0 12 0.3Z" />
              </svg>
              <span>GitHub</span>
            </a>
            <a
              href="/privacy"
              aria-label="Apri la pagina Privacy di LifeWrapped"
              className="hover:text-white transition-colors flex flex-col items-center gap-1"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" aria-hidden="true">
                <path d="M12 3 5 6v6c0 4.97 3.06 8.58 7 9.94 3.94-1.36 7-4.97 7-9.94V6l-7-3Z" />
                <path d="M9.5 12.5 11.2 14.2 14.8 10.6" />
              </svg>
              <span>Privacy</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Background decoration */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#cc97ff]/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
    </>
  );
}