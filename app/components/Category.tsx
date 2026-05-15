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
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#e2dbd1] bg-white p-5 text-left shadow-[0_12px_32px_rgba(45,29,15,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c95a2b] hover:shadow-[0_16px_48px_rgba(45,29,15,0.08)]"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-lg font-semibold tracking-[0.02em] text-[#1a1a1a] [font-family:var(--font-fraunces)]">
                {cat.name}
                </p>
                <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm text-[#c95a2b] transition ${isOpen ? "rotate-45 bg-[#fff0e2]" : "bg-[#fff8f0]"}`}>+</span>
              </div>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#7a7368]">
                Services & Produkte
              </p>

              {isOpen && (
                <ul className="mt-4 space-y-2 border-t border-[#e2dbd1] pt-3 text-sm text-[#7a7368]">
                  {cat.products.map((p) => (
                    <li key={p} className="rounded-md px-1 py-0.5 leading-relaxed transition-colors hover:bg-[#fff8f0] hover:text-[#c95a2b]">• {p}</li>
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
