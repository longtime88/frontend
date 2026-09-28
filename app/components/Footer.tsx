"use client";

import Link from "next/link";
import InstagramIcon from "@mui/icons-material/Instagram";

export default function Footer() {
  return <footer className="border-t border-[#e3e8f0] bg-white text-[#0f172a]"><div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10"><div><Link href="/" className="text-lg font-bold tracking-[-0.04em]">MOLINKA</Link><p className="mt-2 text-sm text-[#667287]">Digitale Lösungen für dein Projekt.</p></div><nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[#333f55]"><Link href="/kontakt" className="hover:text-[#0e66e0]">Service</Link><Link href="/impressum" className="hover:text-[#0e66e0]">Impressum</Link><Link href="/datenschutz" className="hover:text-[#0e66e0]">Datenschutz</Link><a href="https://instagram.com/molinka" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-[#0e66e0]"><InstagramIcon fontSize="small" /> Instagram</a></nav><p className="text-xs text-[#667287]">© {new Date().getFullYear()} Molinka</p></div></footer>;
}
