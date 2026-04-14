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

function getColSpan(index: number, total: number): string {
  if (total === 1) return "md:col-span-12";
  if (total % 2 !== 0 && index === total - 1) return "md:col-span-12";
  const pattern = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7"];
  return pattern[index % 4];
}

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
        <div className="min-h-[100dvh] pt-20">
          <main className="px-6 py-12 max-w-7xl mx-auto">

            {/* Hero header */}
            <motion.section
              className="mb-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <p
                    className="text-[#adaaaa] uppercase tracking-[0.3em] text-xs mb-4"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    The Final Verdict
                  </p>
                  <h1
                    className="text-6xl md:text-8xl font-bold tracking-tighter leading-none"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    ECCEZIONALE.
                    <br />
                    <span style={{ color: "#cc97ff" }}>O FORSE NO.</span>
                  </h1>
                </div>
                <p className="max-w-xs text-[#adaaaa] text-lg leading-relaxed italic hidden md:block">
                  &ldquo;Un anno intero riassunto in numeri che confermano quello che già sapevamo.&rdquo;
                </p>
              </div>
              <div className="mt-10 h-px bg-gradient-to-r from-white/10 to-transparent" />
            </motion.section>

            {/* Stats — asymmetric bento grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-24"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {sourceCards.map((card, i) => (
                <StatCard
                  key={card.source}
                  platform={card.sourceLabel}
                  platformColor={card.sourceColor}
                  stats={card.stats}
                  phrase={card.phrase}
                  icon={card.sourceIcon}
                  glowClass={GLOW_CLASSES[card.source]}
                />
              ))}
            </motion.div>

            {/* Share section */}
            <section className="flex flex-col items-center gap-8 py-16 border-t border-white/[0.06]">
              <motion.div
                className="text-center space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2
                  className="text-3xl font-bold tracking-tight"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  Pronto a farti giudicare?
                </h2>
                <p className="text-[#adaaaa]">
                  Esporta il tuo LifeWrapped e mostralo al mondo (se ne hai il coraggio).
                </p>
              </motion.div>
              {savedToken && <ShareButton token={savedToken} />}
            </section>
          </main>
        </div>

        {/* Background orbs */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="orb-1 absolute top-[15%] left-[10%] w-[600px] h-[600px] bg-[#cc97ff]/5 rounded-full blur-[130px]" />
          <div className="orb-2 absolute bottom-[15%] right-[8%] w-[450px] h-[450px] bg-[#7c3aed]/4 rounded-full blur-[110px]" />
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
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <SourceSelector selected={selected} onToggle={toggleSource} />
        </motion.div>

        {/* File uploaders / Steam input */}
        {selected.size > 0 && (
          <motion.div
            className="w-full mt-10 grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {PLATFORMS.filter((p) => selected.has(p.key)).map((platform) => (
              <div
                key={platform.key}
                className="bg-[#111111] rounded-2xl p-6 border border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
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
          </motion.div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm max-w-md text-center">
            {error}
          </div>
        )}

        {/* CTA */}
        <motion.button
          onClick={handleGenerate}
          disabled={selected.size === 0}
          className="mt-12 bg-[#cc97ff] text-black px-12 py-5 rounded-full font-extrabold text-xl uppercase tracking-tighter flex items-center gap-4 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.03, transition: { type: "spring", stiffness: 350, damping: 25 } }}
          whileTap={{ scale: 0.96, y: 2, transition: { type: "spring", stiffness: 400, damping: 30 } }}
        >
          Genera il mio LifeWrapped
          <span className="material-symbols-outlined">arrow_forward</span>
        </motion.button>

        <motion.p
          className="mt-10 text-[#adaaaa] text-sm italic opacity-50"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          * I tuoi file non vengono mai salvati su disco. Promesso. Forse.
        </motion.p>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] w-full py-12 px-6 border-t border-white/[0.04]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full max-w-7xl mx-auto">
          <div className="text-white text-[10px] uppercase tracking-[0.2em]">
            © 202 LIFEWRAPPED. NO RIGHTS RESERVED.
          </div>
          <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] items-center">
            <a
              href="/privacy"
              aria-label="Apri la pagina Privacy di LifeWrapped"
              className="text-neutral-600 hover:text-white transition-colors flex flex-col items-center gap-1"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" aria-hidden="true">
                <path d="M12 3 5 6v6c0 4.97 3.06 8.58 7 9.94 3.94-1.36 7-4.97 7-9.94V6l-7-3Z" />
                <path d="M9.5 12.5 11.2 14.2 14.8 10.6" />
              </svg>
              <span>Privacy</span>
            </a>
            <a
              href="https://github.com/maton111/lifewrapped"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Apri il repository GitHub di LifeWrapped"
              className="text-neutral-600 hover:text-white transition-colors flex flex-col items-center gap-1"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                <path d="M12 0.3a12 12 0 0 0-3.79 23.39c0.6 0.11 0.82-0.26 0.82-0.58v-2.23c-3.34 0.73-4.04-1.61-4.04-1.61a3.18 3.18 0 0 0-1.33-1.76c-1.08-0.74 0.08-0.72 0.08-0.72a2.52 2.52 0 0 1 1.84 1.24 2.55 2.55 0 0 0 3.48 1 2.55 2.55 0 0 1 0.76-1.6c-2.67-0.3-5.47-1.34-5.47-5.95a4.65 4.65 0 0 1 1.24-3.22 4.32 4.32 0 0 1 0.12-3.17s1.01-0.32 3.3 1.23a11.44 11.44 0 0 1 6.01 0c2.29-1.55 3.29-1.23 3.29-1.23a4.31 4.31 0 0 1 0.12 3.17 4.64 4.64 0 0 1 1.24 3.22c0 4.62-2.81 5.65-5.49 5.94a2.86 2.86 0 0 1 0.82 2.22v3.29c0 0.32 0.21 0.7 0.83 0.58A12 12 0 0 0 12 0.3Z" />
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Background orbs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="orb-1 absolute top-[20%] left-[15%] w-[550px] h-[550px] bg-[#cc97ff]/6 rounded-full blur-[130px]" />
        <div className="orb-2 absolute bottom-[20%] right-[10%] w-[420px] h-[420px] bg-[#7c3aed]/4 rounded-full blur-[110px]" />
      </div>
    </>
  );
}