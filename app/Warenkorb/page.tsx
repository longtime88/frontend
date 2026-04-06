'use client'
import CartLayout from "../components/CartLayout"

import Image from "next/image";


export default function Basket () {
  return (
    <div className="h-[calc(100vh-6rem)] flex items-center justify-center fixed w-full ">
      <div className="relative w-full h-full">
        <Image
          src="/images/Warenkorb.jpg"
          alt="Warenkorb"
          fill
          className="object-cover object-center absolute"
          loading="eager"
          priority
        />

     <main className="relative w-full h-full">
    <div className="relative w-full h-full flex items-center justify-center">
          <CartLayout>
            <h2 className="text-2xl font-bold mb-4">Dein Warenkorb ist leer!</h2>
            <p className="text-gray-300">Füge Produkte hinzu, um sie hier zu sehen.</p>
          </CartLayout>
          </div>
          </main>
        
      </div>
    </div>
    
  )
}


