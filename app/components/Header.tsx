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
    <header className="sticky top-0 z-50 border-b border-[color:var(--line)] bg-[color:var(--surface)]">
      <div className="soft-grid hidden h-8 items-center justify-center text-xs font-semibold tracking-[0.14em] text-[color:var(--brand-deep)] md:flex">
        WEBENTWICKLUNG · PORTFOLIO · DIGITALER SHOP
      </div>

      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 md:px-6">
        <Link href="/" className="group shrink-0">
          <p className="brand-title text-2xl font-bold text-[color:var(--ink)] transition group-hover:text-[color:var(--brand)]">
            DevPortfolio
          </p>
          <p className="text-[10px] font-semibold tracking-[0.18em] text-[color:var(--muted)]">
            WEB DEVELOPER STUDIO
          </p>
        </Link>

        <form onSubmit={handleSearch} className="hidden flex-1 md:flex">
          <div className="glass-panel flex w-full items-center rounded-full px-2 py-2">
            <input
              type="text"
              placeholder="Suche nach Produkten..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent px-4 text-sm text-[color:var(--ink)] outline-none placeholder:text-[color:var(--muted)]"
            />
            <button
              type="submit"
              className="rounded-full bg-[color:var(--brand)] p-2 text-white transition hover:bg-[color:var(--brand-deep)]"
              aria-label="Suche starten"
            >
              <SearchIcon fontSize="small" />
            </button>
          </div>
        </form>

        <nav className="hidden items-center gap-5 text-sm font-semibold text-[color:var(--muted)] md:flex">
          <Link href="/" className="flex items-center gap-1.5 hover:text-[color:var(--brand)]">
            <HomeIcon fontSize="small" /> Start
          </Link>
          <Link href="/ueber-uns" className="flex items-center gap-1.5 hover:text-[color:var(--brand)]">
            <InfoIcon fontSize="small" /> Über uns
          </Link>
          <Link href="/kontakt" className="flex items-center gap-1.5 hover:text-[color:var(--brand)]">
            <ContactMailIcon fontSize="small" /> Kontakt
          </Link>
          <Link href="/anmelden" className="flex items-center gap-1.5 hover:text-[color:var(--brand)]">
            <LoginIcon fontSize="small" /> Konto
          </Link>
          <Link
            href={SHOPWARE_CART_URL}
            className="rounded-full border border-[color:var(--line)] bg-white px-4 py-2 text-[color:var(--ink)] hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
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
          className="ml-auto rounded-full border border-[color:var(--line)] bg-white p-2 text-[color:var(--ink)] md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-[color:var(--line)] bg-[color:var(--surface)] px-4 pb-5 pt-4 md:hidden">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="glass-panel flex items-center rounded-full px-2 py-2">
              <input
                type="text"
                placeholder="Suche nach Produkten..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent px-4 text-sm text-[color:var(--ink)] outline-none placeholder:text-[color:var(--muted)]"
              />
              <button
                type="submit"
                className="rounded-full bg-[color:var(--brand)] p-2 text-white"
                aria-label="Suche starten"
              >
                <SearchIcon fontSize="small" />
              </button>
            </div>
          </form>

          <nav className="flex flex-col gap-3 text-sm font-semibold text-[color:var(--muted)]">
            <Link href="/" className="flex items-center gap-2 rounded-xl px-2 py-2 hover:bg-[#eef4ff]">
              <HomeIcon fontSize="small" /> Start
            </Link>
            <Link href="/ueber-uns" className="flex items-center gap-2 rounded-xl px-2 py-2 hover:bg-[#eef4ff]">
              <InfoIcon fontSize="small" /> Über uns
            </Link>
            <Link href="/kontakt" className="flex items-center gap-2 rounded-xl px-2 py-2 hover:bg-[#eef4ff]">
              <ContactMailIcon fontSize="small" /> Kontakt
            </Link>
            <Link href="/anmelden" className="flex items-center gap-2 rounded-xl px-2 py-2 hover:bg-[#eef4ff]">
              <LoginIcon fontSize="small" /> Konto
            </Link>
            <Link href={SHOPWARE_CART_URL} className="flex items-center gap-2 rounded-xl bg-[color:var(--brand)] px-3 py-3 text-white">
              <ShoppingBasketIcon fontSize="small" /> Zum Warenkorb
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
