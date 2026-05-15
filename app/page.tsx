import Image from "next/image";
import Link from "next/link";
import Category from "./components/Category";
import { Products } from "./components/hello";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SHOPWARE_CART_URL } from "@/lib/shopwareStorefront";

const highlights = [
  ["120+", "Abgeschlossene Deliverables"],
  ["24h", "Schnelle Rueckmeldung"],
  ["99%", "Fokus auf Performance"],
];

export default function Homepage() {
  return (
    <section className="relative overflow-hidden pb-16 md:pb-24">
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#cfe7ff]/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-[24rem] h-80 w-80 rounded-full bg-[#c7f0ea]/60 blur-3xl" />

      <div className="mx-auto mt-6 grid max-w-7xl gap-8 px-4 md:mt-10 md:grid-cols-[1.15fr,0.85fr] md:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-[#d6e2ef] bg-[#f8fbff] p-7 shadow-[0_16px_42px_rgba(18,44,78,0.12)] md:p-10">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#d8f2ee] blur-3xl" />

          <p className="relative z-10 mb-4 w-fit rounded-full bg-[#e9f2ff] px-4 py-1 text-xs font-bold tracking-[0.14em] text-[#17426d]">
            PORTFOLIO · PROJEKTE · SHOP
          </p>
          <h1 className="relative z-10 max-w-2xl text-4xl font-bold leading-tight tracking-[0.02em] text-[#102238] [font-family:var(--font-fraunces)] md:text-6xl">
            Website und Shop in einem Auftritt, der Kunden ueberzeugt.
          </h1>
          <p className="relative z-10 mt-5 max-w-xl text-base leading-relaxed text-[#42586f] md:text-lg">
            Zeig deine Expertise professionell, verkaufe digitale Produkte und fuehre Interessenten ohne Umwege in den
            Checkout.
          </p>

          <div className="relative z-10 mt-8 flex flex-wrap gap-3">
            <Link
              href="#produkte"
              className="rounded-full bg-gradient-to-r from-[#14518f] to-[#1f7a86] px-6 py-3 text-sm font-bold tracking-wide text-white transition duration-300 hover:-translate-y-0.5 hover:from-[#0f3f72] hover:to-[#18626c]"
            >
              Jetzt shoppen
            </Link>
            <Link
              href={SHOPWARE_CART_URL}
              className="rounded-full border border-[#bdd1e4] bg-white px-6 py-3 text-sm font-bold text-[#17314f] transition duration-300 hover:-translate-y-0.5 hover:border-[#14518f] hover:text-[#14518f]"
            >
              Zum Warenkorb
            </Link>
          </div>

          <div className="relative z-10 mt-9 grid gap-3 sm:grid-cols-3">
            {highlights.map(([value, label]) => (
              <article key={label} className="rounded-2xl border border-[#d9e5f2] bg-white px-4 py-3">
                <p className="text-xl font-extrabold text-[#134b83]">{value}</p>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#607287]">{label}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-3xl border border-[#d6e2ef] bg-white p-4 shadow-[0_16px_40px_rgba(18,44,78,0.1)]">
            <Image
              src="/images/Hintergrund.png"
              alt="Webentwickler Portfolio Hero"
              width={680}
              height={900}
              className="h-[380px] w-full rounded-2xl object-cover md:h-[430px]"
              priority
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#d6e2ef] bg-white p-4 text-sm text-[#495e73] shadow-[0_10px_26px_rgba(18,44,78,0.08)]">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#14518f]">UX Klarheit</p>
              <p className="mt-1 font-semibold text-[#1b3550]">Klare Struktur statt visueller Ueberladung.</p>
            </div>
            <div className="rounded-2xl border border-[#cce5df] bg-white p-4 text-sm text-[#495e73] shadow-[0_10px_26px_rgba(23,88,83,0.08)]">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#1f7a86]">Checkout Fokus</p>
              <p className="mt-1 font-semibold text-[#1b3550]">Von der Startseite direkt in den Kaufprozess.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-7xl px-4 md:px-6">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#14518f]">Sortiment</p>
            <h2 className="text-3xl font-bold tracking-[0.02em] text-[#102238] [font-family:var(--font-fraunces)] md:text-4xl">
              Leistungen & Produkte
            </h2>
          </div>
        </div>
        <Category />
      </div>

      <div id="produkte" className="mx-auto mt-14 max-w-7xl px-4 md:px-6">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#1f7a86]">Top Picks</p>
            <h2 className="text-3xl font-bold tracking-[0.02em] text-[#102238] [font-family:var(--font-fraunces)] md:text-4xl">
              Digitale Bestseller
            </h2>
          </div>
        </div>
        <Products />
      </div>

      <div className="mx-auto mt-14 max-w-7xl px-4 md:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Shop-Ready Setup", "Portfolio und Produktverkauf in einem klaren Frontend."],
            ["Sauberer Code", "Moderne Komponenten, responsive Layouts und gute Wartbarkeit."],
            ["Sichere Bezahlung", "Checkout ueber Shopware mit PayPal-Integration moeglich."],
          ].map(([title, text]) => (
            <article
              key={title}
              className="rounded-2xl border border-[#d6e2ef] bg-white p-6 shadow-[0_12px_32px_rgba(18,44,78,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#14518f] hover:shadow-[0_16px_48px_rgba(18,44,78,0.14)]"
            >
              <h3 className="text-2xl font-semibold tracking-[0.02em] text-[#102238] [font-family:var(--font-fraunces)]">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5a6d81]">{text}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl px-4 md:px-6">
        <div className="rounded-3xl bg-gradient-to-r from-[#102e4a] via-[#15557c] to-[#1d7a84] px-6 py-10 text-white md:px-10">
          <h2 className="text-3xl font-bold tracking-[0.02em] [font-family:var(--font-fraunces)] md:text-4xl">
            Bereit fuer Kundenprojekte & Verkaeufe
          </h2>
          <div className="mt-5 flex flex-wrap gap-6 text-sm font-semibold tracking-wide text-[#d7eef4]">
            <span>Case Studies praesentierbar</span>
            <span>Services direkt buchbar</span>
            <span>Digitale Produkte sofort verkaeufbar</span>
          </div>
        </div>
      </div>

      <Analytics />
      <SpeedInsights />
    </section>
  );
}
