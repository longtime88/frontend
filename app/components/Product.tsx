"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { addCustomCartItem, addProductToShopwareCart, resolveShopwareProductId } from "@/lib/shopwareCart";

type ProductItem = { id: string; shopwareProductId?: string; name: string; price: number; image: string; description?: string };

export default function Product({ product }: { product: ProductItem }) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const image = product.image || "/design/product-focus.svg";
  async function addToCart() {
    if (isAdding) return;
    setIsAdding(true);
    const shopwareProductId = resolveShopwareProductId(product.id, product.shopwareProductId);
    try {
      addCustomCartItem({ id: product.id, shopwareId: shopwareProductId || `custom:${product.id}`, name: product.name, price: product.price, image, quantity: 1 });
      if (shopwareProductId) await addProductToShopwareCart(shopwareProductId);
      router.push("/Checkout");
    } finally { setIsAdding(false); }
  }
  return <article className="group overflow-hidden rounded-[18px] bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"><div className="relative aspect-[1.3] overflow-hidden rounded-[14px] bg-[#fafbfd]">{product.image ? <Image src={image} alt={product.name} fill unoptimized className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw" /> : <Image src="/design/story-orbit.svg" alt="" width={56} height={56} className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2" />}</div><h3 className="mt-5 line-clamp-2 min-h-[3rem] text-[17px] font-semibold leading-snug text-[#0f172a]">{product.name}</h3><p className="mt-2 text-sm text-[#667287]">{product.price.toFixed(2).replace(".", ",")} €</p><button type="button" onClick={addToCart} disabled={isAdding} className="mt-5 text-sm font-semibold text-[#0e66e0] transition hover:text-[#0f172a] disabled:opacity-60">{isAdding ? "Wird hinzugefügt…" : "In den Warenkorb"}</button></article>;
}
