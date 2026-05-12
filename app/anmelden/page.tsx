"use client";

import { useState } from "react";
import Link from "next/link";
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { FormEvent } from "react";

export default function Anmelden() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setSuccess(false);
    setSubmitting(true);

    try {
      const res = await fetch("/backend-api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setMessage("Login erfolgreich!");
        console.log("Token:", data.token);
      } else {
        setMessage(data.error || "Login fehlgeschlagen");
      }
    } catch {
      setMessage("Server nicht erreichbar");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="grid gap-6 md:grid-cols-[1.05fr,0.95fr]">
        <div className="glass-panel reveal-rise rounded-3xl p-7 md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--accent)]">Konto</p>
          <h1 className="brand-title mt-2 text-3xl font-bold text-[color:var(--ink)] md:text-5xl">Anmelden</h1>
          <p className="mt-4 text-sm text-[color:var(--muted)] md:text-base">
            Melde dich an, um Kundenbereiche, Käufe und digitale Downloads zentral zu verwalten.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-[color:var(--muted)]">
            <li>• Zugriff auf deine Bestellungen und Rechnungen</li>
            <li>• Schnellere Checkout-Prozesse</li>
            <li>• Zugang zu exklusiven Portfolio-Ressourcen</li>
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass-panel reveal-rise reveal-delay-1 w-full rounded-3xl p-6 md:p-8"
        >
          <div className="mb-4">
            <label className="mb-1 block text-sm font-semibold text-[color:var(--ink)]">E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-[color:var(--ink)] outline-none focus:border-[color:var(--brand)]"
              placeholder="deine@email.de"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-semibold text-[color:var(--ink)]">Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-[color:var(--ink)] outline-none focus:border-[color:var(--brand)]"
              placeholder="Dein Passwort"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-xl bg-[color:var(--brand)] py-3 text-sm font-bold text-white transition hover:bg-[color:var(--brand-deep)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Wird angemeldet..." : "Einloggen"}
          </button>

          {message && (
            <p
              className={`mt-4 text-center text-sm font-medium ${
                success ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {message}
            </p>
          )}

          <div className="mt-5 text-center text-sm text-[color:var(--muted)]">
            Noch keinen Account?{" "}
            <Link href="/kontakt" className="font-semibold text-[color:var(--brand)] hover:underline">
              Anfrage senden
            </Link>
          </div>
        </form>
      </div>
      <SpeedInsights/>
    </section>
  );
}
