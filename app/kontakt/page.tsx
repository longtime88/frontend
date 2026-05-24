"use client";

import { useState, type FormEvent } from "react";

export default function KontaktPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });

      if (response.ok) {
        setSent(true);
      } else {
        setError("Fehler beim Senden. Bitte später erneut versuchen.");
      }
    } catch {
      setError("Verbindungsfehler. Bitte prüfen Sie Ihre Internetverbindung.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-14">
      <div className="pointer-events-none absolute -right-8 top-10 h-56 w-56 rounded-full bg-[color:var(--glow)] blur-3xl" />
      <div className="pointer-events-none absolute -left-8 bottom-4 h-52 w-52 rounded-full bg-[color:var(--glow)] blur-3xl" />

      <div className="grid gap-6 md:grid-cols-[1.02fr,0.98fr]">
        <div className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-7 shadow-glow md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--accent)]">Kontakt</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)] md:text-5xl">
            Lass uns dein Projekt starten
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted)] md:text-base">
            Schick mir dein Ziel, den gewünschten Zeitrahmen und dein Budget. Du bekommst eine klare Einschätzung
            mit nächsten Schritten.
          </p>

          <div className="mt-8 space-y-3 text-sm text-[color:var(--muted)]">
            <p>• Shopware Frontend & Checkout</p>
            <p>• Portfolio / Landingpage Entwicklung</p>
            <p>• Plugin-Entwicklung & API-Integrationen</p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[color:var(--line)] bg-[rgba(79,158,255,0.08)] p-4 text-sm">
              <p className="font-bold text-[color:var(--brand)]">Antwortzeit</p>
              <p className="mt-1 text-[color:var(--muted)]">In der Regel innerhalb von 24h.</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[rgba(56,200,224,0.08)] p-4 text-sm">
              <p className="font-bold text-[color:var(--accent)]">Projektstart</p>
              <p className="mt-1 text-[color:var(--muted)]">Nach Abstimmung schnell umsetzbar.</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-glow transition duration-300 md:p-8"
        >
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[color:var(--ink)]">Name</label>
              <input
                required
                name="name"
                type="text"
                className="w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-[color:var(--ink)] outline-none focus:border-[color:var(--brand)] focus:ring-4 focus:ring-[color:var(--brand)]/15"
                placeholder="Max Mustermann"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[color:var(--ink)]">E-Mail</label>
              <input
                required
                name="email"
                type="email"
                className="w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-[color:var(--ink)] outline-none focus:border-[color:var(--brand)] focus:ring-4 focus:ring-[color:var(--brand)]/15"
                placeholder="max@beispiel.de"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[color:var(--ink)]">Projektanfrage</label>
              <textarea
                required
                name="message"
                rows={5}
                className="w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-[color:var(--ink)] outline-none focus:border-[color:var(--brand)] focus:ring-4 focus:ring-[color:var(--brand)]/15"
                placeholder="Was soll gebaut werden? Welche Deadline gibt es?"
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || sent}
            className="mt-5 w-full rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[color:var(--accent)] py-3 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-50"
          >
            {loading ? "Wird gesendet..." : sent ? "Gesendet ✓" : "Anfrage senden"}
          </button>
        </form>
      </div>
    </section>
  );
}