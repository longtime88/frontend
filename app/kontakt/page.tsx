"use client";

import { useState, type FormEvent } from "react";

export default function KontaktPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="grid gap-6 md:grid-cols-[1.05fr,0.95fr]">
        <div className="glass-panel reveal-rise rounded-3xl p-7 md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--accent)]">Kontakt</p>
          <h1 className="brand-title mt-2 text-3xl font-bold text-[color:var(--ink)] md:text-5xl">
            Lass uns dein Projekt starten
          </h1>
          <p className="mt-4 text-sm text-[color:var(--muted)] md:text-base">
            Schick mir dein Ziel, den gewünschten Zeitrahmen und dein Budget. Ich melde mich mit einer klaren
            Einschätzung und einem passenden Vorschlag.
          </p>

          <div className="mt-8 space-y-3 text-sm text-[color:var(--muted)]">
            <p>• Shopware Frontend & Checkout</p>
            <p>• Portfolio / Landingpage Entwicklung</p>
            <p>• Plugin-Entwicklung & API-Integrationen</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel reveal-rise reveal-delay-1 rounded-3xl p-6 md:p-8">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[color:var(--ink)]">Name</label>
              <input
                required
                type="text"
                className="w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-[color:var(--ink)] outline-none focus:border-[color:var(--brand)]"
                placeholder="Max Mustermann"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[color:var(--ink)]">E-Mail</label>
              <input
                required
                type="email"
                className="w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-[color:var(--ink)] outline-none focus:border-[color:var(--brand)]"
                placeholder="max@beispiel.de"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[color:var(--ink)]">Projektanfrage</label>
              <textarea
                required
                rows={5}
                className="w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-[color:var(--ink)] outline-none focus:border-[color:var(--brand)]"
                placeholder="Was soll gebaut werden? Welche Deadline gibt es?"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-5 w-full rounded-xl bg-[color:var(--brand)] py-3 text-sm font-bold text-white transition hover:bg-[color:var(--brand-deep)]"
          >
            Anfrage senden
          </button>

          {sent && (
            <p className="mt-4 text-center text-sm font-semibold text-emerald-600">
              Danke, ich melde mich schnellstmöglich bei dir.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

