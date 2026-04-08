import Image from "next/image";
import Category from "./components/Category";
import Hello from "./components/hello";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function Homepage() {
  return (
    <section className="relative w-full min-h-screen bg-gray-50">

      {/* HERO SECTION */}
      <div className="relative w-full h-[90vh] flex items-center justify-center text-center">

        {/* Hintergrundbild */}
        <Image
          src="/images/Luna.jpg"
          alt="Hintergrund"
          fill
          className="object-cover brightness-75"
          priority
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl px-6 text-white flex flex-col items-center gap-6">
          <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
            Willkommen bei <span className="text-blue-400">Luna&Clean</span>
          </h1>

          <p className="text-lg md:text-xl opacity-90">
            Premium Reinigungsprodukte für ein glänzendes Zuhause.
          </p>

          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-semibold shadow-lg transition">
            Jetzt entdecken
          </button>
        </div>
      </div>

      {/* KATEGORIEN */}
      <div className="w-full max-w-6xl mx-auto py-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Kategorien</h2>
        <Category />
      </div>

      {/* BESTSELLER / PRODUKTE */}
      <div className="w-full max-w-6xl mx-auto py-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Unsere Bestseller</h2>
        <Hello />
      </div>

      {/* VORTEILE SEKTION */}
      <div className="w-full bg-white py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Warum Luna&Clean?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">

          <div className="p-6 bg-gray-100 rounded-xl shadow text-center">
            <h3 className="text-xl font-semibold mb-3">Schneller Versand</h3>
            <p className="text-gray-600">Wir liefern innerhalb von 1–3 Werktagen.</p>
          </div>

          <div className="p-6 bg-gray-100 rounded-xl shadow text-center">
            <h3 className="text-xl font-semibold mb-3">Premium Qualität</h3>
            <p className="text-gray-600">Nur hochwertige Produkte für beste Ergebnisse.</p>
          </div>

          <div className="p-6 bg-gray-100 rounded-xl shadow text-center">
            <h3 className="text-xl font-semibold mb-3">Sichere Bezahlung</h3>
            <p className="text-gray-600">Verschlüsselte Zahlungssysteme für maximale Sicherheit.</p>
          </div>

        </div>
      </div>

      {/* TRUST ELEMENTE */}
      <div className="w-full bg-gray-900 text-white py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Über 10.000 zufriedene Kunden</h2>

        <div className="flex flex-wrap justify-center gap-10 opacity-80">
          <span>⭐⭐⭐⭐⭐ 4.9/5 Bewertung</span>
          <span>✔ 100% Zufriedenheitsgarantie</span>
          <span>✔ Nachhaltige Produkte</span>
        </div>
      </div>

      <Analytics />
      <SpeedInsights />
    </section>
  );
}
