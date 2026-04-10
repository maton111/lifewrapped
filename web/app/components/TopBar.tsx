"use client";

import Link from "next/link";

interface TopBarProps {
  showNav?: boolean;
  activeSection?: string;
}

const NAV_LINKS = [
  { href: "#overview", label: "Overview" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#privacy", label: "Privacy" },
];

export default function TopBar({ showNav = true, activeSection }: TopBarProps) {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-xl flex justify-between items-center px-6 py-4">
      <Link
        href="/"
        className="text-2xl font-bold tracking-tighter text-white uppercase"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        LifeWrapped
      </Link>

      {showNav && (
        <nav className="hidden md:flex gap-8 items-center">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-neutral-500 hover:text-purple-400 transition-colors text-sm tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {label}
            </a>
          ))}
        </nav>
      )}

      <Link
        href="/"
        className="bg-[#c284ff] text-black px-4 py-1.5 rounded-lg font-bold text-sm hover:scale-95 transition-transform"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Start Over
      </Link>
    </header>
  );
}