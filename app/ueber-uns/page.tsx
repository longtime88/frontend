'use client'

import Image from "next/image"
import Link from "next/link"

export default function Ueberuns() {
  return (
    <div className="min-h-screen bg-blue-600 text-white px-6 
                    pt-32 md:pt-48 lg:pt-60  /* Abstand unter dem Header */
                    flex flex-col items-center">

      {/* Titel */}
      <h1 className="text-4xl font-bold mb-10 text-center">
        Über uns – Verkauf & Handelsinformationen
      </h1>

      {/* Info-Box */}
      <div className="bg-white text-black max-w-3xl w-full p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl font-semibold mb-4">Wer wir sind</h2>
        <p className="mb-6">
          Wir sind ein modernes Handelsunternehmen, spezialisiert auf hochwertige Backwaren,
          regionale Produkte und zuverlässigen Kundenservice. Unser Ziel ist es, frische
          Lebensmittel schnell, sicher und transparent anzubieten.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Unsere Verkaufs- & Handelsinformationen</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Transparente Preise und klare Produktinformationen</li>
          <li>Regionale Lieferanten und nachhaltige Produktion</li>
          <li>Schnelle Lieferung und sichere Bezahlmethoden</li>
          <li>Faire Handelsbedingungen für Kunden & Partner</li>
        </ul>

        {/* Bilderbereich */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg overflow-hidden shadow-md">
            <Image
              src="/images/Weisßbrot.png"
              alt="Weißbrot"
              width={500}
              height={300}
              className="object-cover w-full h-48"
            />
          </div>

          <div className="rounded-lg overflow-hidden shadow-md">
            <Image
              src="/images/Roggenbrot.jpg"
              alt="Roggenbrot"
              width={500}
              height={300}
              className="object-cover w-full h-48"
            />
          </div>
        </div>

        {/* Link zurück */}
        <div className="text-center mt-10">
          <Link
            href="/"
            className="text-blue-600 font-semibold hover:underline"
          >
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  )
}
