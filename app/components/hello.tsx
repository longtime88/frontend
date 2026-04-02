'use client'
import Image from 'next/image';

export default function Hello() {
  
  return (
    <div className="backdrop-blur-sm rounded-lg px-6 py-4 text-center">
      <Image src="/images/Roggenbrot.jpg"
        alt="Roggenbrot" width={150} height={150}
        className="rounded-lg" />
    </div>
   
  )
}
    
   
  




