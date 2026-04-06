'use client'
import Image from 'next/image';

export default function Hello() {
  return (
    <article className="w-full flex justify-center items-center px-4">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[600px] w-full">

        {/* Produkt 1 */}
        <div className="rounded-lg px-6 py-4 text-center">
          <Image 
            src="/images/Weisßbrot.png"
            alt="Weizenbrot"
            width={150}
            height={150}
            className="rounded-lg mx-auto"
          />

          <p className="font-semibold text-gray-700 text-4xl mt-2">3,99 €</p>

          <a
            href="/Warenkorb"
            className="block w-full bg-blue-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-blue-700 transition mt-3"
          >
            Jetzt bestellen
          </a>
        </div>

        {/* Produkt 2 */}
        <div className="rounded-lg px-6 py-4 text-center">
          <Image 
            src="/images/Roggenbrot.jpg"
            alt="Roggenbrot"
            width={150}
            height={150}
            className="rounded-lg mx-auto"
          />

          <p className="font-semibold text-gray-700 text-4xl mt-2">5,99 €</p>

          <a
            href="/Warenkorb"
            className="block w-full bg-blue-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-blue-700 transition mt-3"
          >
            Jetzt bestellen
          </a>
        </div>

      </div>
    </article>
  );
}
