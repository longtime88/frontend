import Link from "next/link";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function Ueberuns() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <nav className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-orange-600">Startseite</Link> &rsaquo; <span>Über uns</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Über Molinka</h1>
        <div className="h-1 w-12 bg-orange-500 rounded-full mb-6"></div>

        <div className="grid gap-6 md:grid-cols-2">
          <p className="text-gray-700">
            Ich bin <strong>Webentwickler & UI-Designer</strong> mit Fokus auf Shopware, Next.js und modernes Frontend-Engineering. Was als kleiner Online-Shop begann, ist heute eine Herzensangelegenheit: digitale Produkte bauen, die Menschen wirklich nutzen wollen.
          </p>
          <p className="text-gray-700">
            Hinter mir liegt auch eine schwere Phase — diese hat mir gezeigt, dass Durchhaltevermögen und echtes Interesse für das Geschaffene zählen. Genau das bringe ich in jedes Projekt ein: Leidenschaft für Qualität, ausgeprägte Lösungsorientierung und die Überzeugung, dass Technologie immer zum Menschen passen muss.
          </p>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Meine Sicht auf KI in der Entwicklung</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <p className="text-gray-700">
              KI ist ein <strong>Werkzeug</strong> — kein Ersatz für kreative Entwickler. Sie kann Repetitive erledigen, Ideen visualisieren und den Arbeitsprozess beschleunigen. Doch die eigentliche Magie entsteht, wenn Mensch und Maschine sinnvoll zusammenarbeiten: KI als Unterstützung, nicht als Ersatz.
            </p>
            <p className="text-gray-700">
              Unternehmen sollten KI nicht als Kostenfalle missbrauchen, sondern als Werkzeug zur Freisetzung menschlicher Kreativität. Qualität entsteht durch Verständnis, Empathie und die Fähigkeit, Lösungen zu bauen, die wirklich zählen — das kann KI nicht allein.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: "🛒", title: "Shopware Shops", desc: "Individuelle Storefronts, Produktkonfiguratoren und Checkout-Optimierung.", badge: "Store-API" },
            { icon: "⚡", title: "Next.js Frontends", desc: "Blitzschnelle Seiten mit React und TypeScript für SEO und Performance.", badge: "App Router" },
            { icon: "🎨", title: "UI & Design", desc: "Klar strukturierte Interfaces mit konsistentem Design-System.", badge: "Figma" },
            { icon: "🗄️", title: "Backend & Integration", desc: "Schnittstellen zu APIs und Zahlungsanbietern.", badge: "Node.js" },
          ].map((card, idx) => (
            <article key={idx} className="border border-gray-200 rounded-md p-5 hover:shadow-md transition-shadow">
              <span className="text-3xl">{card.icon}</span>
              <h3 className="mt-3 font-bold text-gray-900">{card.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{card.desc}</p>
              <span className="mt-3 inline-block text-xs font-medium text-orange-600">{card.badge}</span>
            </article>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mein Prozess</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Kennenlernen", "Wir besprechen Umfang, Zielgruppe und Zeitplan."],
              ["02", "Konzept", "Skizzen und Wireframes vor dem Coding."],
              ["03", "Umsetzung", "Wöchentliche Zwischenstände mit Feedback."],
              ["04", "Launch & Support", "Live-Schaltung mit Einarbeitung."],
            ].map(([step, title, text]) => (
              <div key={step} className="border border-gray-200 rounded-md p-5">
                <span className="text-4xl font-bold text-gray-200">{step}</span>
                <p className="mt-2 font-bold text-gray-900">{title}</p>
                <p className="mt-1 text-sm text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-3 text-center">
          <div>
            <p className="text-4xl font-bold text-gray-900">5+</p>
            <p className="text-sm text-gray-600">Jahre Erfahrung</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-gray-900">30+</p>
            <p className="text-sm text-gray-600">Abgeschlossene Projekte</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-gray-900">100%</p>
            <p className="text-sm text-gray-600">Zufriedene Kunden</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg font-bold text-gray-900 mb-2">Bereit für ein gemeinsames Projekt?</p>
          <p className="text-gray-600 mb-6">
            Ob digitale Produkte, Shopware-Erweiterungen oder individuelle Webentwicklung — ich nehme dir die Arbeit ab.
          </p>
          <Link href="/kontakt" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 px-6 rounded-md transition-colors">
            Projekt anfragen
          </Link>
        </div>
      </div>

      <SpeedInsights />
    </div>
  );
}