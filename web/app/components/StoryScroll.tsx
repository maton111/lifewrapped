"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { slideVariants, numberCountUp } from "../lib/animations";
import type { LifeStats } from "../lib/types";

interface Slide {
  platform: string;
  platformLabel: string;
  platformColor: string;
  icon: string;
  value: string;
  unit: string;
  phrase: string;
  floatingChip?: string;
}

function buildSlides(stats: LifeStats, phrases: string[]): Slide[] {
  const slides: Slide[] = [];

  if (stats.msPlayed) {
    const minutes = Math.round(stats.msPlayed / 60000);
    slides.push({
      platform: "spotify",
      platformLabel: "Spotify Audit",
      platformColor: "#1db954",
      icon: "music_note",
      value: minutes.toLocaleString("it-IT"),
      unit: "minuti ascoltati su Spotify",
      phrase: phrases.find((p) => p.includes("minuti")) ?? `Hai ascoltato ${minutes.toLocaleString("it-IT")} minuti di musica.`,
      floatingChip: stats.topArtist ? `Top: ${stats.topArtist}` : undefined,
    });
  }

  if (stats.hoursWatched) {
    slides.push({
      platform: "netflix",
      platformLabel: "Netflix Report",
      platformColor: "#e50914",
      icon: "tv",
      value: Math.round(stats.hoursWatched).toLocaleString("it-IT"),
      unit: "ore di binge-watching",
      phrase: phrases.find((p) => p.includes("Netflix") || p.includes("ore")) ?? `Netflix ti ha rubato ${Math.round(stats.hoursWatched)} ore.`,
      floatingChip: stats.topSeries ? `Top: ${stats.topSeries}` : undefined,
    });
  }

  if (stats.totalSteamHours) {
    slides.push({
      platform: "steam",
      platformLabel: "Steam Analytics",
      platformColor: "#c7d5e0",
      icon: "sports_esports",
      value: Math.round(stats.totalSteamHours).toLocaleString("it-IT"),
      unit: "ore su Steam",
      phrase: phrases.find((p) => p.includes("Steam") || p.includes("gioco")) ?? `Hai giocato ${Math.round(stats.totalSteamHours)} ore su Steam.`,
      floatingChip: stats.topGame ? `Top: ${stats.topGame}` : undefined,
    });
  }

  if (stats.totalSearches) {
    slides.push({
      platform: "google",
      platformLabel: "Google Audit",
      platformColor: "#4285f4",
      icon: "search",
      value: stats.totalSearches.toLocaleString("it-IT"),
      unit: "ricerche su Google",
      phrase: phrases.find((p) => p.includes("ricerche") || p.includes("Google")) ?? `Hai fatto ${stats.totalSearches.toLocaleString("it-IT")} ricerche.`,
    });
  }

  if (stats.totalDMs || stats.totalLikes) {
    const val = stats.totalLikes ?? stats.totalDMs ?? 0;
    slides.push({
      platform: "instagram",
      platformLabel: "Instagram Report",
      platformColor: "#e1306c",
      icon: "photo_camera",
      value: val.toLocaleString("it-IT"),
      unit: stats.totalLikes ? "like messi su Instagram" : "messaggi su Instagram",
      phrase: phrases.find((p) => p.includes("like") || p.includes("messaggi") || p.includes("Instagram")) ?? `Il pollice non mente.`,
    });
  }

  return slides;
}

interface StoryScrollProps {
  stats: LifeStats;
  phrases: string[];
  onComplete: () => void;
}

const AUTO_ADVANCE_MS = 3000;

export default function StoryScroll({ stats, phrases, onComplete }: StoryScrollProps) {
  const slides = buildSlides(stats, phrases);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goNext = () => {
    if (current < slides.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      onComplete();
    }
  };

  const goPrev = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(goNext, AUTO_ADVANCE_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [current, paused]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setPaused(true);
      if (e.deltaY > 0) goNext(); else goPrev();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [current]);

  if (!slides.length) {
    onComplete();
    return null;
  }

  const slide = slides[current];

  return (
    <div className="h-[100dvh] w-full overflow-hidden relative bg-[#0a0a0a]">
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${slide.platformColor}26 0%, transparent 70%)`,
        }}
      />

      {/* Progress bar */}
      <div className="fixed top-[72px] left-0 w-full px-4 flex gap-1 z-50">
        {slides.map((_, i) => (
          <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
            {i < current && <div className="h-full w-full bg-white rounded-full" />}
            {i === current && (
              <div
                className="h-full rounded-full"
                style={{
                  backgroundColor: slide.platformColor,
                  animation: paused ? "none" : `progressFill ${AUTO_ADVANCE_MS}ms linear forwards`,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Main content */}
      <AnimatePresence mode="wait">
        <motion.main
          key={current}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="h-full w-full flex flex-col items-center justify-center relative z-10"
        >
          {/* Platform chip */}
          <div className="flex items-center gap-2 mb-4 opacity-80">
            <span
              className="material-symbols-outlined"
              style={{ color: slide.platformColor, fontVariationSettings: "'FILL' 1" }}
            >
              {slide.icon}
            </span>
            <span
              className="text-xs tracking-[0.3em] uppercase text-[#adaaaa]"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {slide.platformLabel}
            </span>
          </div>

          {/* Giant number */}
          <motion.h1
            variants={numberCountUp}
            initial="initial"
            animate="animate"
            className="font-bold leading-none tracking-tighter"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize: "clamp(5rem, 20vw, 12rem)",
              color: slide.platformColor,
              textShadow: `0 0 30px ${slide.platformColor}66`,
            }}
          >
            {slide.value}
          </motion.h1>

          {/* Unit */}
          <p
            className="text-2xl md:text-4xl text-white mt-2 tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {slide.unit}
          </p>

          {/* Sarcastic phrase */}
          <div className="absolute bottom-16 left-0 w-full px-6 flex flex-col items-center gap-8">
            <div className="max-w-xl text-center">
              <p
                className="text-xl md:text-2xl text-[#adaaaa] italic leading-relaxed"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                &ldquo;{slide.phrase}&rdquo;
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                scroll or wait
              </p>
              <div
                className="w-px h-12 rounded-full"
                style={{
                  background: `linear-gradient(to bottom, ${slide.platformColor}80, transparent)`,
                }}
              />
            </div>
          </div>

          {/* Floating badge (desktop) */}
          {slide.floatingChip && (
            <div
              className="absolute top-1/4 right-10 hidden lg:block rotate-12"
            >
              <div
                className="px-4 py-2 rounded-full flex items-center gap-3 backdrop-blur-sm border"
                style={{
                  backgroundColor: `${slide.platformColor}1a`,
                  borderColor: `${slide.platformColor}33`,
                }}
              >
                <span
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: slide.platformColor, fontFamily: "var(--font-space-grotesk)" }}
                >
                  {slide.floatingChip}
                </span>
              </div>
            </div>
          )}
        </motion.main>
      </AnimatePresence>

      {/* Click zones for navigation */}
      <div className="absolute inset-0 flex z-20 pointer-events-none">
        <button
          className="w-1/3 h-full pointer-events-auto opacity-0"
          onClick={goPrev}
          aria-label="Slide precedente"
        />
        <div className="w-1/3 h-full" />
        <button
          className="w-1/3 h-full pointer-events-auto opacity-0"
          onClick={goNext}
          aria-label="Slide successiva"
        />
      </div>

      <style>{`
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}