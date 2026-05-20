import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[rgba(100,140,255,0.15)] glass">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4 md:px-6">
        <div className="md:col-span-2">
          <p className="text-xl font-bold tracking-[0.02em] bg-gradient-to-r from-[#7bb8ff] via-[#4f9eff] to-[#38c8e0] bg-clip-text text-transparent [font-family:var(--font-fraunces)]">
            DevPortfolio
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#8892b0]">
            Moderne Shop- und Portfolio-Lösungen mit Fokus auf sauberem Frontend, klarer Nutzerführung und
            reibungslosem Checkout.
          </p>
        </div>

        <nav aria-label="Rechtliches" className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5a8fbf]">Rechtliches</p>
          <div className="flex flex-col gap-2 text-sm font-semibold text-[#5a7090]">
            <Link
              href="/impressum"
              className="w-fit rounded-lg px-3 py-1.5 transition hover:bg-[rgba(30,60,160,0.18)] hover:text-[#7bb8ff]"
            >
              Impressum
            </Link>
            <Link
              href="/datenschutz"
              className="w-fit rounded-lg px-3 py-1.5 transition hover:bg-[rgba(30,60,160,0.18)] hover:text-[#7bb8ff]"
            >
              Datenschutz
            </Link>
            <Link
              href="/kontakt"
              className="w-fit rounded-lg px-3 py-1.5 transition hover:bg-[rgba(30,60,160,0.18)] hover:text-[#7bb8ff]"
            >
              Kontakt
            </Link>
          </div>
        </nav>

        <nav aria-label="Navigation" className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5a8fbf]">Navigation</p>
          <div className="flex flex-col gap-2 text-sm font-semibold text-[#5a7090]">
            <Link href="/" className="w-fit rounded-lg px-3 py-1.5 transition hover:bg-[rgba(30,60,160,0.18)] hover:text-[#7bb8ff]">
              Start
            </Link>
            <Link href="/#produkte" className="w-fit rounded-lg px-3 py-1.5 transition hover:bg-[rgba(30,60,160,0.18)] hover:text-[#7bb8ff]">
              Produkte
            </Link>
            <Link href="/ueber-uns" className="w-fit rounded-lg px-3 py-1.5 transition hover:bg-[rgba(30,60,160,0.18)] hover:text-[#7bb8ff]">
              Über uns
            </Link>
          </div>
        </nav>
      </div>

      <div className="border-t border-[rgba(100,140,255,0.15)] glass">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-[#5a7090] md:px-6">
          <p>© {new Date().getFullYear()} DevPortfolio. Alle Rechte vorbehalten.</p>
          <p className="text-[#5a8fbf]">Made with Next.js, Tailwind & Shopware</p>
        </div>
      </div>
    </footer>
  );
}
