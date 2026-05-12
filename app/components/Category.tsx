"use client"
 
import { useState } from "react";

const categories = [
  { id: 1, name: "Küche", products: ["Fettlöser", "Spülreiniger", "Mikrofaser-Tücher"] },
  { id: 2, name: "Bad", products: ["Kalklöser", "Glasreiniger", "Schimmel-Stop"] },
  { id: 3, name: "Bodenpflege", products: ["Holzpflege", "Fliesenreiniger", "Duftkonzentrate"] },
  { id: 4, name: "Nachhaltig", products: ["Refill-Packs", "Bambus-Bürsten", "Öko-Schwämme"] }
]; 

export default function Category() {
  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const toggle = (id: number) => {
    setOpenCategory(openCategory === id ? null : id);
  };
 
  return (
    <nav className="reveal-rise reveal-delay-1">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((cat) => {
          const isOpen = openCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggle(cat.id)}
              className="glass-panel group rounded-2xl px-5 py-4 text-left transition hover:-translate-y-0.5 hover:border-[color:var(--brand)]"
            >
              <p className="brand-title text-lg font-semibold text-[color:var(--ink)]">
                {cat.name}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">
                Produktlinie
              </p>

              {isOpen && (
                <ul className="mt-4 space-y-1 text-sm text-[color:var(--muted)]">
                  {cat.products.map((p) => (
                    <li key={p}>• {p}</li>
                  ))}
                </ul>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
