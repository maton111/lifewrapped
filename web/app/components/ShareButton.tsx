"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareButtonProps {
  token: string;
}

export default function ShareButton({ token }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined"
    ? `${window.location.origin}/result/${token}`
    : `/result/${token}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Il mio LifeWrapped 2026",
          text: "Il mio anno in dati — guarda cosa ha rivelato LifeWrapped",
          url,
        });
        return;
      } catch {
        // fallback to clipboard
      }
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleShare}
      className="relative group"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-[#cc97ff] to-[#9c48ea] rounded-full blur opacity-25 group-hover:opacity-75 transition duration-300" />
      <div className="relative px-12 py-5 bg-gradient-to-b from-[#cc97ff] to-[#9c48ea] rounded-full flex items-center gap-4 font-bold text-black active:scale-95 transition-transform">
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.div
              key="copied"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span
                className="uppercase tracking-tighter text-lg"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Copiato!
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="share"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-4"
            >
              <span className="material-symbols-outlined text-sm">share</span>
              <span
                className="uppercase tracking-tighter text-lg"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Condividi il tuo LifeWrapped
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </button>
  );
}