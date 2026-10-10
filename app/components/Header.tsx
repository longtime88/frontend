"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { fetchShopwareCart } from "@/lib/shopwareCart";
import { SHOPWARE_CART_URL } from "@/lib/shopwareStorefront";

function Icon({ name }: { name: "search" | "user" | "heart" | "bag" | "menu" | "close" }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 5 5" /></>,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></>,
    heart: <path d="M20.8 8.9c0 5.2-8.8 10.1-8.8 10.1S3.2 14.1 3.2 8.9A4.4 4.4 0 0 1 12 6.7a4.4 4.4 0 0 1 8.8 2.2Z" />,
    bag: <><path d="M5 8.5h14l1 12H4l1-12Z" /><path d="M8 8.5V7a4 4 0 0 1 8 0v1.5" /></>,
    menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
    close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
  };
  return <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">{paths[name]}</svg>;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = async () => {
      try {
        const cart = await fetchShopwareCart();
        setCartCount(cart.items.reduce((sum, item) => sum + item.quantity, 0));
      } catch { setCartCount(0); }
    };
    void updateCartCount();
    const onCartUpdated = () => { void updateCartCount(); };
    window.addEventListener("cart-updated", onCartUpdated);
    return () => { window.removeEventListener("cart-updated", onCartUpdated); };
  }, [pathname]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setMenuOpen(false);
  }

  const nav = [
    ["Neuheiten", "/shoppen"],
    ["Kollektionen", "/#categories-heading"],
    ["Sale", "/#sale"],
  ];

  return <header className="sticky top-0 z-40 border-b border-[#eeeae5] bg-white/95 backdrop-blur-sm">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
      <button type="button" onClick={() => setMenuOpen((open) => !open)} className="p-1 text-[#3a3a3a] lg:hidden" aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}><Icon name={menuOpen ? "close" : "menu"} /></button>
      <nav className="hidden items-center gap-8 lg:flex">
        {nav.map(([label, href]) => <Link key={label} href={href} className="text-sm font-medium tracking-wide text-[#3a3a3a] transition-colors hover:text-[#0d0d0d]">{label}</Link>)}
      </nav>
      <Link href="/" className="absolute left-1/2 -translate-x-1/2 font-display text-2xl font-semibold tracking-tight text-[#0d0d0d]">Molinka<span className="text-[#c8a97e]">.</span></Link>
      <div className="flex items-center gap-4 text-[#3a3a3a]">
        <button type="button" onClick={() => setSearchOpen((open) => !open)} className="hidden transition-colors hover:text-[#0d0d0d] sm:block" aria-label="Suche öffnen"><Icon name="search" /></button>
        <Link href="/anmelden" className="hidden transition-colors hover:text-[#0d0d0d] sm:block" aria-label="Anmelden"><Icon name="user" /></Link>
        <Link href="/konto" className="hidden transition-colors hover:text-[#0d0d0d] sm:block" aria-label="Merkliste"><Icon name="heart" /></Link>
        <a href={SHOPWARE_CART_URL} className="relative transition-colors hover:text-[#0d0d0d]" aria-label="Warenkorb öffnen"><Icon name="bag" />{cartCount > 0 && <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c8a97e] px-1 text-[10px] font-medium leading-none text-white">{cartCount}</span>}</a>
      </div>
    </div>
    <div className={`overflow-hidden border-t border-[#eeeae5] transition-all duration-300 ${searchOpen ? "max-h-16" : "max-h-0 border-t-0"}`}>
      <form onSubmit={submitSearch} className="mx-auto flex max-w-7xl items-center px-4 py-3 sm:px-6"><Icon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} autoFocus={searchOpen} placeholder="Produkte suchen…" className="ml-3 w-full bg-transparent text-sm outline-none placeholder:text-[#888888]" /></form>
    </div>
    {menuOpen && <div className="border-t border-[#eeeae5] bg-white px-4 py-4 lg:hidden"><nav className="space-y-3">{nav.map(([label, href]) => <Link key={label} onClick={() => setMenuOpen(false)} href={href} className="block py-1 text-sm font-medium text-[#3a3a3a]">{label}</Link>)}<Link onClick={() => setMenuOpen(false)} href="/anmelden" className="block py-1 text-sm font-medium text-[#3a3a3a]">Konto</Link></nav></div>}
  </header>;
}
