"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { SHOPWARE_CART_URL } from "@/lib/shopwareStorefront";

type Item = {
  id: string;
  label: string;
  quantity: number;
  priceTotal: number;
  cover?: string | { media?: { url?: string; translated?: { alt?: string } } };
};

const fmtPrice = (cents: number) =>
  (cents / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" });

export default function Warenkorb() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const ctx = typeof window !== "undefined" ? localStorage.getItem("sw-context-token") || "" : "";
      const r = await fetch(`/api/cart/details?contextToken=${encodeURIComponent(ctx)}`);
      const data = await r.json();
      if (!r.ok || !data.ok) { setError(data?.error || "Fehler beim Laden"); setLoading(false); return; }
      if (data.contextToken && typeof window !== "undefined") {
        localStorage.setItem("sw-context-token", data.contextToken);
        document.cookie = `sw-context-token=${encodeURIComponent(data.contextToken)}; path=/; max-age=2592000; samesite=lax`;
      }

      // Parse directly from Shopware cart — Safer than localStorage merge
      // (Data.json product overrides are set in addCustomCartItem and already overlaid).
      const swLineItems = (data.cart as Record<string, unknown>)?.lineItems ?? {};
      const parsed: Item[] = Object.values(swLineItems as Record<string, Record<string, unknown>>).map((li) => ({
        id: String(li.id ?? ""),
        label: String(li.label ?? ""),
        quantity: Number(li.quantity) || 1,
        priceTotal: Number((li.priceTotal as number) ?? (li.price as Record<string, unknown>)?.totalPrice ?? 0),
        cover: li.cover as Item["cover"],
      }));

      // Dedup items that share the same id
      const seen = new Set<string>();
      const deduped: Item[] = [];
      for (const it of parsed) {
        if (!seen.has(it.id)) { seen.add(it.id); deduped.push(it); }
      }
      setItems(deduped);
    } catch { setError("Server nicht erreichbar."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadCart(); }, [loadCart]);

  const removeItem = async (itemId: string) => {
    setRemoving(itemId);
    try {
      const ctx = typeof window !== "undefined" ? localStorage.getItem("sw-context-token") || "" : "";
      const r = await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, contextToken: ctx }),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && data.contextToken && typeof window !== "undefined") {
        localStorage.setItem("sw-context-token", data.contextToken);
      }
      loadCart();
    } catch { setError("Artikel konnte nicht entfernt werden."); }
    finally { setRemoving(null); }
  };

  const subtotal = items.reduce((s, i) => s + i.priceTotal, 0);
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--bg)]">
        <div className="text-center"><div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[color:var(--brand)]" /><p>Warenkorb wird geladen…</p></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">{error}</div>
        <button onClick={loadCart} className="mt-4 w-full rounded-full bg-[color:var(--brand)] py-3 font-bold text-white">Erneut versuchen</button>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="mb-6 text-6xl">🛒</div>
        <h1 className="text-2xl font-bold [font-family:var(--font-fraunces)]">Dein Warenkorb ist leer</h1>
        <p className="mt-2 text-[color:var(--muted)]">Füge Produkte hinzu, um den Checkout zu starten.</p>
        <Link href="/#produkte" className="mt-6 inline-block rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[#e18244] px-8 py-3 font-bold text-white hover:-translate-y-0.5 transition">Zum Shop</Link>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 md:py-14">
      <h1 className="mb-8 text-3xl font-bold [font-family:var(--font-fraunces)]">Warenkorb ({totalQty})</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => {
            let img = "/next.svg";
            if (typeof item.cover === "string") {
              img = item.cover.startsWith("/") ? item.cover : `/${item.cover}`;
            } else if (item.cover && typeof item.cover === "object") {
              const url = (item.cover as { media?: { url?: string } }).media?.url;
              if (url) img = url.startsWith("/") ? url : `/${url}`;
            }
            return (
              <article key={item.id} className="flex gap-4 rounded-2xl border border-[color:var(--line)] bg-white p-4 shadow-sm">
                <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-[#f7f2ee]">
                  <Image src={img}
                    alt={typeof item.cover === "object" && item.cover?.media?.translated?.alt || item.label}
                    fill className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-between py-1">
                  <h3 className="line-clamp-2 font-semibold">{item.label}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-[color:var(--muted)]">{fmtPrice(item.priceTotal)} × {item.quantity}</span>
                    <button onClick={() => removeItem(item.id)} disabled={removing === item.id} className="rounded-full px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50">{removing === item.id ? "…" : "Entfernen"}</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-[color:var(--line)] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">Zusammenfassung</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-[color:var(--muted)]"><span>Zwischensumme ({totalQty} Artikel)</span><span>{fmtPrice(subtotal)}</span></div>
            </div>
            <div className="mt-4 flex justify-between border-t border-[color:var(--line)] pt-4 text-xl font-extrabold">
              <span>Gesamt</span><span className="text-[color:var(--brand)]">{fmtPrice(subtotal)}</span>
            </div>
            <Link href="/Checkout" className="mt-4 block w-full rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[#e18244] py-3 text-center font-bold text-white hover:-translate-y-0.5 transition">Zum Checkout</Link>
          </div>
            <Link href={`${SHOPWARE_CART_URL}${typeof window !== "undefined" && localStorage.getItem("sw-context-token") ? "?t=" + localStorage.getItem("sw-context-token") : ""}`} className="block text-center text-sm font-semibold text-[color:var(--muted)] hover:text-[color:var(--brand)]">Direkt im Shopware-Warenkorb anzeigen</Link>
            <p className="mt-1 text-center text-xs text-[color:var(--muted)]">Öffnet die Shopware-Storefront mit deinem Warenkorb-Inhalt.</p>
        </aside>
      </div>
    </section>
  );
}
