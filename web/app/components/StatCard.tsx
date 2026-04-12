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
}

export default function StatCard({
  platform,
  platformColor,
  stats,
  phrase,
  icon,
  glowClass,
}: StatCardProps) {
  return (
    <motion.div
      variants={cardReveal}
      className={`
        bg-[#131313] p-8 relative overflow-hidden
        border-l-4 group hover:bg-[#201f1f] transition-all duration-300
        ${glowClass ?? ""}
      `}
      style={{ borderLeftColor: platformColor }}
    >
      <div className="flex justify-between items-start mb-12">
        <span
          className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
          style={{
            backgroundColor: `${platformColor}1a`,
            color: platformColor,
            fontFamily: "var(--font-space-grotesk)",
          }}
        >
          {platform}
        </span>
        <span
          className="material-symbols-outlined text-neutral-600 transition-colors group-hover:text-current"
          style={{ "--hover-color": platformColor } as React.CSSProperties}
        >
          {icon}
        </span>
      </div>

      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.key} className="space-y-1">
            <p
              className="text-[#adaaaa] uppercase text-xs tracking-widest"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {stat.label}
            </p>
            <h3
              className="text-3xl font-bold tracking-tighter text-white"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                opacity: stat.isMissing ? 0.6 : 1,
              }}
            >
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-neutral-400 italic">{phrase}</p>
    </motion.div>
  );
}