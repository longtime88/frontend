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
    <nav>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((cat) => {
          const isOpen = openCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggle(cat.id)}
              className="group rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] px-5 py-4 text-left shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--brand)] hover:shadow-[0_16px_34px_rgba(86,45,19,0.14)]"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-lg font-semibold tracking-[0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)]">
                {cat.name}
                </p>
                <span className={`text-sm text-[color:var(--brand)] transition ${isOpen ? "rotate-45" : ""}`}>+</span>
              </div>
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
