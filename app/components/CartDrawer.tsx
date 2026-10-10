"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { addProductToShopwareCart, fetchShopwareCart, removeProductFromShopwareCart, type ShopwareCartLineItem } from "@/lib/shopwareCart";

const money = (value: number) => value.toLocaleString("de-DE", { style: "currency", currency: "EUR" });

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ShopwareCartLineItem[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");

  async function refresh() {
    try {
      const cart = await fetchShopwareCart();
      setItems(cart.items);
      setTotal(cart.totalPrice);
      setError("");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Shopware-Warenkorb konnte nicht geladen werden.");
    }
  }

  useEffect(() => {
    const openCart = () => { void refresh(); setOpen(true); };
    const update = () => { if (open) void refresh(); };
    window.addEventListener("open-cart", openCart);
    window.addEventListener("cart-updated", update);
    return () => { window.removeEventListener("open-cart", openCart); window.removeEventListener("cart-updated", update); };
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  async function changeQuantity(item: ShopwareCartLineItem, quantity: number) {
    setError("");
    try {
      await removeProductFromShopwareCart(item.id);
      if (quantity > 0) await addProductToShopwareCart(item.referencedId, quantity);
      await refresh();
      window.dispatchEvent(new Event("cart-updated"));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Der Warenkorb konnte nicht aktualisiert werden.");
    }
  }

  return <>
    <div onClick={() => setOpen(false)} className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden="true" />
    <aside aria-label="Warenkorb" aria-hidden={!open} className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[390px] flex-col bg-white shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
      <div className="flex items-center justify-between border-b border-[#eeeae5] px-6 py-5"><h2 className="font-display text-xl font-medium">Dein Warenkorb <span className="font-sans text-sm text-[#888888]">({count})</span></h2><button type="button" onClick={() => setOpen(false)} className="text-[#888888] transition hover:text-[#0d0d0d]" aria-label="Warenkorb schließen"><span className="text-2xl leading-none">×</span></button></div>
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {error && <p role="alert" className="mb-5 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
        {items.length === 0 ? <div className="flex h-full flex-col items-center justify-center text-center"><div className="mb-4 text-4xl text-[#d8d3cc]">◌</div><p className="text-sm text-[#888888]">Dein Warenkorb ist noch leer.</p><Link href="/shoppen" onClick={() => setOpen(false)} className="mt-5 text-sm font-medium text-[#a8895e] hover:text-[#0d0d0d]">Produkte entdecken →</Link></div> : <div className="space-y-6">{items.map((item) => <div key={item.id} className="flex gap-4"><div className="h-24 w-20 shrink-0 overflow-hidden bg-[#ede9e4]">{item.image ? <Image src={item.image} alt="" width={80} height={96} unoptimized className="h-full w-full object-cover" /> : <div className="h-full w-full bg-gradient-to-br from-[#ede9e4] to-[#c8a97e]" />}</div><div className="min-w-0 flex-1"><p className="font-display text-sm font-medium leading-snug">{item.label}</p><div className="mt-3 flex items-center gap-2"><button type="button" onClick={() => void changeQuantity(item, item.quantity - 1)} className="flex h-6 w-6 items-center justify-center border border-gray-200 text-sm text-[#888888] hover:border-[#0d0d0d]">−</button><span className="w-5 text-center text-sm">{item.quantity}</span><button type="button" onClick={() => void changeQuantity(item, item.quantity + 1)} className="flex h-6 w-6 items-center justify-center border border-gray-200 text-sm text-[#888888] hover:border-[#0d0d0d]">+</button></div></div><div className="flex flex-col items-end justify-between"><button type="button" onClick={() => void changeQuantity(item, 0)} className="text-lg leading-none text-[#c9c4be] hover:text-red-500" aria-label={`${item.label} entfernen`}>×</button><span className="text-sm font-semibold">{money(item.priceTotal)}</span></div></div>)}</div>}
      </div>
      {items.length > 0 && <div className="border-t border-[#eeeae5] px-6 py-5"><div className="mb-2 flex items-center justify-between"><span className="text-sm text-[#888888]">Zwischensumme</span><span className="font-semibold">{money(total)}</span></div><p className="mb-4 text-xs text-[#888888]">Versand und Steuern werden im Shopware-Checkout berechnet.</p><Link href="/Checkout" onClick={() => setOpen(false)} className="block w-full bg-[#0d0d0d] py-3.5 text-center text-sm font-medium uppercase tracking-wider text-white transition hover:bg-[#3a3a3a]">Zum Shopware-Checkout</Link><button type="button" onClick={() => setOpen(false)} className="w-full py-2 text-center text-sm text-[#888888] hover:text-[#0d0d0d]">Weiter einkaufen</button></div>}
    </aside>
  </>;
}
