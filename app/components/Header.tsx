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

export default function Header() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!query.trim()) return;

    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <header className="w-full h-24 flex items-center justify-between px-6 bg-gray-800 text-white relative z-50">

      {/* Logo */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-linear-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text select-none px-4 py-2">
          Luna&Clean
          <span className="relative top-[-0.4em] text-xs ml-1">®</span>
        </h1>
      </div>

      {/* Suchleiste */}
      <div className="flex-1 mx-4 hidden md:flex">
        <form onSubmit={handleSearch} className="flex items-center w-full">
          <input
            type="text"
            placeholder="Suche..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="grow px-3 py-2 border border-gray-600 rounded-l-md 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 w-full rounded-full"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-500 border border-gray-300 
                       rounded-r-md hover:bg-gray-300 transition text-white flex items-center rounded-lg backdrop-blur-sm"
          >
            <SearchIcon fontSize="small" />
          </button>
        </form>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2"><HomeIcon fontSize="small" /> Home</Link>
        <Link href="/ueber-uns" className="flex items-center gap-2"><InfoIcon fontSize="small" /> Über uns</Link>
        <Link href="/kontakt" className="flex items-center gap-2"><ContactMailIcon fontSize="small" /> Kontakt</Link>
        <Link href="/anmelden" className="flex items-center gap-2"><LoginIcon fontSize="small" /> Anmelden</Link>
        <Link href="/Checkout" className="flex items-center gap-2"><ShoppingBasketIcon fontSize="small" />O</Link>
      </nav>

      {/* Mobile Menü Button */}
      <button
        type="button"
        aria-label={open ? "Menue schliessen" : "Menue oeffnen"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="md:hidden text-white text-3xl absolute right-6 top-1/2 -translate-y-1/2 z-50"
        onClick={() => setOpen(!open)}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Mobile Menü */}
      {open && (
        <div
          id="mobile-menu"
          className="absolute top-full left-0 w-full bg-gray-900/90 backdrop-blur-md p-6 flex flex-col gap-4 md:hidden z-40"
        >
          <form onSubmit={handleSearch} className="flex items-center w-full">
            <input
              type="text"
              placeholder="Suche..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="grow px-3 py-2 border border-gray-600 rounded-l-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 w-full rounded-full"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gray-500 border border-gray-300 
                         rounded-r-md hover:bg-gray-300 transition text-white flex items-center rounded-lg backdrop-blur-sm"
            >
              <SearchIcon fontSize="small" />
            </button>
          </form>

          <Link href="/" className="flex items-center gap-2"><HomeIcon fontSize="small" /> Home</Link>
          <Link href="/ueber-uns" className="flex items-center gap-2"><InfoIcon fontSize="small" /> Über uns</Link>
          <Link href="/kontakt" className="flex items-center gap-2"><ContactMailIcon fontSize="small" /> Kontakt</Link>
          <Link href="/anmelden" className="flex items-center gap-2"><LoginIcon fontSize="small" /> Anmelden</Link>
          <Link href="/Checkout" className="flex items-center gap-2"><ShoppingBasketIcon fontSize="small"/>Basket</Link>
        </div>
      )}
    </header>
  );
}
