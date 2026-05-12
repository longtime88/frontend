"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { addProductToShopwareCart } from "@/lib/shopwareCart";
import { SHOPWARE_CART_URL } from "@/lib/shopwareStorefront";

type SearchProduct = {
  id: string;
  name: string;
  calculatedPrice?: {
    totalPrice?: number;
    unitPrice?: number;
  };
};

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [addingProductId, setAddingProductId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.elements || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
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
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="glass-panel reveal-rise rounded-3xl p-6 md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--accent)]">Suche</p>
        <h1 className="brand-title mt-2 text-3xl font-bold text-[color:var(--ink)] md:text-4xl">
          Ergebnisse für: <span className="text-[color:var(--brand)]">{query || "..."}</span>
        </h1>
        <p className="mt-3 text-sm text-[color:var(--muted)]">
          Finde passende Produkte, Templates oder Services und lege sie direkt in den Warenkorb.
        </p>
      </div>

      {loading && (
        <p className="mt-8 text-sm font-semibold text-[color:var(--muted)]">Suche läuft...</p>
      )}

      {!loading && results.length === 0 && (
        <div className="glass-panel mt-8 rounded-2xl p-6 text-[color:var(--muted)]">
          Keine Produkte gefunden.
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {results.map((product) => (
          <article key={product.id} className="glass-panel reveal-rise rounded-2xl p-5">
            <h3 className="brand-title text-xl font-semibold text-[color:var(--ink)]">{product.name}</h3>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              {typeof product.calculatedPrice?.unitPrice === "number"
                ? `${product.calculatedPrice.unitPrice.toFixed(2)} €`
                : "Preis auf Anfrage"}
            </p>
            <button
              type="button"
              className="mt-5 inline-flex items-center rounded-xl bg-[color:var(--brand)] px-4 py-2 text-sm font-bold text-white hover:bg-[color:var(--brand-deep)] disabled:opacity-60"
              onClick={() => handleAddToCart(product.id)}
              disabled={addingProductId === product.id}
            >
              {addingProductId === product.id ? "Wird hinzugefügt..." : "In den Warenkorb"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-6">Lade Suchergebnisse...</div>}>
      <SearchContent />
    </Suspense>
  );
}
