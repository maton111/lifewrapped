"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../assets/logo-lifewrap.svg";

interface TopBarProps {
  showNav?: boolean;
  activeSection?: string;
}

const NAV_LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/privacy", label: "Privacy" },
];

export default function TopBar({ showNav = true, activeSection }: TopBarProps) {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/85 backdrop-blur-xl flex justify-between items-center px-6 py-4 border-b border-white/[0.05] shadow-[inset_0_-1px_0_rgba(255,255,255,0.03)]">
        <Link href="/" className="flex items-center">
            <Image src={logo} alt="LifeWrapped" priority className="h-10 w-auto" />
        </Link>

      {showNav && (
        <nav className="hidden md:flex gap-8 items-center">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-neutral-600 hover:text-white transition-colors duration-200 text-sm tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {label}
            </a>
          ))}
        </nav>
      )}

      <Link
        href="/"
        className="bg-[#cc97ff] text-black px-4 py-1.5 rounded-full font-bold text-sm hover:opacity-90 active:scale-95 transition-all duration-200"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Start Over
      </Link>
    </header>
  );
}