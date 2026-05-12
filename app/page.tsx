import Image from "next/image";
import Link from "next/link";
import Category from "./components/Category";
import { Products } from "./components/hello";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SHOPWARE_CART_URL } from "@/lib/shopwareStorefront";

export default function Homepage() {
  return (
    <section className="relative overflow-hidden pb-20">
      <div className="mx-auto mt-6 grid max-w-7xl gap-8 px-4 md:mt-10 md:grid-cols-[1.2fr,0.8fr] md:px-6">
        <div className="glass-panel reveal-rise relative overflow-hidden rounded-3xl p-7 md:p-10">
          <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#ffd4a7] blur-3xl" />
          <p className="relative z-10 mb-4 w-fit rounded-full bg-[#f6e6d3] px-4 py-1 text-xs font-bold tracking-[0.14em] text-[color:var(--brand-deep)]">
            FRÜHJAHRSANGEBOT · BIS ZU -30%
          </p>
          <h1 className="brand-title reveal-rise reveal-delay-1 relative z-10 max-w-2xl text-4xl font-bold leading-tight text-[color:var(--ink)] md:text-6xl">
            Reinigungsprodukte, die sich wie ein Upgrade für dein Zuhause anfühlen.
          </h1>
          <p className="reveal-rise reveal-delay-2 relative z-10 mt-5 max-w-xl text-base text-[color:var(--muted)] md:text-lg">
            Entdecke wirkungsstarke Formeln, moderne Duftlinien und nachhaltige Refill-Optionen für Küche, Bad und Boden.
          </p>
          <div className="reveal-rise reveal-delay-2 relative z-10 mt-8 flex flex-wrap gap-3">
            <Link
              href="#produkte"
              className="rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-[color:var(--brand-deep)]"
            >
              Jetzt shoppen
            </Link>
            <Link
              href={SHOPWARE_CART_URL}
              className="rounded-full border border-[color:var(--line)] bg-white px-6 py-3 text-sm font-bold text-[color:var(--ink)] transition hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
            >
              Zum Warenkorb
            </Link>
          </div>
        </div>

        <div className="glass-panel reveal-rise reveal-delay-1 relative overflow-hidden rounded-3xl p-4">
          <div className="soft-grid absolute inset-0 opacity-35" />
          <Image
            src="/images/Luna.jpg"
            alt="Luna & Clean Hero"
            width={680}
            height={900}
            className="relative z-10 h-[420px] w-full rounded-2xl object-cover"
            priority
          />
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl px-4 md:px-6">
        <div className="reveal-rise mb-7 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--brand-deep)]">Sortiment</p>
            <h2 className="brand-title text-3xl font-bold text-[color:var(--ink)] md:text-4xl">Kategorien</h2>
          </div>
        </div>
        <Category />
      </div>

      <div id="produkte" className="mx-auto mt-14 max-w-7xl px-4 md:px-6">
        <div className="reveal-rise mb-7 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--accent)]">Top Picks</p>
            <h2 className="brand-title text-3xl font-bold text-[color:var(--ink)] md:text-4xl">Unsere Bestseller</h2>
          </div>
        </div>
        <Products />
      </div>

      <div className="mx-auto mt-14 max-w-7xl px-4 md:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Schneller Versand", "In 1–3 Werktagen direkt zu dir nach Hause."],
            ["Premium Qualität", "Hochwirksame Formeln ohne unnötige Zusätze."],
            ["Sichere Bezahlung", "Zahlung über Shopware Checkout und PayPal möglich."],
          ].map(([title, text]) => (
            <article key={title} className="glass-panel reveal-rise rounded-2xl p-6">
              <h3 className="brand-title text-2xl font-semibold text-[color:var(--ink)]">{title}</h3>
              <p className="mt-3 text-sm text-[color:var(--muted)]">{text}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl px-4 md:px-6">
        <div className="reveal-rise rounded-3xl bg-[#1f3b3a] px-6 py-10 text-white md:px-10">
          <h2 className="brand-title text-3xl font-bold md:text-4xl">Über 10.000 zufriedene Kunden</h2>
          <div className="mt-5 flex flex-wrap gap-6 text-sm font-semibold tracking-wide text-[#d8f1ef]">
            <span>4.9/5 Bewertung</span>
            <span>100% Zufriedenheitsgarantie</span>
            <span>Nachhaltige Produktlinien</span>
          </div>
        </div>
      </div>

      <Analytics />
      <SpeedInsights />
    </section>
  );
}
