"use client";

import { PLATFORMS, type SourceKey } from "../lib/types";

interface SourceSelectorProps {
  selected: Set<SourceKey>;
  onToggle: (key: SourceKey) => void;
}

export default function SourceSelector({ selected, onToggle }: SourceSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
      {PLATFORMS.map((platform) => {
        const isSelected = selected.has(platform.key);
        return (
          <button
            key={platform.key}
            onClick={() => onToggle(platform.key)}
            className={`
              group relative bg-[#131313] p-8 rounded-xl flex flex-col items-center
              justify-between min-h-[280px] transition-all duration-500 text-left w-full
              hover:bg-[#201f1f]
              ${isSelected
                ? "border border-[#cc97ff]/50 shadow-[0_0_20px_rgba(204,151,255,0.1)]"
                : "border border-white/5"
              }
            `}
          >
            <div className="text-center">
              <span
                className="material-symbols-outlined text-4xl mb-4 block"
                style={{ color: platform.color }}
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
                  <span
                    className="material-symbols-outlined text-[#494847] text-2xl"
                  >
                    keyboard
                  </span>
                  <p className="text-[10px] uppercase tracking-widest text-[#adaaaa] mt-2 text-center">
                    {platform.inputHint}
                  </p>
                </div>
              ) : (
                <div
                  className={`
                    border-2 border-dashed rounded-lg p-4 flex flex-col items-center
                    justify-center transition-colors
                    ${isSelected ? "border-[#cc97ff]/50" : "border-[#494847]/30 group-hover:border-[#cc97ff]/30"}
                  `}
                >
                  <span className="material-symbols-outlined text-[#494847] mb-2">
                    upload_file
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-[#adaaaa] text-center">
                    {platform.inputHint}
                  </span>
                </div>
              )}
            </div>

            {isSelected && (
              <div className="absolute top-3 right-3">
                <span className="material-symbols-outlined text-[#cc97ff] text-lg">
                  check_circle
                </span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}