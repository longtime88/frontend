'use client'
import Image from 'next/image';

export default function Hello() {
  
  return (
    <div className="flex flex-row gap-6 justify-center items-center">
      <div className="rounded-lg px-6 py-4 text-center">
        <Image src="/images/Roggenbrot.jpg"
          alt="Roggenbrot" width={150} height={150}
          className="rounded-lg" />
      </div>
      
      <div className="rounded-lg px-6 py-4 text-center">
        <Image src="/images/Weisßbrot.png"
          alt="Weizenbrot" width={150} height={150}
          className="rounded-lg" />
        
        
      </div>
    </div>
  )
}


    
   
  




