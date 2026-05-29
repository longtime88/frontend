import Link from "next/link";

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <nav className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-orange-600">Startseite</Link> &rsaquo; <span>Impressum</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Impressum</h1>

        <div className="border border-gray-200 rounded-md p-6">
          <div className="space-y-5 text-sm leading-relaxed text-gray-700">
            <p className="font-medium">Angaben gemäß § 5 TMG</p>
            <div>
              <p>Max Mustermann</p>
              <p>Molinka Studio</p>
              <p>Musterstraße 1</p>
              <p>12345 Musterstadt</p>
            </div>
            <div>
              <p>E-Mail: kontakt@beispiel.de</p>
              <p>Telefon: +49 000 000000</p>
            </div>
            <p>Umsatzsteuer-ID: DE123456789</p>
            <div className="rounded-md border border-orange-200 bg-orange-50 p-3 text-xs text-orange-800">
              Hinweis: Bitte diese Platzhalter mit deinen echten Unternehmensdaten ersetzen.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}