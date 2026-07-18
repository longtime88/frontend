"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { FormEvent } from "react";

export default function Anmelden() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const slowLoginTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (slowLoginTimer.current) {
        clearTimeout(slowLoginTimer.current);
      }
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setSuccess(false);
    setSubmitting(true);
    slowLoginTimer.current = setTimeout(() => {
      setMessage("Anmeldung dauert länger als erwartet...");
    }, 5000);

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
      if (slowLoginTimer.current) {
        clearTimeout(slowLoginTimer.current);
        slowLoginTimer.current = null;
      }
      setSubmitting(false);
    }
  }

  return (
    <section className="relative overflow-hidden bg-[#071326] px-4 py-12 text-[#e8f0ff] md:px-6 md:py-16">
      <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[#2850c8]/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-4 h-72 w-72 rounded-full bg-[#1e9fdb]/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-6 md:grid-cols-[1.02fr,0.98fr]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 shadow-2xl shadow-black/20 backdrop-blur md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8cb7e5]">Konto</p>
          <h1 className="mt-2 bg-gradient-to-r from-[#d6e5ff] via-[#7bb8ff] to-[#38d5df] bg-clip-text text-4xl font-bold tracking-tight text-transparent [font-family:var(--font-fraunces)] md:text-5xl">
            Anmelden
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#b5c0d9] md:text-base">
            Melde dich an, um Kundenbereiche, Bestellungen und digitale Downloads zentral zu verwalten.
          </p>

          <ul className="mt-8 space-y-3 text-sm leading-relaxed text-[#b5c0d9]">
            <li>Zugriff auf Bestellungen und Rechnungen</li>
            <li>Schnellerer Checkout mit gespeicherten Daten</li>
            <li>Zugang zu exklusiven Ressourcen</li>
          </ul>

          <div className="mt-8 rounded-2xl border border-[#7bb8ff]/20 bg-[#1a3c75]/35 p-4 text-sm text-[#b5c0d9]">
            <p className="font-semibold text-[#8fc3ff]">Noch kein Konto?</p>
            <p className="mt-1">Erstelle dein Kundenkonto direkt im gleichen Design.</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/[0.08] p-6 shadow-2xl shadow-black/20 backdrop-blur md:p-8"
        >
          <div className="mb-4">
            <label className="mb-1 block text-sm font-semibold text-[#d6e5ff]">E-Mail</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-[#071a35]/70 px-4 py-3 text-sm text-white outline-none placeholder:text-[#71809e] focus:border-[#7bb8ff] focus:ring-2 focus:ring-[#7bb8ff]/25"
              placeholder="deine@email.de"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-semibold text-[#d6e5ff]">Passwort</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-[#071a35]/70 px-4 py-3 text-sm text-white outline-none placeholder:text-[#71809e] focus:border-[#7bb8ff] focus:ring-2 focus:ring-[#7bb8ff]/25"
              placeholder="Dein Passwort"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-full bg-gradient-to-r from-[#2d6fd8] to-[#4f9eff] py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(45,110,240,0.28)] transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Wird angemeldet..." : "Einloggen"}
          </button>

          {message && (
            <p className={`mt-4 text-center text-sm font-medium ${success ? "text-emerald-300" : "text-red-300"}`}>
              {message}
            </p>
          )}

          <div className="mt-5 text-center text-sm text-[#aebbd3]">
            Noch keinen Account?{" "}
            <Link href="/registrieren" className="font-semibold text-[#8fc3ff] underline-offset-4 hover:underline">
              Konto erstellen
            </Link>
          </div>
        </form>
      </div>
      <SpeedInsights />
    </section>
  );
}
