"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import LoginIcon from "@mui/icons-material/Login";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { SHOPWARE_CART_URL } from "@/lib/shopwareStorefront";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!query.trim()) return;

    router.push(`/search?q=${encodeURIComponent(query)}`);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#d8c4aa]/70 bg-gradient-to-b from-[#fff9f0]/95 via-[#fffdf8]/95 to-[#fff9f0]/95 shadow-[0_8px_24px_rgba(75,34,12,0.08)] backdrop-blur">
      <div className="hidden h-8 items-center justify-center bg-[repeating-linear-gradient(90deg,rgba(197,104,48,0.08)_0,rgba(197,104,48,0.08)_1px,transparent_1px,transparent_24px)] text-xs font-semibold tracking-[0.16em] text-[#9f4d23] md:flex">
        WEBENTWICKLUNG · PORTFOLIO · DIGITALER SHOP
      </div>

      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 md:px-6">
        <Link href="/" className="group shrink-0">
          <p className="text-2xl font-bold tracking-[0.03em] text-[#2a241f] transition group-hover:text-[#b35228] [font-family:var(--font-fraunces)]">
            DevPortfolio
          </p>
          <p className="text-[10px] font-semibold tracking-[0.18em] text-[#7c6a5a]">
            WEB DEVELOPER STUDIO
          </p>
        </Link>

        <form onSubmit={handleSearch} className="hidden flex-1 md:flex">
          <div className="flex w-full items-center rounded-full border border-[#e6cfb5] bg-white/90 px-2 py-2 shadow-[0_12px_28px_rgba(73,36,13,0.12)]">
            <input
              type="text"
              placeholder="Suche nach Produkten..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent px-4 text-sm text-[#2a241f] outline-none placeholder:text-[#8f7c6b]"
            />
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-[#cd6633] to-[#e38349] p-2 text-white transition hover:from-[#b9562a] hover:to-[#cc6a32]"
              aria-label="Suche starten"
            >
              <SearchIcon fontSize="small" />
            </button>
          </div>
        </form>

        <nav className="hidden items-center gap-2 text-sm font-semibold text-[#6f5f51] md:flex">
          <Link href="/" className="flex items-center gap-1.5 rounded-full px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:bg-[#fff1de] hover:text-[#b35228]">
            <HomeIcon fontSize="small" /> Start
          </Link>
          <Link href="/ueber-uns" className="flex items-center gap-1.5 rounded-full px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:bg-[#fff1de] hover:text-[#b35228]">
            <InfoIcon fontSize="small" /> Über uns
          </Link>
          <Link href="/kontakt" className="flex items-center gap-1.5 rounded-full px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:bg-[#fff1de] hover:text-[#b35228]">
            <ContactMailIcon fontSize="small" /> Kontakt
          </Link>
          <Link href="/anmelden" className="flex items-center gap-1.5 rounded-full px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:bg-[#fff1de] hover:text-[#b35228]">
            <LoginIcon fontSize="small" /> Konto
          </Link>
          <Link
            href={SHOPWARE_CART_URL}
            className="rounded-full border border-[#e3c4a5] bg-white px-4 py-2 text-[#2a241f] shadow-[0_8px_20px_rgba(73,36,13,0.1)] transition duration-300 hover:-translate-y-0.5 hover:border-[#b35228] hover:text-[#b35228]"
          >
            <span className="flex items-center gap-2">
              <ShoppingBasketIcon fontSize="small" /> Warenkorb
            </span>
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="ml-auto rounded-full border border-[#e3c4a5] bg-white p-2 text-[#2a241f] shadow-[0_8px_20px_rgba(73,36,13,0.1)] md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-[#e3c4a5] bg-gradient-to-b from-[#fffdf8] via-[#fff7eb] to-[#fffdf8] px-4 pb-5 pt-4 md:hidden"
        >
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex items-center rounded-full border border-[#e6cfb5] bg-white/90 px-2 py-2 shadow-[0_12px_28px_rgba(73,36,13,0.12)]">
              <input
                type="text"
                placeholder="Suche nach Produkten..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent px-4 text-sm text-[#2a241f] outline-none placeholder:text-[#8f7c6b]"
              />
              <button
                type="submit"
                className="rounded-full bg-gradient-to-r from-[#cd6633] to-[#e38349] p-2 text-white"
                aria-label="Suche starten"
              >
                <SearchIcon fontSize="small" />
              </button>
            </div>
          </form>

          <nav className="flex flex-col gap-3 text-sm font-semibold text-[#6f5f51]">
            <Link href="/" className="flex items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-[#fff1de]">
              <HomeIcon fontSize="small" /> Start
            </Link>
            <Link href="/ueber-uns" className="flex items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-[#fff1de]">
              <InfoIcon fontSize="small" /> Über uns
            </Link>
            <Link href="/kontakt" className="flex items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-[#fff1de]">
              <ContactMailIcon fontSize="small" /> Kontakt
            </Link>
            <Link href="/anmelden" className="flex items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-[#fff1de]">
              <LoginIcon fontSize="small" /> Konto
            </Link>
            <Link
              href={SHOPWARE_CART_URL}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#cd6633] to-[#e38349] px-3 py-3 text-white"
            >
              <ShoppingBasketIcon fontSize="small" /> Zum Warenkorb
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
