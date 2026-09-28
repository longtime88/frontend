"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CloseIcon from "@mui/icons-material/Close";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [accountLabel, setAccountLabel] = useState("Konto");

  useEffect(() => {
    let active = true;
    async function loadCustomer() {
      try {
        const response = await fetch("/api/customer/me", { cache: "no-store" });
        const customer = await response.json().catch(() => ({}));
        if (active && response.ok && customer?.loggedIn) setAccountLabel(String(customer.firstName || "Konto"));
      } catch { /* The public navigation stays available when Shopware is offline. */ }
    }
    void loadCustomer();
    return () => { active = false; };
  }, [pathname]);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setMenuOpen(false);
  }

  const links = [
    ["Neuheiten", "/shoppen"], ["Kategorien", "/#categories-heading"], ["Bestseller", "/#bestseller"], ["Über uns", "/ueber-uns"],
  ];

  return <header className="sticky top-0 z-50 border-b border-[#e3e8f0] bg-white text-[#0f172a]">
    <p className="bg-[#0f172a] px-4 py-2 text-center text-xs font-medium text-white">Kostenloser Versand ab 50 € &nbsp;·&nbsp; 30 Tage Rückgabe</p>
    <div className="mx-auto flex h-[82px] max-w-7xl items-center px-5 sm:px-8 lg:px-10">
      <Link href="/" className="shrink-0 text-xl font-bold tracking-[-0.04em]">MOLINKA</Link>
      <nav className="ml-auto mr-10 hidden items-center gap-7 text-sm font-medium text-[#333f55] lg:flex">
        {links.map(([label, href]) => <Link key={label} href={href} className="transition hover:text-[#0e66e0]">{label}</Link>)}
      </nav>
      <div className="ml-auto flex items-center gap-1 text-[#333f55] lg:ml-0">
        <button onClick={() => setMenuOpen(true)} aria-label="Suche öffnen" className="rounded-lg p-2 transition hover:bg-[#f5f7fb]"><SearchIcon fontSize="small" /></button>
        <Link href="/anmelden" aria-label="Konto" className="hidden rounded-lg p-2 transition hover:bg-[#f5f7fb] sm:block"><PersonOutlineIcon fontSize="small" /><span className="sr-only">{accountLabel}</span></Link>
        <Link href="/konto" aria-label="Merkliste" className="hidden rounded-lg p-2 transition hover:bg-[#f5f7fb] sm:block"><FavoriteBorderIcon fontSize="small" /></Link>
        <Link href="/Checkout" aria-label="Warenkorb" className="relative rounded-lg p-2 transition hover:bg-[#f5f7fb]"><ShoppingBagOutlinedIcon fontSize="small" /><span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#0e66e0] text-[10px] font-bold text-white">0</span></Link>
        <button onClick={() => setMenuOpen((open) => !open)} aria-label="Menü öffnen" className="rounded-lg p-2 transition hover:bg-[#f5f7fb] lg:hidden">{menuOpen ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}</button>
      </div>
    </div>
    {menuOpen && <div className="border-t border-[#e3e8f0] bg-white px-5 py-5 shadow-lg lg:hidden"><form onSubmit={search} className="flex overflow-hidden rounded-[10px] border border-[#e3e8f0]"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Produkte suchen" className="min-w-0 flex-1 px-4 py-3 text-sm outline-none" autoFocus /><button className="bg-[#0f172a] px-4 text-white" aria-label="Suchen"><SearchIcon fontSize="small" /></button></form><nav className="mt-5 grid gap-1">{links.map(([label, href]) => <Link key={label} onClick={() => setMenuOpen(false)} href={href} className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-[#f5f7fb]">{label}</Link>)}<Link onClick={() => setMenuOpen(false)} href="/anmelden" className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-[#f5f7fb]">{accountLabel}</Link></nav></div>}
  </header>;
}
