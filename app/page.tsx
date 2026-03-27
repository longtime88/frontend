import Image from "next/image";

export default function Homepage() {
  return (
    <div>
      
    <div className=" bg-white shadow flex items-center px-6 relative z-20 w-full h-[calc(100vh-5rem)]">
      <Image
        src="/images/Hintergrund.png"
          alt="Hintergrund"
          fill
          className="object-cover"
          loading="eager"
          priority
        />
      </div>
    </div>
  );
}

    
  

