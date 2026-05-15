'use client'

import Image from 'next/image'
import { useState } from 'react';
import { addProductToShopwareCart, resolveShopwareProductId } from '@/lib/shopwareCart';
import { SHOPWARE_CART_URL } from "@/lib/shopwareStorefront";

type ProductItem = {
  id: number | string;
  shopwareProductId?: string;
  name?: string;
  title?: string;
  price?: number;
  image?: string;
  description?: string;
};

type ProductProps = {
  product: ProductItem;
};

export const Product: React.FC<ProductProps> = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false);
  const productName = product.name || product.title || "Unbenanntes Produkt";
  const productImage = product.image
    ? product.image.startsWith("/")
      ? product.image
      : `/${product.image}`
    : "/next.svg";

  const handleAddToCart = async () => {
    if (isAdding) return;

    const shopwareProductId = resolveShopwareProductId(product.id, product.shopwareProductId);
    if (!shopwareProductId) {
      alert(
        "Dieses Produkt hat keine gueltige Shopware-Produkt-ID. " +
          "Bitte in den Produktdaten `shopwareProductId` (32-stellige Hex-ID) hinterlegen."
      );
      return;
    }

    setIsAdding(true);
    try {
      await addProductToShopwareCart(shopwareProductId, 1);
      window.location.href = SHOPWARE_CART_URL;
    } catch (error) {
      console.error("Fehler beim Hinzufügen zum Warenkorb:", error);
      alert("Fehler beim Hinzufügen zum Warenkorb. Bitte versuche es erneut.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#e2dbd1] bg-white shadow-[0_12px_32px_rgba(45,29,15,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c95a2b] hover:shadow-[0_20px_52px_rgba(45,29,15,0.12)]">
      <div className="relative aspect-[16/9] overflow-hidden bg-[#fff8f0]">
        <Image
          src={productImage}
          alt={productName}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {product.price && (
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#a0421a] shadow-sm">
            Bestseller
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="line-clamp-2 min-h-[3.5rem] text-xl font-semibold tracking-[0.02em] text-[#1a1a1a] [font-family:var(--font-fraunces)]">
          {productName}
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-[#7a7368]">
          {product.description || "Direkt einsetzbares Digital-Produkt für moderne Webprojekte."}
        </p>
        <div className="mt-auto border-t border-[#f0e7dd] pt-4">
          <p className="text-2xl font-extrabold text-[#a0421a]">
            {typeof product.price === "number" ? `${product.price.toFixed(2)} €` : "Preis auf Anfrage"}
          </p>
        </div>

        <button
          type="button"
          className="mt-2 w-full rounded-full bg-gradient-to-r from-[#c95a2b] to-[#e8723c] px-4 py-3 text-sm font-bold tracking-wide text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:from-[#a0421a] hover:to-[#c95a2b] disabled:cursor-not-allowed disabled:opacity-60"
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? "Wird hinzugefügt..." : "In den Warenkorb"}
        </button>
      </div>
    </article>
  );
};

export default Product
