'use client'
import { SpeedInsights } from "@vercel/speed-insights/next"
import Link from "next/link"

export default function Ueberuns() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-14">
      <div className="pointer-events-none absolute -left-10 top-4 h-64 w-64 rounded-full bg-[color:var(--glow)] blur-3xl" />
      <div className="pointer-events-none absolute -right-8 bottom-8 h-56 w-56 rounded-full bg-[color:var(--glow)] blur-3xl" />

      <div className="relative rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-7 shadow-glow md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--accent)]">Studio</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)] md:text-5xl">
          Über Molinka
        </h1>
        <div className="mt-5 h-1 w-12 rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[color:var(--accent)]" />

        <div className="mt-6 grid gap-6 md:grid-cols-2 md:gap-10">
          <p className="text-sm leading-relaxed text-[color:var(--muted)] md:text-base">
            Ich bin <span className="font-semibold text-[color:var(--ink)]">Webentwickler &amp; UI-Designer</span> mit
            Fokus auf Shopware, Next.js und modernes Frontend-Engineering. Was als kleiner Online-Shop begann,
            ist heute eine Herzensangelegenheit: <span className="text-[color:var(--ink)]">digitale Produkte bauen,
            die Menschen wirklich nutzen wollen.</span>
          </p>
          <p className="text-sm leading-relaxed text-[color:var(--muted)] md:text-base">
            Hinter mir liegt auch eine schwere Phase — diese hat mir gezeigt, dass Durchhaltevermögen
            und echtes Interesse für das Geschaffene zählen. Genau das bringe ich in jedes Projekt ein:
            Leidenschaft für Qualität, ausgeprägte Lösungsorientierung und die Überzeugung, dass Technologie
            immer zum Menschen passen muss.
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-7 shadow-glow md:p-10">
        <h2 className="text-2xl font-semibold tracking-[0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)] md:text-3xl">
          Meine Sicht auf KI in der Entwicklung
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <p className="text-sm leading-relaxed text-[color:var(--muted)] md:text-base">
            KI ist ein <strong>Werkzeug</strong> — kein Ersatz für kreative Entwickler. Sie kann Repetitive
            erledigen, Ideen visualisieren und den Arbeitsprozess beschleunigen. Doch die eigentliche Magie
            entsteht, wenn Mensch und Maschine sinnvoll zusammenarbeiten: KI als Unterstützung, nicht als
            Ersatz.
          </p>
          <p className="text-sm leading-relaxed text-[color:var(--muted)] md:text-base">
            Unternehmen sollten KI nicht als Kostenfalle missbrauchen, sondern als Werkzeug zur Freisetzung
            menschlicher Kreativität. Qualität entsteht durch Verständnis, Empathie und die Fähigkeit,
            Lösungen zu bauen, die wirklich zählen — das kann KI nicht allein.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: "🛒",
            title: "Shopware Shops",
            desc: "Individuelle Storefronts, Produktkonfiguratoren, Payment-Integrationen und Checkout-Optimierung — der gesamte Verkaufskanal aus einer Hand.",
            badge: "Store-API · Theme · Extensions",
          },
          {
            icon: "⚡",
            title: "Next.js Frontends",
            desc: "Blitzschnelle Seiten mit React, Server Components und TypeScript. Perfekt für SEO, Performance und skalierbare Architektur.",
            badge: "App Router · Server Actions · Tailwind",
          },
          {
            icon: "🎨",
            title: "UI &amp; Design",
            desc: "Klar strukturierte Interfaces mit konsistentem Design-System. Jede Komponente auf Nutzbarkeit und visuelle Harmonie ausgelegt.",
            badge: "Figma · Design-System · Animationen",
          },
          {
            icon: "🗄️",
            title: "Backend &amp; Integration",
            desc: "Schnittstellen zu APIs, Zahlungsanbietern und WaB-Systemen. Saubere Architektur, die auch nach Jahren wartbar bleibt.",
            badge: "Node.js · REST · Datenbanken",
          },
        ].map((card, idx) => (
          <article
            key={idx}
            className="group grid grid-rows-[auto_1fr_auto] rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 transition duration-300 hover:-translate-y-1 hover:border-[color:var(--brand)]/40 shadow-glow"
          >
            <span className="text-5xl leading-none" aria-hidden="true">{card.icon}</span>
            <div>
              <h2 className="mt-4 text-lg font-bold tracking-[0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)]">
                {card.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">{card.desc}</p>
            </div>
            <span className="mt-4 inline-block rounded-full bg-[rgba(79,158,255,0.15)] px-3 py-1 text-xs font-semibold tracking-wider text-[color:var(--brand)]">
              {card.badge}
            </span>
          </article>
        ))}
      </div>

      <div className="mt-14 rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-7 shadow-glow md:p-10">
        <h2 className="text-2xl font-semibold tracking-[0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)] md:text-3xl">
          Mein Prozess — verständlich und transparent
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["01", "Kennenlernen", "Wir besprechen den Umfang, Zielgruppe und Zeitplan — offen, ohne Fachchinesisch."],
            ["02", "Konzept", "Skizzen, Wireframes und eine klare Architektur, bevor die erste Zeile Code geschrieben wird."],
            ["03", "Umsetzung", "Iterativ entwickelt: jede Woche ein Zwischenstand, Feedback direkt eingearbeitet."],
            ["04", "Launch &amp; Support", "Live-Schaltung mit begleitender Einarbeitung und langfristiger Erreichbarkeit."],
          ].map(([step, title, text]) => (
            <div key={step} className="relative rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5">
              <span className="text-5xl font-extrabold leading-none text-[rgba(79,158,255,0.1)] select-none" aria-hidden="true">
                {step}
              </span>
              <p className="mt-3 text-base font-bold tracking-[0.02em] text-[color:var(--ink)]">{title}</p>
              <p className="mt-1 text-sm leading-relaxed text-[color:var(--muted)]">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-5 rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-7 shadow-glow md:grid-cols-3 md:p-10">
        {[
          ["5+", "Jahre Erfahrung"],
          ["30+", "Abgeschlossene Projekte"],
          ["100%", "Zufriedene Kunden"],
        ].map(([num, label]) => (
          <div key={label} className="text-center">
            <p className="text-4xl font-extrabold text-[color:var(--brand)] [font-family:var(--font-fraunces)] md:text-5xl">{num}</p>
            <p className="mt-1 text-sm text-[color:var(--muted)]">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-3xl border border-[color:var(--line)] bg-gradient-to-r from-[rgba(79,158,255,0.05)] via-transparent to-[rgba(56,200,224,0.05)] p-6 text-center shadow-glow md:p-10">
        <p className="text-lg font-bold tracking-[0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)] md:text-2xl">
          Bereit für ein gemeinsames Projekt?
        </p>
        <p className="mt-2 max-w-2xl mx-auto text-sm leading-relaxed text-[color:var(--muted)] md:text-base">
          Ob digitale Produkte, Shopware-Erweiterungen oder individuelle Webentwicklung —
          <span className="font-semibold text-[color:var(--ink)]">&nbsp;ich nehme dir die Arbeit ab, damit du dich auf das Wesentliche konzentrieren kannst.</span>
        </p>
        <Link
          href="/kontakt"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[color:var(--accent)] px-7 py-3 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-glow"
        >
          Projekt anfragen
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </Link>
      </div>

      <SpeedInsights />
    </section>
  )
}