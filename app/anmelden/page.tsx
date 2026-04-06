"use client";

import { Analytics } from "@vercel/analytics/nuxt/runtime";
import { useState } from "react";

export default function Anmelden() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setSuccess(false);
    setSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const res = await fetch(`${apiUrl}/api/login`, {
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
    } catch (err) {
      setMessage("Server nicht erreichbar");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-blue-600">
      <h1 className="text-3xl font-bold mb-6 text-white">Anmelden</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white text-black p-6 rounded-lg shadow-lg"
      >
        <div className="mb-4">
          <label className="block mb-1 font-medium">E-Mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Deine E-Mail"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Passwort</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Dein Passwort"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Wird angemeldet…" : "Einloggen"}
        </button>

        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              success ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Registrieren-Link */}
        <div className="mt-4 text-center">
          <p className="text-sm">
            Noch keinen Account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Registrieren
              
            </a>
          </p>
        </div>
      </form>
      <Analytics />
    </div>
  );
}
