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
          subject: formData.get("subject"),
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
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-gray-600">
          <a href="/" className="hover:text-orange-600">Startseite</a> &rsaquo; <span>Kontakt</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kontaktieren Sie uns</h1>
        <p className="text-gray-600 mb-8">
          Unser Kundenservice steht Ihnen gerne zur Verfügung. Füllen Sie das Formular aus, um uns Ihre Frage zu stellen.
        </p>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="font-bold text-gray-900 mb-4">Kundendienst</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-700">E-Mail</p>
                  <p className="text-gray-600">support@ihrefirma.de</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Telefon</p>
                  <p className="text-gray-600">+49 123 456789</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Öffnungszeiten</p>
                  <p className="text-gray-600">Mo-Fr: 9:00 - 18:00 Uhr</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">Versand & Rückgabe</h3>
                <p className="text-sm text-gray-600">
                  Kostenlose Rücksendung innerhalb von 30 Tagen.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    required
                    name="name"
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    placeholder="Max Mustermann"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-Mail *
                  </label>
                  <input
                    required
                    name="email"
                    type="email"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    placeholder="max@beispiel.de"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    placeholder="+49 123 456789"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Betreff *
                  </label>
                  <input
                    required
                    name="subject"
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    placeholder="Frage zu Ihrer Bestellung"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nachricht *
                  </label>
                  <textarea
                    required
                    name="message"
                    rows={6}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    placeholder="Bitte beschreiben Sie Ihr Anliegen..."
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || sent}
                className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Wird gesendet..." : sent ? "Nachricht gesendet ✓" : "Nachricht senden"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}