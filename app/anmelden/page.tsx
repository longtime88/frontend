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
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-md px-4 py-12">
        <nav className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-orange-600">Startseite</Link> &rsaquo; <span>Anmelden</span>
        </nav>

        <div className="border border-gray-200 rounded-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Anmelden</h1>
          <p className="text-gray-600 mb-6">
            Melde dich an, um Kundenbereiche, Käufe und digitale Downloads zentral zu verwalten.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-Mail
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder="deine@email.de"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passwort
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder="Dein Passwort"
              />
            </div>

            {message && (
              <p className={`mb-4 text-sm font-medium ${
                success ? "text-green-600" : "text-red-600"
              }`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-md transition-colors disabled:opacity-50"
            >
              {submitting ? "Wird angemeldet..." : "Einloggen"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Noch keinen Account?{" "}
              <a href={SHOPWARE_ACCOUNT_REGISTER_URL} className="font-medium text-orange-600 hover:text-orange-700">
                Shopware Account erstellen
              </a>
            </p>
          </div>
        </div>
      </div>

      <SpeedInsights />
    </div>
  );
}
