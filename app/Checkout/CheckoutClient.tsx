"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import {
  addProductToShopwareCart,
  removeProductFromShopwareCart,
  resolveShopwareProductId,
} from "@/lib/shopwareCart";

type Address = { firstName: string; lastName: string; email?: string; street: string; streetAdditional?: string; city: string; zipcode: string; countryId?: string; company?: string; salutationId?: string | null };
type ShippingMethod = { id: string; name: string; description?: string; media?: { url?: string }; deliveryTime?: string };
type PaymentMethod = { id: string; name: string; description?: string; media?: { url?: string }; formUrl?: string };
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

type CheckoutStep = "cart" | "address" | "shipping" | "payment" | "review";
type CartItem = {
  id: string;
  label: string;
  quantity: number;
  priceTotal: number;
  cover?: string | { media?: { url?: string; translated?: { alt?: string } } };
  referencedId?: string;
};

const checkoutSteps: Array<{ id: CheckoutStep; label: string }> = [
  { id: "cart", label: "Warenkorb" },
  { id: "address", label: "Adresse" },
  { id: "shipping", label: "Versand" },
  { id: "payment", label: "Zahlung" },
  { id: "review", label: "Prüfen" },
];

function coverUrl(cover: CartItem["cover"]): string {
  if (typeof cover === "string") return cover;
  return cover?.media?.url || "";
}

export default function Checkout({ initialContextToken }: CheckoutClientProps) {
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [resetting, setResetting] = useState(false);
  // Guard: verhindert doppeltes Hinzufuegen bei mehreren loadCart-Aufrufen
  const chargingDone = useRef(false);
  

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
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
  const [customerLoggedIn, setCustomerLoggedIn] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState("");
  const contextTokenRef = useRef(initialContextToken);

  useEffect(() => {
    contextTokenRef.current = contextToken;
  }, [contextToken]);

  const applyContextToken = (token: string) => {
    if (!token) return;
    setContextToken(token);
    contextTokenRef.current = token;
  };

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

      const rawLineItems = Array.isArray(data.cart?.lineItems)
        ? data.cart.lineItems as Array<Record<string, unknown>>
        : Object.values((data.cart?.lineItems || {}) as Record<string, Record<string, unknown>>);
      const items = rawLineItems.map((li) => {
        const shopwarePrice = (li.price as Record<string, unknown>)?.totalPrice;
        let priceTotal = 0;

        if (typeof shopwarePrice === 'number') {
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

      // Verfügbare Zahlungs- und Versandarten direkt aus Shopware laden
      await loadMethods(nextToken);
    } catch { setError("Server nicht erreichbar."); setLoading(false); }
  }, []);

  const loadMethods = async (token: string) => {
    const r = await fetch(`/api/checkout/methods?contextToken=${encodeURIComponent(token)}`);

    const data = await r.json();
    if (r.ok && data.ok) {
      setPaymentMethods(data.paymentMethods || []);
      setShippingMethods(data.shippingMethods || []);
      if (data.shippingMethods?.length > 0) setSelectedShipping(data.shippingMethods[0].id);
      if (data.paymentMethods?.length > 0) setSelectedPayment(data.paymentMethods[0].id);
    }
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
    setSubmitting(true);

    try {
      let activeContextToken = contextTokenRef.current;

      // Gastadressen werden zuerst in Shopware als Gastkunde angelegt, damit
      // Shopware sie im eigenen Checkout und in der Bestellung verwenden kann.
      if (!customerLoggedIn) {
        const guestResponse = await fetch("/api/checkout/guest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contextToken: activeContextToken,
            email: shippingAddress.email,
            shippingAddress,
            billingAddress: sameAsShipping ? shippingAddress : billingAddress,
          }),
        });
        const guestData = await guestResponse.json().catch(() => ({}));
        if (!guestResponse.ok || !guestData.ok) {
          setError(guestData?.error || "Gastadresse konnte nicht in Shopware gespeichert werden.");
          return;
        }
        if (guestData.contextToken) {
          activeContextToken = String(guestData.contextToken);
          applyContextToken(activeContextToken);
        }
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contextToken: activeContextToken,
          paymentMethodId: selectedPayment,
          shippingMethodId: selectedShipping,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) {
        setError(data?.error || "Die Bestellung konnte nicht über Shopware erstellt werden.");
        return;
      }

      const redirectUrl = data?.payment?.redirectUrl;
      if (typeof redirectUrl === "string" && redirectUrl) {
        window.location.assign(redirectUrl);
        return;
      }

      setOrderSuccess(`Bestellung erfolgreich erstellt${data?.order?.orderNumber ? `: ${data.order.orderNumber}` : "."}`);
      setCartItems([]);
      setCartTotal(0);
      setShippingCostsRaw(0);
      window.dispatchEvent(new Event("cart-updated"));
    } catch {
      setError("Shopware Checkout ist nicht erreichbar.");
    } finally {
      setSubmitting(false);
    }
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

  const changeItemQuantity = async (item: CartItem, nextQuantity: number) => {
    if (nextQuantity < 0) return;
    setError("");

    try {
      const productId = resolveShopwareProductId(item.referencedId || item.id);
      if (!productId) {
        setError("Die Menge dieses Artikels kann nicht geändert werden.");
        return;
      }

      await removeProductFromShopwareCart(item.id);
      if (nextQuantity > 0) await addProductToShopwareCart(productId, nextQuantity);
      await loadCart();
    } catch {
      setError("Der Warenkorb konnte nicht aktualisiert werden.");
    }
  };

  const removeItem = async (item: CartItem) => {
    setError("");
    try {
      await removeProductFromShopwareCart(item.id);
      await loadCart();
    } catch {
      setError("Der Artikel konnte nicht entfernt werden.");
    }
  };

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center bg-[#fafbfd] text-[#0f172a]"><div className="text-center"><div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#e3e8f0] border-b-[#0e66e0]" /><p className="text-sm text-[#667287]">Warenkorb wird geladen…</p></div></div>;
  }

  const total = cartTotal + shippingCostsRaw;
  const currentStepIndex = checkoutSteps.findIndex(({ id }) => id === step);

  return (
    <section className="bg-[#fafbfd] text-[#0f172a]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-14">
        <div className="mb-9"><p className="text-xs font-semibold tracking-[0.12em] text-[#0e66e0]">BESTELLUNG</p><h1 className="mt-3 text-4xl font-bold tracking-[-0.045em] sm:text-[42px]">Dein Warenkorb</h1><p className="mt-3 text-[16px] text-[#667287]">Prüfe deine Auswahl und schließe deine Bestellung sicher ab.</p></div>
        <ol className="mb-8 flex max-w-4xl items-center overflow-x-auto pb-2" aria-label="Bestellfortschritt">
          {checkoutSteps.map(({ id, label }, index) => {
            const active = id === step;
            const done = index < currentStepIndex;
            return <li key={id} className="flex shrink-0 items-center"><div className="flex items-center gap-2"><span className={`flex h-[34px] w-[34px] items-center justify-center rounded-full text-[13px] font-bold ${active ? "bg-[#0e66e0] text-white" : done ? "bg-[#1ac7b8] text-[#0f172a]" : "border border-[#e3e8f0] bg-white text-[#667287]"}`}>{done ? "✓" : index + 1}</span><span className={`text-sm ${active ? "font-semibold text-[#0f172a]" : "text-[#667287]"}`}>{label}</span></div>{index < checkoutSteps.length - 1 && <span className={`mx-3 h-0.5 w-10 sm:w-[72px] ${index < currentStepIndex || active ? "bg-[#0e66e0]" : "bg-[#e3e8f0]"}`} />}</li>;
          })}
        </ol>

        {orderSuccess && <div role="status" className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{orderSuccess}</div>}
        {error && <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_440px]">
          <div className="min-w-0 space-y-5">
            {step === "cart" && <>
              <h2 className="text-2xl font-bold">Artikel ({cartItems.length})</h2>
              {cartItems.length === 0 ? <div className="rounded-[18px] border border-dashed border-[#cfd8e5] bg-white p-8 text-center text-[#667287]">Dein Warenkorb ist leer.</div> : cartItems.map((item, index) => {
                const image = coverUrl(item.cover);
                return <article key={item.id} className="flex flex-col gap-5 rounded-[18px] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:p-6">
                  <div className={`flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[14px] ${index % 2 ? "bg-[#dbf5f0]" : "bg-[#e8edff]"}`}>{image ? <Image src={image} alt="" width={112} height={112} unoptimized className="h-full w-full object-cover" /> : <span className="text-3xl text-[#0e66e0]">●</span>}</div>
                  <div className="min-w-0 flex-1"><h3 className="text-lg font-semibold">{item.label}</h3><p className="mt-1 text-sm text-[#667287]">Digitales Produkt · Sofort verfügbar</p><div className="mt-5 flex flex-wrap items-center gap-4"><div className="flex h-[34px] items-center rounded-lg bg-[#f5f7fc] text-sm"><button type="button" aria-label={`${item.label} Menge verringern`} onClick={() => void changeItemQuantity(item, item.quantity - 1)} className="h-full px-3 text-base text-[#333f55] hover:text-[#0e66e0]" disabled={item.quantity <= 1}>−</button><span className="w-7 text-center font-semibold">{item.quantity}</span><button type="button" aria-label={`${item.label} Menge erhöhen`} onClick={() => void changeItemQuantity(item, item.quantity + 1)} className="h-full px-3 text-base text-[#333f55] hover:text-[#0e66e0]">+</button></div><button type="button" onClick={() => void removeItem(item)} className="text-sm font-semibold text-[#0e66e0] hover:text-[#0b55b8]">Entfernen</button></div></div>
                  <div className="text-left sm:self-start sm:text-right"><p className="text-lg font-bold">{fmtPrice(item.priceTotal)}</p><p className="mt-1 text-xs text-[#667287]">inkl. MwSt.</p></div>
                </article>;
              })}
              <div className="rounded-[18px] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"><h3 className="font-semibold">Gutschein oder Rabattcode</h3><div className="mt-4 flex gap-3"><input aria-label="Gutschein oder Rabattcode" placeholder="Code eingeben" className="min-w-0 flex-1 rounded-lg bg-[#f5f7fc] px-4 py-3 text-sm outline-none ring-[#0e66e0] focus:ring-2" /><button type="button" disabled className="rounded-[10px] border border-[#e3e8f0] bg-white px-5 py-3 text-sm font-semibold text-[#667287] disabled:cursor-not-allowed">Anwenden</button></div></div>
              <p className="pt-4 text-center text-sm text-[#667287]">Noch nicht fertig? Du kannst jederzeit weitere Produkte hinzufügen.</p>
            </>}

            {step === "address" && <div className="rounded-[18px] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] sm:p-8"><h2 className="mb-6 text-xl font-bold">Lieferadresse</h2><div className="grid gap-5 sm:grid-cols-2">{addrFields.map(([label, field]) => <label key={field} className={field === "street" ? "sm:col-span-2" : ""}><span className="mb-2 block text-sm font-semibold text-[#333f55]">{label}</span><input type={field === "email" ? "email" : "text"} value={shippingAddress[field] ?? ""} onChange={e => setShippingAddress(s => ({ ...s, [field]: e.target.value }))} className="w-full rounded-[10px] border border-[#e3e8f0] px-4 py-3 outline-none focus:border-[#0e66e0] focus:ring-2 focus:ring-[#0e66e0]/15" /></label>)}</div>{customerLoggedIn && <p className="mt-4 text-sm text-emerald-700">Eingeloggt: Bestellung wird deinem Kundenkonto zugeordnet.</p>}<label className="mt-5 flex gap-3 text-sm text-[#667287]"><input type="checkbox" checked={sameAsShipping} onChange={e => setSameAsShipping(e.target.checked)} />Rechnungsadresse ist identisch mit Lieferadresse</label>{!sameAsShipping && <div className="mt-5 grid gap-5 sm:grid-cols-2">{shortFields.map(([label, field]) => <label key={field} className={field === "street" ? "sm:col-span-2" : ""}><span className="mb-2 block text-sm font-semibold text-[#333f55]">{label}</span><input value={billingAddress[field] ?? ""} onChange={e => setBillingAddress(s => ({ ...s, [field]: e.target.value }))} className="w-full rounded-[10px] border border-[#e3e8f0] px-4 py-3 outline-none focus:border-[#0e66e0]" /></label>)}</div>}<button type="button" onClick={() => setStep("shipping")} className="mt-7 w-full rounded-[10px] bg-[#0f172a] py-3.5 text-sm font-semibold text-white hover:bg-[#26334d]">Weiter zu Versand</button></div>}

            {step === "shipping" && <div className="rounded-[18px] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] sm:p-8"><h2 className="mb-5 text-xl font-bold">Versandart</h2>{shippingMethods.length === 0 ? <p className="text-sm text-[#667287]">Keine Versandarten verfügbar.</p> : <div className="space-y-3">{shippingMethods.map(m => <label key={m.id} className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 ${selectedShipping === m.id ? "border-[#0e66e0] bg-[#e8edff]/40" : "border-[#e3e8f0]"}`}><input type="radio" name="shipping" checked={selectedShipping === m.id} onChange={() => setSelectedShipping(m.id)} /><span><b className="text-sm">{m.name}</b>{m.description && <small className="mt-1 block text-[#667287]">{m.description}</small>}</span></label>)}</div>}<div className="mt-7 flex gap-3"><button type="button" onClick={() => setStep("address")} className="flex-1 rounded-[10px] border border-[#e3e8f0] py-3 text-sm font-semibold">Zurück</button><button type="button" onClick={() => setStep("payment")} className="flex-1 rounded-[10px] bg-[#0f172a] py-3 text-sm font-semibold text-white">Weiter zu Zahlung</button></div></div>}

            {step === "payment" && <div className="rounded-[18px] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] sm:p-8"><h2 className="mb-5 text-xl font-bold">Zahlungsart</h2>{paymentMethods.length === 0 ? <p className="text-sm text-[#667287]">Keine Zahlungsarten verfügbar.</p> : <div className="space-y-3">{paymentMethods.map(m => <label key={m.id} className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 ${selectedPayment === m.id ? "border-[#0e66e0] bg-[#e8edff]/40" : "border-[#e3e8f0]"}`}><input type="radio" name="payment" checked={selectedPayment === m.id} onChange={() => setSelectedPayment(m.id)} /><span><b className="text-sm">{m.name}</b>{m.description && <small className="mt-1 block text-[#667287]">{m.description}</small>}</span></label>)}</div>}<div className="mt-7 flex gap-3"><button type="button" onClick={() => setStep("shipping")} className="flex-1 rounded-[10px] border border-[#e3e8f0] py-3 text-sm font-semibold">Zurück</button><button type="button" onClick={() => setStep("review")} className="flex-1 rounded-[10px] bg-[#0f172a] py-3 text-sm font-semibold text-white">Weiter zur Prüfung</button></div></div>}

            {step === "review" && <div className="rounded-[18px] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] sm:p-8"><h2 className="mb-5 text-xl font-bold">Prüfe deine Bestellung</h2><div className="space-y-5 text-sm"><div><b>Lieferadresse</b><p className="mt-1 text-[#667287]">{shippingAddress.firstName} {shippingAddress.lastName}<br />{shippingAddress.email && <>{shippingAddress.email}<br /></>}{shippingAddress.street}<br />{shippingAddress.zipcode} {shippingAddress.city}</p></div><div><b>Versandart</b><p className="mt-1 text-[#667287]">{shippingMethods.find(m => m.id === selectedShipping)?.name || "—"}</p></div><div><b>Zahlungsart</b><p className="mt-1 text-[#667287]">{paymentMethods.find(m => m.id === selectedPayment)?.name || "—"}</p></div></div><div className="mt-7 flex gap-3"><button type="button" onClick={() => setStep("payment")} className="flex-1 rounded-[10px] border border-[#e3e8f0] py-3 text-sm font-semibold">Zurück</button><button type="button" onClick={placeOrder} disabled={submitting} className="flex-1 rounded-[10px] bg-[#0f172a] py-3 text-sm font-semibold text-white disabled:opacity-50">{submitting ? "Weiterleitung…" : "Weiter zu PayPal / Shopware"}</button></div></div>}
          </div>

          <aside className="lg:sticky lg:top-32"><div className="rounded-[18px] bg-white p-7 shadow-[0_12px_30px_rgba(15,23,42,0.05)]"><h2 className="text-[22px] font-bold">Bestellübersicht</h2><div className="mt-7 space-y-4">{cartItems.map(item => <div key={item.id} className="flex items-start justify-between gap-5 text-sm"><span className="font-medium text-[#333f55]">{item.label}{item.quantity > 1 && ` × ${item.quantity}`}</span><span className="shrink-0 font-semibold">{fmtPrice(item.priceTotal)}</span></div>)}</div><div className="mt-7 space-y-3 border-t border-[#e3e8f0] pt-6 text-sm"><div className="flex justify-between text-[#667287]"><span>Zwischensumme</span><span>{fmtPrice(cartTotal)}</span></div><div className="flex justify-between text-[#667287]"><span>Versand</span><span>{shippingCostsRaw === 0 ? "Kostenlos" : fmtPrice(shippingCostsRaw)}</span></div></div><div className="mt-6 flex justify-between border-t border-[#e3e8f0] pt-5 text-xl font-bold"><span>Gesamt</span><span className="text-[#0e66e0]">{fmtPrice(total)}</span></div><p className="mt-3 text-xs text-[#667287]">inkl. MwSt.</p>{step === "cart" ? <><button type="button" onClick={() => setStep("address")} disabled={cartItems.length === 0} className="mt-7 w-full rounded-[10px] bg-[#0f172a] py-3.5 text-sm font-semibold text-white hover:bg-[#26334d] disabled:cursor-not-allowed disabled:opacity-50">Sicher zur Kasse</button><p className="mt-4 text-center text-xs text-[#667287]">Sichere Bezahlung · Datenschutz · 30 Tage Rückgabe</p></> : <button type="button" onClick={resetCart} disabled={resetting || cartItems.length === 0} className="mt-7 w-full rounded-[10px] border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-600 disabled:opacity-50">{resetting ? "Wird geleert…" : "Warenkorb leeren"}</button>}</div></aside>
        </div>
      </div>
    </section>
  );
}
