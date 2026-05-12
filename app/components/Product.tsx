'use client'

import Image from 'next/image'
import { useState } from 'react';
import { SHOPWARE_CART_URL } from '@/lib/shopwareStorefront';
import { addProductToShopwareCart, resolveShopwareProductId } from '@/lib/shopwareCart';

type ProductItem = {
  id: number | string;
  shopwareProductId?: string;
  name?: string;
  title?: string;
  price?: number;
  image?: string;
  
};

export const Product = ({ product }: { product: ProductItem }) => {
  const [isAdding, setIsAdding] = useState(false);

  const productName = product.name ?? product.title ?? "Produkt";
  const productImage = product.image
    ? product.image.startsWith("/")
      ? product.image
      : `/${product.image}`
    : "/next.svg";
  const productId = resolveShopwareProductId(product.id, product.shopwareProductId);

  const handleAddToCart = async () => {
    if (!productId) {
      alert(
        "Dieses Produkt hat noch keine Shopware-Produkt-ID (32-stellige Hex-ID). " +
        "Lege in den Produktdaten `shopwareProductId` an."
      );
      return;
    }

    setIsAdding(true);
    try {
      await addProductToShopwareCart(productId, 1);
      window.location.href = SHOPWARE_CART_URL;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Produkt konnte nicht in den Warenkorb gelegt werden.";
      alert(message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <article className="glass-panel reveal-rise group overflow-hidden rounded-3xl">
      <div className="relative overflow-hidden bg-[color:var(--surface-strong)]">
        <Image
          src={productImage}
          alt={productName}
          width={560}
          height={360}
          className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--brand-deep)]">
          Bestseller
        </span>
      </div>

      <div className='space-y-4 p-5'>
        <h3 className='brand-title text-xl font-semibold text-[color:var(--ink)]'>
          {productName}
        </h3>
        <p className='text-sm text-[color:var(--muted)]'>
          Direkt einsetzbares Digital-Produkt für moderne Webprojekte.
        </p>
        <p className='text-2xl font-extrabold text-[color:var(--brand-deep)]'>
          {typeof product.price === "number" ? `${product.price.toFixed(2)} €` : "Preis auf Anfrage"}
        </p>

        <button
          type="button"
          className='w-full rounded-xl bg-[color:var(--brand)] px-4 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-[color:var(--brand-deep)] disabled:opacity-60'
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
