"use client";

import { useState, type FormEvent } from "react";

export default function KontaktPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-14">
      <div className="pointer-events-none absolute -right-8 top-10 h-56 w-56 rounded-full bg-[#ffd7b1]/45 blur-3xl" />
      <div className="pointer-events-none absolute -left-8 bottom-4 h-52 w-52 rounded-full bg-[#d7efff]/40 blur-3xl" />

      <div className="grid gap-6 md:grid-cols-[1.02fr,0.98fr]">
        <div className="rounded-3xl border border-[color:var(--line)] bg-white p-7 shadow-[0_16px_40px_rgba(45,29,15,0.08)] md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--accent)]">Kontakt</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)] md:text-5xl">
            Lass uns dein Projekt starten
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted)] md:text-base">
            Schick mir dein Ziel, den gewuenschten Zeitrahmen und dein Budget. Du bekommst eine klare Einschaetzung
            mit naechsten Schritten.
          </p>

          <div className="mt-8 space-y-3 text-sm text-[color:var(--muted)]">
            <p>• Shopware Frontend & Checkout</p>
            <p>• Portfolio / Landingpage Entwicklung</p>
            <p>• Plugin-Entwicklung & API-Integrationen</p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#ecdccd] bg-[#fff9f1] p-4 text-sm">
              <p className="font-bold text-[#a0421a]">Antwortzeit</p>
              <p className="mt-1 text-[color:var(--muted)]">In der Regel innerhalb von 24h.</p>
            </div>
            <div className="rounded-2xl border border-[#e0ebf8] bg-[#f5f9ff] p-4 text-sm">
              <p className="font-bold text-[#336aa6]">Projektstart</p>
              <p className="mt-1 text-[color:var(--muted)]">Nach Abstimmung schnell umsetzbar.</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[color:var(--line)] bg-white p-6 shadow-[0_16px_40px_rgba(45,29,15,0.08)] transition duration-300 md:p-8"
        >
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[color:var(--ink)]">Name</label>
              <input
                required
                type="text"
                className="w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-[color:var(--ink)] outline-none focus:border-[color:var(--brand)] focus:ring-4 focus:ring-[color:var(--brand)]/15"
                placeholder="Max Mustermann"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[color:var(--ink)]">E-Mail</label>
              <input
                required
                type="email"
                className="w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-[color:var(--ink)] outline-none focus:border-[color:var(--brand)] focus:ring-4 focus:ring-[color:var(--brand)]/15"
                placeholder="max@beispiel.de"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[color:var(--ink)]">Projektanfrage</label>
              <textarea
                required
                rows={5}
                className="w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-[color:var(--ink)] outline-none focus:border-[color:var(--brand)] focus:ring-4 focus:ring-[color:var(--brand)]/15"
                placeholder="Was soll gebaut werden? Welche Deadline gibt es?"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[#e18244] py-3 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:from-[color:var(--brand-deep)] hover:to-[#c05d2b]"
          >
            Anfrage senden
          </button>

          {sent && (
            <p className="mt-4 text-center text-sm font-semibold text-emerald-600">
              Danke, ich melde mich schnellstmoeglich bei dir.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
