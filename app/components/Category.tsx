"use client"
 
import { useState } from "react";

const categories = [
  { id: 1, name: "Brote",products: ["Weizenbrot","Roggenbrot",] },
  { id: 2, name: "Süßbackwaren", products: ["Krapfen", "Schokocroissant"] },
  { id: 3, name: "Küchenwerkzeug", products:["Küchenmaschine","Küchenmesser"] },
  { id: 4, name: "Weine", products:["Rotwein","Weißwein"] }
]; 

export default function Category() {
  const [openCategory, setOpenCategory] = useState(null);
  const toggle = (id: any) => {
    setOpenCategory(openCategory === id ? null : id);
  };
 
  return ( 
    <nav>
      <div className="relative z-10 w-full h-full flex items-center justify-center px-6">
        <div className="text-center text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                onClick={() => toggle(cat.id)}
                className="bg-blue-950 p-4 rounded-lg cursor-pointer hover:bg-black/70 transition"
              >
                {cat.name}
                {openCategory === cat.id && (
                  <ul className="mt-2 text-shadow-mauve-500 gab-4">
                    {cat.products.map((p, i) => (
                      <li key={i}>• {p}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>  
    </nav>
  );
}