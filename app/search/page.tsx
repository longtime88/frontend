"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type SearchProduct = {
  id: string;
  name: string;
  price?: Array<{
    gross?: number;
  }>;
};

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchProduct[]>([]);

  useEffect(() => {
    if (!query) return;

    async function load() {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.elements || []);
    }

    load();
  }, [query]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Suchergebnisse für: {query}</h2>

      {results.length === 0 && <p>Keine Produkte gefunden.</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {results.map((product) => (
          <div key={product.id} className="p-4 border rounded-lg bg-white text-black">
            <h3 className="font-semibold">{product.name}</h3>
            {product.price && (
              <p className="text-gray-700">{product.price[0]?.gross} €</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-6">Lade Suchergebnisse...</div>}>
      <SearchContent />
    </Suspense>
  );
}
