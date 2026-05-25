"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

export default function Footer() {
  const pathname = usePathname();
  const isKontaktPage = pathname === "/kontakt";

  return (
    <footer className="mt-16 border-t border-[rgba(100,140,255,0.12)] glass">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-4 px-4 py-6 md:px-6">
        {/* Copyright and Legal Links */}
        <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-center">
          <span>
            © {new Date().getFullYear()} <span className="text-white">Molinka</span>
          </span>
          <div className="flex items-center gap-4 text-xs text-[#5a7090]">
            <span className="hidden text-[#c0d0e8] sm:inline">·</span>
            <Link href="/impressum" className="transition hover:text-[#7bb8ff]">
              Impressum
            </Link>
            <span className="hidden text-[#c0d0e8] sm:inline">·</span>
            <Link href="/datenschutz" className="transition hover:text-[#7bb8ff]">
              Datenschutz
            </Link>
            <span className="hidden text-[#c0d0e8] sm:inline">·</span>
            <Link
              href="/kontakt"
              className={`transition hover:text-[#7bb8ff] ${
                isKontaktPage ? "text-[#7bb8ff] font-medium" : ""
              }`}
            >
              Kontakt
            </Link>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex items-center gap-4">
          <a
            href="https://facebook.com/molinka"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[rgba(100,140,255,0.1)] hover:bg-[rgba(100,140,255,0.2)] transition-colors duration-200 text-[#1877f2] hover:text-[#166fe5]"
          >
            <FacebookIcon fontSize="medium" />
          </a>
          <a
            href="https://instagram.com/molinka"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[rgba(100,140,255,0.1)] hover:bg-[rgba(100,140,255,0.2)] transition-colors duration-200 text-[#e4405f] hover:text:#d62e49"
          >
            <InstagramIcon fontSize="medium" />
          </a>
        </div>
      </div>
    </footer>
  );
}
