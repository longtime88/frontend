import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const dynamic = "force-dynamic";

export default function Homepage() {
  return (
    <>
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 md:text-4xl lg:text-5xl">
              Willkommmen bei Monlinka 
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              
            </p>
            <Link
              href="/shoppen"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-md text-sm transition-colors"
            >
              Jetzt shoppen
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-12">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">24/7</p>
              <p className="text-sm text-gray-600">Support</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">100+</p>
              <p className="text-sm text-gray-600">Plugins</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">5 Jahre</p>
              <p className="text-sm text-gray-600">Erfahrung</p>
            </div>
          </div>
        </div>
      </main>

      <Analytics />
      <SpeedInsights />
    </>
  );
}