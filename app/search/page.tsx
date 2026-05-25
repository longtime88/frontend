"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { addProductToShopwareCart, addCustomCartItem, resolveShopwareProductId } from "@/lib/shopwareCart";
import { useRouter } from "next/navigation";

type SearchProduct = {
  id: string;
  name: string;
  price?: number;        // unitPrice in EUR (Shopware store-api)
  calculatedPrice?: {
    totalPrice?: number;
    unitPrice?: number;
  };
};

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
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

  const handleAddToCart = async (product: SearchProduct) => {
    setAddingProductId(product.id);
    try {
      const shopwareId = resolveShopwareProductId(product.id);
      const customId = shopwareId || `custom:${product.id}`;

      // Preis ermitteln (preferiert unitPrice als EUR, fallback 0)
      const price =
        typeof product.calculatedPrice?.unitPrice === "number"
          ? product.calculatedPrice.unitPrice / 100
          : typeof product.price === "number"
            ? product.price
            : 0;

      // Im Custom-Cart (Name + Preis) und im Shopware-Cart speichern
      addCustomCartItem({
        id: product.id,
        shopwareId: customId,
        name: product.name,
        price,
        image: "/next.svg",
        quantity: 1,
      });
      if (shopwareId) {
        await addProductToShopwareCart(shopwareId, 1);
      }
      router.push(`/Checkout?product=${encodeURIComponent(product.id)}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Produkt konnte nicht in den Warenkorb gelegt werden.";
      alert(message);
    } finally {
      setAddingProductId("");
    }
  };

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12">
      <div className="pointer-events-none absolute -right-10 top-4 h-52 w-52 rounded-full bg-[#ffd8b3]/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-4 h-52 w-52 rounded-full bg-[#d9efff]/35 blur-3xl" />

      <div className="relative rounded-3xl border border-[color:var(--line)] bg-white p-6 shadow-[0_16px_40px_rgba(45,29,15,0.08)] md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--accent)]">Suche</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)] md:text-4xl">
          Ergebnisse fuer: <span className="text-[color:var(--brand)]">{query || "..."}</span>
        </h1>
        <p className="mt-3 text-sm text-[color:var(--muted)]">
          Finde passende Produkte, Templates oder Services und lege sie direkt in den Warenkorb.
        </p>
      </div>

      {loading && (
        <div className="mt-8 rounded-2xl border border-[#eadfce] bg-[#fffaf3] p-5 text-sm font-semibold text-[color:var(--muted)]">
          Suche laeuft...
        </div>
      )}

      {!loading && results.length === 0 && (
        <div className="mt-8 rounded-2xl border border-[color:var(--line)] bg-white p-6 text-[color:var(--muted)] shadow-[0_12px_32px_rgba(45,29,15,0.06)]">
          Keine Produkte gefunden.
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {results.map((product) => (
          <article
            key={product.id}
            className="rounded-2xl border border-[color:var(--line)] bg-white p-5 shadow-[0_12px_32px_rgba(45,29,15,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--brand)]"
          >
            <h3 className="text-xl font-semibold tracking-[0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)]">
              {product.name}
            </h3>
<p className="mt-2 text-sm text-[color:var(--muted)]">
                   {typeof product.calculatedPrice?.unitPrice === "number"
                     ? `${(product.calculatedPrice.unitPrice / 100).toFixed(2)} €`
                     : "Preis auf Anfrage"}
                 </p>
            <button
              type="button"
              className="mt-5 inline-flex items-center rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[#e18244] px-4 py-2 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:from-[color:var(--brand-deep)] hover:to-[#c05d2b] disabled:opacity-60"
              onClick={() => handleAddToCart(product)}
              disabled={addingProductId === product.id}
            >
              {addingProductId === product.id ? "Wird hinzugefuegt..." : "In den Warenkorb"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl p-6 text-sm">Lade Suchergebnisse...</div>}>
      <SearchContent />
    </Suspense>
  );
}
