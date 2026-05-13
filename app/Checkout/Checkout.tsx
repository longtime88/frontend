import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CartLineItem {
  id: string;
  label: string;
  quantity: number;
  price?: {
    unitPrice: number;
    totalPrice: number;
  };
  totalPrice?: number;
}

interface Cart {
  lineItems: Record<string, CartLineItem>;
  price: {
    totalPrice: number;
    taxStatus: string;
  };
  deliveries?: unknown[];
}

interface Address {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  zipcode: string;
  countryId?: string;
}

const DEFAULT_COUNTRY_ID = "f3e1b85c74df4e8fae2f3ef2da38e44f";
const PAYMENT_METHOD_IDS = {
  kreditkarte: "f3e1b85c74df4e8fae2f3ef2da38e44f",
  paypal: "f3e1b85c74df4e8fae2f3ef2da38e44f",
} as const;

export default function CheckoutPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contextToken, setContextToken] = useState('');
  const [shipping, setShipping] = useState<Address>({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    zipcode: '',
    countryId: DEFAULT_COUNTRY_ID,
  });
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('sw-context-token') || '';
      setContextToken(token);

      const res = await fetch(`/api/checkout?contextToken=${encodeURIComponent(token)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Warenkorb konnte nicht geladen werden.');
      }

      setCart(data.cart);
      if (data.contextToken) {
        localStorage.setItem('sw-context-token', data.contextToken);
        setContextToken(data.contextToken);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!shipping.firstName || !shipping.lastName || !shipping.street || !shipping.city || !shipping.zipcode) {
      setError('Bitte alle Pflichtfelder ausfüllen.');
      return;
    }

    if (!paymentMethod) {
      setError('Bitte Zahlungsmethode wählen.');
      return;
    }

    try {
      setSubmitting(true);
      const token = contextToken || localStorage.getItem('sw-context-token') || '';

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contextToken: token,
          shippingAddress: shipping,
          billingAddress: shipping,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Bestellung fehlgeschlagen.');
      }

      if (data.contextToken) {
        localStorage.setItem('sw-context-token', data.contextToken);
      }

      window.location.href = '/bestellung';
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Bestellung fehlgeschlagen.');
      setSubmitting(false);
    }
  }

  const subtotal = cart
    ? Object.values(cart.lineItems).reduce(
        (sum, item) => sum + (item.totalPrice ?? item.price?.totalPrice ?? 0),
        0
      )
    : 0;
  const shippingCost = 0;
  const total = subtotal + shippingCost;

  return (
    <div className="min-h-screen bg-neutral-100 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-12">Laden...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
         ) : cart && Object.values(cart.lineItems).length > 0 ? (
          <div className="grid gap-10 lg:grid-cols-[1.7fr,1fr]">
            {/* LEFT */}
            <div className="space-y-8">
              {/* Lieferadresse */}
              <section className="rounded-2xl bg-white p-8 shadow-sm border border-neutral-200">
                <h2 className="text-lg font-medium tracking-tight mb-4">Lieferadresse</h2>
                <div className="grid gap-4">
                  <label className="block">
                    <span className="text-sm font-medium text-neutral-700">Vorname</span>
                    <input
                      name="firstName"
                      value={shipping.firstName}
                      onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-black focus:ring-0"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-neutral-700">Nachname</span>
                    <input
                      name="lastName"
                      value={shipping.lastName}
                      onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-black focus:ring-0"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-neutral-700">Straße</span>
                    <input
                      name="street"
                      value={shipping.street}
                      onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-black focus:ring-0"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-neutral-700">Stadt</span>
                    <input
                      name="city"
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-black focus:ring-0"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-neutral-700">PLZ</span>
                    <input
                      name="zipcode"
                      value={shipping.zipcode}
                      onChange={(e) => setShipping({ ...shipping, zipcode: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-black focus:ring-0"
                    />
                  </label>
                </div>
              </section>

              {/* Versandart */}
              <section className="rounded-2xl bg-white p-8 shadow-sm border border-neutral-200">
                <h2 className="text-lg font-medium tracking-tight mb-4">Versandart</h2>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-neutral-50">
                    <input
                      type="radio"
                      name="shipping"
                      defaultChecked
                      className="h-4 w-4"
                    />
                    <span className="text-sm font-medium">Standard</span>
                  </label>
                </div>
              </section>

              {/* Zahlungsmethode */}
              <section className="rounded-2xl bg-white p-8 shadow-sm border border-neutral-200">
                <h2 className="text-lg font-medium tracking-tight mb-4">Zahlungsmethode</h2>
                <div className="space-y-2">
                  <label
                    className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${paymentMethod === PAYMENT_METHOD_IDS.kreditkarte ? 'bg-neutral-50 border-black' : 'hover:bg-neutral-50'}`}
                    onClick={() => setPaymentMethod(PAYMENT_METHOD_IDS.kreditkarte)}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === PAYMENT_METHOD_IDS.kreditkarte}
                        onChange={() => setPaymentMethod(PAYMENT_METHOD_IDS.kreditkarte)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm font-medium">Kreditkarte</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg width="36" viewBox="0 0 48 32">
                        <rect width="48" height="32" rx="4" fill="#1A1F71" />
                        <text x="50%" y="55%" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">VISA</text>
                      </svg>
                      <svg width="36" viewBox="0 0 48 32">
                        <rect width="48" height="32" rx="4" fill="#ECECEC" />
                        <circle cx="18" cy="16" r="10" fill="#EB001B" />
                        <circle cx="30" cy="16" r="10" fill="#F79E1B" />
                      </svg>
                    </div>
                  </label>
                  <label
                    className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${paymentMethod === PAYMENT_METHOD_IDS.paypal ? 'bg-neutral-50 border-black' : 'hover:bg-neutral-50'}`}
                    onClick={() => setPaymentMethod(PAYMENT_METHOD_IDS.paypal)}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === PAYMENT_METHOD_IDS.paypal}
                        onChange={() => setPaymentMethod(PAYMENT_METHOD_IDS.paypal)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm font-medium">PayPal</span>
                    </div>
                    <svg width="50" viewBox="0 0 24 24" fill="none">
                      <path fill="#003087" d="M7.5 20L9 4h8.5c2.5 0 4 1.5 3.5 4l-1 6c-.5 2.5-2 4-4.5 4H7.5z" />
                      <path fill="#009CDE" d="M9.5 20l1.2-8h7c1.5 0 2.5 1 2.2 2.5l-.6 3c-.3 1.5-1.3 2.5-2.8 2.5H9.5z" />
                    </svg>
                  </label>
                </div>
              </section>
            </div>

            {/* RIGHT */}
            <aside className="space-y-6">
              <section className="rounded-2xl bg-white p-8 shadow-sm border border-neutral-200">
                <h2 className="text-lg font-medium tracking-tight mb-4">Bestellübersicht</h2>
                <div className="grid gap-4">
                  {cart && Object.values(cart.lineItems).length > 0 ? (
                    <>
                      {Object.values(cart.lineItems).map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.label} × {item.quantity}</span>
                          <span>{((item.totalPrice ?? item.price?.totalPrice ?? 0) / 100).toFixed(2)} €</span>
                        </div>
                      ))}
                    </>
                  ) : (
                    <p className="text-sm text-neutral-500">Keine Artikel im Warenkorb</p>
                  )}
                  <div className="border-t pt-4 mt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Zwischensumme</span>
                      <span>{(subtotal / 100).toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Versand</span>
                      <span>{shippingCost === 0 ? '0,00 €' : `${(shippingCost / 100).toFixed(2)} €`}</span>
                    </div>
                    <div className="flex justify-between font-medium text-base pt-2 border-t">
                      <span>Gesamt</span>
                      <span>{(total / 100).toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
              </section>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting || !cart || Object.values(cart.lineItems).length === 0}
                className="w-full rounded-xl bg-black py-4 text-white text-sm font-medium tracking-wide transition-all hover:bg-neutral-900 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black"
              >
                {submitting ? 'Wird verarbeitet...' : 'Bestellung abschließen'}
              </button>
            </aside>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-600 mb-4">Ihr Warenkorb ist leer.</p>
            <Link href="/" className="text-black underline">Zurück zum Shop</Link>
          </div>
        )}
      </div>
    </div>
  );
}
