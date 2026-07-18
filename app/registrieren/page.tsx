"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  street: "",
  zipcode: "",
  city: "",
};

export default function Registrieren() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(data?.error || "Registrierung fehlgeschlagen.");
        return;
      }

      router.push("/konto");
      router.refresh();
    } catch {
      setMessage("Der Server ist nicht erreichbar.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = "w-full rounded-xl border border-white/15 bg-[#071a35]/70 px-4 py-3 text-sm text-white outline-none placeholder:text-[#71809e] focus:border-[#7bb8ff] focus:ring-2 focus:ring-[#7bb8ff]/25";

  return (
    <section className="relative overflow-hidden bg-[#071326] px-4 py-12 text-[#e8f0ff] md:px-6 md:py-16">
      <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[#2850c8]/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-4 h-72 w-72 rounded-full bg-[#1e9fdb]/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-6 md:grid-cols-[0.9fr,1.1fr]">
        <aside className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 shadow-2xl shadow-black/20 backdrop-blur md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8cb7e5]">Kundenkonto</p>
          <h1 className="mt-2 bg-gradient-to-r from-[#d6e5ff] via-[#7bb8ff] to-[#38d5df] bg-clip-text text-4xl font-bold tracking-tight text-transparent [font-family:var(--font-fraunces)] md:text-5xl">
            Registrieren
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#b5c0d9] md:text-base">
            Erstelle dein Konto und behalte Bestellungen, Rechnungen und Downloads an einem Ort.
          </p>

          <div className="mt-8 space-y-4 text-sm text-[#b5c0d9]">
            <p>Deine Daten werden sicher in Shopware gespeichert.</p>
            <p>Du kannst dich danach direkt in deinem Kundenbereich anmelden.</p>
          </div>

          <div className="mt-8 rounded-2xl border border-[#7bb8ff]/20 bg-[#1a3c75]/35 p-4 text-sm text-[#b5c0d9]">
            Bereits registriert?{" "}
            <Link href="/anmelden" className="font-semibold text-[#8fc3ff] underline-offset-4 hover:underline">
              Jetzt anmelden
            </Link>
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/[0.08] p-6 shadow-2xl shadow-black/20 backdrop-blur md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-[#d6e5ff]">
              Vorname
              <input required autoComplete="given-name" value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} className={`mt-1 ${inputClass}`} />
            </label>
            <label className="block text-sm font-semibold text-[#d6e5ff]">
              Nachname
              <input required autoComplete="family-name" value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} className={`mt-1 ${inputClass}`} />
            </label>
          </div>

          <label className="mt-4 block text-sm font-semibold text-[#d6e5ff]">
            E-Mail
            <input required type="email" autoComplete="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} className={`mt-1 ${inputClass}`} placeholder="deine@email.de" />
          </label>
          <label className="mt-4 block text-sm font-semibold text-[#d6e5ff]">
            Passwort
            <input required minLength={8} type="password" autoComplete="new-password" value={form.password} onChange={(event) => updateField("password", event.target.value)} className={`mt-1 ${inputClass}`} placeholder="Mindestens 8 Zeichen" />
          </label>

          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-sm font-semibold text-[#d6e5ff]">Rechnungsadresse</p>
            <label className="mt-3 block text-sm font-semibold text-[#d6e5ff]">
              Strasse und Hausnummer
              <input required autoComplete="street-address" value={form.street} onChange={(event) => updateField("street", event.target.value)} className={`mt-1 ${inputClass}`} />
            </label>
            <div className="mt-4 grid gap-4 sm:grid-cols-[0.42fr,0.58fr]">
              <label className="block text-sm font-semibold text-[#d6e5ff]">
                PLZ
                <input required autoComplete="postal-code" value={form.zipcode} onChange={(event) => updateField("zipcode", event.target.value)} className={`mt-1 ${inputClass}`} />
              </label>
              <label className="block text-sm font-semibold text-[#d6e5ff]">
                Ort
                <input required autoComplete="address-level2" value={form.city} onChange={(event) => updateField("city", event.target.value)} className={`mt-1 ${inputClass}`} />
              </label>
            </div>
          </div>

          {message && <p className="mt-4 text-center text-sm font-medium text-red-300">{message}</p>}

          <button type="submit" disabled={submitting} className="mt-6 w-full rounded-full bg-gradient-to-r from-[#2d6fd8] to-[#4f9eff] py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(45,110,240,0.28)] transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">
            {submitting ? "Konto wird erstellt..." : "Konto erstellen"}
          </button>
          <p className="mt-4 text-center text-xs leading-relaxed text-[#94a5c4]">
            Mit der Registrierung akzeptierst du die Datenschutzerklaerung.
          </p>
        </form>
      </div>
    </section>
  );
}
