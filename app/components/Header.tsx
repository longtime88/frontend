"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
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
  // Read initial login state from localStorage without a useEffect.
  // `"use client"` ensures this code only runs on the client.
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("sw-customer-token");
    }
    return false;
  });
  const [customerName, setCustomerName] = useState<string | null>(null);
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

  async function handleLogout() {
    try {
      await fetch("/api/logout", { method: "POST" });
      localStorage.removeItem("sw-context-token");
      localStorage.removeItem("sw-customer-token");
      setIsLoggedIn(false);
      setCustomerName(null);
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-90"
      } ${
        isScrolled
          ? "border-[rgba(100,140,255,0.22)] glass shadow-[0_4px_40px_rgba(0,0,0,0.35)]"
          : "border-[rgba(100,140,255,0.12)] glass shadow-[0_2px_20px_rgba(0,0,0,0.2)]"
      }`}
    >
      {/* Top-Bar */}
      <div className="hidden h-8 items-center justify-center border-b border-[rgba(100,140,255,0.1)] bg-gradient-to-r from-[rgba(30,60,160,0.55)] via-[rgba(55,100,210,0.35)] to-[rgba(30,80,180,0.55)] text-[9px] font-bold tracking-[0.14em] text-[#8ab4f8] md:flex">
        WEBENTWICKLUNG · PORTFOLIO · DIGITALER SHOP
      </div>

      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="group shrink-0">
          <p className="bg-gradient-to-r from-[#7bb8ff] via-[#4f9eff] to-[#38c8e0] bg-clip-text text-xl font-bold tracking-[0.02em] text-transparent transition brightness-110 group-hover:brightness-130 [font-family:var(--font-fraunces)]">
            Molinka
          </p>
          <p className="text-[9px] font-semibold tracking-[0.14em] text-[#5a7090]">
            WEB DEVELOPER STUDIO
          </p>
        </Link>

        {/* Suche */}
        <form onSubmit={handleSearch} className="hidden flex-1 md:flex">
          <div className="flex w-full items-center rounded-full border border-[rgba(100,140,255,0.15)] glass-input px-2 py-2 ring-1 ring-[rgba(79,158,255,0.08)]">
            <input
              type="text"
              placeholder="Suche nach Produkten..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent px-4 text-sm text-[#dde4f0] outline-none placeholder:text-[#5a6f8e]"
            />
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-[#2d6fd8] to-[#4f9eff] p-2 text-[#e8ecf4] transition hover:from-[#1e5ab0] hover:to-[#2d6fd8]"
              aria-label="Suche starten"
            >
              <SearchIcon fontSize="small" />
            </button>
          </div>
        </form>

        {/* Navigation */}
        <nav className="hidden items-center gap-1.5 text-xs font-semibold text-[#8892b0] md:flex">
          <Link href="/" className="flex items-center gap-1.5 rounded-full px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:bg-[rgba(30,60,160,0.18)] hover:text-[#7bb8ff]">
            <HomeIcon fontSize="small" /> Start
          </Link>
          <Link href="/ueber-uns" className="flex items-center gap-1.5 rounded-full px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:bg-[rgba(20,80,50,0.18)] hover:text-[#38c8e0]">
            <InfoIcon fontSize="small" /> Über uns
          </Link>
          <Link href="/kontakt" className="flex items-center gap-1.5 rounded-full px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:bg-[rgba(30,80,160,0.18)] hover:text-[#4f9eff]">
            <ContactMailIcon fontSize="small" /> Kontakt
          </Link>
          {isLoggedIn && customerName ? (
            <div className="flex items-center gap-2 rounded-full border border-[rgba(100,140,255,0.2)] bg-gradient-to-r from-[rgba(20,40,100,0.6)] to-[rgba(30,55,130,0.6)] px-3 py-1.5 text-[#c8d8f8] shadow-[0_2px_16px_rgba(0,0,0,0.25)]">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7bb8ff]">Kunde</span>
              <span className="h-3.5 w-px bg-[rgba(100,140,255,0.25)]" />
              <span className="text-xs font-semibold text-[#dde4f0]">{customerName}</span>
            </div>
          ) : (
            <Link href="/anmelden" className="flex items-center gap-1.5 rounded-full px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:bg-[rgba(120,50,160,0.18)] hover:text-[#b48aff]">
              <LoginIcon fontSize="small" /> Konto
            </Link>
          )}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-full px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:bg-[rgba(200,50,50,0.18)] hover:text-red-400"
              title="Abmelden"
            >
              <LogoutIcon fontSize="small" />
            </button>
          )}
          <Link
            href={SHOPWARE_CART_URL}
            className="rounded-full border border-[rgba(100,140,255,0.2)] bg-gradient-to-r from-[rgba(20,40,100,0.6)] to-[rgba(30,55,130,0.6)] px-4 py-2 text-[#c8d8f8] shadow-[0_2px_16px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-0.5 hover:border-[#4f9eff] hover:text-[#7bb8ff]"
          >
            <span className="flex items-center gap-2">
              <ShoppingBasketIcon fontSize="small" /> Warenkorb
            </span>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="ml-auto rounded-full border border-[rgba(100,140,255,0.15)] bg-gradient-to-r from-[rgba(20,40,100,0.55)] to-[rgba(30,55,130,0.55)] p-2 text-[#b0c4e8] md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          id="mobile-menu"
          className="glass-input border-t border-[rgba(100,140,255,0.12)] px-4 pb-6 pt-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] md:hidden"
        >
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex items-center rounded-full border border-[rgba(100,140,255,0.15)] px-2 py-2 shadow-sm">
              <input
                type="text"
                placeholder="Suche nach Produkten..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent px-4 text-sm text-[#dde4f0] outline-none placeholder:text-[#5a6f8e]"
              />
              <button
                type="submit"
                className="rounded-full bg-gradient-to-r from-[#2d6fd8] to-[#4f9eff] p-2 text-[#e8ecf4]"
                aria-label="Suche starten"
              >
                <SearchIcon fontSize="small" />
              </button>
            </div>
          </form>

          <nav className="flex flex-col gap-3 text-sm font-semibold text-[#8892b0]">
            <Link href="/" className="flex items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-[rgba(30,60,160,0.18)]">
              <HomeIcon fontSize="small" /> Start
            </Link>
            <Link href="/ueber-uns" className="flex items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-[rgba(30,60,160,0.18)]">
              <InfoIcon fontSize="small" /> Über uns
            </Link>
            <Link href="/kontakt" className="flex items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-[rgba(30,60,160,0.18)]">
              <ContactMailIcon fontSize="small" /> Kontakt
            </Link>
            {isLoggedIn && customerName ? (
              <div className="mt-1 flex items-center gap-2 rounded-xl border border-[rgba(100,140,255,0.15)] bg-[rgba(20,40,100,0.3)] px-3 py-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7bb8ff]">Kunde</span>
                <span className="h-3.5 w-px bg-[rgba(100,140,255,0.2)]" />
                <span className="text-sm font-semibold text-[#dde4f0]">{customerName}</span>
              </div>
            ) : (
              <Link href="/anmelden" className="flex items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-[rgba(30,60,160,0.18)]">
                <LoginIcon fontSize="small" /> Konto
              </Link>
            )}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl px-2 py-2 text-left transition hover:bg-[rgba(200,50,50,0.18)] hover:text-red-400"
              >
                <LogoutIcon fontSize="small" /> Abmelden
              </button>
            )}
            <Link
              href={SHOPWARE_CART_URL}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2d6fd8] to-[#4f9eff] px-3 py-3 text-white"
            >
              <ShoppingBasketIcon fontSize="small" /> Zum Warenkorb
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
