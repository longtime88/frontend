'use client'

import Image from 'next/image'
import { useState } from 'react';
import { addProductToShopwareCart, resolveShopwareProductId } from '@/lib/shopwareCart';

type ProductItem = {
  id: number | string;
  shopwareProductId?: string;
  name?: string;
  title?: string;
  price?: number;
  image?: string;
  
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
      alert(`${productName} wurde zum Warenkorb hinzugefügt!`);
    } catch (error) {
      console.error("Fehler beim Hinzufügen zum Warenkorb:", error);
      alert("Fehler beim Hinzufügen zum Warenkorb. Bitte versuche es erneut.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <article className="group overflow-hidden rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--brand)] hover:shadow-[0_20px_44px_rgba(86,45,19,0.16)]">
      <div className="relative overflow-hidden bg-[color:var(--surface-strong)]">
        <Image
          src={productImage}
          alt={productName}
          width={560}
          height={360}
          className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--brand-deep)]">
          Bestseller
        </span>
      </div>

      <div className="space-y-4 p-5">
        <h3 className="text-xl font-semibold tracking-[0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)]">
          {productName}
        </h3>
        <p className="text-sm text-[color:var(--muted)]">
          Direkt einsetzbares Digital-Produkt für moderne Webprojekte.
        </p>
        <p className="text-2xl font-extrabold text-[color:var(--brand-deep)]">
          {typeof product.price === "number" ? `${product.price.toFixed(2)} €` : "Preis auf Anfrage"}
        </p>

        <button
          type="button"
          className="w-full rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[#e18244] px-4 py-3 text-sm font-bold tracking-wide text-white transition hover:from-[color:var(--brand-deep)] hover:to-[#c05d2b] disabled:opacity-60"
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
