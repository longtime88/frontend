import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const dynamic = "force-dynamic";

/**
 * Startseiten-Komponente mit Hintergrundbild.
 * Zeigt Begrüßungstext, Call-to-Action Button und Statistiken.
 */
export default function Homepage() {
  return (
    <>
      <div style={{ backgroundImage: "url('/images/Imagbehind.jpeg')" }} className="relative min-h-screen bg-cover bg-center">
        <div className="min-h-screen flex flex-col justify-center">
          <div className="mx-auto max-w-7xl px-4 py-12">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-white mb-4 md:text-4xl lg:text-5xl drop-shadow-lg">
                Willkommmen bei Molinka 
              </h1>
              <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-8 drop-shadow">
                
              </p>
              <Link
                href="/shoppen"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-md text-sm transition-colors"
              >
                Jetzt shoppen
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/20 pt-12 text-white">
              <div className="text-center">
                <p className="text-3xl font-bold drop-shadow-lg">24/7</p>
                <p className="text-sm text-gray-300 drop-shadow">Support</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold drop-shadow-lg">100+</p>
                <p className="text-sm text-gray-300 drop-shadow">Plugins</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold drop-shadow-lg">1</p>
                <p className="text-sm text-gray-300 drop-shadow">Erfahrung</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Analytics />
      <SpeedInsights />
    </>
  );
}