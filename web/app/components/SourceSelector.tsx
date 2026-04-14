"use client";

import { motion } from "framer-motion";
import { PLATFORMS, type SourceKey } from "../lib/types";

interface SourceSelectorProps {
  selected: Set<SourceKey>;
  onToggle: (key: SourceKey) => void;
}

export default function SourceSelector({ selected, onToggle }: SourceSelectorProps) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full"
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
    >
      {PLATFORMS.map((platform) => {
        const isSelected = selected.has(platform.key);
        return (
          <motion.button
            key={platform.key}
            onClick={() => onToggle(platform.key)}
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="group relative bg-[#111111] p-8 rounded-2xl flex flex-col items-center justify-between min-h-[280px] text-left w-full border shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
            style={{
              borderColor: isSelected ? `${platform.color}55` : "rgba(255,255,255,0.06)",
              boxShadow: isSelected
                ? `inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px ${platform.color}22, 0 12px 32px -8px ${platform.color}22`
                : "inset 0 1px 0 rgba(255,255,255,0.04)",
              background: isSelected ? `linear-gradient(135deg, ${platform.color}08, transparent 60%)` : undefined,
            }}
          >
            <div className="text-center">
              <span
                className="material-symbols-outlined text-4xl mb-4 block transition-transform duration-300 group-hover:scale-110"
                style={{
                  color: platform.color,
                  fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {platform.icon}
              </span>
              <h3
                className="font-bold text-lg mb-2 text-white"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {platform.label}
              </h3>
              <p className="text-[10px] text-[#adaaaa] uppercase tracking-[0.2em]">
                {platform.description}
              </p>
            </div>

            <div className="w-full mt-8">
              {platform.isTextInput ? (
                <div className="text-center">
                  <span className="material-symbols-outlined text-[#494847] text-2xl">keyboard</span>
                  <p className="text-[10px] uppercase tracking-widest text-[#adaaaa] mt-2 text-center">
                    {platform.inputHint}
                  </p>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-colors duration-300"
                  style={{
                    borderColor: isSelected ? `${platform.color}55` : "rgba(73,72,71,0.3)",
                  }}
                >
                  <span className="material-symbols-outlined text-[#494847] mb-2">upload_file</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#adaaaa] text-center">
                    {platform.inputHint}
                  </span>
                </div>
              )}
            </div>

            {/* Selected indicator */}
            {isSelected && (
              <div
                className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: platform.color,
                  boxShadow: `0 0 10px ${platform.color}66`,
                }}
              >
                <span
                  className="material-symbols-outlined text-black leading-none"
                  style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1, 'wght' 700" }}
                >
                  check
                </span>
              </div>
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}