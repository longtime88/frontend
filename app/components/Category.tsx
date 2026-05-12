"use client"
 
import { useState } from "react";

const categories = [
  { id: 1, name: "Shopware Plugins", products: ["Checkout Erweiterung", "Custom CMS Blocks", "B2B Features"] },
  { id: 2, name: "Frontend Templates", products: ["Landingpage Kits", "Next.js Storefront UI", "Responsive Components"] },
  { id: 3, name: "Automation", products: ["API Integrationen", "ERP Sync", "Lead Workflows"] },
  { id: 4, name: "Mentoring", products: ["Code Review", "Pair Programming", "Tech Setup Sessions"] }
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
                Services & Produkte
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
