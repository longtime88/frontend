import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[rgba(100,140,255,0.12)] glass">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-[1.3fr,0.7fr] md:px-6">
        <div>
          <p className="text-xl font-bold tracking-[0.02em] bg-gradient-to-r from-[#7bb8ff] via-[#4f9eff] to-[#38c8e0] bg-clip-text text-transparent [font-family:var(--font-fraunces)]">
            DevPortfolio
          </p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#8892b0]">
            Moderne Shop- und Portfolio-Lösungen mit Fokus auf sauberem Frontend, klarer Nutzerführung und
            reibungslosem Checkout.
          </p> 
        </div>

        <nav aria-label="Rechtliches" className="space-y-2 text-sm font-semibold text-[#5a7090]">
          <p className="mb-2 text-xs uppercase tracking-[0.14em] text-[#5a8fbf]">Rechtliches</p>
          <Link
            href="/impressum"
            className="block rounded-lg px-2 py-1.5 transition hover:bg-[rgba(30,60,160,0.18)] hover:text-[#7bb8ff]"
          >
            Impressum
          </Link>
          <Link
            href="/datenschutz"
            className="block rounded-lg px-2 py-1.5 transition hover:bg-[rgba(30,60,160,0.18)] hover:text-[#7bb8ff]"
          >
            Datenschutz
          </Link>
        </nav>
      </div>

      <div className="border-t border-[rgba(100,140,255,0.1)] glass">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-[#5a7090] md:px-6">
          <p>© {new Date().getFullYear()} DevPortfolio</p>
          <p>Made with Next.js, Tailwind und Shopware</p>
        </div>
      </div>
    </footer>
  );
}
