"use client";

import Image from "next/image";
import { useState } from "react";
import { addProductToShopwareCart, resolveShopwareProductId } from "@/lib/shopwareCart";
import { SHOPWARE_CART_URL } from "@/lib/shopwareStorefront";

type ProductItem = { id: string; shopwareProductId?: string; name: string; price: number; image: string; description?: string; category?: string; badge?: string };

export default function Product({ product }: { product: ProductItem }) {
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");
  const image = product.image || "/design/product-focus.svg";
  const shopwareProductId = resolveShopwareProductId(product.id, product.shopwareProductId);

  async function addToCart() {
    if (isAdding) return;
    setIsAdding(true);
    setError("");
    if (!shopwareProductId) {
      setError("Dieses Produkt ist nicht mit Shopware verknüpft.");
      setIsAdding(false);
      return;
    }
    try {
      await addProductToShopwareCart(shopwareProductId);
      window.dispatchEvent(new Event("cart-updated"));
      window.location.assign(SHOPWARE_CART_URL);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Produkt konnte nicht hinzugefügt werden.");
    } finally { setIsAdding(false); }
  }

  return <article className="group">
    <div className="relative mb-3 aspect-[4/5] overflow-hidden bg-[#ede9e4]">
      {product.image ? <Image src={image} alt={product.name} fill unoptimized className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" /> : <div className="h-full w-full bg-[radial-gradient(circle_at_35%_25%,#fff_0%,#ede9e4_35%,#c8a97e_100%)]" />}
      {product.badge && <span className="absolute left-3 top-3 bg-[#0d0d0d] px-2.5 py-1 text-xs font-medium uppercase tracking-widest text-white">{product.badge}</span>}
      <button type="button" onClick={addToCart} disabled={isAdding || !shopwareProductId} className="absolute bottom-0 left-0 right-0 bg-[#0d0d0d] py-3 text-sm font-medium uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#3a3a3a] disabled:opacity-60 sm:translate-y-full sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">{isAdding ? "Wird hinzugefügt…" : shopwareProductId ? "In den Warenkorb" : "Shopware-Produkt fehlt"}</button>
    </div>
    <p className="mb-1 text-xs uppercase tracking-widest text-[#888888]">{product.category || "Digitale Lösung"}</p>
    <h3 className="font-display text-base font-medium leading-snug text-[#0d0d0d]">{product.name}</h3>
    {product.description && <p className="mt-1 line-clamp-2 text-sm text-[#888888]">{product.description}</p>}
    <p className="mt-2 text-sm font-semibold text-[#0d0d0d]">{product.price.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €</p>
    {error && <p role="alert" className="mt-2 text-xs text-red-600">{error}</p>}
  </article>;
}
