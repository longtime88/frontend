"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CustomerMeResponse = {
  loggedIn?: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
  customerEmail?: string;
};

export default function KontoPage() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCustomer() {
      try {
        const response = await fetch("/api/customer/me", { cache: "no-store" });
        const data = (await response.json().catch(() => ({}))) as CustomerMeResponse;

        if (!active) return;
        if (!response.ok || !data.loggedIn) {
          setLoggedIn(false);
          setLoading(false);
          return;
        }

        const fullName = [data.firstName, data.lastName]
          .map((value) => String(value || "").trim())
          .filter(Boolean)
          .join(" ");

        setName(fullName);
        setEmail(String(data.email || data.customerEmail || ""));
        setLoggedIn(true);
      } catch {
        if (!active) return;
        setLoggedIn(false);
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadCustomer();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-14">
        <div className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-8 text-sm text-[color:var(--muted)]">
          Kundendaten werden geladen...
        </div>
      </section>
    );
  }

  if (!loggedIn) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-14">
        <div className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--accent)]">Konto</p>
          <h1 className="mt-2 text-3xl font-bold text-[color:var(--ink)] [font-family:var(--font-fraunces)] md:text-4xl">
            Bitte anmelden
          </h1>
          <p className="mt-3 text-sm text-[color:var(--muted)]">
            Du bist aktuell nicht eingeloggt. Melde dich an, um dein Konto zu sehen.
          </p>
          <Link
            href="/anmelden"
            className="mt-6 inline-flex rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-white"
          >
            Zur Anmeldung
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-14">
      <div className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-8 shadow-glow">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--accent)]">Konto</p>
        <h1 className="mt-2 text-3xl font-bold text-[color:var(--ink)] [font-family:var(--font-fraunces)] md:text-4xl">
          Willkommen in deinem Konto
        </h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[color:var(--line)] bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--muted)]">Name</p>
            <p className="mt-2 text-base font-semibold text-[color:var(--ink)]">{name || "Nicht angegeben"}</p>
          </div>
          <div className="rounded-2xl border border-[color:var(--line)] bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--muted)]">E-Mail</p>
            <p className="mt-2 text-base font-semibold text-[color:var(--ink)]">{email || "Nicht angegeben"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
