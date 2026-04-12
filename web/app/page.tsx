"use client";

import { useState } from "react";
import TopBar from "./components/TopBar";
import SourceSelector from "./components/SourceSelector";
import FileUploader from "./components/FileUploader";
import SteamInput from "./components/SteamInput";
import LoadingScreen from "./components/LoadingScreen";
import StoryScroll from "./components/StoryScroll";
import StatCard from "./components/StatCard";
import ShareButton from "./components/ShareButton";
import { uploadFiles, lookupSteam, saveWrapped } from "./lib/api";
import type { SourceKey, LifeStats, UploadResponse } from "./lib/types";
import { PLATFORMS } from "./lib/types";
import { mapSourceCards } from "./lib/statsMapper";
import { motion } from "framer-motion";
import { staggerContainer } from "./lib/animations";

type AppState = "landing" | "loading" | "story" | "recap";

function mergeStatsPreservingValues(base: LifeStats, incoming: LifeStats): LifeStats {
  const next: LifeStats = { ...base };

  for (const [key, value] of Object.entries(incoming)) {
    if (value != null) {
      next[key] = value;
    } else if (!(key in next)) {
      next[key] = value;
    }
  }

  return next;
}

const GLOW_CLASSES: Record<string, string> = {
  google: "neon-glow-google",
  instagram: "neon-glow-instagram",
  spotify: "neon-glow-spotify",
  netflix: "neon-glow-netflix",
  steam: "neon-glow-steam",
};

export default function Home() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [selected, setSelected] = useState<Set<SourceKey>>(new Set());
  const [files, setFiles] = useState<Partial<Record<SourceKey, File[]>>>({});
  const [steamId, setSteamId] = useState("");
  const [steamError, setSteamError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [savedToken, setSavedToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleSource = (key: SourceKey) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const setFilesForSource = (key: SourceKey, newFiles: File[]) => {
    setFiles((prev) => ({ ...prev, [key]: newFiles }));
  };

  const handleGenerate = async () => {
    setError(null);
    setSteamError(null);
    setAppState("loading");

    try {
      const fileMap: Record<string, File | File[]> = {};
      let mergedStats: LifeStats = {};
      let mergedPhrases: string[] = [];
      const sources: string[] = [];

      for (const key of selected) {
        if (key === "steam") continue;
        const f = files[key] ?? [];
        if (f.length === 0) continue;
        fileMap[key] = f.length === 1 ? f[0] : f;
      }

      if (Object.keys(fileMap).length > 0) {
        const res = await uploadFiles(fileMap);
        mergedStats = res.stats;
        mergedPhrases = res.phrases;
        sources.push(...res.sources);
      }

      if (selected.has("steam") && steamId.trim()) {
        try {
          const steamStats = await lookupSteam(steamId.trim());
          mergedStats = mergeStatsPreservingValues(mergedStats, steamStats);
          sources.push("steam");
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "STEAM_ERROR";
          setSteamError(msg === "PRIVATE_PROFILE" ? "PRIVATE_PROFILE" : msg);
        }
      }

      if (Object.keys(mergedStats).length === 0) {
        throw new Error("Nessun dato valido. Carica almeno un file o inserisci un ID Steam.");
      }

      const { token } = await saveWrapped(mergedStats, mergedPhrases, sources);
      setSavedToken(token);

      setUploadResult({ stats: mergedStats, phrases: mergedPhrases, sources });
      setAppState("story");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Errore sconosciuto");
      setAppState("landing");
    }
  };

  // ── Loading ──────────────────────────────────────────────
  if (appState === "loading") return <LoadingScreen />;

  // ── Story scroll ────────────────────────────────────────
  if (appState === "story" && uploadResult) {
    return (
      <>
        <TopBar showNav={false} />
        <StoryScroll
          sources={uploadResult.sources}
          stats={uploadResult.stats}
          phrases={uploadResult.phrases}
          onComplete={() => setAppState("recap")}
        />
      </>
    );
  }

  // ── Final recap ──────────────────────────────────────────
  if (appState === "recap" && uploadResult) {
    const sourceCards = mapSourceCards(uploadResult.sources, uploadResult.stats, uploadResult.phrases);

    return (
      <>
        <TopBar showNav={false} />
        <div className="min-h-screen pt-20">
          <main className="px-6 py-12 max-w-7xl mx-auto">
            {/* Hero header */}
            <section className="mb-20">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2
                    className="text-[#adaaaa] uppercase tracking-[0.3em] text-sm mb-4"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    The Final Verdict
                  </h2>
                  <h1
                    className="text-6xl md:text-8xl font-bold tracking-tighter leading-none"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    ECCEZIONALE.
                    <br />
                    <span style={{ color: "#cc97ff" }}>O FORSE NO.</span>
                  </h1>
                </div>
                <p className="max-w-xs text-[#adaaaa] text-lg leading-relaxed italic">
                  &ldquo;Un anno intero riassunto in numeri che confermano quello che già sapevamo.&rdquo;
                </p>
              </div>
            </section>

            {/* Stats grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {sourceCards.map((card) => {
                return (
                  <StatCard
                    key={card.source}
                    platform={card.sourceLabel}
                    platformColor={card.sourceColor}
                    stats={card.stats}
                    phrase={card.phrase}
                    icon={card.sourceIcon}
                    glowClass={GLOW_CLASSES[card.source]}
                  />
                );
              })}
            </motion.div>

            {/* Share section */}
            <section className="flex flex-col items-center gap-8 py-16 border-t border-white/5">
              <div className="text-center space-y-4">
                <h2
                  className="text-3xl font-bold tracking-tight"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  Pronto a farti giudicare?
                </h2>
                <p className="text-[#adaaaa]">
                  Esporta il tuo LifeWrapped e mostralo al mondo (se ne hai il coraggio).
                </p>
              </div>
              {savedToken && <ShareButton token={savedToken} />}
            </section>
          </main>
        </div>
      </>
    );
  }

  // ── Landing ───────────────────────────────────────────────
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>

      <TopBar />

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen flex flex-col items-center">
        {/* Hero */}
        <section className="text-center mb-20 max-w-3xl">
          <h1
            className="font-extrabold text-6xl md:text-8xl tracking-tighter mb-6 leading-none uppercase"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Il tuo anno
            <br />
            <span
              style={{
                backgroundImage: "linear-gradient(to bottom, #cc97ff, #9c48ea)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              in dati
            </span>
          </h1>
          <p
            className="text-xl md:text-2xl text-[#adaaaa] font-light tracking-wide"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Come Spotify Wrapped, ma per tutta la tua vita digitale.
          </p>
        </section>

        {/* Source selector */}
        <SourceSelector selected={selected} onToggle={toggleSource} />

        {/* File uploaders / Steam input */}
        {selected.size > 0 && (
          <div className="w-full mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {PLATFORMS.filter((p) => selected.has(p.key)).map((platform) => (
              <div
                key={platform.key}
                className="bg-[#131313] rounded-xl p-6 border border-white/5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="material-symbols-outlined text-xl"
                    style={{ color: platform.color }}
                  >
                    {platform.icon}
                  </span>
                  <h3
                    className="font-bold text-white"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {platform.label}
                  </h3>
                </div>
                {platform.isTextInput ? (
                  <SteamInput
                    value={steamId}
                    onChange={setSteamId}
                    error={steamError}
                  />
                ) : (
                  <FileUploader
                    platform={platform}
                    files={files[platform.key] ?? []}
                    onFilesChange={(f) => setFilesForSource(platform.key, f)}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm max-w-md text-center">
            {error}
          </div>
        )}

        {/* CTA */}
        <div className="relative group mt-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#cc97ff] to-[#9c48ea] rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
          <button
            onClick={handleGenerate}
            disabled={selected.size === 0}
            className="relative bg-gradient-to-b from-[#cc97ff] to-[#9c48ea] text-black px-12 py-5 rounded-full font-extrabold text-xl uppercase tracking-tighter flex items-center gap-4 transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Genera il mio LifeWrapped
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>

        <p
          className="mt-12 text-[#adaaaa] text-sm italic opacity-60"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          * I tuoi file non vengono mai salvati su disco. Promesso. Forse.
        </p>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] w-full py-12 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full max-w-7xl mx-auto">
          <div className="text-white text-[10px] uppercase tracking-[0.2em]">
            © 2025 LIFEWRAPPED. NO RIGHTS RESERVED.
          </div>
          <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em]">
            <a href="/privacy" className="text-neutral-600 hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="text-neutral-600 hover:text-white transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>

      {/* Background glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#cc97ff]/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
    </>
  );
}