"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { FormEvent } from "react";
import { SHOPWARE_ACCOUNT_REGISTER_URL } from "@/lib/shopwareStorefront";

export default function Anmelden() {
  const router = useRouter();
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
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json().catch(() => ({}));
      setSuccess(res.ok);
      setMessage(res.ok ? "Anmeldung erfolgreich!" : (data?.error || "Login fehlgeschlagen"));
      if (res.ok) {
        router.push("/");
        router.refresh();
      }
    } catch {
      setMessage("Server nicht erreichbar");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-14">
      <div className="pointer-events-none absolute -left-8 top-14 h-56 w-56 rounded-full bg-[rgba(40,80,200,0.18)] blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-4 h-56 w-56 rounded-full bg-[rgba(30,110,220,0.13)] blur-3xl" />

      <div className="grid gap-6 md:grid-cols-[1.02fr,0.98fr]">
        <div className="glass-card rounded-3xl p-7 shadow-glow md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5a8fbf]">Konto</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[0.02em] bg-gradient-to-r from-[#b0c8f8] via-[#7bb8ff] to-[#38c8e0] bg-clip-text text-transparent [font-family:var(--font-fraunces)] md:text-5xl">
            Anmelden
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#8892b0] md:text-base">
            Melde dich an, um Kundenbereiche, Käufe und digitale Downloads zentral zu verwalten.
          </p>

          <ul className="mt-8 space-y-3 text-sm leading-relaxed text-[#8892b0]">
            <li>• Zugriff auf Bestellungen und Rechnungen</li>
            <li>• Schnellere Checkout-Prozesse</li>
            <li>• Zugang zu exklusiven Ressourcen</li>
          </ul>

          <div className="mt-8 rounded-2xl border border-[rgba(100,140,255,0.15)] bg-[rgba(20,40,100,0.25)] p-4 text-sm text-[#8892b0]">
            <p className="font-semibold text-[#7bb8ff]">Noch kein Konto?</p>
            <p className="mt-1">Registriere dich direkt über deinen Shopware-Account.</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass-card w-full rounded-3xl p-6 shadow-soft md:p-8"
        >
          <div className="mb-4">
            <label className="mb-1 block text-sm font-semibold text-[#b0c8f8]">E-Mail</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input w-full rounded-xl px-4 py-3 text-sm text-[#dde4f0] outline-none placeholder:text-[#4a5a7a]"
              placeholder="deine@email.de"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-semibold text-[#b0c8f8]">Passwort</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input w-full rounded-xl px-4 py-3 text-sm text-[#dde4f0] outline-none placeholder:text-[#4a5a7a]"
              placeholder="Dein Passwort"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-full bg-gradient-to-r from-[#2d6fd8] to-[#4f9eff] py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(45,110,240,0.2)] transition hover:brightness-110 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Wird angemeldet..." : "Einloggen"}
          </button>

          {message && (
            <p
              className={`mt-4 text-center text-sm font-medium ${
                success ? "text-emerald-400" : "text-[#f87171]"
              }`}
            >
              {message}
            </p>
          )}

          <div className="mt-5 text-center text-sm text-[#5a7090]">
            Noch keinen Shopware Account?{" "}
            <Link href={SHOPWARE_ACCOUNT_REGISTER_URL} className="font-semibold text-[#7bb8ff] underline-offset-4 hover:underline">
              Shopware Account erstellen
            </Link>
          </div>
        </form>
      </div>
      <SpeedInsights />
    </section>
  );
}
