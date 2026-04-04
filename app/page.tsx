import Image from "next/image";
import Category from "./components/Category";
import Hello from "./components/hello";

  
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
      
      <div className="relative w-full h-full flex flex-col">
        <nav className="pt-6 flex justify-center z-20 relative">
          <Category />    
        </nav>
        
        <div className="mt-8"></div>
        
        <div className="flex justify-center z-20 relative">
          <Hello />
        </div>
      </div>
            
          </div>
          
      </section>
      </span>
    </div>
  );
}





    
  

