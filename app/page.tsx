import Image from "next/image";

export default function Homepage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Willkommen bei Luna&Clean</h1>

    <div className="realtive w-full h-72 mt-4">
      <Image
        src="/images/Hintergrund.png"
          alt="Hintergrund"
          fill
        className="object-cover"
        />
      </div>
    </div>
  );
}

    
  

