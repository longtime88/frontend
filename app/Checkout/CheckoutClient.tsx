"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { SHOPWARE_CART_URL, SHOPWARE_LINE_ITEM_ADD_URL } from "@/lib/shopwareStorefront";
import { getCustomCartItems, mergeCartWithCustom, addProductToShopwareCart, resolveShopwareProductId } from "@/lib/shopwareCart";

type Address = { firstName: string; lastName: string; email?: string; street: string; streetAdditional?: string; city: string; zipcode: string; countryId?: string; company?: string; salutationId?: string | null };
type ShippingMethod = { id: string; name: string; description?: string; media?: { url?: string }; deliveryTime?: string };
type PaymentMethod = { id: string; name: string; description?: string; media?: { url?: string }; formUrl?: string };
type OrderResult = { id?: string; orderNumber?: string };

const DEFAULT_COUNTRY = "f3e1b85c74df4e8fae2f3ef2da38e44f";

const initialAddress: Address = { firstName: "", lastName: "", email: "", street: "", streetAdditional: "", city: "", zipcode: "", countryId: DEFAULT_COUNTRY };

const fmtPrice = (cents: number) =>
  (cents / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" });

const addrFields: [string, keyof Address][] = [
  ["Vorname", "firstName"],
  ["Nachname", "lastName"],
  ["E-Mail", "email"],
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

type CheckoutClientProps = {
  initialContextToken: string;
};

export default function Checkout({ initialContextToken }: CheckoutClientProps) {
  const [step, setStep] = useState<"address" | "shipping" | "payment" | "review" | "success">("address");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [resetting, setResetting] = useState(false);
  // Guard: verhindert doppeltes Hinzufuegen bei mehreren loadCart-Aufrufen
  const chargingDone = useRef(false);
  

  const [cartItems, setCartItems] = useState<Array<{ id: string; label: string; quantity: number; priceTotal: number; cover?: string | { media?: { url?: string; translated?: { alt?: string } } }; referencedId?: string }>>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [shippingCostsRaw, setShippingCostsRaw] = useState(0);
  const [contextToken, setContextToken] = useState(initialContextToken);

  const [shippingAddress, setShippingAddress] = useState<Address>(initialAddress);
  const [billingAddress, setBillingAddress] = useState<Address>(initialAddress);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShipping, setSelectedShipping] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [orderResult] = useState<OrderResult | null>(null);
  const [customerLoggedIn, setCustomerLoggedIn] = useState(false);
  const contextTokenRef = useRef(initialContextToken);

  useEffect(() => {
    contextTokenRef.current = contextToken;
  }, [contextToken]);

  const applyContextToken = (token: string) => {
    if (!token) return;
    setContextToken(token);
    contextTokenRef.current = token;
    
    

  const loadCustomer = useCallback(async () => {
    try {
      const r = await fetch("/api/customer/me", { cache: "no-store" });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) return;
      if (data.loggedIn) {
        setCustomerLoggedIn(true);
        setShippingAddress((prev) => ({
          ...prev,
          firstName: prev.firstName || String(data.firstName || ""),
          lastName: prev.lastName || String(data.lastName || ""),
          email: prev.email || String(data.email || data.customerEmail || ""),
        }));
      } else {
        setCustomerLoggedIn(false);
      }
    } catch {
      // ignore
    }
  }, []);

  // --- Warenkorb laden ---
  const loadCart = useCallback(async (overrideToken?: string) => {
    const token = overrideToken ?? contextTokenRef.current;
    try {
      const r = await fetch(`/api/checkout?contextToken=${encodeURIComponent(token)}`);
      const data = await r.json();
      if (!r.ok || !data.ok) { setError(data?.error || "Warenkorb-Fehler"); setLoading(false); return; }
      const nextToken = typeof data.contextToken === "string" && data.contextToken ? data.contextToken : token;
      if (data.contextToken) {
        applyContextToken(data.contextToken);
      }

      const lineItems = data.cart?.lineItems || {};
      const customItems = getCustomCartItems();
      const merged = mergeCartWithCustom(lineItems, customItems);
      const items = (merged as Array<Record<string, unknown>>).map((li) => {
        const shopwarePrice = (li.price as Record<string, unknown>)?.totalPrice;
        const customPrice = li.priceTotal as number;
        let priceTotal = 0;

        if (typeof customPrice === 'number' && customPrice > 0) {
          priceTotal = customPrice;
        } else if (typeof shopwarePrice === 'number') {
          priceTotal = Math.round(shopwarePrice * 100);
        }

        return {
          id: String(li.id ?? ""),
          label: String(li.label ?? ""),
          quantity: Number(li.quantity) || 1,
          priceTotal,
          cover: li.cover as string | { media?: { url?: string; translated?: { alt?: string } } } | undefined,
          referencedId: String((li as Record<string, unknown>).referencedId ?? ""),
        };
      });

      // Dedup items that share the same id
      const seen = new Set<string>();
      const deduped: typeof cartItems = [];
      for (const it of items) {
        if (!seen.has(it.id)) { seen.add(it.id); deduped.push(it); }
      }

      setCartItems(deduped);

      // Preis holen: totalPrice aus dem Warenkorb ist NUR der Warenwert,
      // shippingCosts stecken in deliveries[0].shippingCosts.totalPrice.
      // sum(priceTotal) der Artikel + deliveries-shipping = echter Gesamtpreis.
      const cartRecord = data.cart as Record<string, unknown> | undefined;
      const deliveries = (cartRecord?.deliveries as Array<Record<string, unknown>>) ?? [];
      const deliveryShipping = (deliveries[0]?.shippingCosts as Record<string, unknown> | undefined)?.totalPrice
        ? Math.round(Number((deliveries[0]?.shippingCosts as Record<string, unknown>)?.totalPrice) * 100)
        : 0;
const itemsTotal = deduped.reduce((s, it) => s + it.priceTotal, 0);

       setCartTotal(itemsTotal);
       setShippingCostsRaw(deliveryShipping);

      // Charging: Wenn ?product=ID in der URL und Produkt noch nicht im Warenkorb,
      // hinzufuegen und dann neu laden.
      if (!chargingDone.current) {
        chargingDone.current = true;
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          const productId = params.get("product");
          if (productId) {
            const normalizedProductId = resolveShopwareProductId(productId);
            if (normalizedProductId && !deduped.some(i => i.id === normalizedProductId || i.id === `custom:${normalizedProductId}`)) {
              try {
                await addProductToShopwareCart(normalizedProductId, 1);
                // Nochmal laden, damit der neue Artikel erscheint
                await loadCart(nextToken);
                return; // Payment/Shipping wird von diesem loadCart-Aufruf geladen
              } catch (err) {
                console.error("Fehler beim Hinzufuegen zum Warenkorb:", err);
                chargingDone.current = false; // erlaube Retry beim naechsten loadCart
              }
            }
          }
        }
      }

      setLoading(false);

      // Zahlungs- und Versandarten parallel laden
      await Promise.all([loadMethods(nextToken), loadCartItems(nextToken)]);
    } catch { setError("Server nicht erreichbar."); setLoading(false); }
  }, []);

  const loadMethods = async (token: string) => {
    const r = await fetch(`/api/checkout)?contextToken=${token}`);

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

  useEffect(() => {
    applyContextToken(initialContextToken);
    async function init() {
      await loadCustomer();
      await loadCart();
    }
    init();
  }, [initialContextToken, loadCart, loadCustomer]);

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      setError("Der Warenkorb ist leer. Bitte lege zuerst Produkte in den Warenkorb.");
      return;
    }
    setError("");

    const productQuantities = new Map<string, number>();
    for (const item of cartItems) {
      const productId = resolveShopwareProductId(
        String(item.referencedId || item.id).replace(/^custom:/, "")
      );
      if (!productId) {
        setError(`"${item.label}" ist nicht mit einem Shopware-Produkt verknuepft.`);
        return;
      }
      productQuantities.set(productId, (productQuantities.get(productId) || 0) + item.quantity);
    }

    setSubmitting(true);

    const form = document.createElement("form");
    form.method = "post";
    form.action = SHOPWARE_LINE_ITEM_ADD_URL;
    form.style.display = "none";

    const appendInput = (name: string, value: string) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    };

    appendInput("redirectTo", "frontend.checkout.confirm.page");

    for (const [productId, quantity] of productQuantities) {
      appendInput(`lineItems[${productId}][id]`, productId);
      appendInput(`lineItems[${productId}][referencedId]`, productId);
      appendInput(`lineItems[${productId}][type]`, "product");
      appendInput(`lineItems[${productId}][stackable]`, "1");
      appendInput(`lineItems[${productId}][removable]`, "1");
      appendInput(`lineItems[${productId}][quantity]`, String(quantity));
    }

    document.body.appendChild(form);
    form.submit();
  };

  // --- Warenkorb zuruecksetzen ---
  const resetCart = async () => {
    setResetting(true);
    setError("");
    try {
      const token = contextToken;

      // Shopware-Warenkorb leeren (falls Token vorhanden)
      if (token) {
        const r = await fetch("/api/cart/drop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contextToken: token }),
        });
        const data = await r.json().catch(() => ({}));
        if (!r.ok || !data.ok) {
          setError(data?.error || "Warenkorb konnte nicht geleert werden.");
          return;
        }
      }

      
      
      const CheckoutClient = () => {

        const [map, setMap] = useState<Map<string, number>>(new Map()); 
        if (map.size === 0){
          const map = new Map<string,number>();
          map.set("item1", 2);
          map.set("item2", 5);
          setMap(map);
        }

                 
      

      // Custom-Cart in localStorage leeren
      localStorage.removeItem("custom-cart-items");

      // Token aus localStorage und Cookie loeschen
      // WICHTIG: Cookie muss ebenfalls geloescht werden, sonst
      // holt getShopwareContextToken() den alten Token zurueck
      // und loadCart() laedt die alten Artikel wieder.

      // UI direkt auf leer setzen — KEIN loadCart() Aufruf,
      // sonst wird der Token wieder von Shopware geholt und die
      // alten Artikel erscheinen wieder.
      setCartItems([]);
      setCartTotal(0);
      setShippingCostsRaw(0);
      setContextToken("");
      contextTokenRef.current = "";
      setCustomerLoggedIn(false);
    } catch (err) {
      setError("Warenkorb konnte nicht geleert werden.");
      console.error(err);
    } finally {
      setResetting(false);
    }
  };

  // --- UI ---
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--bg)]">
        <div className="text-center"><div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[color:var(--brand)]" /><p>Checkout wird geladen…</p></div>
      </div>
    );
  }

  const total = cartTotal + shippingCostsRaw;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 md:py-14">
      {/* Fortschritt - ohne login step */}
      <div className="mb-8 flex items-center gap-2">
        {["address", "shipping", "payment", "review"].map((s, i) => {
          const labels: Record<string, string> = { address: "Adresse", shipping: "Versand", payment: "Zahlung", review: "Prüfen" };
          const active = s === step;
          const done = ["address", "shipping", "payment", "review"].indexOf(step) > i;
          return (
            <div key={s} className="flex flex-1 items-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium
                ${done ? "bg-emerald-600 text-white" : active ? "bg-gradient-to-r from-[color:var(--brand)] to-[#e18244] text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors"}`}>
                {done ? "✓" : i + 1}
              </div>
              <span className={`mx-2 hidden text-sm sm:inline ${active ? "font-semibold text-[color:var(--brand)]" : "text-gray-500"}`}>
                {labels[s]}
              </span>
              {i < 3 && <div className={`mx-2 h-0.5 flex-1 ${done ? "bg-emerald-600" : active ? "bg-gradient-to-r from-[color:var(--brand)] to-[#e18244]" : "bg-gray-200"}`} />}
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
             <div className="rounded-2xl border border-[color:var(--line)] bg-white p-6 shadow-sm glass-card">
               <h2 className="mb-6 text-xl font-bold">Lieferadresse</h2>
               <div className="grid gap-6 sm:grid-cols-2">
                 {addrFields.map(([label, field]) => (
                   <div key={field} className={field === "street" ? "sm:col-span-2" : ""}>
                     <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-[color:var(--muted)]">{label}</label>
                     <input
                       type={field === "email" ? "email" : "text"}
                       value={shippingAddress[field] ?? ""}
                       onChange={e => setShippingAddress(s => ({ ...s, [field]: e.target.value }))}
                       className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-5 py-3 text-base outline-none focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/20 transition-all duration-200 glass-input"
                       placeholder={label}
                     />
                     </div>
                 ))}
               </div>
               {customerLoggedIn && (
                 <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-base font-semibold text-emerald-700">
                   Eingeloggt: Bestellung wird deinem Kundenkonto zugeordnet.
                 </p>
               )}
               <label className="mt-5 flex items-center gap-3 text-base text-[color:var(--muted)]">
                 <input type="checkbox" checked={sameAsShipping} onChange={e => setSameAsShipping(e.target.checked)} className="rounded" />
                 Rechnungsadresse ist identisch mit Lieferadresse
               </label>
               {!sameAsShipping && (
                 <div className="mt-5 grid gap-6 sm:grid-cols-2">
                   {shortFields.map(([label, field]) => (
                     <div key={field} className={field === "street" ? "sm:col-span-2" : ""}>
                       <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-[color:var(--muted)]">{label}</label>
                       <input value={billingAddress[field] ?? ""} onChange={e => setBillingAddress(s => ({ ...s, [field]: e.target.value }))}
                         className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-5 py-3 text-base outline-none focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/20 transition-all duration-200 glass-input"
                       />
                     </div>
                   ))}
                 </div>
               )}
               <button onClick={() => setStep("shipping")}
                 className="mt-6 w-full rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[#e18244] py-3 font-bold text-white hover:-translate-y-0 active:translate-y-0.5 transition-all duration-200 shadow-glow hover:shadow-[0_0_0_1px_var(--line),0_0_40px_var(--glow),0_8px_30px_rgba(0,0,0,0.22)] active:shadow-[0_0_0_1px_var(--line),0_0_20px_var(--glow),0_4px_15px_rgba(0,0,0,0.18)]">
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
                          // eslint-disable-next-line @next/next/no-img-element
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
                   className="flex-1 rounded-full border border-[color:var(--line)] px-4 py-2.5 font-bold text-sm hover:bg-gray-50 transition-colors duration-200">Zurück</button>
                 <button onClick={() => setStep("payment")}
                   className="flex-1 rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[#e18244] px-4 py-2.5 font-bold text-white hover:-translate-y-0 active:translate-y-0.5 transition-all duration-200 shadow-glow hover:shadow-[0_0_0_1px_var(--line),0_0_40px_var(--glow),0_8px_30px_rgba(0,0,0,0.22)] active:shadow-[0_0_0_1px_var(--line),0_0_20px_var(--glow),0_4px_15px_rgba(0,0,0,0.18)]">Weiter zu Zahlung</button>
               </div>
            </div>
          )}

          {/* 3. Zahlung */}
          {step === "payment" && (
            <div className="rounded-2xl border border-[color:var(--line)] bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold">Zahlungsart</h2>
              {paymentMethods.length === 0
                ? <p className="text-sm text-[color:var(--muted)]">Keine Zahlungsarten verfügbar.</p>
                 : <div className="space-y-4">
                     {paymentMethods.map(m => (
                       <label key={m.id}
                         className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-5 transition-all duration-200 ${selectedPayment === m.id ? "border-[color:var(--brand)] bg-[color:var(--brand)]/5 shadow-glow" : "border-[color:var(--line)] hover:border-[color:var(--brand)]/40 hover:bg-white/5"}`}>
                         <input type="radio" name="payment" value={m.id} checked={selectedPayment === m.id}
                           onChange={() => setSelectedPayment(m.id)} className="sr-only" />
                         {m.media?.url && (
                           // eslint-disable-next-line @next/next/no-img-element
                           <img src={m.media.url} alt="" className="h-10 w-auto rounded-xl object-contain" />
                         )}
                         <div className="flex-1">
                           <p className="font-semibold text-base">{m.name}</p>
                           {m.description && <p className="text-sm text-[color:var(--muted)]">{m.description}</p>}
                         </div>
                         <div className={`h-5 w-5 rounded-full border-2 ${selectedPayment === m.id ? "border-[color:var(--brand)] bg-[color:var(--brand)]" : "border-gray-300 hover:border-[color:var(--brand)]/40"}`}>
                           {selectedPayment === m.id && <div className="m-auto h-3 w-3 rounded-full bg-white" />}
                         </div>
                       </label>
                     ))}
                   </div>}
               <div className="mt-6 flex gap-3">
                 <button onClick={() => setStep("shipping")}
                   className="flex-1 rounded-full border border-[color:var(--line)] px-4 py-2.5 font-bold text-sm hover:bg-gray-50 transition-colors duration-200">Zurück</button>
                 <button onClick={() => setStep("review")}
                   className="flex-1 rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[#e18244] px-4 py-2.5 font-bold text-white hover:-translate-y-0 active:translate-y-0.5 transition-all duration-200 shadow-glow hover:shadow-[0_0_0_1px_var(--line),0_0_40px_var(--glow),0_8px_30px_rgba(0,0,0,0.22)] active:shadow-[0_0_0_1px_var(--line),0_0_20px_var(--glow),0_4px_15px_rgba(0,0,0,0.18)]">Weiter zur Prüfung</button>
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
                    {shippingAddress.email ? (<>{shippingAddress.email}<br /></>) : null}
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
                    <div key={item.id} className="mt-1 flex items-center justify-between gap-4">
                      <span className="text-[color:var(--muted)]">{item.label} × {item.quantity}</span>
                      <span className="text-sm font-semibold text-[color:var(--ink)]">{fmtPrice(item.priceTotal)}</span>
                    </div>
                  ))}
                  <div className="mt-2 flex justify-between border-t border-[color:var(--line)] pt-2 text-lg font-extrabold">
                    <span>Gesamt</span>
                    <span className="text-[color:var(--brand)]">{fmtPrice(total)}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[color:var(--line)] pt-3 text-2xl font-extrabold">
                  <span>Zu zahlen</span><span className="text-[color:var(--brand)]">{fmtPrice(total)}</span>
                </div>
              </div>
               <div className="mt-6 flex gap-3">
                 <button onClick={() => setStep("payment")}
                   className="flex-1 rounded-full border border-[color:var(--line)] px-4 py-2.5 font-bold text-sm hover:bg-gray-50 transition-colors duration-200">Zurück</button>
                 <button onClick={placeOrder} disabled={submitting}
                   className="flex-1 rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[#e18244] px-4 py-2.5 font-bold text-white hover:-translate-y-0 active:translate-y-0.5 transition-all duration-200 shadow-glow hover:shadow-[0_0_0_1px_var(--line),0_0_40px_var(--glow),0_8px_30px_rgba(0,0,0,0.22)] active:shadow-[0_0_0_1px_var(--line),0_0_20px_var(--glow),0_4px_15px_rgba(0,0,0,0.18)] disabled:opacity-50">
                   {submitting ? "Weiterleitung…" : "Weiter zu PayPal / Shopware"}
                 </button>
               </div>
            </div>
          )}


          {/* 5. Erfolg */}
          {step === "success" && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
              <h2 className="mb-2 text-lg font-bold text-emerald-800">Bestellung erfolgreich</h2>
              <p className="text-sm text-emerald-700">
                Deine Bestellung wurde uebermittelt.
                {orderResult?.orderNumber ? ` Bestellnummer: ${orderResult.orderNumber}.` : ""}
              </p>
              {orderResult?.id && (
                <p className="mt-2 text-xs text-emerald-700">Interne Order-ID: {orderResult.id}</p>
              )}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => { window.location.href = "/"; }}
                  className="flex-1 rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[#e18244] py-2.5 font-bold text-white hover:-translate-y-0.5 transition"
                >
                  Zur Startseite
                </button>
              </div>
            </div>
          )}
        </div>

         {/* Zusammenfassung sidebar */}
         <aside className="space-y-6">
           <div className="sticky top-4 rounded-2xl border border-[color:var(--line)] bg-white p-8 shadow-lg">
             <h2 className="mb-6 text-xl font-bold">Bestellübersicht</h2>
             <div className="space-y-4 text-sm">
               {cartItems.map(item => (
                 <div key={item.id} className="flex justify-between py-2 border-b border-[color:var(--line)]/50 last:border-b-0">
                   <span className="line-clamp-1">{item.label} × {item.quantity}</span>
                   <span>{fmtPrice(item.priceTotal)}</span>
                 </div>
               ))}
             </div>
             <div className="mt-6 space-y-3 border-t border-[color:var(--line)] pt-6">
               <div className="flex justify-between text-[color:var(--muted)]">
                 <span>Zwischensumme</span><span>{fmtPrice(cartTotal)}</span>
               </div>
               <div className="flex justify-between text-[color:var(--muted)]">
                 <span>Versand</span><span>{shippingCostsRaw === 0 ? "Kostenlos" : fmtPrice(shippingCostsRaw)}</span>
               </div>
             </div>
             <div className="mt-5 flex justify-between border-t border-[color:var(--line)] pt-4 text-2xl font-extrabold">
               <span>Gesamt</span><span className="text-[color:var(--brand)]">{fmtPrice(total)}</span>
             </div>
             <button
               onClick={resetCart}
               disabled={resetting || cartItems.length === 0}
               className="mt-6 w-full rounded-xl border border-red-200 bg-red-50 px-6 py-3 text-base font-bold text-red-600 transition-all duration-200 hover:bg-red-100 active:bg-red-200 disabled:cursor-not-allowed disabled:opacity-40"
             >
               {resetting ? "Wird geleert…" : "Warenkorb leeren"}
             </button>
           </div>
         </aside>
      </div>
    </section>
  );
}
