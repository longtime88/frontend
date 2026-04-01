import Image from "next/image";


export default function Homepage() {
  return (
     
    <div>
      <span>
      <section className="relative">
      <div className=" bg-white shadow flex bg-center items-center min-h-screen px-6 relative z-20 w-full
       h-[calc(100vh-6rem)]">
      <Image
        src="/images/Hintergrund.png"
          alt="Hintergrund"
          fill
          className="object-cover"
          loading="eager"
              priority
      />
       
            
          </div>
        </section>
      </span>
    </div >
   
    
  );
}

    
  

