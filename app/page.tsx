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
      <div className="pointer-events-none absolute -left-24 top-28 h-72 w-72 rounded-full bg-[#ffd9b8]/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-[32rem] h-72 w-72 rounded-full bg-[#ffe9cc]/70 blur-3xl" />

      <div className="mx-auto mt-6 grid max-w-7xl gap-8 px-4 md:mt-10 md:grid-cols-[1.2fr,0.8fr] md:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-7 shadow-[var(--shadow-soft)] transition duration-500 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(86,45,19,0.16)] md:p-10">
          <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#ffd7b4] blur-3xl" />
          <p className="relative z-10 mb-4 w-fit rounded-full bg-[#fff1de] px-4 py-1 text-xs font-bold tracking-[0.14em] text-[color:var(--brand-deep)]">
            PORTFOLIO · PROJEKTE · SHOP
          </p>
          <h1 className="relative z-10 max-w-2xl text-4xl font-bold leading-tight tracking-[0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)] md:text-6xl">
            Webentwicklung, die verkauft. Portfolio, Services und digitale Produkte in einem Shop.
          </h1>
          <p className="relative z-10 mt-5 max-w-xl text-base text-[color:var(--muted)] md:text-lg">
            Zeig deine Projekte professionell, verkaufe Templates oder Plugins und leite Kunden direkt in den Checkout.
          </p>
          <div className="relative z-10 mt-8 flex flex-wrap gap-3">
            <Link
              href="#produkte"
              className="rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[#e18244] px-6 py-3 text-sm font-bold tracking-wide text-white transition hover:from-[color:var(--brand-deep)] hover:to-[#c05d2b]"
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

        <div className="relative overflow-hidden rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-4 shadow-[var(--shadow-soft)] transition duration-500 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(86,45,19,0.16)]">
          <Image
            src="/images/Hintergrund.png"
            alt="Webentwickler Portfolio Hero"
            width={680}
            height={900}
            className="relative z-10 h-[420px] w-full rounded-2xl object-cover"
            priority
          />
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl px-4 md:px-6">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--brand-deep)]">Sortiment</p>
            <h2 className="text-3xl font-bold tracking-[0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)] md:text-4xl">Leistungen & Produkte</h2>
          </div>
        </div>
        <Category />
      </div>

      <div id="produkte" className="mx-auto mt-14 max-w-7xl px-4 md:px-6">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--accent)]">Top Picks</p>
            <h2 className="text-3xl font-bold tracking-[0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)] md:text-4xl">Digitale Bestseller</h2>
          </div>
        </div>
        <Products />
      </div>

      <div className="mx-auto mt-14 max-w-7xl px-4 md:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Shop-Ready Setup", "Portfolio + Produktverkauf in einem klaren Frontend."],
            ["Sauberer Code", "Moderne Komponenten, responsive Layouts und gute Wartbarkeit."],
            ["Sichere Bezahlung", "Checkout über Shopware mit PayPal-Integration möglich."],
          ].map(([title, text]) => (
            <article key={title} className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--brand)]">
              <h3 className="text-2xl font-semibold tracking-[0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)]">{title}</h3>
              <p className="mt-3 text-sm text-[color:var(--muted)]">{text}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl px-4 md:px-6">
        <div className="rounded-3xl bg-gradient-to-r from-[#8a3f1b] to-[#c96830] px-6 py-10 text-white md:px-10">
          <h2 className="text-3xl font-bold tracking-[0.02em] [font-family:var(--font-fraunces)] md:text-4xl">Bereit für Kundenprojekte & Verkäufe</h2>
          <div className="mt-5 flex flex-wrap gap-6 text-sm font-semibold tracking-wide text-[#ffe0ca]">
            <span>Case Studies präsentierbar</span>
            <span>Services direkt buchbar</span>
            <span>Digitale Produkte sofort verkaufbar</span>
          </div>
        </div>
      </div>

      <Analytics />
      <SpeedInsights />
    </section>
  );
}
