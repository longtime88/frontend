"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SHOPWARE_CART_URL } from "@/lib/shopwareStorefront";
import { getCustomCartItems, getShopwareContextToken, mergeCartWithCustom } from "@/lib/shopwareCart";

type Address = { firstName: string; lastName: string; street: string; streetAdditional?: string; city: string; zipcode: string; countryId?: string; company?: string; salutationId?: string | null };
type ShippingMethod = { id: string; name: string; description?: string; media?: { url?: string }; deliveryTime?: string };
type PaymentMethod = { id: string; name: string; description?: string; media?: { url?: string }; formUrl?: string };

const DEFAULT_COUNTRY = "f3e1b85c74df4e8fae2f3ef2da38e44f";

const initialAddress: Address = { firstName: "", lastName: "", street: "", streetAdditional: "", city: "", zipcode: "", countryId: DEFAULT_COUNTRY };

const fmtPrice = (cents: number) =>
  (cents / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" });

const addrFields: [string, keyof Address][] = [
  ["Vorname", "firstName"],
  ["Nachname", "lastName"],
  ["Straße + Hausnummer", "street"],
  ["Straße (Zusatz)", "streetAdditional"],
  ["PLZ", "zipcode"],
  ["Ort", "city"],
  ["Firma", "company"],
];

const shortFields: [string, keyof Address][] = [
  ["Vorname", "firstName"],
  ["Nachname", "lastName"],
  ["Straße", "street"],
  ["PLZ", "zipcode"],
  ["Ort", "city"],
];

export default function Checkout() {
  const router = useRouter();
  const [step, setStep] = useState<"address" | "shipping" | "payment" | "review" | "success">("address");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [cartItems, setCartItems] = useState<Array<{ id: string; label: string; quantity: number; priceTotal: number; cover?: string | { media?: { url?: string; translated?: { alt?: string } } } }>>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [shippingCostsRaw, setShippingCostsRaw] = useState(0);
  const [contextToken, setContextToken] = useState("");

  const [shippingAddress, setShippingAddress] = useState<Address>(initialAddress);
  const [billingAddress, setBillingAddress] = useState<Address>(initialAddress);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShipping, setSelectedShipping] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPayment, setSelectedPayment] = useState("");

  // --- Warenkorb laden ---
  const loadCart = useCallback(async () => {
    const token = getShopwareContextToken();
    setContextToken(token);
    try {
      const r = await fetch(`/api/checkout?contextToken=${encodeURIComponent(token)}`);
      const data = await r.json();
      if (!r.ok || !data.ok) { setError(data?.error || "Warenkorb-Fehler"); setLoading(false); return; }
      if (data.contextToken) {
        setContextToken(data.contextToken);
        localStorage.setItem("sw-context-token", data.contextToken);
        document.cookie = `sw-context-token=${encodeURIComponent(data.contextToken)}; path=/; max-age=2592000; samesite=lax`;
      }
      const lineItems = data.cart?.lineItems || {};
      const customItems = getCustomCartItems();
      const merged = mergeCartWithCustom(lineItems, customItems);
      const items = (merged as Array<Record<string, unknown>>).map((li) => ({
        id: String(li.id ?? ""),
        label: String(li.label ?? ""),
        quantity: Number(li.quantity) || 1,
        priceTotal: Number((li.priceTotal as number) ?? (li.price as Record<string, unknown>)?.totalPrice ?? 0),
        cover: li.cover as string | { media?: { url?: string; translated?: { alt?: string } } } | undefined,
      }));

      // Dedup items that share the same id
      const seen = new Set<string>();
      const deduped: typeof cartItems = [];
      for (const it of items) {
        if (!seen.has(it.id)) { seen.add(it.id); deduped.push(it); }
      }
      setCartItems(deduped);
      setCartTotal(Number(data.cart?.price?.totalPrice ?? 0));
      setShippingCostsRaw(Number(data.shippingCosts?.totalPrice ?? data.cart?.price?.shippingCosts?.totalPrice ?? 0));
      setLoading(false);

      // Zahlungs- und Versandarten parallel laden
      await Promise.all([loadMethods(token), loadCartItems(token)]);
    } catch { setError("Server nicht erreichbar."); setLoading(false); }
  }, []);

  const loadMethods = async (token: string) => {
    const r = await fetch(`/api/checkout/methods?contextToken=${encodeURIComponent(token || "")}`);
    const data = await r.json();
    if (r.ok && data.ok) {
      setPaymentMethods(data.paymentMethods || []);
      setShippingMethods(data.shippingMethods || []);
      if (data.shippingMethods?.length > 0) setSelectedShipping(data.shippingMethods[0].id);
      if (data.paymentMethods?.length > 0) setSelectedPayment(data.paymentMethods[0].id);
    }
  };

  // WICHTIG: Versandmethode aus Warenkorb lesen und setzen
  const loadCartItems = async (token: string) => {
    try {
      const r = await fetch(`${SHOPWARE_CART_URL}?t=${token}`);
      const html = await r.text();
      const match = html.match(/name="shippingMethodId"\s+value="([^"]+)"/);
      if (match?.[1]) setSelectedShipping(match[1]);
    } catch { /* ignorieren */ }
  };

  const loadPreviousAddresses = async () => {
    // Prüfe, ob der Nutzer bereits eine Lieferadresse hat (für Vorausfüllung)
    try {
      const token = getShopwareContextToken();
      const r = await fetch(`${SHOPWARE_CART_URL}?t=${token}`);
      const html = await r.text();
      // Extrahiere vorausgefüllte Werte aus dem Shopware-Formular
      const addrMatch = html.match(/id="addressStreet"\s+value="([^"]*)"/);
      const cityMatch = html.match(/id="addressCity"\s+value="([^"]*)"/);
      const zipMatch = html.match(/id="addressZipcode"\s+value="([^"]*)"/);
      const firstMatch = html.match(/id="addressFirstName"\s+value="([^"]*)"/);
      const lastMatch = html.match(/id="addressLastName"\s+value="([^"]*)"/);

      if (firstMatch?.[1]) setShippingAddress(a => ({ ...a, firstName: firstMatch[1] }));
      if (lastMatch?.[1]) setShippingAddress(a => ({ ...a, lastName: lastMatch[1] }));
      if (addrMatch?.[1]) setShippingAddress(a => ({ ...a, street: addrMatch[1] }));
      if (cityMatch?.[1]) setShippingAddress(a => ({ ...a, city: cityMatch[1] }));
      if (zipMatch?.[1]) setShippingAddress(a => ({ ...a, zipcode: zipMatch[1] }));
    } catch { /* ignorieren */ }
  };

  useEffect(() => {
    loadCart();
    loadPreviousAddresses();
  }, [loadCart]);

  // --- Bestellung abschicken ---
  const placeOrder = async () => {
    setSubmitting(true);
    setError("");
    try {
      const bill = sameAsShipping ? shippingAddress : billingAddress;
      const lineItems = cartItems.map(i => ({ type: "product", referencedId: i.id, quantity: i.quantity }));

      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lineItems,
          contextToken,
          shippingAddress: { ...shippingAddress, countryId: DEFAULT_COUNTRY },
          billingAddress: { ...bill, countryId: DEFAULT_COUNTRY },
          shippingMethod: selectedShipping,
          paymentMethod: selectedPayment,
        }),
      });
      const data = await r.json();
      if (!r.ok) { setError(data?.error || "Bestellung fehlgeschlagen."); setSubmitting(false); return; }

      if (data.contextToken) {
        localStorage.setItem("sw-context-token", data.contextToken);
        document.cookie = `sw-context-token=${encodeURIComponent(data.contextToken)}; path=/; max-age=2592000; samesite=lax`;
      }
      setStep("success");
    } catch { setError("Shopware nicht erreichbar."); }
    finally { setSubmitting(false); }
  };

  // --- UI ---
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--bg)]">
        <div className="text-center"><div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[color:var(--brand)]" /><p>Checkout wird geladen…</p></div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <section className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mb-4 text-6xl">✅</div>
        <h1 className="text-3xl font-bold [font-family:var(--font-fraunces)]">Vielen Dank für deine Bestellung!</h1>
        <p className="mt-4 text-[color:var(--muted)]">
          Wir haben deine Bestellung erhalten. Du bekommst eine Bestätigung per E-Mail.
        </p>
        <button onClick={() => router.push("/")}
          className="mt-8 rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[#e18244] px-8 py-3 font-bold text-white hover:-translate-y-0.5 transition">
          Zurück zur Startseite
        </button>
      </section>
    );
  }

  const total = cartTotal + shippingCostsRaw;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 md:py-14">
      {/* Fortschritt */}
      <div className="mb-8 flex items-center gap-2">
        {["address", "shipping", "payment", "review"].map((s, i) => {
          const labels: Record<string, string> = { address: "Adresse", shipping: "Versand", payment: "Zahlung", review: "Prüfen" };
          const active = s === step;
          const done = ["address", "shipping", "payment", "review"].indexOf(step) > i;
          return (
            <div key={s} className="flex flex-1 items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold
                ${done ? "bg-emerald-500 text-white" : active ? "bg-[color:var(--brand)] text-white" : "bg-gray-200 text-gray-400"}`}>
                {done ? "✓" : i + 1}
              </div>
              <span className={`mx-1 hidden text-xs sm:inline ${active ? "font-bold text-[color:var(--brand)]" : "text-gray-400"}`}>
                {labels[s]}
              </span>
              {i < 3 && <div className={`mx-1 h-0.5 flex-1 ${done ? "bg-emerald-500" : "bg-gray-200"}`} />}
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Hauptbereich */}
        <div className="lg:col-span-2 space-y-6">
          {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-700">{error}</div>}

          {/* 1. Adresse */}
          {step === "address" && (
            <div className="rounded-2xl border border-[color:var(--line)] bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold">Lieferadresse</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {addrFields.map(([label, field]) => (
                  <div key={field} className={field === "street" ? "sm:col-span-2" : ""}>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">{label}</label>
                    <input value={shippingAddress[field] ?? ""} onChange={e => setShippingAddress(s => ({ ...s, [field]: e.target.value }))}
                      className="w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-2.5 text-sm outline-none focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/20" />
                  </div>
                ))}
              </div>
              <label className="mt-4 flex items-center gap-2 text-sm text-[color:var(--muted)]">
                <input type="checkbox" checked={sameAsShipping} onChange={e => setSameAsShipping(e.target.checked)} className="rounded" />
                Rechnungsadresse ist identisch mit Lieferadresse
              </label>
              {!sameAsShipping && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {shortFields.map(([label, field]) => (
                    <div key={field} className={field === "street" ? "sm:col-span-2" : ""}>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">{label}</label>
                      <input value={billingAddress[field] ?? ""} onChange={e => setBillingAddress(s => ({ ...s, [field]: e.target.value }))}
                        className="w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-2.5 text-sm outline-none focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/20" />
                    </div>
                  ))}
                </div>
              )}
              <button onClick={() => setStep("shipping")}
                className="mt-6 w-full rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[#e18244] py-3 font-bold text-white hover:-translate-y-0.5 transition">
                Weiter zu Versand
              </button>
            </div>
          )}

          {/* 2. Versand */}
          {step === "shipping" && (
            <div className="rounded-2xl border border-[color:var(--line)] bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold">Versandart</h2>
              {shippingMethods.length === 0
                ? <p className="text-sm text-[color:var(--muted)]">Keine Versandarten verfügbar.</p>
                : <div className="space-y-3">
                    {shippingMethods.map(m => (
                      <label key={m.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition ${selectedShipping === m.id ? "border-[color:var(--brand)] bg-[color:var(--brand)]/5" : "border-[color:var(--line)] hover:border-[color:var(--brand)]/40"}`}>
                        <input type="radio" name="shipping" value={m.id} checked={selectedShipping === m.id}
                          onChange={() => setSelectedShipping(m.id)} className="sr-only" />
                        {m.media?.url && (
                          <img src={m.media.url} alt="" className="h-8 w-8 rounded object-contain" />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{m.name}</p>
                          {m.description && <p className="text-xs text-[color:var(--muted)]">{m.description}</p>}
                        </div>
                        <div className={`h-4 w-4 rounded-full border-2 ${selectedShipping === m.id ? "border-[color:var(--brand)] bg-[color:var(--brand)]" : "border-gray-300"}`}>
                          {selectedShipping === m.id && <div className="m-auto h-2 w-2 rounded-full bg-white" />}
                        </div>
                      </label>
                    ))}
                  </div>}
              <div className="mt-6 flex gap-3">
                <button onClick={() => setStep("address")}
                  className="flex-1 rounded-full border border-[color:var(--line)] py-2.5 font-bold text-sm hover:bg-gray-50">Zurück</button>
                <button onClick={() => setStep("payment")}
                  className="flex-1 rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[#e18244] py-2.5 font-bold text-white hover:-translate-y-0.5 transition">Weiter zu Zahlung</button>
              </div>
            </div>
          )}

          {/* 3. Zahlung */}
          {step === "payment" && (
            <div className="rounded-2xl border border-[color:var(--line)] bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold">Zahlungsart</h2>
              {paymentMethods.length === 0
                ? <p className="text-sm text-[color:var(--muted)]">Keine Zahlungsarten verfügbar.</p>
                : <div className="space-y-3">
                    {paymentMethods.map(m => (
                      <label key={m.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition ${selectedPayment === m.id ? "border-[color:var(--brand)] bg-[color:var(--brand)]/5" : "border-[color:var(--line)] hover:border-[color:var(--brand)]/40"}`}>
                        <input type="radio" name="payment" value={m.id} checked={selectedPayment === m.id}
                          onChange={() => setSelectedPayment(m.id)} className="sr-only" />
                        {m.media?.url && (
                          <img src={m.media.url} alt="" className="h-8 w-auto rounded object-contain" />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{m.name}</p>
                          {m.description && <p className="text-xs text-[color:var(--muted)]">{m.description}</p>}
                        </div>
                        <div className={`h-4 w-4 rounded-full border-2 ${selectedPayment === m.id ? "border-[color:var(--brand)] bg-[color:var(--brand)]" : "border-gray-300"}`}>
                          {selectedPayment === m.id && <div className="m-auto h-2 w-2 rounded-full bg-white" />}
                        </div>
                      </label>
                    ))}
                </div>}
              <div className="mt-6 flex gap-3">
                <button onClick={() => setStep("shipping")}
                  className="flex-1 rounded-full border border-[color:var(--line)] py-2.5 font-bold text-sm hover:bg-gray-50">Zurück</button>
                <button onClick={() => setStep("review")}
                  className="flex-1 rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[#e18244] py-2.5 font-bold text-white hover:-translate-y-0.5 transition">Weiter zur Prüfung</button>
              </div>
            </div>
          )}

          {/* 4. Prüfung */}
          {step === "review" && (
            <div className="rounded-2xl border border-[color:var(--line)] bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold">Prüfe deine Bestellung</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold">Lieferadresse</p>
                  <p className="text-[color:var(--muted)]">
                    {shippingAddress.firstName} {shippingAddress.lastName}<br />
                    {shippingAddress.street}<br />
                    {shippingAddress.zipcode} {shippingAddress.city}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Versandart</p>
                  <p className="text-[color:var(--muted)]">
                    {shippingMethods.find(m => m.id === selectedShipping)?.name || "—"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Zahlungsart</p>
                  <p className="text-[color:var(--muted)]">
                    {paymentMethods.find(m => m.id === selectedPayment)?.name || "—"}
                  </p>
                </div>
                <div className="border-t border-[color:var(--line)] pt-4">
                  <p className="font-semibold">Artikel ({cartItems.length})</p>
                  {cartItems.map(item => (
                    <div key={item.id} className="mt-1 flex justify-between text-[color:var(--muted)]">
                      <span>{item.label} × {item.quantity}</span>
                      <span>{fmtPrice(item.priceTotal)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setStep("payment")}
                  className="flex-1 rounded-full border border-[color:var(--line)] py-2.5 font-bold text-sm hover:bg-gray-50">Zurück</button>
                <button onClick={placeOrder} disabled={submitting}
                  className="flex-1 rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[#e18244] py-2.5 font-bold text-white hover:-translate-y-0.5 transition disabled:opacity-50">
                  {submitting ? "Wird bearbeitet…" : `Jetzt kostenpflichtig bestellen – ${fmtPrice(total)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Zusammenfassung sidebar */}
        <aside className="space-y-4">
          <div className="sticky top-4 rounded-2xl border border-[color:var(--line)] bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-bold">Bestellübersicht</h2>
            <div className="space-y-2 text-xs">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span className="line-clamp-1">{item.label} × {item.quantity}</span>
                  <span>{fmtPrice(item.priceTotal)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1 border-t border-[color:var(--line)] pt-3 text-sm">
              <div className="flex justify-between text-[color:var(--muted)]">
                <span>Zwischensumme</span><span>{fmtPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-[color:var(--muted)]">
                <span>Versand</span><span>{shippingCostsRaw === 0 ? "Kostenlos" : fmtPrice(shippingCostsRaw)}</span>
              </div>
            </div>
            <div className="mt-3 flex justify-between border-t border-[color:var(--line)] pt-3 text-lg font-extrabold">
              <span>Gesamt</span><span className="text-[color:var(--brand)]">{fmtPrice(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
