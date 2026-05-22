'use client'
import { SpeedInsights } from "@vercel/speed-insights/next"
import Image from "next/image"
import Link from "next/link"

export default function Ueberuns() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-14">
      {/* Hintergrund-Gradient Dekoration */}
      <div className="pointer-events-none absolute -left-10 top-4 h-64 w-64 rounded-full bg-[#ffe5c8]/55 blur-3xl" />
      <div className="pointer-events-none absolute -right-8 bottom-8 h-56 w-56 rounded-full bg-[#d9f0ff]/45 blur-3xl" />

      {/* ── HEADER ────────────────────────────────── */}
      <div className="relative rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-7 shadow-[0_16px_40px_rgba(45,29,15,0.08)] md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--accent)]">Studio</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)] md:text-5xl">
          Über Molinka
        </h1>
        <div className="mt-5 h-1 w-12 rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[#e18244]" />

        <div className="mt-6 grid gap-6 md:grid-cols-2 md:gap-10">
          <p className="text-sm leading-relaxed text-[color:var(--muted)] md:text-base">
            Ich bin <span className="font-semibold text-[color:var(--ink)]">Webentwickler &amp; UI-Designer</span> mit
            Fokus auf Shopware, Next.js und modernes Frontend-Engineering. Was als kleiner Online-Shop begann,
            ist heute eine Herzensangelegenheit: <span className="text-[color:var(--ink)]">digitale Produkte bauen,
            die Menschen wirklich nutzen wollen.</span>
          </p>
          <p className="text-sm leading-relaxed text-[color:var(--muted)] md:text-base">
            Von der ersten Skizze bis zur Live-Schaltung begleite ich jedes Projekt mit klarer Kommunikation,
            sauberem Code und dem Anspruch, dass sich jedes Detail richtig anfühlt. Ob Shop, Portfolio oder
            individuelle Erweiterung — jedes Auftritt hat seine eigene Geschichte, die es zu erzählen gilt.
          </p>
        </div>
      </div>

      {/* ── WAS ICH KANN ─────────────────────────── */}
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
            className="group grid grid-rows-[auto_1fr_auto] rounded-3xl border border-[color:var(--line)] bg-white p-6 shadow-[0_12px_32px_rgba(45,29,15,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--brand)]/40 hover:shadow-[0_16px_44px_rgba(45,29,15,0.11)]"
          >
            <span className="text-5xl leading-none" aria-hidden="true">{card.icon}</span>
            <div>
              <h2 className="mt-4 text-lg font-bold tracking-[0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)]">
                {card.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">{card.desc}</p>
            </div>
            <span className="mt-4 inline-block rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold tracking-wider text-[#3a6cc7]">
              {card.badge}
            </span>
          </article>
        ))}
      </div>

      {/* ── PROZESS ──────────────────────────────── */}
      <div className="mt-14 rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-7 shadow-[0_16px_40px_rgba(45,29,15,0.08)] md:p-10">
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
            <div key={step} className="relative rounded-2xl border border-[color:var(--line)] bg-white p-5">
              <span className="text-5xl font-extrabold leading-none text-[#e5edff] select-none" aria-hidden="true">
                {step}
              </span>
              <p className="mt-3 text-base font-bold tracking-[0.02em] text-[color:var(--ink)]">{title}</p>
              <p className="mt-1 text-sm leading-relaxed text-[color:var(--muted)]">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── ZAHLEN & STATS ───────────────────────── */}
      <div className="mt-8 grid gap-5 rounded-3xl border border-[color:var(--line)] bg-white p-7 shadow-[0_12px_32px_rgba(45,29,15,0.06)] md:grid-cols-3 md:p-10">
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

      {/* ── GALERIE / SHOWCASE ───────────────────── */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="group overflow-hidden rounded-3xl border border-[color:var(--line)] bg-white p-3 shadow-[0_12px_32px_rgba(45,29,15,0.06)] transition duration-300 hover:-translate-y-1">
          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src="/images/Hintergrund.png"
              alt="Projekt Showcase — Webentwicklung"
              width={900}
              height={520}
              className="h-64 w-full object-cover transition duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,20,60,0.75)] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7bb8ff]">Webentwicklung</p>
              <p className="mt-1 text-lg font-bold text-white [font-family:var(--font-fraunces)]">
                Performante Frontends mit klarer Architektur
              </p>
            </div>
          </div>
        </div>

        <div className="group overflow-hidden rounded-3xl border border-[color:var(--line)] bg-white p-3 shadow-[0_12px_32px_rgba(45,29,15,0.06)] transition duration-300 hover:-translate-y-1">
          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src="/images/Luna.jpg"
              alt="Portfolio Preview — Shoplösungen"
              width={900}
              height={520}
              className="h-64 w-full object-cover transition duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,20,60,0.75)] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#38c8e0]">Shopware</p>
              <p className="mt-1 text-lg font-bold text-white [font-family:var(--font-fraunces)]">
                Individuelle Shop-Lösungen und Checkout-Optimierung
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CALL TO ACTION ──────────────────────── */}
      <div className="mt-10 rounded-3xl border border-[#eddccf] bg-gradient-to-r from-[#fff7ec] via-white to-[#eef7ff] p-6 text-center shadow-[0_12px_32px_rgba(45,29,15,0.05)] md:p-10">
        <p className="text-lg font-bold tracking-[0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)] md:text-2xl">
          Bereit für ein gemeinsames Projekt?
        </p>
        <p className="mt-2 max-w-2xl mx-auto text-sm leading-relaxed text-[color:var(--muted)] md:text-base">
          Ob digitale Produkte, Shopware-Erweiterungen oder individuelle Webentwicklung —
          <span className="font-semibold text-[color:var(--ink)]">&nbsp;ich nehme dir die Arbeit ab, damit du dich auf das Wesentliche konzentrieren kannst.</span>
        </p>
        <Link
          href="/kontakt"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[#e18244] px-7 py-3 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:from-[color:var(--brand-deep)] hover:to-[#c05d2b] shadow-[0_8px_24px_rgba(45,110,240,0.22)]"
        >
          Projekt anfragen
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </Link>
      </div>

      <SpeedInsights />
    </section>
  )
}
