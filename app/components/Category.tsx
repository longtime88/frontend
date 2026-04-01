'use client'
 
import { useState } from "react";

const categories = [
  { id: 1, name: "Brote",products: ["Weizenbrot","Roggenbrot",] },
  { id: 2, name: "Süßbackwaren", products: ["Krapfen", "Schokocroissant"] },
  { id: 3, name: "Küchenwerkzeuge", products:["Küchenmaschine", "Küchenmesser"] },
  { id: 4, name: "Weine", products:["Rotwein","Weißwein"] }
];

export default function Category() {
  const [openCategory, setOpenCategory] = useState(null);
  const toggle = (id: any) => {
    setOpenCategory(openCategory === id ? null : id);
  };
 
  return ( 
    <div className="shadow p-1 items-start justify-center relative flex gab-4 bg-blue-700 md:flex-row">
      <div className="w-48 space-y-3 flex gab-4 justify-center ">
        {categories.map((cat) => (
          <div key={cat.id} className="px-4 py-2 backdrop-blur-sm rounded-lg">
            <button
              onClick={() => toggle(cat.id)}
              className="w-full flex px-3 py-2 gap-4 z-10 text-left font-medium transition backdrop-blur-sm"
            >
              {cat.name}
              <span>{openCategory === cat.id ? "−" : "+"}</span>
            </button>
            {openCategory === cat.id && (
              <ul className="px-4 py-2 space-y-1 bg-white">
                {cat.products.map((p, i) => (
                  <li key={i} className="text-gray-500">•{p}</li>
                ))}
              </ul>
              
            )}
          </div>
         
        ))}
       
      </div>
    
    </div>
   
  );
}