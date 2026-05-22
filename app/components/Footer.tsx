import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[rgba(100,140,255,0.12)] glass">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-3 text-xs text-[#5a7090] md:px-6">
        <span>© {new Date().getFullYear()} Molinka</span>
        <span className="hidden text-[#c0d0e8] sm:inline">·</span>
        <Link href="/impressum" className="transition hover:text-[#7bb8ff]">
          Impressum
        </Link>
        <Link href="/datenschutz" className="transition hover:text-[#7bb8ff]">
          Datenschutz
        </Link>
      </div>
    </footer>
  );
}
