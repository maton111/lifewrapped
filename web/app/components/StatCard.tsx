"use client";

import { motion } from "framer-motion";
import { cardReveal } from "../lib/animations";
import type { SourceStatView } from "../lib/types";

interface StatCardProps {
  platform: string;
  platformColor: string;
  stats: SourceStatView[];
  phrase: string;
  icon: string;
  glowClass?: string;
  className?: string;
}

export default function StatCard({
  platform,
  platformColor,
  stats,
  phrase,
  icon,
  glowClass,
  className,
}: StatCardProps) {
  return (
    <motion.div
      variants={cardReveal}
      className={`
        bg-[#111111] rounded-2xl p-8 relative overflow-hidden flex flex-col
        border border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
        group hover:bg-[#161616] hover:border-white/10 transition-all duration-300
        ${glowClass ?? ""}
        ${className ?? ""}
      `}
    >
      {/* Top accent gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(to right, ${platformColor}, transparent 55%)` }}
      />

      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <span
          className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest"
          style={{
            backgroundColor: `${platformColor}18`,
            color: platformColor,
            fontFamily: "var(--font-space-grotesk)",
          }}
        >
          {platform}
        </span>
        <span
          className="material-symbols-outlined text-neutral-700 group-hover:text-neutral-500 transition-colors duration-300"
        >
          {icon}
        </span>
      </div>

      {/* Stats */}
      <div className="space-y-5 flex-1">
        {stats.map((stat) => (
          <div key={stat.key}>
            <p
              className="text-[#adaaaa] uppercase text-[10px] tracking-[0.2em] mb-1.5"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {stat.label}
            </p>
            <h3
              className="text-4xl font-bold tracking-tighter text-white leading-none"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                opacity: stat.isMissing ? 0.45 : 1,
              }}
            >
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Quote */}
      <div className="mt-8 pt-5 border-t border-white/[0.05]">
        <p className="text-sm text-neutral-500 italic leading-relaxed">{phrase}</p>
      </div>
    </motion.div>
  );
}