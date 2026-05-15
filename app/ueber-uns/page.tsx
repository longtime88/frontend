'use client'
import { SpeedInsights } from "@vercel/speed-insights/next"
import Image from "next/image"
import Link from "next/link"

export default function Ueberuns() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-14">
      <div className="pointer-events-none absolute -left-10 top-4 h-64 w-64 rounded-full bg-[#ffe5c8]/55 blur-3xl" />
      <div className="pointer-events-none absolute -right-8 bottom-8 h-56 w-56 rounded-full bg-[#d9f0ff]/45 blur-3xl" />

      <div className="relative rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-7 shadow-[0_16px_40px_rgba(45,29,15,0.08)] md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--accent)]">Studio</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)] md:text-5xl">
          Ueber mich
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[color:var(--muted)] md:text-base">
          Ich entwickle performante Shop- und Portfolio-Loesungen mit Fokus auf Shopware, Next.js und skalierbare
          Integrationen. Ziel ist immer ein Auftritt, der professionell wirkt und gleichzeitig konvertiert.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-3xl border border-[color:var(--line)] bg-white p-6 shadow-[0_12px_32px_rgba(45,29,15,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--brand)]">
          <h2 className="text-2xl font-semibold tracking-[0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)]">
            Meine Arbeitsweise
          </h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[color:var(--muted)]">
            <li>• Klare Architektur statt Schnellschuss-Loesungen</li>
            <li>• Nutzerfokus: Seite soll verkaufen und verstaendlich sein</li>
            <li>• Sauberer Code mit nachvollziehbarer Struktur</li>
            <li>• Enge Zusammenarbeit und transparente Schritte</li>
          </ul>
        </article>

        <article className="rounded-3xl border border-[color:var(--line)] bg-white p-6 shadow-[0_12px_32px_rgba(45,29,15,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--brand)]">
          <h2 className="text-2xl font-semibold tracking-[0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)]">
            Was Kunden bekommen
          </h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[color:var(--muted)]">
            <li>• Individuelle Shopware Erweiterungen</li>
            <li>• Portfolio- und Landingpage-Builds</li>
            <li>• Checkout- und UX-Optimierung</li>
            <li>• Wartbare Komponenten und Deployment-Setup</li>
          </ul>
        </article>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-[color:var(--line)] bg-white p-3 shadow-[0_12px_32px_rgba(45,29,15,0.06)] transition duration-300 hover:-translate-y-1">
          <Image
            src="/images/Hintergrund.png"
            alt="Projektansicht"
            width={900}
            height={520}
            className="h-60 w-full rounded-2xl object-cover transition duration-500 hover:scale-[1.03]"
          />
        </div>
        <div className="overflow-hidden rounded-3xl border border-[color:var(--line)] bg-white p-3 shadow-[0_12px_32px_rgba(45,29,15,0.06)] transition duration-300 hover:-translate-y-1">
          <Image
            src="/images/Luna.jpg"
            alt="Portfolio Preview"
            width={900}
            height={520}
            className="h-60 w-full rounded-2xl object-cover transition duration-500 hover:scale-[1.03]"
          />
        </div>
      </div>

      <div className="mt-10 rounded-3xl border border-[#eddccf] bg-gradient-to-r from-[#fff7ec] via-white to-[#eef7ff] p-6 text-center shadow-[0_12px_32px_rgba(45,29,15,0.05)] md:p-8">
        <p className="text-sm text-[color:var(--muted)]">Bereit fuer ein Projekt mit klarer Struktur und starkem Look?</p>
        <Link
          href="/kontakt"
          className="mt-4 inline-flex rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[#e18244] px-6 py-3 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:from-[color:var(--brand-deep)] hover:to-[#c05d2b]"
        >
          Projekt anfragen
        </Link>
      </div>
      <SpeedInsights/>
    </section>
  )
}
