"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
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
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const goingDown = currentY > lastScrollY.current;

      setIsScrolled(currentY > 12);

      if (open) {
        setIsVisible(true);
      } else if (currentY < 32) {
        setIsVisible(true);
      } else if (goingDown && currentY > 120) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!query.trim()) return;

    router.push(`/search?q=${encodeURIComponent(query)}`);
    setOpen(false);
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-90"
      } ${
        isScrolled
          ? "border-[#e8d7cc] bg-white/90 shadow-[0_14px_34px_rgba(75,34,12,0.13)]"
          : "border-[#ecded3] bg-white/95 shadow-[0_10px_24px_rgba(75,34,12,0.07)]"
      }`}
    >
      <div className="hidden h-8 items-center justify-center border-b border-[#f0e7dd] bg-gradient-to-r from-[#fff1c7] via-[#ffe2e2] to-[#dbf0ff] text-[9px] font-bold tracking-[0.12em] text-[#8a3e1a] md:flex">
        WEBENTWICKLUNG · PORTFOLIO · DIGITALER SHOP
      </div>

      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 md:px-6">
        <Link href="/" className="group shrink-0">
          <p className="bg-gradient-to-r from-[#a0421a] via-[#c95a2b] to-[#3a8a75] bg-clip-text text-xl font-bold tracking-[0.02em] text-transparent transition group-hover:brightness-110 [font-family:var(--font-fraunces)]">
            DevPortfolio
          </p>
          <p className="text-[9px] font-semibold tracking-[0.14em] text-[#6e716f]">
            WEB DEVELOPER STUDIO
          </p>
        </Link>

        <form onSubmit={handleSearch} className="hidden flex-1 md:flex">
          <div className="flex w-full items-center rounded-full border border-[#e2dbd1] bg-white/95 px-2 py-2 shadow-sm ring-1 ring-[#fff1e4]">
            <input
              type="text"
              placeholder="Suche nach Produkten..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent px-4 text-sm text-[#1a1a1a] outline-none placeholder:text-[#7a7368]"
            />
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-[#c95a2b] to-[#e8723c] p-2 text-white transition hover:from-[#a0421a] hover:to-[#c95a2b]"
              aria-label="Suche starten"
            >
              <SearchIcon fontSize="small" />
            </button>
          </div>
        </form>

        <nav className="hidden items-center gap-1.5 text-xs font-semibold text-[#7a7368] md:flex">
          <Link href="/" className="flex items-center gap-1.5 rounded-full px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:bg-[#fff8f0] hover:text-[#c95a2b]">
            <HomeIcon fontSize="small" /> Start
          </Link>
          <Link href="/ueber-uns" className="flex items-center gap-1.5 rounded-full px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:bg-[#effaf6] hover:text-[#2f7d67]">
            <InfoIcon fontSize="small" /> Über uns
          </Link>
          <Link href="/kontakt" className="flex items-center gap-1.5 rounded-full px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:bg-[#eef5ff] hover:text-[#336aa6]">
            <ContactMailIcon fontSize="small" /> Kontakt
          </Link>
          <Link href="/anmelden" className="flex items-center gap-1.5 rounded-full px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:bg-[#fff1f6] hover:text-[#a64d78]">
            <LoginIcon fontSize="small" /> Konto
          </Link>
          <Link
            href={SHOPWARE_CART_URL}
            className="rounded-full border border-[#e2dbd1] bg-gradient-to-r from-[#fff7ec] to-[#fff] px-4 py-2 text-[#1a1a1a] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#c95a2b] hover:text-[#c95a2b]"
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
          className="ml-auto rounded-full border border-[#e2dbd1] bg-gradient-to-r from-[#fff8f0] to-[#fff] p-2 text-[#1a1a1a] md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-[#e2dbd1] bg-[#fffcf8] px-4 pb-6 pt-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] md:hidden"
        >
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex items-center rounded-full border border-[#e2dbd1] bg-white px-2 py-2 shadow-sm">
              <input
                type="text"
                placeholder="Suche nach Produkten..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent px-4 text-sm text-[#1a1a1a] outline-none placeholder:text-[#7a7368]"
              />
              <button
                type="submit"
                className="rounded-full bg-gradient-to-r from-[#c95a2b] to-[#e8723c] p-2 text-white"
                aria-label="Suche starten"
              >
                <SearchIcon fontSize="small" />
              </button>
            </div>
          </form>

          <nav className="flex flex-col gap-3 text-sm font-semibold text-[#7a7368]">
            <Link href="/" className="flex items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-[#fff8f0]">
              <HomeIcon fontSize="small" /> Start
            </Link>
            <Link href="/ueber-uns" className="flex items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-[#fff8f0]">
              <InfoIcon fontSize="small" /> Über uns
            </Link>
            <Link href="/kontakt" className="flex items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-[#fff8f0]">
              <ContactMailIcon fontSize="small" /> Kontakt
            </Link>
            <Link href="/anmelden" className="flex items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-[#fff8f0]">
              <LoginIcon fontSize="small" /> Konto
            </Link>
            <Link
              href={SHOPWARE_CART_URL}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#c95a2b] to-[#e8723c] px-3 py-3 text-white"
            >
              <ShoppingBasketIcon fontSize="small" /> Zum Warenkorb
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
