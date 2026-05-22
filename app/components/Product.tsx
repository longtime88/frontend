'use client'

import Image from 'next/image'
import { useState } from 'react';
import { addProductToShopwareCart, resolveShopwareProductId, addCustomCartItem } from '@/lib/shopwareCart';
import { useRouter } from "next/navigation";


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
  const router = useRouter();
  const productName = product.name || product.title || "Unbenanntes Produkt";
  const productImage = product.image
    ? typeof product.image === "string" && product.image.startsWith("http")
      ? product.image.trim()
      : `/${(product.image as string).trim().replace(/^\/+/, "")}`
    : "/next.svg";

  const handleAddToCart = async () => {
    if (isAdding) return;

    const shopwareProductId = resolveShopwareProductId(product.id, product.shopwareProductId);
    const customShopwareId = shopwareProductId || `custom:${String(product.id)}`;

    setIsAdding(true);
    try {
      addCustomCartItem({
        id: String(product.id),
        shopwareId: customShopwareId,
        name: productName,
        price: product.price ?? 0,
        image: productImage,
        quantity: 1,
      });
      if (shopwareProductId) {
        await addProductToShopwareCart(shopwareProductId, 1);
      }
      // Zum eigenen Checkout weiterleiten
      router.push("/Checkout");
    } catch (error) {
      console.error("Fehler beim Hinzufuegen zum Warenkorb:", error);
      alert("Fehler beim Hinzufuegen zum Warenkorb. Bitte versuche es erneut.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <article className="glass-card group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
      <div className="relative aspect-[16/9] overflow-hidden bg-[rgba(15,30,70,0.45)]">
        <Image
          src={productImage}
          alt={productName}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {product.price && (
          <span className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-[rgba(30,60,160,0.8)] to-[rgba(45,110,240,0.7)] backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#7bb8ff] shadow-[0_0_20px_rgba(79,158,255,0.15)]">
            Bestseller
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="line-clamp-2 min-h-[3.5rem] text-xl font-semibold tracking-[0.02em] bg-gradient-to-r from-[#c8d8f8] to-[#8892b0] bg-clip-text text-transparent [font-family:var(--font-fraunces)]">
          {productName}
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-[#7a8aaa]">
          {product.description || "Direkt einsetzbares Digital-Produkt für moderne Webprojekte."}
        </p>
        <div className="mt-auto border-t border-[rgba(100,140,255,0.12)] pt-4">
          <p className="text-2xl font-extrabold text-[#7bb8ff]">
            {typeof product.price === "number" ? `${product.price.toFixed(2)} €` : "Preis auf Anfrage"}
          </p>
        </div>

        <button
          type="button"
          className="mt-2 w-full rounded-full bg-gradient-to-r from-[#2d6fd8] to-[#4f9eff] px-4 py-3 text-sm font-bold tracking-wide text-white shadow-[0_0_20px_rgba(45,110,240,0.2)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? "Wird hinzugefügt…" : "Bestellen"}
        </button>
      </div>
    </article>
  );
};

export default Product
