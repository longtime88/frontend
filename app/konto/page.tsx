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

/**
 * Konto-Seite mit Kundendaten-Anzeige.
 * Lädt Daten asynchron von /api/customer/me und zeigt sie an.
 */
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
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <p className="text-gray-600">Kundendaten werden geladen...</p>
        </div>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="border border-gray-200 rounded-md p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Konto</h1>
            <p className="text-gray-600 mb-6">
              Du bist aktuell nicht eingeloggt. Melde dich an, um dein Konto zu sehen.
            </p>
            <Link
              href="/anmelden"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded transition-colors"
            >
              Anmelden
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <nav className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-orange-600">Startseite</Link> &rsaquo; <span>Konto</span>
        </nav>

        <div className="border border-gray-200 rounded-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Mein Konto</h1>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-gray-200 rounded-md p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Name</p>
              <p className="text-gray-900 font-medium">{name || "Nicht angegeben"}</p>
            </div>
            <div className="border border-gray-200 rounded-md p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">E-Mail</p>
              <p className="text-gray-900 font-medium">{email || "Nicht angegeben"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}