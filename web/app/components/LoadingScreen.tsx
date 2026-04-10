"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MESSAGES = [
  "Stiamo giudicando le tue scelte musicali...",
  "Contando le ore perse su Netflix...",
  "Calcolando quanto Steam ti ha rubato...",
  "Analizzando le tue ricerche di mezzanotte...",
  "Valutando il tuo livello di dipendenza digitale...",
  "Elaborando i danni collaterali...",
];

export default function LoadingScreen() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center z-50">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#cc97ff]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-12 px-6 text-center">
        {/* Logo */}
        <div
          className="text-3xl font-bold tracking-tighter text-white uppercase"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          LifeWrapped
        </div>

        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-[#cc97ff]/20" />
          <div className="absolute inset-0 rounded-full border-2 border-t-[#cc97ff] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>

        {/* Rotating message */}
        <div className="h-10 flex items-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-[#adaaaa] italic max-w-sm"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {MESSAGES[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress bar (indeterminate) */}
        <div className="w-64 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-gradient-to-r from-[#cc97ff] to-[#9c48ea] rounded-full animate-[shimmer_1.5s_ease-in-out_infinite]" />
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(450%); }
        }
      `}</style>
    </div>
  );
}