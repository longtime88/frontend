"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { addProductToShopwareCart } from "@/lib/shopwareCart";
import { SHOPWARE_CART_URL } from "@/lib/shopwareStorefront";

type SearchProduct = {
  id: string;
  name: string;
  price?: Array<{
  productid: string;

  }>;
};

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [addingProductId, setAddingProductId] = useState("");

  useEffect(() => {
    if (!query) return;

    async function load() {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.elements || []);
      
    }

    load();
  }, [query]);

  const handleAddToCart = async (productId: string) => {
    setAddingProductId(productId);
    try {
      await addProductToShopwareCart(productId, 1);
      window.location.href = SHOPWARE_CART_URL;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Produkt konnte nicht in den Warenkorb gelegt werden.";
      alert(message);
    } finally {
      setAddingProductId("");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Suchergebnisse für: {query}</h2>

      {results.length === 0 && <p>Keine Produkte gefunden.</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {results.map((product) => (
          <div key={product.id} className="p-4 border rounded-lg bg-white text-black">
            <h3 className="font-semibold">{product.name}</h3>
            {product.price && (
              <p className="text-gray-700">{product.price[0]?.productid} €</p>
            )}
            <button
              type="button"
              className="mt-3 inline-flex items-center rounded bg-black px-4 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-60"
              onClick={() => handleAddToCart(product.id)}
              disabled={addingProductId === product.id}
            >
              {addingProductId === product.id ? "Wird hinzugefügt..." : "In den Warenkorb"}
            </button>
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
