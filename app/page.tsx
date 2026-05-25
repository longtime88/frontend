import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ScrollAnimations from "./components/ScrollAnimations";

export const dynamic = "force-dynamic";

export default function Homepage() {
  return (
    <>
      {/* Premium Hero Section with Scroll Effects */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[color:var(--bg)]">
        {/* Animated Background with parallax */}
        <div className="absolute inset-0 parallax-animation">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[rgba(79,158,255,0.15)] blur-3xl animate-pulse" />
          <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-[rgba(56,200,224,0.12)] blur-3xl animate-pulse delay-1000" />
          <div className="absolute left-1/3 top-1/3 h-64 w-64 rounded-full bg-[rgba(225,130,68,0.08)] blur-2xl animate-pulse delay-2000" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(100,130,200,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(100,130,200,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--accent)] animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[color:var(--brand)] opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--brand)]" />
            </span>
            Willkommen im Digital Store
          </div>

          <h1 className="text-5xl font-bold tracking-[-0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)] md:text-6xl lg:text-7xl animate-slide-up">
            <span className="block">Premium Digitale Produkte</span>
            <span className="mt-2 block bg-gradient-to-r from-[color:var(--brand)] via-[color:var(--accent)] to-[#e18244] bg-clip-text text-transparent">
              für Profis
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-[color:var(--muted)] animate-fade-in-delay">
            Hochwertige Shopware-Plugins, Next.js Templates und automatisierte Workflows.
            Sofort downloadbar, professionell entwickelt.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-fade-in-delay-2">
            <Link
              href="/shoppen"
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[color:var(--accent)] px-8 py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <span className="relative z-10 flex items-center gap-2">
                Jetzt shoppen
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform group-hover:translate-x-0" />
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-[color:var(--line)] pt-12">
            {[
              ["24/7", "Support"],
              ["100+", "Plugins"],
              ["5 Jahre", "Erfahrung"],
            ].map(([num, label]) => (
              <div key={label} className="animate-fade-in-stagger">
                <p className="text-3xl font-bold text-[color:var(--brand)] [font-family:var(--font-fraunces)]">{num}</p>
                <p className="text-sm text-[color:var(--muted)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Teaser section removed as requested */}
      
      <Analytics />
      <SpeedInsights />
      <ScrollAnimations />
    </>
  );
}