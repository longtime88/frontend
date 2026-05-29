"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

export default function Header() {
  const pathname = usePathname();
  const isKontaktPage = pathname === "/kontakt";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerName, setCustomerName] = useState<string | null>(null);
  const lastScrollY = useRef(0);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const goingDown = currentY > lastScrollY.current;

      setIsScrolled(currentY > 12);

      if (mobileOpen) {
        setIsVisible(true);
      } else if (currentY < 120) {
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
  }, [mobileOpen]);

  useEffect(() => {
    let active = true;

    async function syncCustomerState() {
      try {
        const response = await fetch("/api/customer/me", { cache: "no-store" });
        const data = await response.json().catch(() => ({}));

        if (!active) return;
        if (!response.ok || !data?.loggedIn) {
          setIsLoggedIn(false);
          setCustomerName(null);
          return;
        }

        const fullName = [data?.firstName, data?.lastName]
          .map((value: unknown) => String(value || "").trim())
          .filter(Boolean)
          .join(" ");

        setIsLoggedIn(true);
        setCustomerName(fullName || String(data?.email || data?.customerEmail || "Konto"));
      } catch {
        if (!active) return;
        setIsLoggedIn(false);
        setCustomerName(null);
      }
    }

    void syncCustomerState();
    return () => {
      active = false;
    };
  }, [pathname]);

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!query.trim()) return;

    router.push(`/search?q=${encodeURIComponent(query)}`);
    setMobileOpen(false);
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
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-200 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-full"
        } ${
          isScrolled
            ? "border-[rgba(255,255,255,0.1)]"
            : "border-[rgba(255,255,255,0.08)]"
        } dark:border-[rgba(17,24,39,0.5)] dark:border-[rgba(17,24,39,0.3)] bg-gray-900`}
      >
        {/* Main Header Container */}
        <div className="mx-auto flex h-[60px] max-w-[1280px] items-center px-4 md:px-6">
          {/* Mobile: Hamburger Menu */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex-shrink-0 mr-2 p-1 text-gray-300 hover:text-white"
            aria-label="Menü"
          >
            {mobileOpen ? (
              <CloseIcon fontSize="small" className="text-[24px]" />
            ) : (
              <MenuIcon fontSize="small" className="text-[24px]" />
            )}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 mr-6">
            <Image
              src="/logo-amazon.svg"
              alt="Molinka"
              width={120}
              height={20}
              className="h-[20px] w-auto"
            />
            <span className="text-white font-semibold tracking-wide">Molinka</span>
          </Link>

          {/* Desktop Search Bar - Hidden on Mobile */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-[500px] mr-4"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Suche nach Produkten..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="
                  w-full 
                  h-[40px] 
                  pl-[45px] 
                  pr-10 
                  text-sm 
                  text-gray-300 
                  bg-gray-800 
                  border 
                  border-gray-600 
                  rounded-l-md 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-[#fea41b]
                  focus:border-[#fea41b]
                  placeholder:text-gray-500
                  dark:bg-gray-700
                  dark:border-gray-600
                  dark:text-gray-200
                  dark:placeholder:text-gray-400
                "
              />
              <button
                type="submit"
                className="
                  absolute 
                  right-0 
                  top-0 
                  bottom-0 
                  w-[50px] 
                  bg-[#fea41b] 
                  text-black 
                  font-medium 
                  flex 
                  items-center 
                  justify-center 
                  border-none 
                  rounded-r-md 
                  hover:bg-[#febd69] 
                  transition-colors
                  px-2
                  dark:text-white
                "
                aria-label="Suche starten"
              >
                <SearchIcon fontSize="small" className="text-[14px]" />
              </button>
            </div>
          </form>

          {/* Mobile: Search Icon */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden flex items-center justify-center ml-auto mr-2 p-1 text-gray-300 hover:text-white"
            aria-label="Suche"
          >
            <SearchIcon fontSize="small" className="text-[20px]" />
          </button>

          {/* Account & Cart - Desktop */}
          <div className="hidden md:flex items-center gap-4 ml-auto">
            {/* Account Section */}
            {isLoggedIn && customerName ? (
              <div className="relative z-20">
                <div
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="
                    flex 
                    items-center 
                    gap-2 
                    text-sm 
                    text-gray-300 
                    hover:text-white 
                    cursor-pointer
                    px-2 
                    py-1
                    rounded
                    hover:bg-gray-700
                    dark:hover:bg-gray-600
                  "
                >
                  <span>Hallo, {customerName.split(" ")[0]}</span>
                  <span className="text-xs">Konto &amp; Listen</span>
                  <span className="ml-1 text-[10px]">▾</span>
                </div>
                {/* Dropdown Menu */}
                {accountOpen && (
                  <div className="
                    absolute 
                    left-0 
                    mt-2.5 
                    w-[200px] 
                    bg-gray-800 
                    border 
                    border-gray-600 
                    rounded-md 
                    shadow-lg 
                    z-30
                    dark:bg-gray-900
                    dark:border-gray-700
                    animate-fade-in
                  ">
                    <div className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-200 dark:text-gray-100">
                        Hallo, {customerName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                        <Link
                          href="/konto"
                          className="text-blue-400 hover:underline dark:hover:text-blue-300"
                        >
                          Konto anzeigen
                        </Link>
                      </p>
                    </div>
                    <div className="border-t border-gray-600 my-2 dark:border-gray-600"></div>
                    <nav className="space-y-1">
                      <Link
                        href="/konto"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-600"
                      >
                        Dein Konto
                      </Link>
                      <Link
                        href="/ueber-uns"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-600"
                      >
                        Über uns
                      </Link>
                      <Link
                        href="/kontakt"
                        className={`block px-4 py-2 text-sm hover:bg-gray-700 dark:hover:bg-gray-600 ${
                          isKontaktPage
                            ? "text-[#fea41b] bg-gray-700/60"
                            : "text-gray-300"
                        }`}
                      >
                        Kontakt
                      </Link>
                      <div className="border-t border-gray-600 my-2 dark:border-gray-600"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-600 bg-transparent border-none cursor-pointer font-inherit"
                      >
                        Abmelden
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/anmelden"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white dark:hover:text-gray-100"
              >
                <span>Hallo, anmelden</span>
                <span className="text-xs">Konto &amp; Listen</span>
                <span className="ml-1 text-[10px]">▾</span>
              </Link>
            )}

            {/* Warenkorb */}
            <Link
              href="/Checkout"
              className="relative flex items-center gap-2 text-sm text-gray-300 hover:text-white dark:hover:text-gray-100"
            >
              <ShoppingBasketIcon fontSize="small" className="text-[20px]" />
              <span>Warenkorb</span>
              <span className="
                absolute 
                -top-[8px] 
                -right-[8px] 
                bg-[#fea41b] 
                text-white 
                text-[xs] 
                font-bold 
                flex 
                items-center 
                justify-center 
                w-[20px] 
                h-[20px] 
                rounded-full
              ">
                0
              </span>
            </Link>
          </div>

          {/* Mobile: Cart Icon */}
          <div className="md:hidden ml-auto">
            <Link
              href="/Checkout"
              className="relative flex items-center justify-center p-1 text-gray-300 hover:text-white"
            >
              <ShoppingBasketIcon fontSize="small" className="text-[20px]" />
              <span className="
                absolute 
                -top-[6px] 
                -right-[6px] 
                bg-[#fea41b] 
                text-white 
                text-[10px] 
                font-bold 
                flex 
                items-center 
                justify-center 
                w-[18px] 
                h-[18px] 
                rounded-full
              ">
                0
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar - Shown when menu is open */}
        {mobileOpen && (
          <form
            onSubmit={handleSearch}
            className="md:hidden border-t border-gray-600 px-4 py-3"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Suche..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="
                  w-full 
                  h-[40px] 
                  pl-[45px] 
                  pr-10 
                  text-sm 
                  text-gray-300 
                  bg-gray-800 
                  border 
                  border-gray-600 
                  rounded-l-md 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-[#fea41b]
                  placeholder:text-gray-500
                "
              />
              <button
                type="submit"
                className="
                  absolute 
                  right-0 
                  top-0 
                  bottom-0 
                  w-[50px] 
                  bg-[#fea41b] 
                  text-black 
                  font-medium 
                  flex 
                  items-center 
                  justify-center 
                  border-none 
                  rounded-r-md 
                  hover:bg-[#febd69]
                "
                aria-label="Suche starten"
              >
                <SearchIcon fontSize="small" className="text-[14px]" />
              </button>
            </div>
          </form>
        )}
      </header>

      {/* Mobile Navigation Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] z-40 bg-black bg-opacity-50" onClick={() => setMobileOpen(false)}>
          <nav className="absolute left-0 top-0 bottom-0 w-[280px] bg-gray-800 border-r border-gray-600 overflow-y-auto">
            {/* User Section */}
            {isLoggedIn && customerName ? (
              <div className="border-b border-gray-600">
                <div className="px-4 py-4">
                  <p className="text-sm font-medium text-gray-100">
                    {customerName}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Angemeldet</p>
                </div>
                <div className="space-y-1 pb-4 px-2">
                  <Link
                    href="/konto"
                    className="block px-3 py-2 rounded text-sm text-gray-300 hover:bg-gray-700"
                    onClick={() => setMobileOpen(false)}
                  >
                    Mein Konto
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded text-sm text-gray-300 hover:bg-gray-700 bg-transparent border-none cursor-pointer"
                  >
                    Abmelden
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-b border-gray-600">
                <Link
                  href="/anmelden"
                  className="block px-4 py-3 text-sm font-medium text-[#fea41b] hover:bg-gray-700"
                  onClick={() => setMobileOpen(false)}
                >
                  Anmelden / Registrieren
                </Link>
              </div>
            )}

            {/* Navigation Links */}
            <div className="space-y-1 p-2">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 rounded text-sm text-gray-300 hover:bg-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                <HomeIcon fontSize="small" className="text-[18px]" />
                <span>Home</span>
              </Link>
              <Link
                href="/shoppen"
                className="flex items-center gap-3 px-3 py-2 rounded text-sm text-gray-300 hover:bg-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                <ShoppingBasketIcon fontSize="small" className="text-[18px]" />
                <span>Shoppen</span>
              </Link>
              <Link
                href="/ueber-uns"
                className="flex items-center gap-3 px-3 py-2 rounded text-sm text-gray-300 hover:bg-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                <InfoIcon fontSize="small" className="text-[18px]" />
                <span>Über uns</span>
              </Link>
              <Link
                href="/kontakt"
                className={`flex items-center gap-3 px-3 py-2 rounded text-sm hover:bg-gray-700 ${
                  isKontaktPage
                    ? "text-[#fea41b] bg-gray-700/60"
                    : "text-gray-300"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                <ContactMailIcon fontSize="small" className="text-[18px]" />
                <span>Kontakt</span>
              </Link>
              <Link
                href="/impressum"
                className="flex items-center gap-3 px-3 py-2 rounded text-sm text-gray-300 hover:bg-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                <span>Impressum</span>
              </Link>
              <Link
                href="/datenschutz"
                className="flex items-center gap-3 px-3 py-2 rounded text-sm text-gray-300 hover:bg-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                <span>Datenschutz</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

// Add animation keyframes
if (typeof window !== "undefined") {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}
