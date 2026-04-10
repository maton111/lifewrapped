"use client";

import { useState } from "react";

interface SteamInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}

function isValidSteamInput(value: string): boolean {
  if (!value.trim()) return true;
  if (/^\d{17}$/.test(value.trim())) return true;
  if (value.includes("steamcommunity.com/id/")) return true;
  if (value.includes("steamcommunity.com/profiles/")) return true;
  // vanity URL (short name)
  if (/^[a-zA-Z0-9_-]{2,32}$/.test(value.trim())) return true;
  return false;
}

export default function SteamInput({ value, onChange, error }: SteamInputProps) {
  const [focused, setFocused] = useState(false);
  const isValid = isValidSteamInput(value);

  return (
    <div className="space-y-2">
      <label
        className="text-[10px] uppercase tracking-widest text-[#adaaaa]"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Profile ID o URL
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="76561198000000000 o steamcommunity.com/id/nome"
          className={`
            w-full bg-[#000000] rounded-lg text-sm px-4 py-3
            placeholder:text-neutral-700 text-white outline-none
            transition-all duration-200
            ${focused
              ? "ring-1 ring-[#cc97ff] shadow-[0_0_15px_rgba(204,151,255,0.15)]"
              : "ring-1 ring-[#494847]/30"
            }
            ${!isValid && value ? "ring-red-500/50" : ""}
          `}
          style={{ fontFamily: "var(--font-body)" }}
        />
        {value && isValid && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#cc97ff] text-sm">
            check_circle
          </span>
        )}
      </div>

      {error === "PRIVATE_PROFILE" && (
        <div className="flex items-start gap-2 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
          <span className="material-symbols-outlined text-red-400 text-sm mt-0.5">
            lock
          </span>
          <div>
            <p className="text-red-400 text-sm font-medium">Profilo privato</p>
            <p className="text-[#adaaaa] text-xs mt-1">
              Rendi il profilo Steam pubblico temporaneamente.{" "}
              <a
                href="https://help.steampowered.com/en/faqs/view/588C-C67D-0251-C276"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#cc97ff] hover:underline"
              >
                Istruzioni →
              </a>
            </p>
          </div>
        </div>
      )}

      {error && error !== "PRIVATE_PROFILE" && (
        <p className="text-red-400 text-xs">{error}</p>
      )}

      <p className="text-[10px] text-[#adaaaa]">
        Accetta: ID numerico (17 cifre), URL profilo, o vanity URL
      </p>
    </div>
  );
}