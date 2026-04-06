import Image from "next/image";
import Category from "./components/Category";
import Hello from "./components/hello";
import { Analytics } from '@vercel/analytics/next';
export default function Homepage() {
  return (
    <section className="relative w-full min-h-screen">

      {/* Hintergrundbild */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/Hintergrund.png"
          alt="Hintergrund"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Inhalt */}
      <div className="
        relative z-10 
        w-full min-h-screen 
        flex flex-col 
        items-center 
        justify-start 
        gap-12 
        px-4 

        pt-60     /* Mobile */
        md:pt-48  /* Tablet */
        lg:pt-30  /* Desktop */
      ">
        
        {/* Category oben, zentriert */}
        <div className="w-full flex justify-center">
          <Category />
        </div>

        {/* Produkte darunter */}
        <div className="w-full flex justify-center">
          <Hello />
        </div>
      <Analytics />
      </div>
    </section>
  );
}
