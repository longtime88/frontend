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
  const toggle = (id: number) => setOpenCategory(openCategory === id ? null : id);

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
              className="glass-card group flex flex-col overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-lg font-semibold tracking-[0.02em] bg-gradient-to-r from-[#b0c8f8] to-[#7bb8ff] bg-clip-text text-transparent [font-family:var(--font-fraunces)]">
                  {cat.name}
                </p>
                <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm text-[#4f9eff] transition ${isOpen ? "rotate-45 bg-[rgba(30,60,160,0.3)]" : "bg-[rgba(30,50,120,0.25)]"}`}>+</span>
              </div>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#5a7090]">
                Services &amp; Produkte
              </p>

              {isOpen && (
                <ul className="mt-4 space-y-2 border-t border-[rgba(100,140,255,0.12)] pt-3 text-sm text-[#8892b0]">
                  {cat.products.map((p) => (
                    <li key={p} className="rounded-md px-1 py-0.5 leading-relaxed transition-colors hover:bg-[rgba(30,60,160,0.18)] hover:text-[#7bb8ff]">
                      • {p}
                    </li>
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
