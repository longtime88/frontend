import Image from "next/image";
import Category from "./components/Category";

  

export default function Homepage() {
  return (
    <div>
      <span>
      <section className="relative w-full h-[calc(100vh-6rem)]">
      <div className="relative w-full h-full">
            
      <Image
        src="/images/Hintergrund.png"
          alt="Hintergrund"
          fill
          className="object-cover absolute"
          loading="eager"
              priority
      />
      
     <nav>
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-center pt-6 hover:gap-4 transition hover:bg-blue-500">
           <Category />    
      </div>
         </nav>
      </div>
        </section>
      </span>
    </div>
  );
}





    
  

