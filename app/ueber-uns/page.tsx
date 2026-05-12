'use client'
import { SpeedInsights } from "@vercel/speed-insights/next"
import Image from "next/image"
import Link from "next/link"

export default function Ueberuns() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="glass-panel reveal-rise rounded-3xl p-7 md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--accent)]">Studio</p>
        <h1 className="brand-title mt-2 text-3xl font-bold text-[color:var(--ink)] md:text-5xl">
          Über mich
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-[color:var(--muted)] md:text-base">
          Ich entwickle performante Shop- und Portfolio-Lösungen mit Fokus auf Shopware, Next.js und skalierbare
          Integrationen. Mein Ziel: Design, Technik und Conversion zusammenbringen.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="glass-panel reveal-rise rounded-3xl p-6">
          <h2 className="brand-title text-2xl font-semibold text-[color:var(--ink)]">Meine Arbeitsweise</h2>
          <ul className="mt-4 space-y-2 text-sm text-[color:var(--muted)]">
            <li>• Klare Architektur statt Schnellschuss-Lösungen</li>
            <li>• Nutzerfokus: Seite soll verkaufen und verständlich sein</li>
            <li>• Sauberer Code mit nachvollziehbarer Struktur</li>
            <li>• Enge Zusammenarbeit und transparente Schritte</li>
          </ul>
        </article>

        <article className="glass-panel reveal-rise reveal-delay-1 rounded-3xl p-6">
          <h2 className="brand-title text-2xl font-semibold text-[color:var(--ink)]">Was Kunden bekommen</h2>
          <ul className="mt-4 space-y-2 text-sm text-[color:var(--muted)]">
            <li>• Individuelle Shopware Erweiterungen</li>
            <li>• Portfolio- und Landingpage-Builds</li>
            <li>• Checkout- und UX-Optimierung</li>
            <li>• Wartbare Komponenten und Deployment-Setup</li>
          </ul>
        </article>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="glass-panel overflow-hidden rounded-3xl p-3">
          <Image
            src="/images/Hintergrund.png"
            alt="Projektansicht"
            width={900}
            height={520}
            className="h-56 w-full rounded-2xl object-cover"
          />
        </div>
        <div className="glass-panel overflow-hidden rounded-3xl p-3">
          <Image
            src="/images/Luna.jpg"
            alt="Portfolio Preview"
            width={900}
            height={520}
            className="h-56 w-full rounded-2xl object-cover"
          />
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="inline-flex rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-bold text-white hover:bg-[color:var(--brand-deep)]">
          Zurück zur Startseite
        </Link>
      </div>
      <SpeedInsights/>
    </section>
  )
}
