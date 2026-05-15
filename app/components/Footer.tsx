import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[color:var(--line)] bg-gradient-to-b from-white/95 to-[#fff8ef]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-[1.3fr,0.7fr] md:px-6">
        <div>
          <p className="text-xl font-bold tracking-[0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)]">
            DevPortfolio
          </p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[color:var(--muted)]">
            Moderne Shop- und Portfolio-Loesungen mit Fokus auf sauberem Frontend, klarer Nutzerfuehrung und
            reibungslosem Checkout.
          </p>
        </div>

        <nav aria-label="Rechtliches" className="space-y-2 text-sm font-semibold text-[color:var(--muted)]">
          <p className="mb-2 text-xs uppercase tracking-[0.14em] text-[color:var(--accent)]">Rechtliches</p>
          <Link
            href="/impressum"
            className="block rounded-lg px-2 py-1.5 transition hover:bg-[color:var(--surface-subtle)] hover:text-[color:var(--brand)]"
          >
            Impressum
          </Link>
          <Link
            href="/datenschutz"
            className="block rounded-lg px-2 py-1.5 transition hover:bg-[color:var(--surface-subtle)] hover:text-[color:var(--brand)]"
          >
            Datenschutz
          </Link>
        </nav>
      </div>

      <div className="border-t border-[color:var(--line)]/80 bg-white/70">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-[color:var(--muted)] md:px-6">
          <p>© {new Date().getFullYear()} DevPortfolio</p>
          <p>Made with Next.js, Tailwind und Shopware</p>
        </div>
      </div>
    </footer>
  );
}
