'use client'
import Image from 'next/image';


export default function Hello() {
  

  return (
   
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-lg px-6 py-4 text-center">
          <Image src="/images/Weisßbrot.png"
            alt="Weizenbrot" width={150} height={150}
            className="rounded-lg"
           
        />
        <p className=" font-semibold text-gray-700 text-4xl">3,99 €</p>

        <a
          href="/Warenkorb"
          className="w-full bg-black text-white py-3 rounded-lg text-center font-semibold hover:bg-gray-800 transition"
        >
          Jetzt bestellen
        </a>
       
        </div>

        <div className="rounded-lg px-6 py-4 text-center">
          <Image src="/images/Roggenbrot.jpg"
            alt="Roggenbrot" width={150} height={150}
            className="rounded-lg"
           
        />
        <p className=" font-semibold text-gray-700 text-4xl">5,99 €</p>

        <a
          href="/Warenkorb"
          className="w-full bg-black text-white py-3 rounded-lg text-center font-semibold hover:bg-gray-800 transition"
        >
          Jetzt bestellen
        </a>
        
       

      </div>
    </div>
  );
}



    
   
  




