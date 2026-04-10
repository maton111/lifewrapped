"use client";

import { motion } from "framer-motion";
import { cardReveal } from "../lib/animations";

interface StatCardProps {
  platform: string;
  platformColor: string;
  label: string;
  value: string | number;
  phrase: string;
  icon: string;
  glowClass?: string;
}

export default function StatCard({
  platform,
  platformColor,
  label,
  value,
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

      <div className="space-y-1">
        <p
          className="text-[#adaaaa] uppercase text-xs tracking-widest"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          {label}
        </p>
        <h3
          className="text-5xl font-bold tracking-tighter text-white"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          {typeof value === "number" ? value.toLocaleString("it-IT") : value}
        </h3>
      </div>

      <p className="mt-8 text-sm text-neutral-400 italic">{phrase}</p>
    </motion.div>
  );
}