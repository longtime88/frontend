import Link from "next/link";

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <nav className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-orange-600">Startseite</Link> &rsaquo; <span>Datenschutz</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Datenschutzerklärung</h1>

        <div className="border border-gray-200 rounded-md p-6">
          <div className="space-y-5 text-sm leading-relaxed text-gray-700">
            <p>
              Der Schutz deiner persönlichen Daten ist uns wichtig. Diese Seite informiert über Art, Umfang und Zweck
              der Verarbeitung personenbezogener Daten.
            </p>
            <div>
              <p className="font-medium">Erhobene Daten:</p>
              <p>
                Bei der Nutzung dieser Website können technisch notwendige Daten (z. B. IP-Adresse, Browserdaten,
                Zugriffszeit) verarbeitet werden.
              </p>
            </div>
            <div>
              <p className="font-medium">Kontaktformular:</p>
              <p>
                Wenn du uns eine Anfrage sendest, werden die eingegebenen Daten zur Bearbeitung deiner Anfrage genutzt.
              </p>
            </div>
            <div>
              <p className="font-medium">Deine Rechte:</p>
              <p>
                Du hast jederzeit das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung
                deiner Daten.
              </p>
            </div>
            <div className="rounded-md border border-orange-200 bg-orange-50 p-3 text-xs text-orange-800">
              Hinweis: Diese Vorlage ersetzt keine rechtliche Beratung. Bitte rechtlich prüfen und anpassen.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}