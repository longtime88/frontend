"use client";

import { useState } from "react";
import Link from "next/link";
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { FormEvent } from "react";
import { SHOPWARE_ACCOUNT_REGISTER_URL } from "@/lib/shopwareStorefront";

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
    <section className="relative mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-14">
      <div className="pointer-events-none absolute -left-8 top-14 h-56 w-56 rounded-full bg-[#ffe1c1]/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-4 h-56 w-56 rounded-full bg-[#d9efff]/40 blur-3xl" />

      <div className="grid gap-6 md:grid-cols-[1.02fr,0.98fr]">
        <div className="rounded-3xl border border-[color:var(--line)] bg-white p-7 shadow-[0_16px_40px_rgba(45,29,15,0.08)] md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--accent)]">Konto</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)] md:text-5xl">
            Anmelden
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted)] md:text-base">
            Melde dich an, um Kundenbereiche, Kaeufe und digitale Downloads zentral zu verwalten.
          </p>

          <ul className="mt-8 space-y-3 text-sm leading-relaxed text-[color:var(--muted)]">
            <li>• Zugriff auf Bestellungen und Rechnungen</li>
            <li>• Schnellere Checkout-Prozesse</li>
            <li>• Zugang zu exklusiven Ressourcen</li>
          </ul>

          <div className="mt-8 rounded-2xl border border-[#ece1d5] bg-[#fff9f1] p-4 text-sm text-[color:var(--muted)]">
            <p className="font-semibold text-[#8f3f1d]">Noch kein Konto?</p>
            <p className="mt-1">Registriere dich direkt ueber deinen Shopware-Account.</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full rounded-3xl border border-[color:var(--line)] bg-white p-6 shadow-[0_16px_40px_rgba(45,29,15,0.08)] md:p-8"
        >
          <div className="mb-4">
            <label className="mb-1 block text-sm font-semibold text-[color:var(--ink)]">E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-[color:var(--ink)] outline-none focus:border-[color:var(--brand)] focus:ring-4 focus:ring-[color:var(--brand)]/15"
              placeholder="deine@email.de"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-semibold text-[color:var(--ink)]">Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-[color:var(--ink)] outline-none focus:border-[color:var(--brand)] focus:ring-4 focus:ring-[color:var(--brand)]/15"
              placeholder="Dein Passwort"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[#e18244] py-3 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:from-[color:var(--brand-deep)] hover:to-[#c05d2b] disabled:cursor-not-allowed disabled:opacity-60"
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
            Noch keinen Shopware Account?{" "}
            <Link href={SHOPWARE_ACCOUNT_REGISTER_URL} className="font-semibold text-[color:var(--brand)] underline-offset-4 hover:underline">
              Shopware Account erstellen
            </Link>
          </div>
        </form>
      </div>
      <SpeedInsights/>
    </section>
  );
}
